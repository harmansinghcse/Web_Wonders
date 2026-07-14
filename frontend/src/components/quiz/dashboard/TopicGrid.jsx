import TopicCard from "./TopicCard";

import fossils from "../../../assets/quiz-assets/topic-fossils.png";
import dinosaur from "../../../assets/quiz-assets/topic-dinosaur.png";
import volcano from "../../../assets/quiz-assets/topic-volcano.png";
import evolution from "../../../assets/quiz-assets/topic-dna.png";

import { ArrowRight, Trophy, Clock3 } from "lucide-react";

// TODO (Backend)
// Replace with GET /quiz/topics

const topics = [
    {
        title: "Fossils",
        description: "Discover how ancient life is preserved through millions of years.",
        image: fossils,
        progress: 24,
        lessons: 12,
        level: "Beginner",
    },
    {
        title: "Dinosaurs",
        description: "Meet the incredible giants that once ruled the Earth.",
        image: dinosaur,
        progress: 58,
        lessons: 18,
        level: "Intermediate",
    },
    {
        title: "Extinction",
        description: "Learn what caused Earth's greatest extinction events.",
        image: volcano,
        progress: 12,
        lessons: 10,
        level: "Beginner",
    },
    {
        title: "Evolution",
        description: "Understand how prehistoric life evolved over time.",
        image: evolution,
        progress: 75,
        lessons: 15,
        level: "Advanced",
    },
];

const TopicGrid = () => {
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
                    {topics.map((topic) => (
                        <TopicCard
                            key={topic.title}
                            {...topic}/>
                    ))}
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