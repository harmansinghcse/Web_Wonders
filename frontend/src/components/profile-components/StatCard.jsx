/**
 * --------------------------------------------
 * Component: StatCard
 * Purpose:
 * Displays an individual statistic card
 * containing a title and its corresponding
 * value in the user's profile overview.
 * --------------------------------------------
 */
export default function StatCard({ title, value }) {
    return (
        // Individual statistic card
        <div className="rounded-2xl border border-[#D8D2C5] bg-white p-6 shadow-xs hover:shadow-md transition duration-200">
        {/* Statistic title */}
            <p className="text-sm font-semibold text-slate-500">{title}</p>
            {/* Statistic value */}
            <h2 className="mt-2 text-3xl font-black text-[#005611]">{value}</h2>
        </div>
    );
}
