import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/home_components/hero/Navbar";
import { startQuiz, submitQuiz } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowLeft, Lightbulb, CheckCircle2, XCircle, Trophy, Dna, Target, HelpCircle } from "lucide-react";

const PlayQuiz = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const difficulty = searchParams.get("difficulty") || "easy";
    const navigate = useNavigate();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> selectedOption (index)
    const [showHint, setShowHint] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Results state from backend
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate("/login");
            return;
        }

        const initSession = async () => {
            if (!isLoggedIn) return;
            try {
                const sessionData = await startQuiz(slug, difficulty);
                setSessionId(sessionData.sessionId);
                setQuestions(sessionData.questions);
            } catch (err) {
                console.error("Error starting quiz session:", err);
                setError(err.response?.data?.message || "Failed to initialize quiz. Please make sure the difficulty is unlocked.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            initSession();
        }
    }, [slug, difficulty, isLoggedIn, authLoading, navigate]);

    const handleSelectOption = (optionIndex) => {
        const currentQuestion = questions[currentIndex];
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion._id]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowHint(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowHint(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");

        try {
            // Prepare answers payload
            const answersPayload = questions.map((q) => ({
                questionId: q._id,
                selectedOption: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1,
            }));

            const gradingResults = await submitQuiz(sessionId, answersPayload);
            setResults(gradingResults);
        } catch (err) {
            console.error("Error submitting answers:", err);
            setError("Failed to grade quiz. Please check your internet connection.");
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || (isLoggedIn && loading)) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24 font-sans">
                    <Loader2 className="h-10 w-10 animate-spin text-[#47613F]" />
                    <p className="text-gray-500 font-medium">Entering Arena...</p>
                </div>
            </>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    if (error && !results) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F5EF] pt-24 px-6 font-sans">
                    <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-[#E9E2D4] shadow-md">
                        <h2 className="text-2xl font-bold text-red-600">Error Occurred</h2>
                        <p className="mt-3 text-gray-600">{error}</p>
                        <Link to={`/quiz/${slug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#47613F] px-5 py-3 font-semibold text-white transition hover:bg-[#385032]">
                            <ArrowLeft size={16} /> Back to Details
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Grading Results Render Page
    if (results) {
        const passed = results.accuracy >= 60;

        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-[#F8F5EF] pt-28 pb-16 font-sans">
                    <div className="mx-auto max-w-3xl px-6">
                        {/* Results Summary Box */}
                        <div className="rounded-[32px] border border-[#E8DEC9] bg-white p-8 text-center shadow-lg">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EDF3E7] text-[#47613F]">
                                <Trophy size={40} className="text-[#47613F]" />
                            </div>

                            <h1 className="mt-6 text-4xl font-extrabold text-[#2A2A2A]">
                                {passed ? "Level Mastered!" : "Quiz Completed"}
                            </h1>
                            <p className="mt-2 text-gray-500 font-medium">
                                Topic: <span className="capitalize">{slug}</span> ({difficulty})
                            </p>

                            {passed && results.unlockedDifficulty !== difficulty && (
                                <div className="mx-auto mt-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 animate-pulse">
                                    Difficulty Unlocked: {results.unlockedDifficulty}!
                                </div>
                            )}

                            {/* Score Cards */}
                            <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
                                <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4">
                                    <div className="flex justify-center text-amber-600">
                                        <Target size={22} />
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-[#2A2A2A]">
                                        {results.accuracy}%
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">Accuracy</p>
                                </div>

                                <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4">
                                    <div className="flex justify-center text-emerald-600">
                                        <CheckCircle2 size={22} />
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-[#2A2A2A]">
                                        {results.score} / {results.totalQuestions}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">Score</p>
                                </div>

                                <div className="rounded-2xl bg-green-50/50 border border-green-100 p-4">
                                    <div className="flex justify-center text-[#47613F]">
                                        <Dna size={22} />
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-[#2F5A3F]">
                                        +{results.dnaEarned}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">DNA Points</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/quiz" className="w-full sm:w-auto rounded-2xl bg-[#47613F] px-8 py-4 font-semibold text-white transition-all hover:bg-[#385032] shadow-sm text-center">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full sm:w-auto rounded-2xl border border-[#E9E2D4] bg-white px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-50 text-center"
                                >
                                    Retry Quiz
                                </button>
                            </div>
                        </div>

                        {/* Detailed Question Review */}
                        <div className="mt-12 space-y-6">
                            <h2 className="text-2xl font-bold text-[#2A2A2A]">
                                Review Your Answers
                            </h2>

                            {results.review.map((item, index) => {
                                return (
                                    <div key={item._id} className={`rounded-3xl border p-6 bg-white shadow-sm ${item.isCorrect ? 'border-emerald-100' : 'border-rose-100'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${item.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                {index + 1}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-[#2A2A2A]">
                                                    {item.question}
                                                </h3>

                                                {/* Options */}
                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                    {item.options.map((opt, optIndex) => {
                                                        const isSelected = item.selectedOption === optIndex;
                                                        const isCorrectOpt = item.correctAnswer === optIndex;

                                                        let optionClass = "border-gray-200 bg-white text-gray-700";
                                                        if (isCorrectOpt) {
                                                            optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                                                        } else if (isSelected && !item.isCorrect) {
                                                            optionClass = "border-rose-500 bg-rose-50 text-rose-900 font-medium";
                                                        }

                                                        return (
                                                            <div key={optIndex} className={`flex items-center justify-between rounded-xl border p-4 text-sm ${optionClass}`}>
                                                                <span>{opt}</span>
                                                                <div className="flex items-center gap-2">
                                                                    {isSelected && (
                                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                                                            Yours
                                                                        </span>
                                                                    )}
                                                                    {isCorrectOpt ? (
                                                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                                                    ) : isSelected ? (
                                                                        <XCircle size={16} className="text-rose-600" />
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Explanation Box */}
                                                {item.explanation && (
                                                    <div className="mt-6 rounded-2xl bg-amber-50/40 border border-amber-100/50 p-4 text-sm text-gray-700 leading-relaxed">
                                                        <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                                                            <Lightbulb size={16} />
                                                            Explanation
                                                        </span>
                                                        {item.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </>
        );
    }

    // SUBMITTING GRADE SCREEN
    if (submitting) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24 font-sans">
                    <Loader2 className="h-10 w-10 animate-spin text-[#47613F]" />
                    <p className="text-gray-500 font-medium">Grading quiz session, compiling stats...</p>
                </div>
            </>
        );
    }

    // ACTIVE GAMEPLAY SCREEN
    const currentQuestion = questions[currentIndex];
    const userSelection = selectedAnswers[currentQuestion._id];
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-28 pb-16 font-sans">
                <div className="mx-auto max-w-3xl px-6">
                    {/* Top Progress & Back */}
                    <div className="flex items-center justify-between">
                        <Link to={`/quiz/${slug}`} className="inline-flex items-center gap-2 font-medium text-gray-500 hover:text-gray-800 transition">
                            <ArrowLeft size={18} />
                            Quit Quiz
                        </Link>

                        <span className="text-sm font-semibold text-gray-400">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                        <div
                            className="h-2 rounded-full bg-[#47613F] transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    {/* Active Question Card */}
                    <div className="mt-8 rounded-[32px] border border-[#E8DEC9] bg-white p-8 shadow-md">
                        {currentQuestion.image && (
                            <div className="mb-6 h-52 w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                                <img src={currentQuestion.image} alt="Question helper" className="h-full w-full object-cover" />
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EDF3E7] text-[#47613F]">
                                <HelpCircle size={20} />
                            </div>

                            <div className="flex-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#47613F]">
                                    {difficulty} Mode
                                </span>
                                
                                <h2 className="mt-2 text-2xl font-extrabold text-[#2A2A2A] leading-snug">
                                    {currentQuestion.question}
                                </h2>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = userSelection === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectOption(index)}
                                        className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                            isSelected
                                                ? "border-[#47613F] bg-[#EDF3E7] text-[#2A2A2A]"
                                                : "border-[#E9E2D4] bg-white text-gray-700 hover:border-gray-400"
                                        }`}
                                    >
                                        <span>{option}</span>
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                                            {isSelected && <div className="h-2 w-2 rounded-full bg-[#47613F]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Hint section */}
                        {currentQuestion.hint && (
                            <div className="mt-8">
                                {showHint ? (
                                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-4 text-sm text-amber-900 flex items-start gap-2.5 animate-fadeIn">
                                        <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                                        <div>
                                            <span className="font-bold block mb-0.5">Hint:</span>
                                            {currentQuestion.hint}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowHint(true)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#47613F] hover:text-[#385032] transition"
                                    >
                                        <Lightbulb size={14} />
                                        Need a hint?
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Navigation Actions */}
                        <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={`rounded-xl border border-[#E9E2D4] bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 ${
                                    currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                Previous
                            </button>

                            {isLastQuestion ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={userSelection === undefined}
                                    className={`rounded-xl bg-[#47613F] px-8 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#385032] ${
                                        userSelection === undefined ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    Submit Quiz
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={userSelection === undefined}
                                    className={`rounded-xl bg-[#47613F] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#385032] ${
                                        userSelection === undefined ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default PlayQuiz;
