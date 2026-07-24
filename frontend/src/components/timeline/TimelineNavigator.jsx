import { useState, useEffect } from "react";
import { eras } from "../../data/eras";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, MapPin, Thermometer, Wind, Globe, Trees, Columns, ChevronRight } from "lucide-react";

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(0); // 0 = Triassic, 1 = Jurassic, 2 = Cretaceous
    const [compareMode, setCompareMode] = useState(false);
    const navigate = useNavigate();
    const currentEra = eras[activeEra];

    // Preload & decode all background and dinosaur images on mount to eliminate latency when changing timelines
    useEffect(() => {
        eras.forEach((era) => {
            const imagesToPreload = [era.background, era.dinosaur];
            if (era.dinosaurs) {
                era.dinosaurs.forEach((dino) => {
                    if (dino.image) imagesToPreload.push(dino.image);
                });
            }
            imagesToPreload.forEach((src) => {
                const img = new Image();
                img.src = src;
                if (img.decode) {
                    img.decode().catch(() => {});
                }
            });
        });
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0a0c0a] font-sans selection:bg-[#C9AA5B]/30 selection:text-white pb-16">
            
            {/* Hidden image preloader to force immediate browser caching */}
            <div className="hidden" aria-hidden="true">
                {eras.map((era) => (
                    <div key={`preload-${era.id}`}>
                        <img src={era.background} alt="" fetchPriority="high" />
                        <img src={era.dinosaur} alt="" fetchPriority="high" />
                        {era.dinosaurs?.map((dino, idx) => (
                            <img key={`preload-dino-${idx}`} src={dino.image} alt="" fetchPriority="high" />
                        ))}
                    </div>
                ))}
            </div>

            {/* Background Image transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentEra.background}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 0.45, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: `url(${currentEra.background})` }}
                />
            </AnimatePresence>

            {/* Dynamic Atmosphere Tint Overlay */}
            <motion.div
                key={`tint-${currentEra.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${currentEra.theme.bgGlow} 0%, rgba(10, 12, 10, 0.85) 75%)`
                }}
            />

            {/* Premium Vignettes & Gradients */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-[#0a0c0a] pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0c0a]/90 via-transparent to-[#0a0c0a]/90 pointer-events-none" />

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 sm:px-6 py-8">
                
                {/* Header Section */}
                <header className="relative z-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-sm font-semibold text-gray-300 backdrop-blur-xl transition hover:border-white/30 hover:bg-black/60 hover:text-white"
                    >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to Expedition
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setCompareMode(!compareMode)}
                            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold text-gray-200 backdrop-blur-xl hover:border-white/40 hover:text-white transition"
                        >
                            <Columns size={14} />
                            <span>{compareMode ? "Single Era View" : "Compare Eras Side-by-Side"}</span>
                        </button>

                        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold backdrop-blur-xl">
                            <span className="text-gray-400">Atmosphere Theme:</span>{" "}
                            <span style={{ color: currentEra.theme.primary }} className="font-bold">
                                {currentEra.theme.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Compare Mode View or Main Showcase View */}
                {compareMode ? (
                    <div className="my-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                        {eras.map((era, index) => (
                            <div
                                key={`compare-${era.id}`}
                                onClick={() => setActiveEra(index)}
                                className={`cursor-pointer rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-300 ${
                                    activeEra === index
                                        ? "ring-2 scale-[1.02]"
                                        : "opacity-80 hover:opacity-100"
                                }`}
                                style={{
                                    borderColor: era.theme.border,
                                    backgroundColor: era.theme.cardBg,
                                    ringColor: era.theme.primary
                                }}
                            >
                                <div
                                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3"
                                    style={{ backgroundColor: era.theme.badgeBg, color: era.theme.primary }}
                                >
                                    <Sparkles size={10} />
                                    {era.theme.name}
                                </div>
                                <h3 className="font-serif text-3xl font-extrabold text-white">{era.name}</h3>
                                <p className="text-xs font-semibold text-gray-300 mt-1">{era.tagline}</p>
                                <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-3">{era.description}</p>
                                
                                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-300">
                                    <span className="text-gray-400">Span:</span> <strong>{era.start}</strong> to <strong>{era.end}</strong>
                                </div>

                                <div className="mt-4 rounded-xl bg-black/40 p-3 text-xs space-y-1.5 border border-white/5">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Temp:</span>
                                        <span className="font-bold text-white">{era.climate.temp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Oxygen:</span>
                                        <span className="font-bold text-white">{era.climate.oxygen}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Drift:</span>
                                        <span className="font-semibold text-gray-300 truncate max-w-[140px]">{era.climate.drift}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Hero Showcase Card */}
                        <div
                            className="my-6 relative z-10 grid grid-cols-1 items-center gap-8 rounded-[36px] border p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-10 transition-colors duration-500"
                            style={{
                                borderColor: currentEra.theme.border,
                                backgroundColor: currentEra.theme.cardBg
                            }}
                        >
                            {/* Left: Content Info */}
                            <div className="relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentEra.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                    >
                                        <div
                                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                                            style={{
                                                backgroundColor: currentEra.theme.badgeBg,
                                                color: currentEra.theme.primary
                                            }}
                                        >
                                            <Sparkles size={12} />
                                            {currentEra.theme.name.toUpperCase()} • GEOLOGICAL PERIOD
                                        </div>

                                        <h1 className="mt-4 font-serif text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                                            {currentEra.name}
                                        </h1>

                                        <h2 className="mt-3 text-lg font-bold sm:text-xl md:text-2xl" style={{ color: currentEra.theme.primary }}>
                                            {currentEra.tagline}
                                        </h2>

                                        <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base sm:leading-loose">
                                            {currentEra.description}
                                        </p>

                                        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <MapPin size={16} style={{ color: currentEra.theme.primary }} />
                                                <span>Span: <strong className="text-white">{currentEra.start}</strong> to <strong className="text-white">{currentEra.end}</strong></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Right: Dinosaur Representation */}
                            <div className="relative flex h-64 items-center justify-center sm:h-80 lg:h-96">
                                <div
                                    className="absolute h-40 w-64 rounded-full blur-3xl transition-colors duration-500"
                                    style={{ backgroundColor: currentEra.theme.bgGlow }}
                                />

                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentEra.dinosaur}
                                        src={currentEra.dinosaur}
                                        alt={`${currentEra.name} dinosaur`}
                                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                                        animate={{ 
                                            opacity: 1, 
                                            x: 0, 
                                            scale: 1,
                                            y: [0, -10, 0]
                                        }}
                                        exit={{ opacity: 0, x: -40, scale: 0.95 }}
                                        transition={{ 
                                            opacity: { duration: 0.3 },
                                            x: { duration: 0.35, ease: "easeOut" },
                                            scale: { duration: 0.35 },
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

                        {/* Climate Dashboard Card */}
                        <div
                            className="my-6 rounded-3xl border p-6 backdrop-blur-xl shadow-lg transition-colors duration-500"
                            style={{
                                borderColor: currentEra.theme.border,
                                backgroundColor: currentEra.theme.cardBg
                            }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <h3 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                                    <Thermometer size={18} style={{ color: currentEra.theme.primary }} />
                                    <span>ATMOSPHERIC & ENVIRONMENTAL CLIMATE DASHBOARD ({currentEra.name.toUpperCase()})</span>
                                </h3>
                                <span className="w-fit rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    LIVE METRICS
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Temp */}
                                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3">
                                    <div className="rounded-xl p-2.5 bg-white/5" style={{ color: currentEra.theme.primary }}>
                                        <Thermometer size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">AVG TEMPERATURE</p>
                                        <p className="text-xl font-bold text-white mt-1">{currentEra.climate.temp}</p>
                                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">{currentEra.climate.tempSub}</p>
                                    </div>
                                </div>

                                {/* Oxygen */}
                                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3">
                                    <div className="rounded-xl p-2.5 bg-white/5 className=text-emerald-400">
                                        <Wind size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">OXYGEN (O₂)</p>
                                        <p className="text-xl font-bold text-white mt-1">{currentEra.climate.oxygen}</p>
                                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">{currentEra.climate.co2}</p>
                                    </div>
                                </div>

                                {/* Drift */}
                                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3">
                                    <div className="rounded-xl p-2.5 bg-white/5 text-blue-400">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">CONTINENTAL DRIFT</p>
                                        <p className="text-sm font-bold text-white mt-1 leading-snug">{currentEra.climate.drift}</p>
                                    </div>
                                </div>

                                {/* Flora */}
                                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3">
                                    <div className="rounded-xl p-2.5 bg-white/5 text-green-400">
                                        <Trees size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">DOMINANT FLORA</p>
                                        <p className="text-xs font-bold text-white mt-1 leading-snug">{currentEra.climate.flora}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Approved Dinosaurs Section */}
                        <div
                            className="my-6 rounded-3xl border p-6 backdrop-blur-xl shadow-lg transition-colors duration-500"
                            style={{
                                borderColor: currentEra.theme.border,
                                backgroundColor: currentEra.theme.cardBg
                            }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <h3 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                                    <Sparkles size={16} style={{ color: currentEra.theme.primary }} />
                                    <span>APPROVED SYSTEM DINOSAURS ({currentEra.name.toUpperCase()} ERA)</span>
                                </h3>
                                <button
                                    onClick={() => navigate("/explorer")}
                                    className="flex items-center gap-1 text-xs font-bold text-[#E7D3A7] hover:text-white transition"
                                >
                                    <span>Browse Dinosaur Encyclopedia</span>
                                    <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {currentEra.dinosaurs.map((dino, idx) => (
                                    <div
                                        key={`dino-${idx}`}
                                        className="group rounded-2xl border border-white/10 bg-black/50 overflow-hidden hover:border-white/30 transition-all duration-300"
                                    >
                                        <div className="relative h-36 w-full overflow-hidden bg-black/60">
                                            <img
                                                src={dino.image}
                                                alt={dino.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#E7D3A7] border border-white/10">
                                                {dino.diet}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#E7D3A7] transition-colors">
                                                {dino.name}
                                            </h4>
                                            <p className="text-xs font-semibold italic mt-0.5" style={{ color: currentEra.theme.primary }}>
                                                {dino.scientificName}
                                            </p>

                                            <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[11px] text-gray-400">
                                                <span>Length: <strong className="text-white">{dino.length}</strong></span>
                                                <span>Weight: <strong className="text-white">{dino.weight}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Milestones Section */}
                        <div
                            className="my-6 rounded-3xl border p-6 backdrop-blur-xl shadow-lg transition-colors duration-500"
                            style={{
                                borderColor: currentEra.theme.border,
                                backgroundColor: currentEra.theme.cardBg
                            }}
                        >
                            <h3 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-white sm:text-base mb-6">
                                <span style={{ color: currentEra.theme.primary }}>ℹ️</span>
                                <span>KEY ERA MILESTONES & GEOLOGICAL EVENTS</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {currentEra.milestones.map((m, idx) => (
                                    <div
                                        key={`m-${idx}`}
                                        className="rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-white/20"
                                    >
                                        <span
                                            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white mb-2"
                                            style={{ backgroundColor: currentEra.theme.badgeBg, border: `1px solid ${currentEra.theme.border}` }}
                                        >
                                            {m.ma}
                                        </span>
                                        <h4 className="font-serif text-sm font-bold text-white">{m.title}</h4>
                                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{m.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Footer Slider & Controls */}
                <footer className="relative z-10 mt-6 rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-xl shadow-lg">
                    
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
                            className="absolute left-4 top-0 h-1 rounded-full"
                            style={{ backgroundColor: currentEra.theme.primary }}
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
                                        {/* Golden/Theme Pulsing Halo for active node */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeHalo"
                                                className="absolute inset-0 rounded-full border animate-ping"
                                                style={{
                                                    borderColor: era.theme.primary,
                                                    backgroundColor: era.theme.bgGlow,
                                                    animationDuration: "2s"
                                                }}
                                            />
                                        )}

                                        {/* Outer Circle Ring */}
                                        <div
                                            className="h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                                            style={{
                                                borderColor: isActive ? era.theme.primary : "rgba(255,255,255,0.3)",
                                                backgroundColor: isActive ? "#0a0c0a" : "black",
                                                transform: isActive ? "scale(1.25)" : "scale(1)"
                                            }}
                                        >
                                            {/* Inner Dot */}
                                            <div
                                                className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: isActive ? era.theme.primary : "transparent"
                                                }}
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
                                    className={`group rounded-2xl p-3 text-center transition-all duration-300 border ${
                                        isActive 
                                            ? "shadow-lg" 
                                            : "border-transparent hover:bg-white/5"
                                    }`}
                                    style={{
                                        borderColor: isActive ? era.theme.border : "transparent",
                                        backgroundColor: isActive ? era.theme.badgeBg : "transparent"
                                    }}
                                >
                                    <h3
                                        className="font-serif text-sm font-bold transition-colors sm:text-lg md:text-xl"
                                        style={{
                                            color: isActive ? era.theme.primary : "rgb(156, 163, 175)"
                                        }}
                                    >
                                        {era.name}
                                    </h3>
                                    <p className="mt-1 text-[9px] font-semibold text-gray-400 sm:text-[10px] md:text-xs">
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
