import { NavLink } from "react-router-dom";

function NavbarLink({ to, icon: Icon, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                    isActive
                        ? "bg-[#E8F0E8] text-[#36593D] border-[#36593D]/20 shadow-[0_4px_12px_rgba(54,89,61,0.15)]"
                        : "text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D] hover:border-[#36593D]/15 hover:shadow-[0_2px_8px_rgba(54,89,61,0.10)] hover:-translate-y-[1px]"
                }`
            }
        >
            <Icon size={16} />
            <span>{children}</span>
        </NavLink>
    );
}

export default NavbarLink;
