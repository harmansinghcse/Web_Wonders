import { useNavigate } from "react-router-dom";
import StatsSection from "../home_components/stat_section";

export default function WelcomeHome() {
    const navigate = useNavigate();

    return (
        <>
            {/* home-content */}
            <div className="mt-16 max-w-xl px-6 lg:mt-30 lg:px-20">
                <h2 className="text-2xl font-semibold text-[#D8B56A] lg:text-3xl">
                    Journey Back in Time
                </h2>

                <h1 className="mt-2 text-5xl font-black leading-none text-white lg:text-7xl">
                    Explore the
                </h1>

                <h1 className="text-5xl font-black leading-none text-[#C9962A] lg:text-7xl">
                    Age of Dinosaurs
                </h1>
                <div className="py-5 text-base text-white lg:text-xl">
                    <p className="mt-8 max-w-xl text-lg leading-8 text-gray-200">
                        Discover prehistoric giants, uncover ancient fossils,
                        and travel through over
                        <span className="font-semibold text-[#E7D3A7]">
                            {" "}
                            180 million years
                        </span>{" "}
                        of Earth's history.
                    </p>
                </div>

                <div className="pt-4">
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        {/* Primary */}
                        <button
                            onClick={() => navigate("/timeline")}
                            className="group flex items-center justify-center rounded-full border border-[#D9B56A]/40 bg-[#36543E] px-8 py-4 font-semibold tracking-wide text-white shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#44684D]"
                        >
                            Explore Timeline
                            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>

                        {/* Secondary */}
                        <button className="group flex items-center justify-center rounded-full border border-[#D9B56A]/30 bg-[#8C7332] px-8 py-4 font-semibold tracking-wide text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#A7863D]">
                            Play Quiz
                            <span className="ml-3 transition-transform duration-300 group-hover:rotate-12">
                                🦴
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="mt-16 lg:mt-24">
                <StatsSection />
            </div> */}
        </>
    );
}
