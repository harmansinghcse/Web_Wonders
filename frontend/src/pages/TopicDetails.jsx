import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/home_components/hero/Navbar";
import { getTopicDetails } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowLeft, Clock, BookOpen, Lock, Play } from "lucide-react";
import fossils from "../assets/quiz-assets/topic-fossils.png";
import dinosaur from "../assets/quiz-assets/topic-dinosaur.png";
import volcano from "../assets/quiz-assets/topic-volcano.png";
import evolution from "../assets/quiz-assets/topic-dna.png";

const getLocalImage = (slug) => {
    switch (slug) {
        case "fossils":
            return fossils;
        case "dinosaurs":
            return dinosaur;
        case "extinction":
            return volcano;
        case "evolution":
            return evolution;
        default:
            return dinosaur;
    }
};

const TopicDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, loading: authLoading } = useAuth();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate("/login");
            return;
        }

        const fetchDetails = async () => {
            if (!isLoggedIn) return;
            try {
                const data = await getTopicDetails(slug);
                setTopic(data);
            } catch (err) {
                console.error("Error fetching topic details:", err);
                setError("Failed to load topic details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchDetails();
        }
    }, [slug, isLoggedIn, authLoading, navigate]);

    if (authLoading || (isLoggedIn && loading)) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24">
                    <Loader2 className="h-10 w-10 animate-spin text-[#47613F]" />
                    <p className="text-gray-500 font-medium font-sans">Loading topic insights...</p>
                </div>
            </>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    if (error || !topic) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F5EF] pt-24 px-6">
                    <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-[#E9E2D4] shadow-md">
                        <h2 className="text-2xl font-bold text-red-600">Failed to load</h2>
                        <p className="mt-3 text-gray-600">{error || "Topic not found."}</p>
                        <Link to="/quiz" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#47613F] px-5 py-3 font-semibold text-white transition hover:bg-[#385032]">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const diffLevels = { easy: 1, medium: 2, hard: 3 };
    const highestUnlocked = topic.highestDifficultyUnlocked || "easy";
    const highestUnlockedRank = diffLevels[highestUnlocked];

    const getDifficultyStyles = (diff, isLocked) => {
        if (isLocked) {
            return {
                bg: "bg-gray-50 opacity-80 border-gray-200 cursor-not-allowed",
                badge: "bg-gray-100 text-gray-500",
                accent: "text-gray-400"
            };
        }
        switch (diff) {
            case "easy":
                return {
                    bg: "bg-emerald-50/40 border-[#A2D3C2]/50 hover:border-emerald-600 hover:shadow-emerald-100/50 hover:shadow-lg cursor-pointer",
                    badge: "bg-emerald-100 text-emerald-800",
                    accent: "text-emerald-700"
                };
            case "medium":
                return {
                    bg: "bg-amber-50/40 border-[#F0D59E]/50 hover:border-amber-600 hover:shadow-amber-100/50 hover:shadow-lg cursor-pointer",
                    badge: "bg-amber-100 text-amber-800",
                    accent: "text-amber-700"
                };
            case "hard":
                return {
                    bg: "bg-rose-50/40 border-[#F5B5B5]/50 hover:border-rose-600 hover:shadow-rose-100/50 hover:shadow-lg cursor-pointer",
                    badge: "bg-rose-100 text-rose-800",
                    accent: "text-rose-700"
                };
            default:
                return {
                    bg: "bg-white border-gray-200",
                    badge: "bg-gray-100 text-gray-800",
                    accent: "text-gray-700"
                };
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-28 pb-16 font-sans">
                <div className="mx-auto max-w-5xl px-6">
                    {/* Back Button */}
                    <Link to="/quiz" className="inline-flex items-center gap-2 font-medium text-[#47613F] transition-all hover:gap-3">
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>

                    {/* Topic Card Hero */}
                    <div className="relative mt-6 overflow-hidden rounded-[32px] border border-[#E8DEC9] bg-white shadow-md">
                        <div className="h-64 w-full overflow-hidden bg-[#EDF3E7]">
                            <img 
                                src={topic.bannerImage || getLocalImage(slug)} 
                                alt={topic.title} 
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="p-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h1 className="text-4xl font-extrabold text-[#2A2A2A]">
                                    {topic.title}
                                </h1>

                                <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                                    <span className="flex items-center gap-1.5 bg-[#EDF3E7] text-[#47613F] px-4 py-2 rounded-full">
                                        <Clock size={16} />
                                        {topic.estimatedTime} Min
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-[#EDF3E7] text-[#47613F] px-4 py-2 rounded-full">
                                        <BookOpen size={16} />
                                        {topic.totalQuestions} Questions
                                    </span>
                                </div>
                            </div>

                            <p className="mt-4 text-base leading-relaxed text-gray-600 max-w-3xl">
                                {topic.description}
                            </p>
                        </div>
                    </div>

                    {/* Select Difficulty Grid */}
                    <h2 className="mt-12 text-2xl font-bold text-[#2A2A2A]">
                        Select Quiz Difficulty
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Achieve 60% or higher to unlock the next challenge level.
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {topic.levels.map((level) => {
                            const isLocked = diffLevels[level.difficulty] > highestUnlockedRank;
                            const styles = getDifficultyStyles(level.difficulty, isLocked);

                            return (
                                <div
                                    key={level.difficulty}
                                    onClick={() => {
                                        if (!isLocked) {
                                            navigate(`/quiz/${slug}/play?difficulty=${level.difficulty}`);
                                        }
                                    }}
                                    className={`relative flex flex-col justify-between rounded-3xl border-2 p-6 transition-all duration-300 ${styles.bg}`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className={`rounded-xl px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                                                {level.difficulty}
                                            </span>

                                            {isLocked && <Lock size={18} className="text-gray-400" />}
                                        </div>

                                        <h3 className="mt-6 text-xl font-bold text-[#2A2A2A] capitalize">
                                            {level.difficulty} Mode
                                        </h3>
                                        
                                        <p className="mt-2 text-sm text-gray-500">
                                            Includes {level.questions} curated questions.
                                        </p>
                                    </div>

                                    <div className="mt-10 flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                            Status: {isLocked ? "Locked" : "Unlocked"}
                                        </span>

                                        {!isLocked && (
                                            <button className={`flex h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E9E2D4] shadow-sm transition hover:scale-105 hover:bg-[#47613F] hover:text-white ${styles.accent}`}>
                                                <Play size={16} fill="currentColor" className="ml-0.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
};

export default TopicDetails;
