import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function UserMenu({ mobile = false, onClose = () => {} }) {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/20" />
        );
    }

    /* ---------------- MOBILE ---------------- */

    if (mobile) {
        if (!isLoggedIn) {
            return (
                <div className="flex flex-col gap-2">
                    <Link
                        to="/login"
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-xl px-4 py-4 transition hover:bg-white/10"
                    >
                        <span className="text-[#00851b]">🔑 Login</span>
                        <span className="transition group-hover:translate-x-1">
                            ›
                        </span>
                    </Link>

                    <Link
                        to="/signup"
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-xl px-4 py-4 text-[#E7D3A7] transition hover:bg-white/10"
                    >
                        <span>🦖 Create Account</span>
                        <span className="transition group-hover:translate-x-1">
                            ›
                        </span>
                    </Link>
                </div>
            );
        }

        const level = user.level ?? 1;
        const rank = user.rank ?? "Fossil Hunter";

        return (
            <div className="flex flex-col gap-3">
                {/* Name + role card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-base font-semibold text-white">
                        {user.name}
                    </p>
                    <p className="mt-0.5 text-sm text-[#8FBA97]">Explorer</p>
                </div>

                {/* Profile row: name + level/rank */}
                <Link
                    to="/profile"
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10"
                >
                    <p className="text-base font-semibold text-white">
                        {user.name}
                    </p>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-[#B7C4B9]">
                            Level {level} • {rank}
                        </p>
                        <ChevronRight
                            size={16}
                            className="text-[#B7C4B9] transition group-hover:translate-x-1"
                        />
                    </div>
                </Link>

                {/* Logout row with accent bar */}
                <button
                    onClick={() => {
                        onClose();
                        // TODO: logout()
                    }}
                    className="group flex items-center justify-between rounded-xl border-l-2 border-[#E28F7A] bg-[#E28F7A]/5 px-4 py-3 text-left text-[#E28F7A] transition hover:bg-[#E28F7A]/10"
                >
                    <span className="font-semibold">Logout</span>
                    <ChevronRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                    />
                </button>
            </div>
        );
    }

    /* ---------------- DESKTOP ---------------- */

    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    to="/login"
                    className="rounded-full border border-[#36593D]/20 px-5 py-2 text-sm font-medium text-[#36593D] transition duration-300 hover:bg-[#36593D] hover:text-white"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="rounded-full bg-[#36593D] px-5 py-2 text-sm font-medium text-white transition duration-300 hover:bg-[#446C4D]"
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <Link
            to="/profile"
            className="flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3 transition hover:bg-[#36593D]/10"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#36593D]/10">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <User size={18} className="text-[#36593D]" />
                )}
            </div>

            <div className="leading-tight">
                <p className="text-xs text-[#6A675E]">Welcome,</p>
                <p className="text-sm font-semibold text-[#1F1F1F]">
                    {user.name}
                </p>
            </div>

            <ChevronDown size={16} className="text-[#6A675E]" />
        </Link>
    );
}

export default UserMenu;
