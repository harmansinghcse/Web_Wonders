import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// TODO (Backend)
// Props will come from:
// GET /quiz/topics

const TopicCard = ({
    title,
    description,
    image,
    progress,
    lessons,
    level,
    slug,
}) => {

    return (
        <Link
            to={`/quiz/${slug}`}
            className="group block overflow-hidden rounded-[28px] border border-[#E9E2D4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left"
        >
            {/* Image */}
            <div className="overflow-hidden bg-[#EDF3E7]">
                <img
                    src={image || "/quiz-assets/topic-placeholder.png"}
                    alt={title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-[#2A2A2A]">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#6B6B6B]">
                    {description}
                </p>

                {/* Progress */}
                <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-[#47613F]">
                            Learning Progress
                        </span>

                        <span className="font-semibold">{progress}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-[#EEE8DB]">
                        <div
                            className="h-2 rounded-full bg-[#47613F] transition-all duration-700"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Difficulty
                                </p>

                                <p className="font-semibold text-[#2A2A2A]">
                                    {level}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Lessons
                                </p>

                                <p className="font-semibold text-[#2A2A2A]">
                                    {lessons}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className=" rounded-full bg-[#EDF3E7] p-3 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#47613F] group-hover:text-white">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default TopicCard;
