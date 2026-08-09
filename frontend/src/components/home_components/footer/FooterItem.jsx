import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FooterItem = ({ icon: Icon, children, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-between transition-all duration-200 ease-out
        ${isActive
            ? "font-semibold text-[#45653A]"
            : "text-[#2F2F2F] hover:text-[#45653A]"
        }`
      }
    >
      {/* Left Side */}
      <div className="flex items-center gap-2.5">

        <Icon
          size={17}
          className="flex-shrink-0 text-[#45653A] transition-transform duration-200 group-hover:scale-105"
        />

        <span className="text-[14px] leading-6">
          {children}
        </span>

      </div>

      {/* Right Arrow */}
      <ArrowRight
        size={14}
        className="ml-3 translate-x-[-5px] opacity-0 text-[#45653A] transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
      />

    </NavLink>
  );
};

export default FooterItem;