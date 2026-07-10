import { ChevronDown, Leaf } from "lucide-react";

export default function FilterDropdown({
    label,
    icon: Icon = Leaf,
    value,
    onChange,
    options = [],
}) {
    return (
        <div className="relative w-56">
            {/* Left Icon */}
            <Icon
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#47613F]"
            />

            {/* Select */}
            <select
                value={value}
                onChange={onChange}
                className="
                    h-14
                    w-full
                    appearance-none
                    rounded-2xl
                    border
                    border-[#D8D2C5]
                    bg-white
                    pl-12
                    pr-12
                    text-sm
                    font-medium
                    text-[#2E4A37]
                    shadow-md
                    outline-none
                    transition
                    hover:border-[#47613F]
                    focus:border-[#47613F]
                    focus:ring-4
                    focus:ring-[#47613F]/15
                "
            >
                <option value="">{label}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Right Chevron */}
            <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
        </div>
    );
}
