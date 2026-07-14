import { Flame, Dna, Target, BookOpen } from "lucide-react";

// TODO (Backend)
// Replace these values with GET /quiz/dashboard response

const StatsCards = ({ user }) => {
    const stats = [
        {
            icon: <Flame className="text-orange-500" size={28} />,
            value: user?.streak ?? 0,
            label: "Day Streak",
            bg: "bg-orange-100",
        },
        {
            icon: <Dna className="text-[#47613F]" size={28} />,
            value: user?.dnaPoints ?? 0,
            label: "DNA Points",
            bg: "bg-green-100",
        },
        {
            icon: <Target className="text-red-500" size={28} />,
            value: user?.accuracy !== undefined ? `${user.accuracy}%` : "0%",
            label: "Accuracy",
            bg: "bg-red-100",
        },
        {
            icon: <BookOpen className="text-blue-500" size={28} />,
            value: user?.questionsSolved ?? 0,
            label: "Questions Solved",
            bg: "bg-blue-100",
        },
    ];

    return (
        <section className="mx-auto mt-6 max-w-7xl px-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                {stats.map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-[#E7DDC8] bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                                {item.icon}
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-[#202020]">
                                    {item.value}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsCards;