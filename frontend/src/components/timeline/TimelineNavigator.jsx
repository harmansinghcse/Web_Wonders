import { useState, useEffect } from "react";
import { eras } from "../../data/eras";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Sparkles,
    MapPin,
    Thermometer,
    Wind,
    Globe,
    Trees,
    Columns,
    ChevronRight,
    Flame,
    X,
    ExternalLink
} from "lucide-react";
import Navbar from "../home_components/hero/Navbar";
import { getExplorerDinosaurs } from "../../services/explorerService";

// Framer motion animation constants
const balancedSmoothSpring = { type: "spring", stiffness: 300, damping: 25 };
const ultraBezier = [0.4, 0, 0.2, 1];

// Safe API Lookup Helper
const fetchExplorerDinosaurs = async (params) => {
    if (typeof getExplorerDinosaurs === "function") {
        return await getExplorerDinosaurs(params);
    }
    return { data: [] };
};

// Asteroid Impact Modal Component
function AsteroidImpactModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: ultraBezier }}
                className="relative w-full max-w-lg rounded-3xl border border-red-500/30 bg-[#0d0707] p-6 text-white shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-4"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
                    <Flame size={16} className="animate-pulse text-red-500" />
                    <span>Cretaceous-Paleogene Extinction Event</span>
                </div>

                <h3 className="font-serif text-3xl font-extrabold text-red-100">
                    Asteroid Impact Simulation
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                    Approximately 66 million years ago, a massive asteroid roughly 10 to 15 kilometers in diameter struck Earth near Chicxulub, Mexico, triggering extreme climate changes and ending the Mesozoic Era.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-3">
                        <span className="text-[10px] font-bold text-red-400 uppercase block">Impact Velocity</span>
                        <span className="text-base font-extrabold text-white">20 km/s (45,000 mph)</span>
                    </div>
                    <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-3">
                        <span className="text-[10px] font-bold text-red-400 uppercase block">Crater Diameter</span>
                        <span className="text-base font-extrabold text-white">180 km (110 miles)</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                >
                    Close Simulation
                </motion.button>
            </motion.div>
        </div>
    );
}

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(0); // 0 = Triassic, 1 = Jurassic, 2 = Cretaceous
    const [compareMode, setCompareMode] = useState(false);
    const [comparisonEra, setComparisonEra] = useState(1);
    const [eraDinosaurs, setEraDinosaurs] = useState([]);
    const [loadingDinosaurs, setLoadingDinosaurs] = useState(false);
    const [selectedSpecimen, setSelectedSpecimen] = useState(null);
    const [isAsteroidModalOpen, setIsAsteroidModalOpen] = useState(false);

    const navigate = useNavigate();
    const currentEra = eras[activeEra] || eras[0];
    const compEra = comparisonEra !== null && eras[comparisonEra] ? eras[comparisonEra] : null;
    const theme = currentEra.theme;

    // Fetch approved dinosaurs from system API for current era
    useEffect(() => {
        const fetchEraDinosaurs = async () => {
            setLoadingDinosaurs(true);
            try {
                const res = await fetchExplorerDinosaurs({
                    period: currentEra.name,
                    limit: 4,
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setEraDinosaurs(res.data);
                } else {
                    setEraDinosaurs([]);
                }
            } catch (err) {
                console.log("System API lookup for era dinosaurs:", err.message);
                setEraDinosaurs([]);
            } finally {
                setLoadingDinosaurs(false);
            }
        };
        fetchEraDinosaurs();
    }, [activeEra, currentEra.name]);

    // Ensure comparisonEra is always one of the OTHER two eras
    useEffect(() => {
        if (comparisonEra === activeEra || comparisonEra === null) {
            const nextComp = (activeEra + 1) % eras.length;
            setComparisonEra(nextComp);
        }
    }, [activeEra, comparisonEra]);

    // Available comparison options (only the OTHER two timelines)
    const availableCompareEras = eras
        .map((er, idx) => ({ ...er, index: idx }))
        .filter((er) => er.index !== activeEra);

    // Preload & decode all background and dinosaur images on mount to eliminate latency when changing timelines
    useEffect(() => {
        if (!Array.isArray(eras)) return;
        eras.forEach((era) => {
            const imagesToPreload = [era.background, era.dinosaur].filter(Boolean);
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
        <section className="relative min-h-screen overflow-hidden bg-[#0A0C0A] font-sans selection:bg-[#C9AA5B]/30 selection:text-white pb-20">
            
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
                    animate={{ opacity: 0.55, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
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
                    background: `radial-gradient(circle at 50% 20%, ${currentEra.theme.bgGlow} 0%, rgba(10, 12, 10, 0.85) 75%)`
                }}
            />

            {/* Premium Vignettes & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0A0C0A] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C0A]/90 via-transparent to-[#0A0C0A]/90 pointer-events-none" />

            {/* SITE NAVIGATION HEADER */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 sm:px-6 pt-26 sm:pt-28 lg:pt-30">
                
                {/* Header Section: Floating Pill Buttons matching exact screenshot layout */}
                <motion.header 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/")}
                        className="group flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xl transition hover:border-white/40 hover:bg-black/90 cursor-pointer shadow-lg"
                    >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        <span>Back to Expedition</span>
                    </motion.button>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCompareMode(!compareMode)}
                            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xl hover:border-white/40 transition cursor-pointer shadow-lg"
                        >
                            <Columns size={15} />
                            <span>{compareMode ? "Single Era View" : "Compare Eras Side-by-Side"}</span>
                        </motion.button>

                        {activeEra === 2 && (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAsteroidModalOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/70 px-5 py-2.5 text-xs font-bold text-red-200 backdrop-blur-xl hover:border-red-400 hover:bg-red-900/90 transition cursor-pointer shadow-lg"
                            >
                                <Flame size={15} className="text-red-400 animate-pulse" />
                                <span>Simulate Extinction</span>
                            </motion.button>
                        )}

                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-semibold backdrop-blur-xl shadow-lg"
                        >
                            <span className="text-gray-300">Atmosphere Theme:</span>{" "}
                            <span style={{ color: currentEra.theme.primary }} className="font-bold">
                                {currentEra.theme.name}
                            </span>
                        </motion.div>
                    </div>
                </motion.header>

                {/* Compare Mode View or Main Showcase View */}
                {compareMode ? (
                    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {[currentEra, compEra].filter(Boolean).map((eraItem, idx) => (
                            <div
                                key={`compare-card-${eraItem.id}-${idx}`}
                                className="rounded-[32px] border p-6 backdrop-blur-2xl space-y-5 shadow-2xl transition-all duration-300"
                                style={{
                                    borderColor: eraItem.theme.border,
                                    backgroundColor: eraItem.theme.cardBg
                                }}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span
                                        className="rounded-full px-3 py-1 text-xs font-bold uppercase"
                                        style={{
                                            backgroundColor: eraItem.theme.badgeBg,
                                            color: eraItem.theme.primary
                                        }}
                                    >
                                        Era {idx + 1}: {eraItem.name}
                                    </span>
                                    {idx === 1 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-400 font-bold">Compare with:</span>
                                            <select
                                                value={comparisonEra !== null ? comparisonEra : 1}
                                                onChange={(e) => setComparisonEra(Number(e.target.value))}
                                                className="rounded-xl border border-white/30 bg-black/90 px-3 py-1 text-xs font-extrabold text-white focus:outline-none cursor-pointer"
                                            >
                                                {availableCompareEras.map((er) => (
                                                    <option key={er.id} value={er.index} className="bg-black text-white">
                                                        {er.name} ({er.start} - {er.end})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="font-serif text-3xl font-extrabold text-white">
                                        {eraItem.name}
                                    </h2>
                                    <p className="text-xs font-bold" style={{ color: eraItem.theme.primary }}>
                                        {eraItem.tagline}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                                        {eraItem.description}
                                    </p>
                                </div>

                                {/* Climate Stats */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Avg Temp</span>
                                        <span className="text-sm font-extrabold text-white">{eraItem.climate.temp}</span>
                                    </div>
                                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Oxygen O₂</span>
                                        <span className="text-sm font-extrabold text-emerald-300">{eraItem.climate.oxygen}</span>
                                    </div>
                                </div>

                                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
                                    <img
                                        src={eraItem.dinosaur}
                                        alt={eraItem.name}
                                        onError={(e) => {
                                            if (eraItem.id === "triassic") e.currentTarget.src = "/triassic-dino.webp";
                                            else if (eraItem.id === "jurassic") e.currentTarget.src = "/jurassic-dino.webp";
                                            else e.currentTarget.src = "/trex-dino.webp";
                                        }}
                                        className="h-full w-full object-contain p-2 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                    />
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
                                        onError={(e) => {
                                            if (currentEra.id === "triassic") e.currentTarget.src = "/triassic-dino.webp";
                                            else if (currentEra.id === "jurassic") e.currentTarget.src = "/jurassic-dino.webp";
                                            else e.currentTarget.src = "/trex-dino.webp";
                                        }}
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
                                <motion.div 
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                                >
                                    <div className="rounded-xl p-2.5 bg-white/5" style={{ color: currentEra.theme.primary }}>
                                        <Thermometer size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">AVG TEMPERATURE</p>
                                        <p className="text-xl font-bold text-white mt-1">{currentEra.climate.temp}</p>
                                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">{currentEra.climate.tempSub}</p>
                                    </div>
                                </motion.div>

                                {/* Oxygen */}
                                <motion.div 
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                                >
                                    <div className="rounded-xl p-2.5 bg-white/5 text-emerald-400">
                                        <Wind size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">OXYGEN (O₂)</p>
                                        <p className="text-xl font-bold text-white mt-1">{currentEra.climate.oxygen}</p>
                                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">{currentEra.climate.co2}</p>
                                    </div>
                                </motion.div>

                                {/* Drift */}
                                <motion.div 
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                                >
                                    <div className="rounded-xl p-2.5 bg-white/5 text-blue-400">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">CONTINENTAL DRIFT</p>
                                        <p className="text-sm font-bold text-white mt-1 leading-snug">{currentEra.climate.drift}</p>
                                    </div>
                                </motion.div>

                                {/* Flora */}
                                <motion.div 
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                                >
                                    <div className="rounded-xl p-2.5 bg-white/5 text-green-400">
                                        <Trees size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">DOMINANT FLORA</p>
                                        <p className="text-xs font-bold text-white mt-1 leading-snug">{currentEra.climate.flora}</p>
                                    </div>
                                </motion.div>
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
                                    className="flex items-center gap-1 text-xs font-bold text-[#E7D3A7] hover:text-white transition cursor-pointer"
                                >
                                    <span>Browse Dinosaur Encyclopedia</span>
                                    <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {currentEra.dinosaurs.map((dino, idx) => (
                                    <motion.div
                                        key={`dino-${idx}`}
                                        whileHover={{ y: -8, scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                        onClick={() => setSelectedSpecimen(dino)}
                                        className="group rounded-2xl border border-white/10 bg-black/50 overflow-hidden hover:border-white/40 transition-all duration-300 cursor-pointer shadow-xl"
                                    >
                                        <div className="relative h-44 w-full overflow-hidden bg-black/60">
                                            <img
                                                src={dino.image}
                                                alt={dino.name}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = currentEra.dinosaur;
                                                }}
                                                className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
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
                                    </motion.div>
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
                                {currentEra.milestones.map((m, idx) => {
                                    const shades = [
                                        {
                                            bg: "bg-gradient-to-br from-[#2b1b0b]/90 via-[#1b1106]/85 to-[#0a0602]/95",
                                            border: "border-amber-500/40 hover:border-amber-400",
                                            badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/50",
                                            titleColor: "text-amber-100 group-hover:text-amber-300",
                                            glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
                                        },
                                        {
                                            bg: "bg-gradient-to-br from-[#0b281c]/90 via-[#071a12]/85 to-[#030d08]/95",
                                            border: "border-emerald-500/40 hover:border-emerald-400",
                                            badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
                                            titleColor: "text-emerald-100 group-hover:text-emerald-300",
                                            glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
                                        },
                                        {
                                            bg: "bg-gradient-to-br from-[#2c0b0b]/90 via-[#1c0606]/85 to-[#0c0202]/95",
                                            border: "border-red-500/40 hover:border-red-400",
                                            badgeBg: "bg-red-500/20 text-red-300 border-red-500/50",
                                            titleColor: "text-red-100 group-hover:text-red-300",
                                            glow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
                                        },
                                    ];
                                    const shade = shades[idx % shades.length];
                                    return (
                                        <motion.div
                                            key={`m-${idx}`}
                                            whileHover={{ y: -7, scale: 1.03 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`group rounded-2xl border p-4 font-sans transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg ${shade.bg} ${shade.border} ${shade.glow}`}
                                        >
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase border mb-3 ${shade.badgeBg}`}
                                            >
                                                {m.ma}
                                            </span>
                                            <h4 className={`font-serif text-sm font-bold tracking-tight transition-colors ${shade.titleColor}`}>
                                                {m.title}
                                            </h4>
                                            <p className="text-xs text-gray-300/90 mt-2 leading-relaxed font-medium">
                                                {m.desc}
                                            </p>
                                        </motion.div>
                                    );
                                })}
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
                        <div className="h-1.5 w-full rounded-full bg-white/15" />

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
                                mass: 0.5,
                                stiffness: 180,
                                damping: 21,
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
                                        className="group relative flex h-8 w-8 items-center justify-center outline-none focus:outline-none cursor-pointer"
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
                                <motion.button
                                    key={era.id}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={balancedSmoothSpring}
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
                                </motion.button>
                            );
                        })}
                    </div>
                </footer>
            </div>

            {/* SPECIMEN DETAILS MODAL OVERLAY */}
            {selectedSpecimen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 15 }}
                        transition={{ duration: 0.35, ease: ultraBezier }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-black/90 p-6 text-white shadow-2xl space-y-4"
                        style={{
                            borderColor: theme?.border || "rgba(255,255,255,0.2)"
                        }}
                    >
                        <button
                            onClick={() => setSelectedSpecimen(null)}
                            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 cursor-pointer z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div 
                                className="rounded-xl px-3 py-1 text-xs font-bold"
                                style={{
                                    backgroundColor: theme?.badgeBg || "rgba(255,255,255,0.1)",
                                    color: theme?.primary || "#E7D3A7"
                                }}
                            >
                                {selectedSpecimen.diet || "Fossil Specimen"}
                            </div>
                            <span className="text-xs text-gray-400">{selectedSpecimen.period || currentEra.name}</span>
                        </div>

                        <h3 
                            className="font-serif text-2xl font-bold"
                            style={{ color: theme?.primary || "#ffffff" }}
                        >
                            {selectedSpecimen.name}
                        </h3>
                        {selectedSpecimen.scientificName && (
                            <p className="text-xs font-bold italic" style={{ color: theme?.primary || "#E7D3A7" }}>
                                {selectedSpecimen.scientificName}
                            </p>
                        )}

                        {selectedSpecimen.image && (
                            <img
                                src={selectedSpecimen.image}
                                alt={selectedSpecimen.name}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = currentEra.dinosaur;
                                }}
                                className="h-48 w-full rounded-2xl object-cover border border-white/10 bg-black/40"
                            />
                        )}

                        {selectedSpecimen.desc && (
                            <p className="text-xs text-stone-300 leading-relaxed">{selectedSpecimen.desc}</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] text-gray-400 font-bold block uppercase">Length</span>
                                <span className="font-extrabold text-white">{selectedSpecimen.length || "N/A"}</span>
                            </div>
                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] text-gray-400 font-bold block uppercase">Weight</span>
                                <span className="font-extrabold text-white">{selectedSpecimen.weight || "N/A"}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={balancedSmoothSpring}
                            onClick={() => {
                                setSelectedSpecimen(null);
                                navigate("/explorer");
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-extrabold shadow-md transition cursor-pointer"
                            style={{
                                borderColor: theme?.border || "rgba(255,255,255,0.2)",
                                backgroundColor: theme?.badgeBg || "rgba(255,255,255,0.1)",
                                color: theme?.primary || "#ffffff"
                            }}
                        >
                            <span>Inspect in Dinosaur Explorer</span>
                            <ExternalLink size={14} />
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* ASTEROID IMPACT SIMULATION MODAL */}
            {isAsteroidModalOpen && (
                <AsteroidImpactModal onClose={() => setIsAsteroidModalOpen(false)} />
            )}
        </section>
    );
}
