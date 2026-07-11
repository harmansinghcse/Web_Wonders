import { useState } from "react";
import { eras } from "../../data/eras";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(1);
    const navigate = useNavigate();
    const currentEra = eras[activeEra];

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0E120E]">
            {/* Background */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentEra.background}
                    src={currentEra.background}
                    alt={currentEra.name}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </AnimatePresence>

            {/* Overall dark overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Top gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent" />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-[#10120F] via-transparent to-transparent" />

            {/* Side vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.6)_100%)]" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-0">
                {/* Top bar */}
                <div className="relative z-50 mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <nav className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-xl sm:gap-3 sm:px-4 md:gap-4 md:px-5 md:py-3">
                        <button
                            onClick={() => navigate("/")}
                            className="group flex items-center gap-1.5 text-xs font-medium text-gray-300 transition-colors hover:text-white sm:gap-2 md:text-sm"
                        >
                            <span className="transition-transform duration-300 group-hover:-translate-x-1">
                                ←
                            </span>
                            Home
                        </button>

                        <div className="h-5 w-px bg-white/10" />

                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9AA5B] sm:text-xs sm:tracking-[0.25em]">
                            Geological Timeline
                        </span>
                    </nav>

                    <div className="w-fit rounded-full border border-[#C9AA5B]/20 bg-black/20 px-3 py-1.5 text-[10px] tracking-wide text-gray-400 backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs">
                        <span className="font-medium text-[#E7D3A7]">
                            Timeline Note:
                        </span>{" "}
                        Ma = Million Years Ago
                    </div>
                </div>

                {/* Hero */}
                <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.45)] sm:p-6 sm:rounded-4xl lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:p-10">
                    {/* Left */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEra.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-xs uppercase tracking-[0.25em] text-[#C9AA5B] sm:text-sm sm:tracking-[0.35em]">
                                Journey Through Time
                            </p>

                            <h1 className="mt-4 font-serif text-4xl leading-tight text-white sm:mt-5 sm:text-5xl md:text-6xl lg:text-7xl">
                                {currentEra.name}
                            </h1>

                            <h2 className="mt-2 text-xl text-[#E7D3A7] sm:mt-3 sm:text-2xl lg:text-3xl">
                                {currentEra.tagline}
                            </h2>

                            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-300 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
                                {currentEra.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Right */}
                    <div className="order-1 relative flex items-end justify-center lg:order-2">
                        {/* Golden ground glow */}
                        <div className="absolute bottom-4 h-16 w-48 rounded-full bg-[#C9AA5B]/20 blur-3xl sm:bottom-6 sm:h-24 sm:w-72" />

                        {/* Side vignette */}
                        <div className="absolute inset-0 rounded-full bg-black/20 blur-3xl" />

                        <motion.img
                            key={currentEra.dinosaur}
                            src={currentEra.dinosaur}
                            alt={currentEra.name}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.7 }}
                            className="relative z-10 max-h-52 object-contain rounded-2xl drop-shadow-[0_45px_80px_rgba(0,0,0,.9)] brightness-105 contrast-110 sm:max-h-72 sm:rounded-3xl md:max-h-96 lg:max-h-140"
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 rounded-2xl border border-[#C9AA5B]/10 bg-black/30 p-5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,.35)] sm:mt-8 sm:rounded-[28px] sm:p-6 lg:mt-10 lg:p-10">
                    <div className="flex justify-between text-[10px] text-gray-400 sm:text-xs md:text-sm">
                        <span>{eras[0].start}</span>
                        <span>{eras[1].start}</span>
                        <span>{eras[2].start}</span>
                        <span>{eras[2].end}</span>
                    </div>

                    <div className="relative mt-6 sm:mt-8">
                        <div className="h-0.75 rounded-full bg-[#3A3D34]" />

                        <motion.div
                            animate={{
                                width:
                                    activeEra === 0
                                        ? "0%"
                                        : activeEra === 1
                                          ? "50%"
                                          : "100%",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 18,
                            }}
                            className="absolute left-0 top-0 h-0.75 rounded-full bg-[#C9AA5B]"
                        />

                        <div className="absolute inset-0 flex -translate-y-1/2 items-center justify-between">
                            {eras.map((era, index) => (
                                <motion.button
                                    key={era.id}
                                    onClick={() => setActiveEra(index)}
                                    whileHover={{ scale: 1.15 }}
                                    animate={{
                                        scale: activeEra === index ? 1.3 : 1,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 18,
                                    }}
                                    className="relative flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9"
                                >
                                    {/* Glow */}
                                    {activeEra === index && (
                                        <motion.div
                                            layoutId="activeGlow"
                                            className="absolute inset-0 rounded-full bg-[#C9AA5B]/20 blur-md"
                                        />
                                    )}

                                    {/* Circle */}
                                    <div
                                        className={`relative h-4 w-4 rounded-full border-2 sm:h-5 sm:w-5 ${
                                            activeEra === index
                                                ? "border-[#C9AA5B] bg-[#C9AA5B]"
                                                : "border-[#C9AA5B] bg-[#151712]"
                                        }`}
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
                        {eras.map((era, index) => (
                            <button
                                key={era.id}
                                onClick={() => setActiveEra(index)}
                                className="text-center"
                            >
                                <h3
                                    className={`font-serif text-sm leading-tight transition-all sm:text-xl md:text-2xl lg:text-3xl ${
                                        activeEra === index
                                            ? "text-[#E7D3A7]"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {era.name}
                                </h3>

                                <p className="mt-1 text-[9px] text-gray-500 sm:mt-2 sm:text-[10px] md:text-sm">
                                    ({era.start} – {era.end})
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
