import { ChevronLeft, ChevronRight } from "lucide-react";
/**
 * --------------------------------------------
 * Component: Pagination
 * Purpose:
 * Allows users to navigate through multiple
 * pages of dinosaur search results by
 * moving to the previous or next page.
 * --------------------------------------------
 */
export default function Pagination({ page, pagination, setPage }) {
    return (
        // Pagination container
        <div className="mt-12 flex items-center justify-center gap-6">
            {/* Previous page button */}
            <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!pagination.hasPreviousPage}
                className="
                    flex items-center gap-2
                    rounded-xl
                    border
                    border-[#D8D2C5]
                    bg-white
                    px-5
                    py-3
                    text-[#2E4A37]
                    transition
                    hover:border-[#47613F]
                    hover:bg-[#47613F]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:border-[#D8D2C5]
                    disabled:hover:bg-white
                    disabled:hover:text-[#2E4A37]
                "
            >
                <ChevronLeft size={18} />
                Previous
                {/* Displays the current page number */}
            </button>

            <div className="rounded-xl bg-[#2E4A37] px-6 py-3 font-semibold text-white">
                Page {page} of {pagination.totalPages}
            </div>
             {/* Next page button */}
            <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="
                    flex items-center gap-2
                    rounded-xl
                    border
                    border-[#D8D2C5]
                    bg-white
                    px-5
                    py-3
                    text-[#2E4A37]
                    transition
                    hover:border-[#47613F]
                    hover:bg-[#47613F]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:border-[#D8D2C5]
                    disabled:hover:bg-white
                    disabled:hover:text-[#2E4A37]
                "
            >
                Next
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
