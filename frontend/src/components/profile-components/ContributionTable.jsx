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
        approved: { label: "Approved", className: "bg-green-600/20 text-green-400 border border-green-500/20" },
        pending: { label: "Pending", className: "bg-yellow-600/20 text-yellow-400 border border-yellow-500/20" },
        rejected: { label: "Rejected", className: "bg-red-600/20 text-red-400 border border-red-500/20" },
    };

    return (
         // Recent contributions section
        <section>
            {/* Section heading */}
            <h2 className="mb-6 text-2xl font-bold">Recent Contributions</h2>
             {/* Table container */}
            <div className="overflow-hidden rounded-2xl bg-[#12251C] border border-white/10">
                <table className="w-full">
                    {/* Table header */}
                    <thead className="border-b border-white/10 bg-black/20">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-300">Dinosaur</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-300">Date</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-300">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {/* Display message when no contributions are available */}
                        {contributions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-6 text-center text-gray-400 text-sm"
                                >
                                    No contributions yet.
                                </td>
                            </tr>
                        ) : (
                            /* Display each contribution in a table row */
                            contributions.map((item) => {
                                const statusInfo = statusLabels[item.status] || {
                                    label: item.status,
                                    className: "bg-gray-600/20 text-gray-400 border border-gray-500/20",
                                };
                                const dinoName = item.dinosaurData?.name || item.name || "Unnamed Dino";
                                const dinoThumb = item.dinosaurData?.images?.heroBackground || "";

                                return (
                                    <tr
                                        key={item._id}
                                        className="transition hover:bg-white/5"
                                    >
                                        {/* Dinosaur name & Thumbnail */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {dinoThumb ? (
                                                    <img
                                                        src={dinoThumb}
                                                        alt={dinoName}
                                                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/10"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-xs">
                                                        🦖
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-semibold text-white text-sm block">
                                                        {dinoName}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 italic">
                                                        {item.dinosaurData?.scientificName}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Contribution date */}
                                        <td className="p-4 text-sm text-gray-300">
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
                                                    <span className="text-[11px] text-red-400/90 leading-normal max-w-xs block">
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
