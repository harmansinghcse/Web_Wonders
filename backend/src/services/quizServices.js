const Topic = require("../models/QuizModals/Topic");
const Question = require("../models/QuizModals/Questions");
const UserTopicProgress = require("../models/QuizModals/UserTopicProgress");
const QuizSession = require("../models/QuizModals/QuizSession");
const QuizAttempt = require("../models/QuizModals/QuizAttempt");
const User = require("../models/User");

const QUIZ_QUESTIONS_PER_GAME = parseInt(process.env.QUIZ_QUESTIONS_PER_GAME) || 5;

// Helper to calculate streak based on completed attempts
function calculateStreak(attempts) {
    if (!attempts || attempts.length === 0) return 0;
    
    // Convert dates to YYYY-MM-DD strings in local timezone
    const dates = attempts.map(a => {
        const d = new Date(a.completedAt);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    
    // Get unique dates sorted in descending order
    const uniqueDates = [...new Set(dates)].sort().reverse();
    if (uniqueDates.length === 0) return 0;
    
    const getLocalDateStr = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const todayStr = getLocalDateStr(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateStr(yesterday);
    
    // If user hasn't played today and hasn't played yesterday, streak is 0
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
        return 0;
    }
    
    let streak = 0;
    let currentDate = new Date(uniqueDates[0]);
    
    for (let i = 0; i < uniqueDates.length; i++) {
        const dateStr = uniqueDates[i];
        const checkStr = getLocalDateStr(currentDate);
        
        if (dateStr === checkStr) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

exports.getDashboard = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Fetch attempts to compute streak, solved count, average accuracy
    const attempts = await QuizAttempt.find({ user: userId });
    
    const totalQuestionsSolved = attempts.reduce((acc, curr) => acc + curr.score, 0);
    const totalAccuracy = attempts.reduce((acc, curr) => acc + curr.accuracy, 0);
    const averageAccuracy = attempts.length > 0 ? Math.round(totalAccuracy / attempts.length) : 0;
    const streak = calculateStreak(attempts);

    // Fetch published topics
    const topics = await Topic.find({ isPublished: true }).sort({ order: 1, title: 1 });
    const progressList = await UserTopicProgress.find({ user: userId });

    const topicsData = await Promise.all(
        topics.map(async (topic) => {
            const progress = progressList.find(p => p.topic.toString() === topic._id.toString());
            const totalQuestions = await Question.countDocuments({ topic: topic._id });
            
            let percentageProgress = 0;
            if (totalQuestions > 0 && progress) {
                percentageProgress = Math.round((progress.completedQuestions / totalQuestions) * 100);
                if (percentageProgress > 100) percentageProgress = 100;
            }

            return {
                id: topic._id,
                title: topic.title,
                slug: topic.slug,
                description: topic.description,
                bannerImage: topic.bannerImage,
                icon: topic.icon,
                progress: percentageProgress,
                lessons: totalQuestions,
                level: progress ? progress.highestDifficultyUnlocked : "easy",
            };
        })
    );

    return {
        user: {
            name: user.name,
            streak,
            dnaPoints: user.score,
            accuracy: averageAccuracy,
            questionsSolved: totalQuestionsSolved,
        },
        topics: topicsData,
        dailyChallenge: null,
    };
};

exports.getTopicDetails = async (userId, slug) => {
    const topic = await Topic.findOne({
        slug,
        isPublished: true,
    });

    if (!topic) {
        throw new Error("Topic not found");
    }

    const totalQuestions = await Question.countDocuments({ topic: topic._id });
    const easyCount = await Question.countDocuments({ topic: topic._id, difficulty: "easy" });
    const mediumCount = await Question.countDocuments({ topic: topic._id, difficulty: "medium" });
    const hardCount = await Question.countDocuments({ topic: topic._id, difficulty: "hard" });

    const progress = await UserTopicProgress.findOne({
        user: userId,
        topic: topic._id,
    });

    return {
        title: topic.title,
        description: topic.description,
        bannerImage: topic.bannerImage,
        icon: topic.icon,
        estimatedTime: topic.estimatedTime,
        totalQuestions,
        completedQuestions: progress?.completedQuestions || 0,
        highestDifficultyUnlocked: progress?.highestDifficultyUnlocked || "easy",
        levels: [
            {
                difficulty: "easy",
                questions: easyCount,
            },
            {
                difficulty: "medium",
                questions: mediumCount,
            },
            {
                difficulty: "hard",
                questions: hardCount,
            },
        ],
    };
};

exports.startSession = async (userId, slug, difficulty = "easy") => {
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
        difficulty = "easy";
    }

    const topic = await Topic.findOne({
        slug,
        isPublished: true,
    });

    if (!topic) {
        throw new Error("Topic not found");
    }

    // Check unlocked difficulty level
    const progress = await UserTopicProgress.findOne({
        user: userId,
        topic: topic._id,
    });

    const diffLevels = { easy: 1, medium: 2, hard: 3 };
    const highestUnlocked = progress?.highestDifficultyUnlocked || "easy";
    if (diffLevels[difficulty] > diffLevels[highestUnlocked]) {
        throw new Error("This difficulty level is locked.");
    }

    // Query questions of this topic and difficulty
    const questions = await Question.find({
        topic: topic._id,
        difficulty,
    });

    if (!questions || questions.length === 0) {
        throw new Error("No questions found for this difficulty.");
    }

    // Shuffle and pick random questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, QUIZ_QUESTIONS_PER_GAME);

    // Create session
    const session = await QuizSession.create({
        user: userId,
        topic: topic._id,
        difficulty,
        questions: selectedQuestions.map(q => q._id),
        completed: false,
    });

    // Sanitize questions for frontend (no correctAnswer, explanation, score info)
    const sanitizedQuestions = selectedQuestions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        image: q.image,
        hint: q.hint,
    }));

    return {
        sessionId: session._id,
        questions: sanitizedQuestions,
    };
};

