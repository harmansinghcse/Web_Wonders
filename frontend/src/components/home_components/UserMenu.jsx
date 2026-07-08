import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function UserMenu() {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/20" />
        );
    }

    if (!isLoggedIn) {
        return (
            <>
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
            </>
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
