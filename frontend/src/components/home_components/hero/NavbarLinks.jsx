import { NavLink } from "react-router-dom";

function NavbarLink({ to, icon: Icon, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                        ? "bg-[#F1EDE4] text-[#36593D] shadow-sm"
                        : "text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D]"
                }`
            }
        >
            <Icon size={16} />
            <span>{children}</span>
        </NavLink>
    );
}

export default NavbarLink;
