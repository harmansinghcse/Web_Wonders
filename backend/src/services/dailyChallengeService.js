const DailyChallenge = require("../models/QuizModals/DailyChallenge");
const Question = require("../models/QuizModals/Questions");
const Topic = require("../models/QuizModals/Topic");
const QuizSession = require("../models/QuizModals/QuizSession");
const QuizAttempt = require("../models/QuizModals/QuizAttempt");
const User = require("../models/User");
const { getTodayDateString, getNextResetTime } = require("../utils/timezone");

/**
 * Deterministically or randomly generates today's daily challenge.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Promise<object>}
 */
async function generateTodayChallenge(dateStr) {
    const allQuestions = await Question.find({}).populate("topic");
    if (!allQuestions || allQuestions.length === 0) {
        throw new Error("No suitable questions available in the database to generate a challenge.");
    }

    // Shuffle and pick 5 questions (or up to 5)
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

    // Determine dominant topic
    const topicsMap = {};
    selectedQuestions.forEach(q => {
        if (q.topic) {
            topicsMap[q.topic.title] = (topicsMap[q.topic.title] || 0) + 1;
        }
    });

    let dominantTopicName = "Mixed Topics";
    let dominantTopicId = null;
    let maxCount = 0;
    for (const [name, count] of Object.entries(topicsMap)) {
        if (count > maxCount) {
            maxCount = count;
            dominantTopicName = name;
            const qWithTopic = selectedQuestions.find(q => q.topic && q.topic.title === name);
            dominantTopicId = qWithTopic ? qWithTopic.topic._id : null;
        }
    }

    // If multiple topics are involved, keep it Mixed
    if (Object.keys(topicsMap).length > 1) {
        dominantTopicName = "Mixed Topics";
        dominantTopicId = null;
    }

    // Determine difficulty
    const diffs = selectedQuestions.map(q => q.difficulty);
    const uniqueDiffs = [...new Set(diffs)];
    let difficulty = "mixed";
    if (uniqueDiffs.length === 1) {
        difficulty = uniqueDiffs[0];
    }

    const titles = [
        "Prehistoric Quest",
        "Dinosaur Discovery",
        "Mesozoic Mayhem",
        "Fossil Frenzy",
        "Triassic Trivia",
        "Cretaceous Challenge",
        "Jurassic Sprint"
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const description = `Complete today's daily challenge and earn bonus DNA points!`;

    try {
        const challenge = await DailyChallenge.create({
            date: dateStr,
            title,
            description,
            difficulty,
            topic: dominantTopicId,
            topicName: dominantTopicName,
            questions: selectedQuestions.map(q => q._id),
        });
        return challenge;
    } catch (error) {
        // In case of concurrency race condition where another request created it first
        if (error.code === 11000) {
            const existing = await DailyChallenge.findOne({ date: dateStr });
            if (existing) return existing;
        }
        throw error;
    }
}

/**
 * Gets or creates today's Daily Challenge and details for the specified user.
 */
exports.getTodayDailyChallenge = async (userId) => {
    const dateStr = getTodayDateString();
    
    let challenge = await DailyChallenge.findOne({ date: dateStr });
    if (!challenge) {
        challenge = await generateTodayChallenge(dateStr);
    }
    
    // Check if user completed it
    const attempt = await QuizAttempt.findOne({ user: userId, dailyChallenge: challenge._id });
    
    let status = "not_attempted";
    let attemptData = null;
    let sessionId = null;
    
    if (attempt) {
        status = "completed";
        attemptData = {
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            accuracy: attempt.accuracy,
            dnaEarned: attempt.dnaEarned,
            completedAt: attempt.completedAt,
            answers: attempt.answers,
        };
    } else {
        const session = await QuizSession.findOne({ user: userId, dailyChallenge: challenge._id, completed: false });
        if (session) {
            status = "in_progress";
            sessionId = session._id;
        }
    }
    
    return {
        id: challenge._id,
        date: challenge.date,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        topic: challenge.topic,
        topicName: challenge.topicName,
        questionCount: challenge.questions.length,
        status,
        sessionId,
        attempt: attemptData,
        nextResetAt: getNextResetTime().toISOString(),
    };
};

/**
 * Starts or retrieves the active session for today's Daily Challenge.
 */
exports.startDailyChallenge = async (userId) => {
    const dateStr = getTodayDateString();
    let challenge = await DailyChallenge.findOne({ date: dateStr });
    if (!challenge) {
        challenge = await generateTodayChallenge(dateStr);
    }
    
    // Check if user already completed it
    const attempt = await QuizAttempt.findOne({ user: userId, dailyChallenge: challenge._id });
    if (attempt) {
        throw new Error("Challenge already completed");
    }
    
    // Find or create in-progress session
    let session = await QuizSession.findOne({ user: userId, dailyChallenge: challenge._id, completed: false });
    if (!session) {
        session = await QuizSession.create({
            user: userId,
            dailyChallenge: challenge._id,
            questions: challenge.questions,
            completed: false,
        });
    }
    
    const populatedSession = await QuizSession.findById(session._id).populate("questions");
    
    // Sanitize questions (no correct answers)
    const sanitizedQuestions = populatedSession.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        image: q.image,
        hint: q.hint,
    }));
    
    return {
        sessionId: session._id,
        questions: sanitizedQuestions,
        title: challenge.title,
        description: challenge.description,
        topicName: challenge.topicName,
        difficulty: challenge.difficulty,
    };
};

