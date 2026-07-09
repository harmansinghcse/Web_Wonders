import StatCard from "./StatCard";

export default function OverviewCards({ profile }) {
    const stats = [
        {
            title: "Quizzes Solved",
            value: profile.quizzesSolved,
        },
        {
            title: "Total Score",
            value: profile.score,
        },
        {
            title: "Achievements",
            value: profile.achievementsUnlocked,
        },
    ];

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Overview</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}
            </div>
        </section>
    );
}
