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
        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                credentials: "include",
            });

            if (!response.ok) {
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
