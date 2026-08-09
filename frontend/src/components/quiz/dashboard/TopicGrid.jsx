import { useEffect, useState } from "react";
import TopicCard from "./TopicCard";


import fossils from "../../../assets/quiz-assets/topic-fossils.png";
import dinosaur from "../../../assets/quiz-assets/topic-dinosaur.png";
import volcano from "../../../assets/quiz-assets/topic-volcano.png";
import evolution from "../../../assets/quiz-assets/topic-dna.png";

import { ArrowRight, Trophy, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";


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

const CountdownTimer = ({ nextResetAt }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(nextResetAt) - +new Date();
            if (difference <= 0) {
                setTimeLeft("00:00:00");
                return;
            }

            const hrs = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, "0");
            const mins = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0");
            const secs = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");

            setTimeLeft(`${hrs}:${mins}:${secs}`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [nextResetAt]);

    return (
        <span className="font-mono text-xl font-bold tracking-wider text-[#47613F]">{timeLeft}</span>
    );
};

const TopicGrid = ({ topics = [], dailyChallenge }) => {
    const navigate = useNavigate();

    const isCompleted = dailyChallenge?.status === "completed";

    return (
        <section className="mx-auto mt-10 max-w-7xl px-6">
            {/* Heading */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#2A2A2A]">
                        Explore Topics
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Learn dinosaurs one topic at a time.
                    </p>
                </div>

                <button className="flex items-center gap-2 font-medium text-[#47613F] transition-all hover:gap-3">
                    View All
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Grid */}
            <div className="grid gap-6 lg:grid-cols-[3fr_1.2fr]">
                {/* Left */}
                <div className="grid gap-6 md:grid-cols-2">
                    {topics.length === 0 ? (
                        <div className="col-span-2 flex h-48 items-center justify-center rounded-3xl border border-dashed border-[#E9E2D4] bg-white text-gray-400">
                            No topics available.
                        </div>
                    ) : (
                        topics.map((topic) => (
                            <TopicCard
                                key={topic.slug}
                                {...topic}
                                image={
                                    topic.bannerImage ||
                                    getLocalImage(topic.slug)
                                }
                            />
                        ))
                    )}
                </div>

                {/* Right */}
                <div className="rounded-[30px] border border-[#E9E2D4] bg-white p-7 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#47613F]">
                                Today's Challenge
                            </p>
                            {isCompleted && (
                                <span className="rounded-full bg-[#EDF3E7] px-2.5 py-0.5 text-xs text-[#47613F] font-bold">
                                    Completed ✓
                                </span>
                            )}
                        </div>

                        <h3 className="mt-3 text-3xl font-bold text-[#2A2A2A]">
                            {dailyChallenge?.title || "Jurassic Sprint"}
                        </h3>

                        {!isCompleted ? (
                            <>
                                <p className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {dailyChallenge?.topicName || "Mixed Topics"} · {dailyChallenge?.difficulty || "mixed"}
                                </p>

                                <p className="mt-4 leading-7 text-gray-600">
                                    {dailyChallenge?.description || "Complete today's challenge and earn bonus DNA points."}
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock3 size={20} className="text-[#47613F]" />
                                        <span>{dailyChallenge?.questionCount || 5} Questions</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Trophy size={20} className="text-[#47613F]" />
                                        <span>Reward DNA Points</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/daily-challenge")}
                                    className="mt-10 w-full rounded-2xl bg-[#47613F] py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#385032]"
                                >
                                    {dailyChallenge?.status === "in_progress" ? "Continue Challenge" : "Start Challenge"}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mt-6 rounded-2xl bg-[#F4F8EF] p-5 text-center">
                                    <Trophy size={28} className="mx-auto text-[#47613F]" />
                                    <p className="mt-2 text-sm text-gray-500 font-medium">Your Score</p>
                                    <p className="text-3xl font-extrabold text-[#47613F] mt-1">
                                        {dailyChallenge?.attempt?.score} / {dailyChallenge?.attempt?.totalQuestions} ({dailyChallenge?.attempt?.accuracy}%)
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                        +{dailyChallenge?.attempt?.dnaEarned} DNA Points Earned
                                    </p>
                                </div>

                                <p className="mt-6 text-sm text-center leading-relaxed text-gray-600 font-medium">
                                    Come back tomorrow for a new challenge.
                                </p>

                                <div className="mt-6 border-t border-[#E9E2D4] pt-6 text-center">
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-[0.1em]">Next challenge in</p>
                                    <div className="mt-2">
                                        <CountdownTimer nextResetAt={dailyChallenge?.nextResetAt} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopicGrid;
