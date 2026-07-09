import AchievementItem from "./AchievementItem";

export default function AchievementSection({ achievements = [] }) {
    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Achievements</h2>

            {achievements.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#12251C] p-8 text-center">
                    <p className="text-gray-400">
                        No achievements unlocked yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {achievements.map((achievement) => (
                        <AchievementItem
                            key={achievement._id || achievement.title}
                            icon={achievement.icon}
                            title={achievement.title}
                            description={achievement.description}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
