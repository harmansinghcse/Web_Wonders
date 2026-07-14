import TopicCard from "./TopicCard";

import fossils from "../../../assets/quiz-assets/topic-fossils.png";
import dinosaur from "../../../assets/quiz-assets/topic-dinosaur.png";
import volcano from "../../../assets/quiz-assets/topic-volcano.png";
import evolution from "../../../assets/quiz-assets/topic-dna.png";

import { ArrowRight, Trophy, Clock3 } from "lucide-react";

// TODO (Backend)
// Replace with GET /quiz/topics

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

const TopicGrid = ({ topics = [] }) => {
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
                                image={topic.bannerImage || getLocalImage(topic.slug)}
                            />
                        ))
                    )}
                </div>

                {/* Right */}
                <div className="rounded-[30px] border border-[#E9E2D4] bg-white p-7 shadow-sm">
                    <p className="font-semibold text-[#47613F]">
                        Today's Challenge
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-[#2A2A2A]">
                        Jurassic Sprint
                    </h3>

                    <p className="mt-4 leading-7 text-gray-600">
                        Complete today's challenge and earn bonus DNA points.
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock3 size={20} className="text-[#47613F]"/>
                            <span>5 Questions</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Trophy
                                size={20}
                                className="text-[#47613F]"
                            />
                            <span>Reward +50 DNA</span>
                        </div>
                    </div>

                    <button className="mt-10 w-full rounded-2xl bg-[#47613F] py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#385032]">
                        Start Challenge
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopicGrid;