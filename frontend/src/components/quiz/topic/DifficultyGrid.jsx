import { Sprout, Mountain, Flame, Clock3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TODO (Backend)
// Replace this static data with GET /quiz/topics/:slug
// Replace const levels = [...] with data.levels
const levels = [
    {
        id: "easy",
        title: "Beginner",
        icon: <Sprout size={26} />,
        color: "bg-green-100 text-green-700",
        questions: 20,
        duration: "10 min",
    },
    {
        id: "medium",
        title: "Intermediate",
        icon: <Mountain size={26} />,
        color: "bg-yellow-100 text-yellow-700",
        questions: 20,
        duration: "15 min",
    },
    {
        id: "hard",
        title: "Expert",
        icon: <Flame size={26} />,
        color: "bg-red-100 text-red-700",
        questions: 10,
        duration: "20 min",
    },
];

const DifficultyGrid = () => {
    const navigate = useNavigate();

    return (
        <section className="mx-auto mt-10 max-w-7xl px-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#222]">
                    Choose Difficulty
                </h2>

                <p className="mt-2 text-gray-500">
                    Select the challenge level that suits your knowledge.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {levels.map((level) => (
                    <div key={level.id} className=" group rounded-[28px] borde border-[#E7DDC8] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <div className={`inline-flex rounded-2xl p-4 ${level.color}`}>
                            {level.icon}
                        </div>

                        <h3 className="mt-6 text-2xl font-bold">
                            {level.title}
                        </h3>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <BookOpen
                                    size={18}
                                    className="text-[#47613F]"
                                />

                                <span>
                                    {level.questions} Questions
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock3
                                    size={18}
                                    className="text-[#47613F]"
                                />

                                <span>
                                    {level.duration}
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() =>
                                navigate(`/quiz/play/fossils/${level.id}`)
                            }
                            className=" mt-8 w-full rounded-2xl bg-[#47613F] py-4 font-semibold text-white transition-all hover:bg-[#365239]">
                            Start Quiz
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DifficultyGrid;