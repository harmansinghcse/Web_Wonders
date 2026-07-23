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
    TreePine,
    Columns,
    Flame,
    X,
    Info,
    ExternalLink,
    ChevronRight,
    PlusCircle,
    Loader2
} from "lucide-react";
import Navbar from "../home_components/hero/Navbar";
import AsteroidImpactModal from "./AsteroidImpactModal";
import { getExplorerDinosaurs } from "../../services/explorerService";

// PERFECT BALANCE: SILKY SMOOTH & ELEGANT FLUID SPRING
const ultraBezier = [0.22, 1, 0.36, 1]; // Premium luxury ease curve
const balancedSmoothSpring = { type: "spring", mass: 0.5, stiffness: 210, damping: 21 }; // Perfect balance hover lift
const softBounce = { type: "spring", mass: 0.4, stiffness: 180, damping: 19 };

// VARIANT CONTAINERS FOR SEQUENTIAL STAGGERING
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.02,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.02,
            staggerDirection: -1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.38,
            ease: ultraBezier,
        },
    },
    exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.22 } },
};

export default function TimelineNavigator() {
    const [activeEra, setActiveEra] = useState(1); // Default to Jurassic (index 1)
    const [comparisonEra, setComparisonEra] = useState(null); // Comparison era index if compare mode active
    const [isCompareMode, setIsCompareMode] = useState(false);

    // Dynamic System Dinosaurs State (Fetched live from /api/dinosaur)
    const [eraDinosaurs, setEraDinosaurs] = useState([]);
    const [loadingDinosaurs, setLoadingDinosaurs] = useState(false);

    // Active Specimen Modal State
    const [selectedSpecimen, setSelectedSpecimen] = useState(null);

    // Asteroid Impact Modal State
    const [isAsteroidModalOpen, setIsAsteroidModalOpen] = useState(false);

    const navigate = useNavigate();
    const currentEra = eras[activeEra];
    const compEra = comparisonEra !== null ? eras[comparisonEra] : null;
    const theme = currentEra.theme;

    // Fetch approved dinosaurs from system API for current era
    useEffect(() => {
        const fetchEraDinosaurs = async () => {
            setLoadingDinosaurs(true);
            try {
                const res = await getExplorerDinosaurs({
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

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0A0C0A] font-sans selection:bg-[#C9AA5B]/30 selection:text-white pb-20 transition-colors duration-500">
            
            {/* BACKGROUND IMAGE TRANSITION */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentEra.background}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 0.55, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: ultraBezier }}
                    className="absolute inset-0 h-full w-full bg-cover bg-center will-change-transform transform-gpu"
                    style={{ backgroundImage: `url(${currentEra.background})` }}
                />
            </AnimatePresence>

            {/* DYNAMIC ERA-THEMED AMBIENT GLOWS & GRADIENTS */}
            <div
                className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
                style={{
                    background: `radial-gradient(circle at 50% 20%, ${theme.glowColor} 0%, transparent 60%)`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0A0C0A]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C0A]/95 via-transparent to-[#0A0C0A]/95" />

            {/* SITE NAVIGATION HEADER */}
            <header className="relative z-50 pt-4 pb-2">
                <Navbar />
            </header>

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-4 sm:px-6 pt-20">
                
                {/* SUB HEADER ACTIONS BAR */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: ultraBezier }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4 z-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.03, x: -3 }}
                        whileTap={{ scale: 0.96 }}
                        transition={balancedSmoothSpring}
                        onClick={() => navigate("/")}
                        className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/50 px-5 py-2.5 text-xs font-bold text-gray-300 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-black/80 hover:text-white cursor-pointer shadow-lg"
                    >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        <span>Back to Expedition</span>
                    </motion.button>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            transition={balancedSmoothSpring}
                            onClick={() => {
                                setIsCompareMode(!isCompareMode);
                                if (!isCompareMode && (comparisonEra === null || comparisonEra === activeEra)) {
                                    setComparisonEra((activeEra + 1) % eras.length);
                                }
                            }}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                                isCompareMode
                                    ? `${theme.accentBg} text-black font-extrabold shadow-lg`
                                    : `border-white/20 bg-black/40 text-stone-200 hover:bg-black/70`
                            }`}
                        >
                            <Columns size={15} />
                            <span>{isCompareMode ? "Exit Compare Mode" : "Compare Eras Side-by-Side"}</span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, ease: ultraBezier }}
                            className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-bold text-stone-300 backdrop-blur-xl"
                        >
                            <span className="text-gray-400">Atmosphere Theme:</span>{" "}
                            <strong className={theme.accentText}>{theme.name}</strong>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ERA COMPARISON MODE VIEW */}
                {isCompareMode ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
                        >
                            {[currentEra, compEra].map((e, idx) => (
                                <motion.div
                                    key={e.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    transition={balancedSmoothSpring}
                                    className={`rounded-[32px] border ${e.theme.cardBorder} p-6 backdrop-blur-2xl space-y-5 shadow-2xl transition-colors duration-500 will-change-transform transform-gpu`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${e.theme.badgeBg}`}>
                                            Era {idx + 1}: {e.name}
                                        </span>
                                        {idx === 1 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-gray-400 font-bold">Compare with:</span>
                                                <select
                                                    value={comparisonEra}
                                                    onChange={(evt) => setComparisonEra(Number(evt.target.value))}
                                                    className="rounded-xl border border-white/30 bg-black/90 px-3 py-1.5 text-xs font-extrabold text-white focus:outline-none cursor-pointer"
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
                                        <h2 className={`font-serif text-3xl font-extrabold bg-gradient-to-r ${e.theme.titleGradient} bg-clip-text text-transparent`}>
                                            {e.name}
                                        </h2>
                                        <p className="text-xs font-bold text-stone-300">{e.tagline}</p>
                                        <p className="mt-2 text-xs text-gray-300 leading-relaxed">{e.description}</p>
                                    </div>

                                    {/* Climate Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold block">Avg Temp</span>
                                            <span className={`text-sm font-extrabold ${e.theme.accentText}`}>{e.climate.temp}</span>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold block">Oxygen O₂</span>
                                            <span className="text-sm font-extrabold text-emerald-300">{e.climate.oxygen}</span>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold block">CO₂ Level</span>
                                            <span className="text-sm font-extrabold text-orange-300">{e.climate.co2}</span>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold block">Continents</span>
                                            <span className="text-xs font-extrabold text-white truncate block">{e.climate.continents}</span>
                                        </div>
                                    </div>

                                    <img
                                        src={e.dinosaur}
                                        alt={e.name}
                                        className="h-44 w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    /* HERO SHOWCASE CARD FOR ACTIVE ERA WITH ULTRA-SMOOTH GPU MOTIONS */
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: ultraBezier }}
                        className={`my-6 relative z-10 grid grid-cols-1 items-center gap-8 rounded-[36px] border ${theme.cardBorder} p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-10 transition-colors duration-700 will-change-transform transform-gpu`}
                    >
                        
                        {/* Left: Content Info */}
                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentEra.id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }}
                                    transition={{ duration: 0.35, ease: ultraBezier }}
                                >
                                    <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.badgeBg}`}>
                                        <Sparkles size={13} className={theme.iconColor} />
                                        {theme.name} • Geological Period
                                    </div>

                                    <h1 className={`mt-3 font-serif text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent sm:text-5xl lg:text-6xl drop-shadow-md`}>
                                        {currentEra.name}
                                    </h1>

                                    <h2 className="mt-2 text-base font-bold text-stone-200 sm:text-lg">
                                        {currentEra.tagline}
                                    </h2>

                                    <p className="mt-4 text-xs leading-relaxed text-stone-300 sm:text-sm sm:leading-loose">
                                        {currentEra.description}
                                    </p>

                                    <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-5">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                                            <MapPin size={16} className={theme.iconColor} />
                                            <span>Span: <strong className="text-white">{currentEra.start}</strong> to <strong className="text-white">{currentEra.end}</strong></span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right: Breathing Dinosaur Representation */}
                        <div className="relative flex h-60 items-center justify-center sm:h-72 lg:h-80">
                            <div
                                className="absolute h-40 w-60 rounded-full blur-3xl transition-all duration-700 opacity-60"
                                style={{ backgroundColor: theme.primaryAccent }}
                            />

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentEra.dinosaur}
                                    src={currentEra.dinosaur}
                                    alt={`${currentEra.name} dinosaur`}
                                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, -12, 0]
                                    }}
                                    exit={{ opacity: 0, scale: 0.92, y: -15 }}
                                    transition={{
                                        opacity: { duration: 0.35, ease: ultraBezier },
                                        scale: { duration: 0.35, ease: ultraBezier },
                                        y: { duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                                    }}
                                    className="absolute z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] will-change-transform transform-gpu"
                                />
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* PREHISTORIC CLIMATE & ENVIRONMENT DASHBOARD */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: ultraBezier }}
                    className={`relative z-10 mb-6 rounded-3xl border ${theme.cardBorder} p-5 backdrop-blur-xl shadow-xl transition-colors duration-700`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${theme.accentText}`}>
                            <motion.div
                                animate={{ scale: [1, 1.18, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Thermometer size={16} className={theme.iconColor} />
                            </motion.div>
                            Atmospheric & Environmental Climate Dashboard ({currentEra.name})
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 bg-white/5 border border-white/10 rounded-full px-3 py-0.5">
                            Live Metrics
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEra.id}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs"
                        >
                            {/* Card 1: Avg Temperature */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={balancedSmoothSpring}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3.5 transition-colors duration-300 hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(230,126,34,0.25)] will-change-transform transform-gpu cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out" />
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    transition={softBounce}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 ${theme.accentText} shrink-0 mt-0.5 shadow-inner`}
                                >
                                    <Thermometer size={20} />
                                </motion.div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-amber-200 transition-colors">Avg Temperature</p>
                                    <p className="text-base font-black text-white group-hover:text-amber-100 transition-colors">{currentEra.climate.temp}</p>
                                    <span className={`text-[10px] font-bold block ${theme.accentText}`}>{currentEra.climate.tempDelta}</span>
                                </div>
                            </motion.div>

                            {/* Card 2: Oxygen O2 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={balancedSmoothSpring}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3.5 transition-colors duration-300 hover:border-emerald-400/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(82,183,136,0.25)] will-change-transform transform-gpu cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out" />
                                <motion.div
                                    animate={{ rotate: [0, 8, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5 shadow-inner"
                                >
                                    <Wind size={20} />
                                </motion.div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-emerald-200 transition-colors">Oxygen (O₂)</p>
                                    <p className="text-base font-black text-white group-hover:text-emerald-100 transition-colors">{currentEra.climate.oxygen}</p>
                                    <span className="text-[10px] font-bold text-emerald-400 block">CO₂: {currentEra.climate.co2}</span>
                                </div>
                            </motion.div>

                            {/* Card 3: Continental Drift */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={balancedSmoothSpring}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3.5 transition-colors duration-300 hover:border-blue-400/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(59,130,246,0.25)] will-change-transform transform-gpu cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5 shadow-inner"
                                >
                                    <Globe size={20} />
                                </motion.div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-200 transition-colors">Continental Drift</p>
                                    <p className="text-[11px] sm:text-xs font-extrabold text-white leading-snug break-words group-hover:text-blue-100 transition-colors">{currentEra.climate.continents}</p>
                                </div>
                            </motion.div>

                            {/* Card 4: Dominant Flora */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={balancedSmoothSpring}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3.5 transition-colors duration-300 hover:border-green-400/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(34,197,94,0.25)] will-change-transform transform-gpu cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out" />
                                <motion.div
                                    animate={{ scale: [1, 1.12, 1] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-300 shrink-0 mt-0.5 shadow-inner"
                                >
                                    <TreePine size={20} />
                                </motion.div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-green-200 transition-colors">Dominant Flora</p>
                                    <p className="text-[11px] sm:text-xs font-extrabold text-white leading-snug break-words group-hover:text-green-100 transition-colors">{currentEra.climate.flora}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* DYNAMIC SYSTEM ERA SPECIES SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08, ease: ultraBezier }}
                    className={`relative z-10 mb-6 rounded-3xl border ${theme.cardBorder} p-5 backdrop-blur-xl shadow-xl transition-colors duration-700`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className={theme.iconColor} />
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
                                Approved System Dinosaurs ({currentEra.name} Era)
                            </h3>
                        </div>

                        <motion.button
                            whileHover={{ x: 4 }}
                            transition={balancedSmoothSpring}
                            onClick={() => navigate("/explorer")}
                            className={`text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer ${theme.accentText}`}
                        >
                            <span>Browse Dinosaur Encyclopedia</span>
                            <ChevronRight size={14} />
                        </motion.button>
                    </div>

                    {loadingDinosaurs ? (
                        <div className="flex items-center justify-center gap-3 py-12 text-gray-400 text-xs font-semibold">
                            <Loader2 size={20} className={`animate-spin ${theme.accentText}`} />
                            <span>Querying system database for {currentEra.name} dinosaur records...</span>
                        </div>
                    ) : eraDinosaurs.length > 0 ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentEra.id}
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                            >
                                {eraDinosaurs.slice(0, 4).map((dino) => {
                                    const dinoName = dino.name || "Unknown Dinosaur";
                                    const dinoDiet = dino.stats?.diet || dino.diet || "Specimen";
                                    const dinoImg =
                                        dino.images?.heroBackground ||
                                        dino.images?.main ||
                                        dino.image ||
                                        currentEra.dinosaur;
                                    const dinoLength =
                                        dino.stats?.length ||
                                        (dino.height ? `${dino.height} meters` : "N/A");
                                    const dinoWeight =
                                        dino.stats?.weight ||
                                        (dino.weight ? `${dino.weight} kg` : "N/A");

                                    return (
                                        <motion.div
                                            key={dino._id || dino.id || dino.name}
                                            variants={itemVariants}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            transition={balancedSmoothSpring}
                                            onClick={() =>
                                                setSelectedSpecimen({
                                                    name: dinoName,
                                                    diet: dinoDiet,
                                                    role: dino.scientificName || dino.stats?.period || `${currentEra.name} Specimen`,
                                                    length: dinoLength,
                                                    weight: dinoWeight,
                                                    period: dino.stats?.period || currentEra.name,
                                                    image: dinoImg,
                                                    desc: dino.description || "System dinosaur record stored in database.",
                                                })
                                            }
                                            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors duration-300 hover:${theme.accentBorder} hover:bg-white/10 cursor-pointer shadow-md will-change-transform transform-gpu`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out" />
                                            <div className="h-32 w-full overflow-hidden rounded-xl bg-black/40 relative flex items-center justify-center">
                                                <img
                                                    src={dinoImg}
                                                    alt={dinoName}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = currentEra.dinosaur;
                                                    }}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
                                                />
                                                <span className={`absolute top-2 left-2 rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${theme.badgeBg}`}>
                                                    {dinoDiet}
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-1">
                                                <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-200 transition">
                                                    {dinoName}
                                                </h4>
                                                <p className={`text-[11px] font-bold truncate ${theme.accentText}`}>
                                                    {dino.scientificName || `${currentEra.name} Specimen`}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    Length: <strong className="text-stone-200">{dinoLength}</strong> • {dinoWeight}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        /* DYNAMIC SYSTEM EMPTY STATE */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, ease: ultraBezier }}
                            className={`rounded-2xl border ${theme.cardBorder} p-8 text-center space-y-3`}
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${theme.badgeBg} mx-auto text-xl font-bold`}>
                                🦕
                            </div>
                            <h4 className="font-serif text-base font-bold text-white">
                                No Approved System Records for {currentEra.name} Era
                            </h4>
                            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                                Dinosaur species are dynamically pulled from system database records. When users contribute via <strong className="text-white">Create Dinosaur</strong> and admins approve them, they will instantly populate this era view.
                            </p>
                            <div className="pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={balancedSmoothSpring}
                                    onClick={() => navigate("/create")}
                                    className={`inline-flex items-center gap-2 rounded-xl border ${theme.badgeBg} px-5 py-2.5 text-xs font-extrabold shadow-md transition cursor-pointer`}
                                >
                                    <PlusCircle size={16} />
                                    <span>Contribute a {currentEra.name} Dinosaur</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* HISTORICAL MILESTONES SCRUBBER & ASTEROID TRIGGER */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: ultraBezier }}
                    className={`relative z-10 mb-6 rounded-3xl border ${theme.cardBorder} p-5 backdrop-blur-xl shadow-xl transition-colors duration-700`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${theme.accentText}`}>
                            <Info size={16} className={theme.iconColor} />
                            Key Era Milestones & Geological Events
                        </h3>

                        {currentEra.id === "cretaceous" && (
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                transition={balancedSmoothSpring}
                                onClick={() => setIsAsteroidModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 px-4 py-1.5 text-xs font-black text-white shadow-lg transition cursor-pointer"
                            >
                                <Flame size={14} />
                                <span>Simulate Asteroid Impact (66 Ma)</span>
                            </motion.button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEra.id}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
                        >
                            {currentEra.milestones.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, x: 3 }}
                                    transition={balancedSmoothSpring}
                                    className={`rounded-2xl border p-3.5 space-y-1.5 transition-colors duration-300 ${
                                        m.type === "extinction"
                                            ? "border-red-500/40 bg-red-950/30 hover:border-red-400"
                                            : m.type === "climate"
                                            ? "border-amber-500/40 bg-amber-950/30 hover:border-amber-400"
                                            : "border-emerald-500/40 bg-emerald-950/30 hover:border-emerald-400"
                                    } will-change-transform transform-gpu cursor-pointer`}
                                >
                                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${theme.badgeBg}`}>
                                        {m.year}
                                    </span>
                                    <h4 className="font-bold text-white text-xs">{m.title}</h4>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">{m.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* FOOTER SLIDER & CONTROLS */}
                <motion.footer
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12, ease: ultraBezier }}
                    className={`relative z-10 rounded-3xl border ${theme.cardBorder} p-6 backdrop-blur-xl shadow-xl transition-colors duration-700`}
                >
                    
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
                            className={`absolute left-4 top-0 h-1.5 rounded-full ${theme.accentBg}`}
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
                                        {/* Pulsing Halo */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeHalo"
                                                className={`absolute inset-0 rounded-full border ${era.theme.accentBorder} ${era.theme.tabActive} animate-ping`}
                                                style={{ animationDuration: "2s" }}
                                            />
                                        )}

                                        {/* Outer Circle Ring */}
                                        <div
                                            className={`h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                                isActive
                                                    ? `${era.theme.accentBorder} bg-[#0A0C0A] scale-125`
                                                    : "border-white/30 bg-black hover:border-white"
                                            }`}
                                        >
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                                    isActive ? era.theme.accentBg : "bg-transparent group-hover:bg-white/40"
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
                                <motion.button
                                    key={era.id}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={balancedSmoothSpring}
                                    onClick={() => setActiveEra(index)}
                                    className={`group rounded-2xl p-3 text-center transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? era.theme.tabActive
                                            : "border border-transparent hover:bg-white/5"
                                    }`}
                                >
                                    <h3
                                        className={`font-serif text-sm font-bold transition-colors sm:text-lg md:text-xl ${
                                            isActive ? era.theme.accentText : "text-gray-500 group-hover:text-gray-300"
                                        }`}
                                    >
                                        {era.name}
                                    </h3>
                                    <p className="mt-1 text-[9px] font-semibold text-gray-500 sm:text-[10px] md:text-xs">
                                        {era.start} – {era.end}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.footer>
            </div>

            {/* SPECIMEN DETAILS MODAL OVERLAY */}
            {selectedSpecimen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 15 }}
                        transition={{ duration: 0.35, ease: ultraBezier }}
                        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border ${theme.cardBorder} p-6 text-white shadow-2xl space-y-4`}
                    >
                        <button
                            onClick={() => setSelectedSpecimen(null)}
                            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className={`rounded-xl border px-3 py-1 text-xs font-bold ${theme.badgeBg}`}>
                                {selectedSpecimen.diet}
                            </div>
                            <span className="text-xs text-gray-400">{selectedSpecimen.period}</span>
                        </div>

                        <h3 className={`font-serif text-2xl font-bold bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent`}>
                            {selectedSpecimen.name}
                        </h3>
                        <p className={`text-xs font-bold ${theme.accentText}`}>{selectedSpecimen.role}</p>

                        <img
                            src={selectedSpecimen.image}
                            alt={selectedSpecimen.name}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = currentEra.dinosaur;
                            }}
                            className="h-48 w-full rounded-2xl object-cover border border-white/10"
                        />

                        <p className="text-xs text-stone-300 leading-relaxed">{selectedSpecimen.desc}</p>

                        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] text-gray-400 font-bold block uppercase">Length</span>
                                <span className="font-extrabold text-white">{selectedSpecimen.length}</span>
                            </div>
                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] text-gray-400 font-bold block uppercase">Weight</span>
                                <span className="font-extrabold text-white">{selectedSpecimen.weight}</span>
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
                            className={`w-full flex items-center justify-center gap-2 rounded-xl border ${theme.badgeBg} py-3 text-xs font-extrabold shadow-md transition cursor-pointer`}
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
