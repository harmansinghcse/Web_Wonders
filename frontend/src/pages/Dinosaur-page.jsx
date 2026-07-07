import React from "react";
import { Ruler, Weight, Leaf, CalendarDays, Globe, Gauge } from "lucide-react";

const TRexPage = () => {
    // Stats array - Update values here to fix the repeating "12-15 m" in the original design
    const stats = [
        {
            icon: <Ruler size={32} strokeWidth={1.5} />,
            title: "LENGTH",
            value: "12-15 m",
        },
        {
            icon: <Weight size={32} strokeWidth={1.5} />,
            title: "WEIGHT",
            value: "12-15 m",
        },
        {
            icon: <Leaf size={32} strokeWidth={1.5} />,
            title: "DIET",
            value: "12-15 m",
        },
        {
            icon: <CalendarDays size={32} strokeWidth={1.5} />,
            title: "PERIOD",
            value: "12-15 m",
        },
        {
            icon: <Globe size={32} strokeWidth={1.5} />,
            title: "HABITAT",
            value: "12-15 m",
        },
        {
            icon: <Gauge size={32} strokeWidth={1.5} />,
            title: "SPEED",
            value: "12-15 m",
        },
    ];

    return (
        <div className="relative min-h-screen bg-black flex flex-col justify-end font-sans overflow-hidden">
            {/* Background Image with Overlays */}
            <div className="absolute inset-0 z-0">
                <img
                    // Replace this URL with your actual T-Rex image path
                    src="trex1.jpg"
                    alt="T-Rex Background"
                    className="w-full h-full object-cover opacity-70"
                />
                {/* Gradients to darken edges for text readability */}
                <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grow flex flex-col justify-center mt-24">
                <div className="max-w-2xl">
                    <h2 className="text-[#c6a87c] text-sm md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                        The King of Dinosaurs
                    </h2>
                    <h1 className="text-5xl md:text-[5.5rem] font-bold text-white mb-2 leading-[1.1] tracking-tight">
                        TYRANNOSAURUS
                        <br />
                        <span className="text-[#c6a87c]">T-REX</span>
                    </h1>
                    <p className="text-gray-200 text-base md:text-lg mt-8 leading-relaxed max-w-xl pr-4">
                        The Tyrannosaurus rex, or T. rex, was a massive
                        carnivorous dinosaur from the late Cretaceous period.
                        Standing up to 12 meters long, it had powerful jaws with
                        60 sharp teeth, strong hind legs, and tiny arms. Known
                        as the "king of dinosaurs," it was a fierce apex
                        predator.
                    </p>
                </div>
            </div>

            {/* Quick Facts Bottom Bar */}
            <div className="relative z-10 w-full bg-[#201f19]/95 border-t border-[#36342e] mt-12">
                <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
                    {/* Quick Facts Header Block */}
                    <div className="flex items-center justify-center p-8 lg:w-56 lg:border-r border-[#36342e] shrink-0 border-b lg:border-b-0">
                        <h3 className="text-white text-xl font-bold leading-tight text-center lg:text-left tracking-wide">
                            QUICK <br className="hidden lg:block" />
                            FACTS
                        </h3>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grow">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center justify-center p-8 border-[#36342e] ${
                                    index !== stats.length - 1
                                        ? "lg:border-r"
                                        : ""
                                } border-b md:border-b-0 md:border-r`}
                            >
                                <div className="text-[#c6a87c] mb-4">
                                    {stat.icon}
                                </div>
                                <span className="text-white text-sm font-bold tracking-wider mb-1">
                                    {stat.title}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TRexPage;
