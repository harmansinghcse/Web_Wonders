import { Search } from "lucide-react";

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search dinosaurs...",
}) {
    return (
        <div className="relative mx-auto w-full max-w-5xl">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full
                    rounded-2xl
                    border
                    border-white/30
                    bg-white
                    px-8
                    py-5
                    pr-16
                    text-lg
                    text-gray-700
                    shadow-xl
                    outline-none
                    transition
                    focus:border-[#47613F]
                    focus:ring-4
                    focus:ring-[#47613F]/15
                "
            />
            {/*search button */}
            <button
                type="button"
                className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-[#47613F]
                    transition
                    hover:scale-110
                "
            >
                <Search size={28} />
            </button>
        </div>
    );
}
