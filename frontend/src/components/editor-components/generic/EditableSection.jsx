// components/editor-components/generic/EditableSection.jsx

import { Pencil, ImagePlus } from "lucide-react";

export default function EditableSection({ children, title, className = "" }) {
    return (
        <section
            className={`
                group
                relative
                transition-all
                duration-300
                hover:ring-2
                hover:ring-[#C6A87C]
                hover:ring-offset-4
                hover:ring-offset-white
                rounded-2xl
                ${className}
            `}
        >
            {/* Floating Toolbar */}
            <div
                className="
                    absolute
                    -top-4
                    right-6
                    z-50

                    flex
                    items-center
                    gap-3

                    rounded-full
                    border
                    border-[#C6A87C]/30
                    bg-[#1E1E1E]

                    px-4
                    py-2

                    shadow-xl

                    opacity-0
                    -translate-y-2

                    transition-all
                    duration-300

                    group-hover:opacity-100
                    group-hover:translate-y-0
                "
            >
                <Pencil size={16} className="text-[#C6A87C]" />

                <span className="text-sm font-medium text-white">
                    Edit {title}
                </span>

                <ImagePlus size={16} className="text-gray-400" />
            </div>

            {children}
        </section>
    );
}
