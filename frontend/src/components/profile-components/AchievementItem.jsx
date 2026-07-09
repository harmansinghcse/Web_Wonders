import AchievementItem from "./AchievementItem";

export default function AchievementSection({ achievements = [] }) {
    if (achievements.length === 0) {
        return (
            <section>
                <h2 className="mb-6 text-2xl font-bold">Achievements</h2>

                <p className="text-gray-400">No achievements unlocked yet.</p>
            </section>
        );
    }

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Achievements</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement) => (
                    <AchievementItem
                        key={achievement._id}
                        icon={achievement.icon}
                        title={achievement.title}
                        description={achievement.description}
                    />
                ))}
            </div>
        </section>
    );
}
