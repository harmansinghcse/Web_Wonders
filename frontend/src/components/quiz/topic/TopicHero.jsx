import topicBanner from "../../../assets/quiz-assets/topic-banner.png";
import topicIcon from "../../../assets/quiz-assets/topic-fossils-icon.png";
import { ArrowLeft, Clock3, Layers3, BookOpen } from "lucide-react";

// TODO (Backend)
// GET /quiz/topics/:slug
//
// Expected Response:
// {
//   title,
//   description,
//   banner,
//   icon,
//   totalQuestions,
//   completedQuestions,
//   estimatedTime,
//   difficultyLevels
// }

const TopicHero = () => {
    return (
        <section className="mx-auto mt-8 max-w-7xl px-6">

            {/* Back Button */}
            <button className=" mb-5 flex items-center gap-2 text-[#47613F] transition hover:gap-3">
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            {/* Hero */}
            <div className="overflow-hidden rounded-[34px] border border-[#E7DDC8] bg-white shadow-sm">

                <div className="relative h-[260px]">
                    <img src={topicBanner} alt="Topic Banner" className="absolute inset-0 h-full w-full object-cover"/>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF]/95 via-[#F8F5EF]/60 to-transparent" />

                    <div className="relative flex h-full items-center justify-between px-10">

                        {/* Left */}
                        <div className="max-w-xl">
                            <div className="flex items-center gap-5">
                                <img src={topicIcon} alt="Fossils" className="h-20 w-20 rounded-3xl border border-[#E7DDC8] bg-white object-cover p-2"/>
                                <div>
                                    <h1 className="text-5xl font-bold text-[#222]">
                                        Fossils
                                    </h1>

                                    <p className="mt-2 leading-7 text-gray-600">
                                        Fossils preserve the history of ancient
                                        life. Learn how organisms became
                                        preserved over millions of years.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Stats */}
                        <div className="rounded-[28px] bg-white/95 p-7 shadow-lg backdrop-blur">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <BookOpen
                                        size={20}
                                        className="text-[#47613F]"/>
                                    <div>
                                        <p className="text-xs uppercase text-gray-400">
                                            Questions
                                        </p>

                                        <h3 className="font-bold">
                                            50
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Layers3
                                        size={20}
                                        className="text-[#47613F]"/>
                                    <div>
                                        <p className="text-xs uppercase text-gray-400">
                                            Levels
                                        </p>

                                        <h3 className="font-bold">
                                            3
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock3
                                        size={20}
                                        className="text-[#47613F]"/>

                                    <div>
                                        <p className="text-xs uppercase text-gray-400">
                                            Duration
                                        </p>

                                        <h3 className="font-bold">
                                            15 min
                                        </h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default TopicHero;