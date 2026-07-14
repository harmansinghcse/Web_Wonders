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
        <div className="rounded-2xl border border-white/10 bg-[#12251C] p-6 shadow-lg">
        {/* Statistic title */}
            <p className="text-sm text-gray-400">{title}</p>
            {/* Statistic value */}
            <h2 className="mt-2 text-3xl font-bold text-[#E4C08D]">{value}</h2>
        </div>
    );
}
