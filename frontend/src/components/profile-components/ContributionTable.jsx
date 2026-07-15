/**
 * --------------------------------------------
 * Component: ContributionTable
 * Purpose:
 * Displays the user's recent dinosaur
 * contributions in a table format with thumbnails.
 * If no contributions are available,
 * an empty state message is displayed.
 * --------------------------------------------
 */
export default function ContributionTable({ contributions = [] }) {
    const statusLabels = {
        approved: { label: "Approved", className: "bg-emerald-50 text-[#005611] border border-emerald-200" },
        pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
        rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700 border border-rose-200" },
    };

    return (
         // Recent contributions section
        <section>
            {/* Section heading */}
            <h2 className="mb-6 text-2xl font-bold text-slate-800">Recent Contributions</h2>
             {/* Table container */}
            <div className="overflow-hidden rounded-2xl bg-white border border-[#D8D2C5] shadow-xs">
                <table className="w-full">
                    {/* Table header */}
                    <thead className="border-b border-[#D8D2C5] bg-[#F7F5EF]">
                        <tr>
                            <th className="p-4 text-left text-sm font-bold text-slate-700">Dinosaur</th>
                            <th className="p-4 text-left text-sm font-bold text-slate-700">Date</th>
                            <th className="p-4 text-left text-sm font-bold text-slate-700">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#D8D2C5]/30">
                        {/* Display message when no contributions are available */}
                        {contributions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-6 text-center text-slate-500 text-sm font-medium"
                                >
                                    No contributions yet.
                                </td>
                            </tr>
                        ) : (
                            /* Display each contribution in a table row */
                            contributions.map((item) => {
                                const statusInfo = statusLabels[item.status] || {
                                    label: item.status,
                                    className: "bg-slate-50 text-slate-600 border border-slate-200",
                                };
                                const dinoName = item.dinosaurData?.name || item.name || "Unnamed Dino";
                                const dinoThumb = item.dinosaurData?.images?.heroBackground || "";

                                return (
                                    <tr
                                        key={item._id}
                                        className="transition hover:bg-slate-50/50"
                                    >
                                        {/* Dinosaur name & Thumbnail */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {dinoThumb ? (
                                                    <img
                                                        src={dinoThumb}
                                                        alt={dinoName}
                                                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#D8D2C5]"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 border border-[#D8D2C5] flex items-center justify-center text-xs">
                                                        🦖
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-bold text-slate-800 text-sm block">
                                                        {dinoName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 font-semibold italic">
                                                        {item.dinosaurData?.scientificName}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Contribution date */}
                                        <td className="p-4 text-sm text-slate-600 font-semibold">
                                            {new Date(
                                                item.date || item.createdAt,
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        
                                        {/* Contribution status & Feedback reason */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider w-fit ${statusInfo.className}`}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                                {item.status === "rejected" && item.feedback && (
                                                    <span className="text-[11px] text-rose-600 font-medium leading-normal max-w-xs block">
                                                        <strong>Feedback:</strong> "{item.feedback}"
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
