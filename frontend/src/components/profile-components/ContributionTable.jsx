/**
 * --------------------------------------------
 * Component: ContributionTable
 * Purpose:
 * Displays the user's recent dinosaur
 * contributions in a table format.
 * If no contributions are available,
 * an empty state message is displayed.
 * --------------------------------------------
 */
export default function ContributionTable({ contributions = [] }) {
    return (
         // Recent contributions section
        <section>
            {/* Section heading */}
            <h2 className="mb-6 text-2xl font-bold">Recent Contributions</h2>
             {/* Table container */}
            <div className="overflow-hidden rounded-2xl bg-[#12251C]">
                <table className="w-full">
                    {/* Table header */}
                    <thead className="border-b border-white/10">
                        <tr>
                            <th className="p-4 text-left">Dinosaur</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Display message when no contributions are available */}
                        {contributions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-6 text-center text-gray-400"
                                >
                                    No contributions yet.
                                </td>
                            </tr>
                        ) : (
                            /* Display each contribution in a table row */
                            contributions.map((item) => (
                                <tr
                                    key={item._id || item.name}
                                    className="border-b border-white/5"
                                >
                                    {/* Dinosaur name */}
                                    <td className="p-4">{item.name}</td>
                                    {/* Contribution date */}
                                    <td className="p-4">
                                        {new Date(
                                            item.date || item.createdAt,
                                        ).toLocaleDateString()}
                                    </td>
                                         {/* Contribution status */}
                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm ${
                                                item.status === "Approved"
                                                    ? "bg-green-600"
                                                    : item.status === "Pending"
                                                      ? "bg-yellow-600"
                                                      : "bg-red-600"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
