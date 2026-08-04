import { NavLink } from "react-router-dom";

function NavbarLink({ to, icon: Icon, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-1 xl:gap-1.5 rounded-full border border-transparent px-2 xl:px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out whitespace-nowrap shrink-0 ${
                    isActive
                        ? "bg-[#D2E6D2] text-[#234229] border-[#36593D]/40 shadow-[0_4px_20px_rgba(37,74,42,0.35),0_0_12px_rgba(54,89,61,0.3)] font-semibold"
                        : "text-[#4A4A4A] hover:bg-[#EAF3EA] hover:text-[#36593D] hover:border-[#36593D]/25 hover:shadow-[0_0_15px_rgba(54,89,61,0.18)] hover:-translate-y-[1px]"
                }`
            }
        >
            <Icon size={15} />
            <span>{children}</span>
        </NavLink>
    );
}

export default NavbarLink;
