export default function StatCard({ title, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#12251C] p-6 shadow-lg">
            <p className="text-sm text-gray-400">{title}</p>

            <h2 className="mt-2 text-3xl font-bold text-[#E4C08D]">{value}</h2>
        </div>
    );
}
