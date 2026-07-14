import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home_components/hero/Navbar";
import DashboardHero from "../components/quiz/dashboard/DashboardHero";
import StatsCards from "../components/quiz/dashboard/StatsCards";
import TopicGrid from "../components/quiz/dashboard/TopicGrid";
import { getDashboard } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const Quiz = () => {
    const { isLoggedIn, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Redirection logic if not authenticated
        if (!authLoading && !isLoggedIn) {
            navigate("/login");
            return;
        }

        const fetchDashboardData = async () => {
            if (!isLoggedIn) return;
            try {
                const dashboardData = await getDashboard();
                setData(dashboardData);
            } catch (err) {
                console.error("Error loading quiz dashboard:", err);
                setError("Failed to load quiz dashboard. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchDashboardData();
        }
    }, [isLoggedIn, authLoading, navigate]);

    if (authLoading || (isLoggedIn && loading)) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[100vh] flex-col items-center justify-center gap-4 bg-[#F8F5EF] pt-24">
                    <Loader2 className="h-10 w-10 animate-spin text-[#47613F]" />
                    <p className="text-gray-500 font-medium">Loading Quiz Station...</p>
                </div>
            </>
        );
    }

    if (!isLoggedIn) {
        return null; // Will redirect in useEffect
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24 pb-16">
                {error ? (
                    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 shadow-sm">
                        <h2 className="text-xl font-bold">Oops!</h2>
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <DashboardHero user={data?.user} />
                        <StatsCards user={data?.user} />
                        <TopicGrid topics={data?.topics} />
                    </>
                )}
            </main>
        </>
    );
};

export default Quiz;