/**
 * Submits answers for a Daily Challenge session and evaluates/persists results.
 */
exports.submitDailyChallenge = async (userId, sessionId, submittedAnswers = []) => {
    const session = await QuizSession.findById(sessionId).populate("questions");
    if (!session) {
        throw new Error("Quiz session not found");
    }

    if (session.user.toString() !== userId.toString()) {
        throw new Error("Unauthorized access to quiz session");
    }

    if (session.completed) {
        throw new Error("This quiz session has already been completed");
    }
    
    if (session.dailyChallenge) {
        const existingAttempt = await QuizAttempt.findOne({ user: userId, dailyChallenge: session.dailyChallenge });
        if (existingAttempt) {
            throw new Error("Duplicate submission: Daily challenge already completed");
        }
    }

    let score = 0;
    let dnaEarned = 0;
    const answersSnapshot = [];
    const reviewData = [];

    session.questions.forEach((question) => {
        const submission = submittedAnswers.find(
            (ans) => ans.questionId.toString() === question._id.toString()
        );

        const selectedOption = submission ? parseInt(submission.selectedOption) : -1;
        const isCorrect = selectedOption === question.correctAnswer;

        if (isCorrect) {
            score++;
            dnaEarned += question.points || 10;
        }

        answersSnapshot.push({
            questionId: question._id,
            selectedOption,
            correctOption: question.correctAnswer,
            wasCorrect: isCorrect,
        });

        reviewData.push({
            _id: question._id,
            question: question.question,
            options: question.options,
            selectedOption,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            isCorrect,
        });
    });

    const accuracy = Math.round((score / session.questions.length) * 100);

    session.completed = true;
    await session.save();

    const attempt = await QuizAttempt.create({
        user: userId,
        dailyChallenge: session.dailyChallenge,
        topic: session.topic || null,
        difficulty: session.difficulty || "mixed",
        score,
        totalQuestions: session.questions.length,
        accuracy,
        dnaEarned,
        answers: answersSnapshot,
    });

    const user = await User.findById(userId);
    if (user) {
        user.score += dnaEarned;
        user.quizzesSolved += 1;
        await user.save();
    }

    return {
        score,
        totalQuestions: session.questions.length,
        accuracy,
        dnaEarned,
        review: reviewData,
    };
};
