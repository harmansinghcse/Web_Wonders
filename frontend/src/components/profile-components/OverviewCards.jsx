import StatCard from "./StatCard";

/**
 * --------------------------------------------
 * Component: OverviewCards
 * Purpose:
 * Displays an overview of the user's profile
 * statistics, including quizzes solved,
 * total score, and achievements unlocked.
 * --------------------------------------------
 */
export default function OverviewCards({ profile }) {
    // Profile statistics displayed in the overview section
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
        // Overview section
        <section>
            {/* Section heading */}
            <h2 className="mb-6 text-2xl font-bold text-slate-800">Overview</h2>
             {/* Grid displaying all overview statistic cards */}
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
