import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopicFooterCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="mx-auto my-12 max-w-7xl px-6">
            <div className="rounded-[30px] bg-[#47613F] p-8 text-white">
                <h2 className="text-3xl font-bold">
                    Want to explore another topic?
                </h2>

                <p className="mt-3 max-w-2xl text-green-100">
                    Discover fossils, dinosaurs, evolution, extinction events,
                    and many more prehistoric adventures.
                </p>

                <button
                    onClick={() => navigate("/quiz")}
                    className=" mt-8 flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-[#47613F] transition-all hover:gap-3">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </div>
        </section>
    );
};

export default TopicFooterCTA;