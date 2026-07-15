/**
 * --------------------------------------------
 * Component: ResultsHeader
 * Purpose:
 * Displays the heading of the Explorer page
 * along with the total number of dinosaur
 * search results found.
 * --------------------------------------------
 */
export default function ResultsHeader({ totalDocuments }) {
    return (
        // Header section displaying page title and result count
        <div className="mb-8 flex items-center justify-between">
            <div>
                 {/* Explorer page title */}
                <h2 className="text-4xl font-bold text-[#2E4A37]">Dinosaurs</h2>
                {/* Total number of matching dinosaur records */}
                <p className="mt-2 text-gray-500">
                    {totalDocuments} Results Found
                </p>
            </div>
        </div>
    );
}
