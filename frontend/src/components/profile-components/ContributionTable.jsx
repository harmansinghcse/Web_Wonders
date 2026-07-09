export default function ContributionTable({ contributions = [] }) {
    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Recent Contributions</h2>

            <div className="overflow-hidden rounded-2xl bg-[#12251C]">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr>
                            <th className="p-4 text-left">Dinosaur</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
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
                            contributions.map((item) => (
                                <tr
                                    key={item._id || item.name}
                                    className="border-b border-white/5"
                                >
                                    <td className="p-4">{item.name}</td>

                                    <td className="p-4">
                                        {new Date(
                                            item.date || item.createdAt,
                                        ).toLocaleDateString()}
                                    </td>

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
