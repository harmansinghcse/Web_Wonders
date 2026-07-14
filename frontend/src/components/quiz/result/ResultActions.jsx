import { RotateCcw, Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResultActions = () => {
    const navigate = useNavigate();

    return (
        <section className="mx-auto my-10 max-w-5xl px-6">
            <div className="grid gap-4 md:grid-cols-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#47613F] py-4 font-semibold text-white transition hover:bg-[#365239]">
                    <RotateCcw size={18} />
                    Play Again
                </button>

                <button
                    onClick={() => navigate("/quiz")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#E7DDC8] bg-white py-4 font-semibold text-[#47613F] transition hover:bg-[#EDF3E7]">
                    <Home size={18} />
                    Dashboard
                </button>

                <button
                    onClick={() => navigate("/explorer")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#E7DDC8] bg-white py-4 font-semibold text-[#47613F] transition hover:bg-[#EDF3E7]">
                    <Search size={18} />
                    Explore
                </button>
            </div>
        </section>
    );
};

export default ResultActions;