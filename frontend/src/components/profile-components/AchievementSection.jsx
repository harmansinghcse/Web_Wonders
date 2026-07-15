import AchievementItem from "./AchievementItem";

/**
 * --------------------------------------------
 * Component: AchievementSection
 * Purpose:
 * Computes and displays the user's achievements
 * dynamically based on their current stats.
 * --------------------------------------------
 */
export default function AchievementSection({ profile, submissionsCount = 0 }) {
    const list = [
        {
            id: "first-quiz",
            title: "Fossil Finder",
            description: "Solve your first quiz to start your journey.",
            icon: "🧭",
            isUnlocked: profile.quizzesSolved > 0,
        },
        {
            id: "dino-scholar",
            title: "Dino Scholar",
            description: "Solve 5 or more quizzes to unlock scholar status.",
            icon: "📜",
            isUnlocked: profile.quizzesSolved >= 5,
        },
        {
            id: "dna-collector",
            title: "DNA Specialist",
            description: "Accumulate 500 or more total DNA score points.",
            icon: "🧬",
            isUnlocked: profile.score >= 500,
        },
        {
            id: "contributor",
            title: "Prehistoric Contributor",
            description: "Propose a dinosaur contribution to the database.",
            icon: "🦖",
            isUnlocked: submissionsCount > 0,
        },
    ];

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold text-slate-800">My Badges & Achievements</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((item) => (
                    <AchievementItem
                        key={item.id}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        isUnlocked={item.isUnlocked}
                    />
                ))}
            </div>
        </section>
    );
}
