import { House, Compass, Trophy, User, LogOut, Settings } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { NavLink } from "react-router-dom";

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

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        console.log("Logout clicked");

        await logout();

        console.log("Logout finished");

        navigate("/");
    };

    return (
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0B1A13]">
            {/* Logo */}

            <div className="border-b border-white/10 p-8">
                <h1 className="text-2xl font-bold text-[#E4C08D]">Jurassic</h1>

                <p className="text-sm text-gray-400">Explorer Dashboard</p>
            </div>

            {/* Navigation */}

            <nav className="flex-1 space-y-2 p-6">
                {links.map((link) => {
                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.name}
                            to={link.path}
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
    );
}
