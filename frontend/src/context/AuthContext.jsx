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
            console.log("Checking auth...");

            const response = await fetch(`http://localhost:5000/api/users/me`, {
                credentials: "include",
            });

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("Response:", data);

            if (!response.ok) {
                setUser(null);
                return;
            }

            setUser(data.user);
            console.log("User updated:", data.user);
        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                checkAuth,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
