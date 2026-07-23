import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function NavDropdown({ label, icon: Icon, items }) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);
    const location = useLocation();

    // Check if any child item is active
    const isChildActive = items.some((item) => location.pathname === item.to);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 180);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 xl:gap-2 rounded-full border px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap shrink-0 ${
                    isChildActive || open
                        ? "bg-[#E8F0E8] text-[#36593D] border-[#36593D]/20 shadow-[0_4px_12px_rgba(54,89,61,0.15)]"
                        : "border-transparent text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D] hover:border-[#36593D]/15 hover:shadow-[0_2px_8px_rgba(54,89,61,0.10)] hover:-translate-y-[1px]"
                }`}
            >
                {Icon && <Icon size={16} />}
                <span>{label}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                        open ? "rotate-180 text-[#36593D]" : "text-gray-400"
                    }`}
                />
            </button>

            {/* Dropdown Menu matching exact design from screenshot */}
            {open && (
                <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white/98 p-2 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex flex-col gap-1">
                        {items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                                        isActive
                                            ? "bg-[#E8F0E8] text-[#36593D] font-semibold"
                                            : "text-gray-700 hover:bg-[#F4F8F4] hover:text-[#36593D]"
                                    }`}
                                >
                                    {ItemIcon && (
                                        <ItemIcon
                                            size={18}
                                            className={`shrink-0 transition-colors ${
                                                isActive ? "text-[#36593D]" : "text-gray-500 group-hover:text-[#36593D]"
                                            }`}
                                        />
                                    )}
                                    <span className="text-xs sm:text-sm font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
