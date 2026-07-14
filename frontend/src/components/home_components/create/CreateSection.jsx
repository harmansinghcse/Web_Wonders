import CreateFeatures from "./CreateFeatures";
import CreateShowcase from "./CreateShowcase";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const createBg = "/create-bg.png";

export default function CreateSection() {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-[#EFEAE0] px-6 py-20 sm:px-8 lg:px-12">
            {/* Back-ground */}
            <img
                src={createBg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-right"
            />

            {/* Overlay so left-side text stays readable */}
            {/* <div className="absolute inset-0 bg-linear-to-r from-[#EFEAE0] via-[#EFEAE0]/80 to-transparent" /> */}

            {/* Content sits above background */}
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div>
                    <div className="mb-6 flex items-center gap-4">
                        <div className="h-px w-12 bg-[#8A867E]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6A675E]">
                            Unleash Your Creativity
                        </p>
                    </div>

                    <h2 className="font-display text-4xl leading-[1.05] text-[#1F1F1F] sm:text-5xl lg:text-6xl">
                        Create Your
                        <br />
                        <span className="text-[#36593D]">Own Dinosaur</span>
                    </h2>

                    <p className="mt-6 max-w-md text-base leading-7 text-[#5D5D5D] sm:text-lg sm:leading-8">
                        Design your very own prehistoric creature. Choose its
                        era, diet, habitat, abilities and more.
                    </p>

                    <CreateFeatures />

                    <button
                        onClick={() => navigate("/create")}
                        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#36593D] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#2A4530] sm:px-8 sm:py-4 sm:text-base"
                    >
                        Start Creating
                        <ArrowRight
                            size={18}
                            className="transition group-hover:translate-x-1"
                        />
                    </button>
                </div>

                <CreateShowcase />
            </div>
        </section>
    );
}
