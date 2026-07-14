import { useState } from "react";
import { eras } from "../../data/eras";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, MapPin } from "lucide-react";

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(1);
    const navigate = useNavigate();
    const currentEra = eras[activeEra];

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0a0c0a] font-sans selection:bg-[#C9AA5B]/30 selection:text-white">
            
            {/* Background Image transition */}
            <AnimatePresence>
                <motion.div
                    key={currentEra.background}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 0.45, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentEra.background})` }}
                />
            </AnimatePresence>

            {/* Premium Vignettes & Gradients */}
            <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent 20%, rgba(10, 12, 10, 0.9) 100%)" />
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-[#0a0c0a]" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0c0a]/90 via-transparent to-[#0a0c0a]/90" />

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8">
                
                {/* Header Section */}
                <header className="relative z-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => navigate("/")}
                        className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-sm font-semibold text-gray-300 backdrop-blur-xl transition hover:border-[#C9AA5B]/40 hover:bg-black/60 hover:text-white"
                    >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to Expedition
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="rounded-full border border-[#C9AA5B]/20 bg-black/40 px-4 py-2 text-xs font-semibold text-[#E7D3A7] backdrop-blur-xl">
                            <span className="text-gray-400">Timeline Metric:</span> Ma = Million Years Ago
                        </div>
                    </div>
                </header>

                {/* Hero Showcase Card */}
                <div className="my-8 relative z-10 grid grid-cols-1 items-center gap-8 rounded-[36px] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-12">
                    
                    {/* Left: Content Info */}
                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentEra.id}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#C9AA5B]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#C9AA5B]">
                                    <Sparkles size={12} />
                                    Geological Era
                                </div>

                                <h1 className="mt-4 font-serif text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                                    {currentEra.name}
                                </h1>

                                <h2 className="mt-3 text-lg font-bold text-[#E7D3A7] sm:text-xl md:text-2xl">
                                    {currentEra.tagline}
                                </h2>

                                <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base sm:leading-loose">
                                    {currentEra.description}
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <MapPin size={16} className="text-[#C9AA5B]" />
                                        <span>Span: <strong className="text-white">{currentEra.start}</strong> to <strong className="text-white">{currentEra.end}</strong></span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Breathing Dinosaur Representation */}
                    <div className="relative flex h-64 items-center justify-center sm:h-80 lg:h-96">
                        {/* Glow effect under dino */}
                        <div className="absolute h-32 w-56 rounded-full bg-[#C9AA5B]/15 blur-3xl" />

                        <AnimatePresence>
                            <motion.img
                                key={currentEra.dinosaur}
                                src={currentEra.dinosaur}
                                alt={`${currentEra.name} dinosaur`}
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ 
                                    opacity: 1, 
                                    x: 0, 
                                    scale: 1,
                                    y: [0, -10, 0] // Soft breathing float effect
                                }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ 
                                    opacity: { duration: 0.35 },
                                    x: { duration: 0.4, ease: "easeOut" },
                                    scale: { duration: 0.4 },
                                    y: {
                                        duration: 6,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }
                                }}
                                className="absolute z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                            />
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Slider & Controls */}
                <footer className="relative z-10 rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-xl shadow-lg">
                    
                    {/* Time Ruler Ticks */}
                    <div className="flex justify-between text-xs font-semibold tracking-wider text-gray-400">
                        <span>{eras[0].start} (Triassic Dawn)</span>
                        <span className="hidden sm:inline">201 Ma</span>
                        <span>{eras[2].end} (Mass Extinction)</span>
                    </div>

                    {/* Timeline Slider Track */}
                    <div className="relative mt-6 px-4">
                        <div className="h-1 w-full rounded-full bg-white/15" />

                        {/* Active Progress Segment */}
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
                                stiffness: 100,
                                damping: 18,
                            }}
                            className="absolute left-4 top-0 h-1 rounded-full bg-[#C9AA5B]"
                        />

                        {/* Slider Node Handles */}
                        <div className="absolute inset-y-0 left-4 right-4 flex -translate-y-1/2 items-center justify-between">
                            {eras.map((era, index) => {
                                const isActive = activeEra === index;
                                return (
                                    <button
                                        key={era.id}
                                        onClick={() => setActiveEra(index)}
                                        className="group relative flex h-8 w-8 items-center justify-center outline-none focus:outline-none"
                                    >
                                        {/* Golden Pulsing Halo for active node */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeHalo"
                                                className="absolute inset-0 rounded-full border border-[#C9AA5B] bg-[#C9AA5B]/10 animate-ping"
                                                style={{ animationDuration: "2s" }}
                                            />
                                        )}

                                        {/* Outer Circle Ring */}
                                        <div
                                            className={`h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                                isActive
                                                    ? "border-[#C9AA5B] bg-[#0a0c0a] scale-125"
                                                    : "border-[#C9AA5B]/50 bg-black hover:border-[#C9AA5B]"
                                            }`}
                                        >
                                            {/* Inner Dot */}
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                                    isActive ? "bg-[#C9AA5B]" : "bg-transparent group-hover:bg-[#C9AA5B]/40"
                                                }`}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Period Selection Tabs */}
                    <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
                        {eras.map((era, index) => {
                            const isActive = activeEra === index;
                            return (
                                <button
                                    key={era.id}
                                    onClick={() => setActiveEra(index)}
                                    className={`group rounded-2xl p-3 text-center transition-all duration-300 ${
                                        isActive 
                                            ? "bg-[#C9AA5B]/10 border border-[#C9AA5B]/30" 
                                            : "border border-transparent hover:bg-white/5"
                                    }`}
                                >
                                    <h3
                                        className={`font-serif text-sm font-bold transition-colors sm:text-lg md:text-xl ${
                                            isActive ? "text-[#C9AA5B]" : "text-gray-500 group-hover:text-gray-300"
                                        }`}
                                    >
                                        {era.name}
                                    </h3>
                                    <p className="mt-1 text-[9px] font-semibold text-gray-500 sm:text-[10px] md:text-xs">
                                        {era.start} – {era.end}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </footer>
            </div>
        </section>
    );
}
