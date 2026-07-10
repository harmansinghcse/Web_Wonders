import { SearchX } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="rounded-3xl border border-dashed border-[#D8D2C5] bg-white py-24 text-center shadow-sm">
            <SearchX size={60} className="mx-auto text-[#47613F]" />

            <h3 className="mt-6 text-3xl font-bold text-[#2E4A37]">
                No Dinosaurs Found
            </h3>

            <p className="mt-3 text-gray-500">
                Try changing your search or filters.
            </p>
        </div>
    );
}
