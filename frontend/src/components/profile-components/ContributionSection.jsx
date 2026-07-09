export default function ContributionSection({
    contributions = {
        submitted: 0,
        approved: 0,
        pending: 0,
    },
}) {
    const stats = [
        {
            title: "Submitted",
            value: contributions.submitted,
            color: "text-white",
        },
        {
            title: "Approved",
            value: contributions.approved,
            color: "text-green-400",
        },
        {
            title: "Pending",
            value: contributions.pending,
            color: "text-yellow-400",
        },
    ];

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Community Contributions</h2>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-2xl bg-[#12251C] p-6"
                    >
                        <p className="text-gray-400">{stat.title}</p>

                        <h3 className={`mt-2 text-3xl font-bold ${stat.color}`}>
                            {stat.value}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
