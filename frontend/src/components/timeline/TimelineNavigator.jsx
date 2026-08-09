import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Columns,
    Flame,
} from "lucide-react";

import { eras } from "../../data/eras";
import { getExplorerDinosaurs } from "../../services/explorerService";

import Navbar from "../home_components/hero/Navbar";
import AsteroidImpactModal from "./AsteroidImpactModal";
import TimelineSections from "./TimelineSections";
import SpecimenModal from "./SpecimenModal";
import TimelineFooter from "./TimelineFooter";


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
    const compEra =
        comparisonEra !== null && eras[comparisonEra]
            ? eras[comparisonEra]
            : null;
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
                console.log(
                    "System API lookup for era dinosaurs:",
                    err.message,
                );
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
            const imagesToPreload = [era.background, era.dinosaur].filter(
                Boolean,
            );
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
                            <img
                                key={`preload-dino-${idx}`}
                                src={dino.image}
                                alt=""
                                fetchPriority="high"
                            />
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
                    background: `radial-gradient(circle at 50% 20%, ${currentEra.theme.bgGlow} 0%, rgba(10, 12, 10, 0.85) 75%)`,
                }}
            />

            {/* Premium Vignettes & Gradients */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-[#0A0C0A] pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0A0C0A]/90 via-transparent to-[#0A0C0A]/90 pointer-events-none" />

            {/* SITE NAVIGATION HEADER */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 sm:px-6 pt-26 sm:pt-28 lg:pt-30">
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
                        <ArrowLeft
                            size={16}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
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
                            <span>
                                {compareMode
                                    ? "Single Era View"
                                    : "Compare Eras Side-by-Side"}
                            </span>
                        </motion.button>

                        {activeEra === 2 && (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAsteroidModalOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/70 px-5 py-2.5 text-xs font-bold text-red-200 backdrop-blur-xl hover:border-red-400 hover:bg-red-900/90 transition cursor-pointer shadow-lg"
                            >
                                <Flame
                                    size={15}
                                    className="text-red-400 animate-pulse"
                                />
                                <span>Simulate Extinction</span>
                            </motion.button>
                        )}

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-semibold backdrop-blur-xl shadow-lg"
                        >
                            <span className="text-gray-300">
                                Atmosphere Theme:
                            </span>{" "}
                            <span
                                style={{ color: currentEra.theme.primary }}
                                className="font-bold"
                            >
                                {currentEra.theme.name}
                            </span>
                        </motion.div>
                    </div>
                </motion.header>

                <TimelineSections
                    compareMode={compareMode}
                    currentEra={currentEra}
                    compEra={compEra}
                    comparisonEra={comparisonEra}
                    setComparisonEra={setComparisonEra}
                    availableCompareEras={availableCompareEras}
                    setSelectedSpecimen={setSelectedSpecimen}
                    navigate={navigate}
                />

                {/* Footer Slider & Controls */}
                <TimelineFooter
                    eras={eras}
                    activeEra={activeEra}
                    setActiveEra={setActiveEra}
                    currentEra={currentEra}
                    balancedSmoothSpring={balancedSmoothSpring}
                />
            </div>

            {/* SPECIMEN DETAILS MODAL OVERLAY */}
            {selectedSpecimen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <SpecimenModal
                        selectedSpecimen={selectedSpecimen}
                        currentEra={currentEra}
                        theme={theme}
                        ultraBezier={ultraBezier}
                        balancedSmoothSpring={balancedSmoothSpring}
                        setSelectedSpecimen={setSelectedSpecimen}
                        navigate={navigate}
                    />
                </div>
            )}

            {/* ASTEROID IMPACT SIMULATION MODAL */}
            {isAsteroidModalOpen && (
                <AsteroidImpactModal
                    onClose={() => setIsAsteroidModalOpen(false)}
                />
            )}
        </section>
    );
}
