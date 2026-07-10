import { Link } from "react-router-dom";
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
                        <span>🔑 Login</span>

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

        return (
            <div className="flex flex-col">
                <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-lg font-semibold text-white">
                        {user.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">Explorer</p>
                </div>

                <Link
                    to="/profile"
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-xl px-4 py-4 transition hover:bg-white/10"
                >
                    <p className="text-lg font-semibold text-white">
                        {user.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Level {user.level ?? 1} • {user.rank ?? "Fossil Hunter"}
                    </p>

                    <span className="transition group-hover:translate-x-1">
                        ›
                    </span>
                </Link>

                <button
                    onClick={() => {
                        onClose();
                        // TODO: logout()
                    }}
                    className="group flex items-center justify-between rounded-xl px-4 py-4 text-left text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                    <span>🚪 Logout</span>

                    <span className="transition group-hover:translate-x-1">
                        ›
                    </span>
                </button>
            </div>
        );
    }

    /* ---------------- DESKTOP ---------------- */

    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    to="/login"
                    className="rounded-full border bg-[#516858] px-5 py-2 transition duration-300 hover:bg-white hover:text-[#516858]"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="rounded-full border bg-[#516858] px-5 py-2 transition duration-300 hover:bg-white hover:text-[#516858]"
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <span className="font-semibold">Welcome, {user.name}</span>

            <Link
                to="/profile"
                className="rounded-full border bg-[#516858] px-5 py-2 transition duration-300 hover:bg-white hover:text-[#516858]"
            >
                Profile
            </Link>
        </div>
    );
}

export default UserMenu;
