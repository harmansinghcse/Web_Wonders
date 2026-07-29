import {
    House,
    Compass,
    Trophy,
    User,
    LogOut,
    Settings,
    X,
    ShieldAlert,
    Gamepad2,
    Users,
    Map
} from "lucide-react";

import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/jurrasic-logo.png";

/**
 * --------------------------------------------
 * Component: Sidebar
 * Purpose:
 * Displays the application's navigation menu,
 * including links to different pages and a
 * logout option. It also supports responsive
 * behavior for mobile devices.
 * --------------------------------------------
 */

// Navigation links displayed in the sidebar
const links = [
    {
        name: "Home",
        icon: House,
        path: "/",
    },
    {
        name: "Explore",
        icon: Compass,
        path: "/explore",
    },
    {
        name: "Quiz",
        icon: Trophy,
        path: "/quiz",
    },
    {
        name: "Games",
        icon: Gamepad2,
        path: "/games",
    },
    {
        name: "Community",
        icon: Users,
        path: "/community",
    },
    {
        name: "Profile",
        icon: User,
        path: "/profile",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "admin";

    const sidebarLinks = [
        ...links,
        ...(isAdmin
            ? [
                  {
                      name: "Moderation",
                      icon: ShieldAlert,
                      path: "/admin/submissions",
                  },
              ]
            : []),
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                />
            )}
            {/* Sidebar container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-[#D8D2C5]/20 bg-[#1E3326] transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between border-b border-[#D8D2C5]/20 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Jurassic Explorer"
                            className="h-9 w-auto object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-wider text-white">
                                Jurassic
                            </h1>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3BFA8]">
                                Explorer Console
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-[#A3BFA8] transition hover:bg-white/5 hover:text-white lg:hidden cursor-pointer"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 sm:p-5 no-scrollbar">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-[#1E3326] shadow-md scale-[1.01]"
                                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={19} className="shrink-0" />
                                <span>{link.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-[#D8D2C5]/20 p-4 sm:p-5">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm text-red-300 font-semibold transition-colors hover:bg-red-500/10 hover:text-red-200 cursor-pointer"
                    >
                        <LogOut size={19} className="shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
