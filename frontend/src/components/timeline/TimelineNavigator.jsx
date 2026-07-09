import { useState } from "react";
import { eras } from "../../data/eras";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(1);
    const navigate = useNavigate();
    const currentEra = eras[activeEra];

    return (
        <>
            <section className="relative min-h-screen overflow-hidden bg-[#0E120E]">
                <nav className="absolute left-8 top-8 z-50 flex items-center gap-4 rounded-full border border-white/10 bg-black/25 px-5 py-3 backdrop-blur-xl">
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Home
                    </button>

                    <div className="h-5 w-px bg-white/10" />

                    <span className="text-xs uppercase tracking-[0.25em] text-[#C9AA5B]">
                        Geological Timeline
                    </span>
                </nav>
                {/* Background */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentEra.background}
                        src={currentEra.background}
                        alt={currentEra.name}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
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

                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-8">
                    {/* Hero */}
                    <div className="grid grid-cols-[1.2fr_1fr] items-center gap-10 rounded-4xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.45)]">
                        {/* Left */}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentEra.id}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                }}
                                transition={{
                                    duration: 0.5,
                                }}
                            >
                                <p className="uppercase tracking-[0.35em] text-[#C9AA5B]">
                                    Journey Through Time
                                </p>

                                <h1 className="mt-5 font-serif text-7xl text-white">
                                    {currentEra.name}
                                </h1>

                                <h2 className="mt-3 text-3xl text-[#E7D3A7]">
                                    {currentEra.tagline}
                                </h2>

                                <p className="mt-8 max-w-lg text-lg leading-8 text-gray-300">
                                    {currentEra.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Right */}
                        <div className="relative flex items-end justify-center">
                            {/* Golden ground glow */}
                            <div className="absolute bottom-6 h-24 w-72 rounded-full bg-[#C9AA5B]/20 blur-3xl" />

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
                                className="
                            relative
                            z-10
                            max-h-140
                            object-contain
                            rounded-3xl
                            drop-shadow-[0_45px_80px_rgba(0,0,0,.9)]
                            brightness-105
                            contrast-110
                        "
                            />
                        </div>
                    </div>

                    {/* Timeline */}

                    <div className="mt-10 rounded-[28px] border border-[#C9AA5B]/10 bg-black/30 p-10 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,.35)]">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>{eras[0].start}</span>
                            <span>{eras[1].start}</span>
                            <span>{eras[2].start}</span>
                            <span>{eras[2].end}</span>
                        </div>

                        <div className="relative mt-8">
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
                                            scale:
                                                activeEra === index ? 1.3 : 1,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 18,
                                        }}
                                        className="relative flex h-9 w-9 items-center justify-center"
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
                                            className={`relative h-5 w-5 rounded-full border-2 ${
                                                activeEra === index
                                                    ? "border-[#C9AA5B] bg-[#C9AA5B]"
                                                    : "border-[#C9AA5B] bg-[#151712]"
                                            }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-3">
                            {eras.map((era, index) => (
                                <button
                                    key={era.id}
                                    onClick={() => setActiveEra(index)}
                                    className="text-center"
                                >
                                    <h3
                                        className={`font-serif text-3xl transition-all ${
                                            activeEra === index
                                                ? "text-[#E7D3A7]"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {era.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {era.start} – {era.end}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
