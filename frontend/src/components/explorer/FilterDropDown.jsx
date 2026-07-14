import { ChevronDown, Leaf } from "lucide-react";
/**
 * --------------------------------------------
 * Component: FilterDropdown
 * Purpose:
 * A reusable dropdown component used in the
 * Explorer page for selecting filter options
 * such as Era, Diet, Location, and Sort.
 * --------------------------------------------
 */
export default function FilterDropdown({
    label,
    icon: Icon = Leaf,
    value,
    onChange,
    options = [],
}) {
    return (
        // Dropdown container
        <div className="relative w-56">
            {/* Filter icon displayed on the left */}
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
