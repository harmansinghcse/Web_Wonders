import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Navbar from "../components/home_components/hero/Navbar";
import QuizHeader from "../components/quiz/play/QuizHeader";
import QuestionCard from "../components/quiz/play/QuestionCard";
import HintCard from "../components/quiz/play/HintCard";
import QuizNavigation from "../components/quiz/play/QuizNavigation";
import { getDailyChallenge, startDailyChallenge, submitDailyChallenge } from "../services/quizService";

const DailyChallenge = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [challengeInfo, setChallengeInfo] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState({}); // maps question._id to option index
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const initChallenge = async () => {
            try {
                // Get challenge state first
                const info = await getDailyChallenge();
                setChallengeInfo(info);
                
                if (info.status === "completed") {
                    navigate("/daily-challenge/result", {
                        state: {
                            score: info.attempt.score,
                            totalQuestions: info.attempt.totalQuestions,
                            dnaEarned: info.attempt.dnaEarned,
                            title: info.title
                        }
                    });
                    return;
                }

                // Start or resume session
                const sessionData = await startDailyChallenge();
                setSessionId(sessionData.sessionId);
                setQuestions(sessionData.questions);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load daily challenge:", err);
                setError(err.response?.data?.message || "Failed to load Daily Challenge.");
                setLoading(false);
            }
        };

        initChallenge();
    }, [navigate]);

    const handleSelectOption = (optionIndex) => {
        const questionId = questions[currentQuestion]?._id;
        if (!questionId) return;
        
        setSelectedOption(optionIndex);
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleNext = async () => {
        if (selectedOption === null) {
            return;
        }

        // Check if last question
        if (currentQuestion === questions.length - 1) {
            setSubmitting(true);
            try {
                // Construct answers array for submission
                const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
                    questionId,
                    selectedOption
                }));
                
                // Add the current answer if not already there (which it should be)
                const currentQuestionId = questions[currentQuestion]._id;
                if (!answersArray.some(ans => ans.questionId === currentQuestionId)) {
                    answersArray.push({
                        questionId: currentQuestionId,
                        selectedOption
                    });
                }

                const result = await submitDailyChallenge(sessionId, answersArray);
                
                navigate("/daily-challenge/result", {
                    state: {
                        score: result.score,
                        totalQuestions: result.totalQuestions,
                        dnaEarned: result.dnaEarned,
                        title: challengeInfo?.title
                    }
                });
            } catch (err) {
                console.error("Submission failed:", err);
                setError("Failed to submit answers. Please try again.");
                setSubmitting(false);
            }
            return;
        }

        // Move to next question
        const nextIndex = currentQuestion + 1;
        setCurrentQuestion(nextIndex);

        // Pre-fill answer if already answered previously
        const nextQuestionId = questions[nextIndex]?._id;
        setSelectedOption(nextQuestionId && answers[nextQuestionId] !== undefined ? answers[nextQuestionId] : null);
    };

    const handlePrevious = () => {
        if (currentQuestion === 0) {
            navigate("/quiz");
            return;
        }

        const prevIndex = currentQuestion - 1;
        setCurrentQuestion(prevIndex);
        
        const prevQuestionId = questions[prevIndex]?._id;
        setSelectedOption(prevQuestionId && answers[prevQuestionId] !== undefined ? answers[prevQuestionId] : null);
    };

    if (loading || submitting) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[100vh] flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24">
                    <Loader2 className="h-10 w-10 animate-spin text-[#47613F]" />
                    <p className="text-gray-500 font-medium">
                        {submitting ? "Submitting Challenge..." : "Loading Daily Challenge..."}
                    </p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[100vh] flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24 px-6 text-center">
                    <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-red-600">Error</h2>
                        <p className="mt-4 text-gray-600">{error}</p>
                        <button
                            onClick={() => navigate("/quiz")}
                            className="mt-6 rounded-2xl bg-[#47613F] px-6 py-3 font-semibold text-white transition hover:bg-[#385032]"
                        >
                            Back to Quiz Station
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const question = questions[currentQuestion];

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24 pb-16">

                {/* Daily Challenge Intro */}
                <div className="mx-auto max-w-6xl px-6 pt-8">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#47613F]">
                            Daily Challenge
                        </p>
                        <h1 className="mt-2 text-4xl font-bold text-[#2A2A2A]">
                            {challengeInfo?.title || "Jurassic Sprint"}
                        </h1>
                        <p className="mt-2 max-w-2xl text-gray-600">
                            {challengeInfo?.description || "Complete today's challenge and earn bonus DNA points."}
                        </p>
                    </div>
                </div>

                {/* Quiz Header */}
                <QuizHeader
                    topic={challengeInfo?.topicName || "Daily Challenge"}
                    currentQuestion={currentQuestion + 1}
                    totalQuestions={questions.length}
                />

                {/* Question */}
                {question && (
                    <QuestionCard
                        question={{
                            text: question.question,
                            options: question.options,
                            image: question.image
                        }}
                        selectedOption={selectedOption}
                        onSelect={handleSelectOption}
                    />
                )}

                {/* Hint */}
                {question?.hint && (
                    <HintCard hint={question.hint} />
                )}

                {/* Navigation */}
                <QuizNavigation
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    nextLabel={currentQuestion === questions.length - 1 ? "Submit" : "Next"}
                    disabled={selectedOption === null}
                />

            </main>
        </>
    );
};

export default DailyChallenge;