exports.submitSession = async (userId, sessionId, submittedAnswers = []) => {
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

    // Mark session complete
    session.completed = true;
    await session.save();

    // Create QuizAttempt
    const attempt = await QuizAttempt.create({
        user: userId,
        topic: session.topic,
        difficulty: session.difficulty,
        score,
        totalQuestions: session.questions.length,
        accuracy,
        dnaEarned,
        answers: answersSnapshot,
    });

    // Fetch user topic progress to update
    let progress = await UserTopicProgress.findOne({
        user: userId,
        topic: session.topic,
    });

    if (!progress) {
        progress = new UserTopicProgress({
            user: userId,
            topic: session.topic,
            completedQuestions: 0,
            dnaPoints: 0,
            accuracy: 0,
            highestDifficultyUnlocked: "easy",
        });
    }

    // Accumulate dna points
    progress.dnaPoints += dnaEarned;

    // Calculate unique questions solved correctly for this topic
    const allAttempts = await QuizAttempt.find({ user: userId, topic: session.topic });
    const correctQuestionIds = new Set();
    allAttempts.forEach((att) => {
        att.answers.forEach((ans) => {
            if (ans.wasCorrect) {
                correctQuestionIds.add(ans.questionId.toString());
            }
        });
    });
    progress.completedQuestions = correctQuestionIds.size;

    // Update highest difficulty unlocked
    if (accuracy >= 60) {
        if (session.difficulty === "easy" && progress.highestDifficultyUnlocked === "easy") {
            progress.highestDifficultyUnlocked = "medium";
        } else if (session.difficulty === "medium" && progress.highestDifficultyUnlocked === "medium") {
            progress.highestDifficultyUnlocked = "hard";
        }
    }

    progress.accuracy = Math.round(
        allAttempts.reduce((acc, curr) => acc + curr.accuracy, 0) / allAttempts.length
    );
    progress.lastPlayed = Date.now();
    await progress.save();

    // Update user DNA points (score field) and count
    const user = await User.findById(userId);
    user.score += dnaEarned;
    user.quizzesSolved += 1;
    await user.save();

    return {
        score,
        totalQuestions: session.questions.length,
        accuracy,
        dnaEarned,
        unlockedDifficulty: progress.highestDifficultyUnlocked,
        review: reviewData,
    };
};
