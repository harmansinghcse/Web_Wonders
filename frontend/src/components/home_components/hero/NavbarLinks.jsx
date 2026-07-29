import { NavLink } from "react-router-dom";

function NavbarLink({ to, icon: Icon, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-1 xl:gap-1.5 rounded-full border border-transparent px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap shrink-0 ${
                    isActive
                        ? "bg-[#E2EFE2] text-[#2E4E34] border-[#36593D]/30 shadow-[0_0_18px_rgba(54,89,61,0.22)] font-semibold"
                        : "text-[#4A4A4A] hover:bg-[#EAF3EA] hover:text-[#36593D] hover:border-[#36593D]/25 hover:shadow-[0_0_15px_rgba(54,89,61,0.18)] hover:-translate-y-[1px]"
                }`
            }
        >
            <Icon size={16} />
            <span>{children}</span>
        </NavLink>
    );
}

export default NavbarLink;
