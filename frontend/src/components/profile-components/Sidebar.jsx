import {
    House,
    Compass,
    Trophy,
    User,
    LogOut,
    Settings,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { NavLink } from "react-router-dom";
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
    const { logout } = useAuth();
    // Handles user logout and redirects to the home page
    const handleLogout = async () => {
        console.log("Logout clicked");

        await logout();

        console.log("Logout finished");

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
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0B1A13] transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between border-b border-white/10 p-6 sm:p-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#E4C08D]">
                            Jurassic
                        </h1>
                        <p className="text-sm text-gray-400">
                            Explorer Dashboard
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto p-6">
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                                        isActive
                                            ? "bg-[#E4C08D] text-black"
                                            : "text-gray-300 hover:bg-white/5"
                                    }`
                                }
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-white/10 p-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
