/**
 * --------------------------------------------
 * Component: ContributionSection
 * Purpose:
 * Displays the user's community contribution
 * statistics, including submitted, approved,
 * and pending contributions.
 * --------------------------------------------
 */
export default function ContributionSection({
    contributions = {
        submitted: 0,
        approved: 0,
        pending: 0,
    },
}) {
     // Contribution statistics displayed on the profile page
    const stats = [
        {
            title: "Submitted",
            value: contributions.submitted,
            color: "text-slate-800",
        },
        {
            title: "Approved",
            value: contributions.approved,
            color: "text-[#005611]",
        },
        {
            title: "Pending",
            value: contributions.pending,
            color: "text-amber-600",
        },
    ];

    return (
        <section>
            {/* Section heading */}
            <h2 className="mb-6 text-2xl font-bold text-slate-800">Community Contributions</h2>
            {/* Grid displaying contribution statistics */}
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-2xl border border-[#D8D2C5] bg-white p-6 shadow-xs"
                    >
                        {/* Contribution category */}
                        <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                        {/* Contribution count */}
                        <h3 className={`mt-2 text-3xl font-black ${stat.color}`}>
                            {stat.value}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
