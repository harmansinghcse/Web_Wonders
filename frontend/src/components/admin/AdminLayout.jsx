import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    LayoutDashboard, 
    Layers, 
    PlusCircle, 
    FileText, 
    BrainCircuit, 
    Users, 
    Settings, 
    LogOut, 
    Compass, 
    Menu, 
    X,
    Lock
} from "lucide-react";

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center bg-[#0B1A13] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#C9AA5B]" />
                    <p className="text-sm font-medium text-gray-400">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return (
            <div className="relative flex min-h-screen items-center justify-center bg-[#070806] px-6 text-white text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1b2b1e_0%,transparent_70%)]" />
                <div className="relative z-10 max-w-md rounded-3xl border border-white/10 bg-neutral-900/60 p-8 backdrop-blur-2xl shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Access Denied</h1>
                    <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                        This section of the expedition is restricted to authorised Admin roles only. Please log in with an administrator account or return to the main map.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="rounded-xl bg-[#C9AA5B] px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-[#d5b974]"
                        >
                            Log In as Admin
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/5"
                        >
                            Return to Expedition
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const navigationItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Dinosaurs", href: "/admin/dinosaurs", icon: Layers },
        { name: "Create Dinosaur", href: "/admin/dinosaurs/create", icon: PlusCircle },
        { name: "Submissions", href: "/admin/submissions", icon: FileText },
        { name: "Pending AI Drafts", href: "#", icon: BrainCircuit, disabled: true },
        { name: "Quiz Management", href: "#", icon: BrainCircuit, disabled: true },
        { name: "Users", href: "#", icon: Users, disabled: true },
        { name: "Settings", href: "#", icon: Settings, disabled: true },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#070806] text-white flex">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#1E3326_0%,transparent_40%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,#16261D_0%,transparent_35%)]" />

            {/* Sidebar for Mobile overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-neutral-950/90 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Brand Logo */}
                <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🦖</span>
                        <span className="font-extrabold uppercase tracking-widest text-[#C9AA5B] text-lg">
                            Jurassic Admin
                        </span>
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        if (item.disabled) {
                            return (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 cursor-not-allowed select-none group"
                                >
                                    <Icon size={18} className="shrink-0 text-gray-700" />
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-800 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md">
                                        Soon
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                    isActive(item.href)
                                        ? "bg-[#C9AA5B] text-neutral-950 shadow-[0_0_15px_rgba(201,170,91,0.2)] font-bold"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Icon size={18} className={`shrink-0 ${isActive(item.href) ? "text-neutral-950" : "text-gray-400"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10 mt-auto shrink-0 bg-neutral-950/40">
                    <div className="flex items-center gap-3 px-2 py-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-[#1E3326] border border-[#C9AA5B]/20 flex items-center justify-center text-sm font-bold text-[#C9AA5B]">
                            {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate text-white">{user?.name || "Admin User"}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || "admin@jurassic.com"}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={18} className="shrink-0" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-white/10 bg-neutral-950/40 px-6 backdrop-blur-xl lg:px-8 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-white hidden sm:block">
                            Expedition Management Console
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/explore"
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-[#C9AA5B]/40 hover:text-white"
                        >
                            <Compass size={14} />
                            View Site
                        </Link>
                    </div>
                </header>

                {/* Dashboard Sub-content Container */}
                <main className="flex-1 overflow-y-auto relative p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
