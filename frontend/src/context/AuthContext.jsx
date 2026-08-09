import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        // Prevent firing /api/users/me when visitor is known to be unauthenticated/logged out
        const hasSession = localStorage.getItem("is_logged_in");
        if (hasSession === "false") {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                credentials: "include",
            });

            if (!response.ok) {
                localStorage.setItem("is_logged_in", "false");
                setUser(null);
                localStorage.removeItem("isLoggedIn");
                return;
            }

            const data = await response.json();

            setUser(data.user);
            localStorage.setItem("isLoggedIn", "true");
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            localStorage.removeItem("isLoggedIn");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/api/users/logout`, {
                method: "POST",
                credentials: "include",
                });
            localStorage.removeItem("isLoggedIn");
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.setItem("is_logged_in", "false");
            setUser(null);
            localStorage.removeItem("isLoggedIn");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                checkAuth,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
