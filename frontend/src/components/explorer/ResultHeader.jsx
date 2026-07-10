export default function ResultsHeader({ totalDocuments }) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h2 className="text-4xl font-bold text-[#2E4A37]">Dinosaurs</h2>

                <p className="mt-2 text-gray-500">
                    {totalDocuments} Results Found
                </p>
            </div>
        </div>
    );
}
