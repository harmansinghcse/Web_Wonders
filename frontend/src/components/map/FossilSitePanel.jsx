import { useState, useEffect } from "react";
import { X, MapPin, Calendar, Sparkles, Globe, Trees, Building2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const FossilSitePanel = ({ dinosaur, locationData, loadingLocation, onClose }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!dinosaur) return null;

    const { name } = dinosaur;
    const {
        formation,
        country,
        region,
        period,
        description,
        importance,
        count,
        environment,
        nearbyCity,
        geoFact
    } = locationData || {};

    const showLocalContext = environment || (nearbyCity && nearbyCity !== "Unknown" && nearbyCity !== "") || geoFact;

    // Animation variants: vertical fade/slide for inline mobile, horizontal slide for desktop panel
    const panelVariants = {
        initial: isMobile ? { y: 15, opacity: 0 } : { x: 340, opacity: 0 },
        animate: isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 },
        exit: isMobile ? { y: 15, opacity: 0 } : { x: 340, opacity: 0 }
    };

    return (
        <motion.div
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="pointer-events-auto z-10 flex w-full md:w-92 h-auto md:h-full shrink-0 flex-col border border-[#C9A14A]/15 md:border-t-0 md:border-b-0 md:border-r-0 md:border-l bg-[#211D18] shadow-2xl rounded-3xl md:rounded-none"
        >
            {/* Header with Close */}
            <div className="flex h-16 md:h-20 items-center justify-between border-b border-[#C9A14A]/10 px-5 shrink-0">
                <div className="flex items-center gap-2.5">
                    <BookOpen className="text-[#C9A14A]" size={20} />
                    <h2 className="font-serif text-base md:text-lg font-black text-[#F5F2EA] tracking-tight">
                        Excavation Report
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-[#9A9489] hover:bg-[#2B2621] hover:text-[#F5F2EA] transition-all"
                    aria-label="Close report"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Shimmer/Skeleton Loading State */}
            {loadingLocation ? (
                <div className="flex-1 p-5 space-y-6 animate-pulse bg-[#211D18] rounded-b-3xl md:rounded-b-none">
                    <div>
                        <div className="h-3 w-20 bg-[#2B2621] rounded-md" />
                        <div className="h-7 w-48 bg-[#2B2621] rounded-md mt-2" />
                    </div>

                    <div className="space-y-4">
                        {/* Formation Card Skeleton */}
                        <div className="rounded-2xl border border-[#C9A14A]/10 bg-[#171613] p-4">
                            <div className="h-12 w-full bg-[#2B2621] rounded-md" />
                        </div>

                        {/* Grid Skeletons */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-16 bg-[#171613] border border-[#C9A14A]/10 rounded-2xl p-3" />
                            <div className="h-16 bg-[#171613] border border-[#C9A14A]/10 rounded-2xl p-3" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-5 border-t border-[#C9A14A]/10">
                        <div className="h-3 w-28 bg-[#2B2621] rounded-md" />
                        <div className="h-20 w-full bg-[#2B2621] rounded-md mt-2" />
                    </div>

                    <div className="flex items-center justify-center py-8">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#9A9489] flex items-center gap-2">
                            <svg className="animate-spin h-4.5 w-4.5 text-[#C9A14A]" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Geocoding Stratum...
                        </span>
                    </div>
                </div>
            ) : (
                /* Main Geological Site Narrative Content */
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-stone-850 scrollbar-track-transparent rounded-b-3xl md:rounded-b-none">
                    {/* Species Reference */}
                    <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-[#8BAA83] block">
                            Fossil Site for
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-black text-[#F5F2EA] leading-tight mt-0.5">
                            {name}
                        </h3>
                    </div>

                    {/* Primary Site Info Cards */}
                    <div className="space-y-4">
                        {/* Formation Card */}
                        {formation && (
                            <div className="rounded-2xl border border-[#C9A14A]/15 bg-[#171613] p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-[#C9A14A] mt-0.5 shrink-0" />
                                    <div>
                                        <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">
                                            Geological Stratum
                                        </span>
                                        <h4 className="font-serif text-sm md:text-base font-black text-[#F5F2EA] leading-tight mt-1">
                                            {formation}
                                        </h4>
                                        {(region || country) && (
                                            <span className="block text-xs text-[#D0C9BB] font-medium mt-1 font-sans">
                                                {region ? `${region}, ` : ""}{country}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Era & Count Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Period */}
                            {period && (
                                <div className="rounded-2xl border border-[#C9A14A]/15 bg-[#171613] p-3.5 shadow-sm">
                                    <Calendar size={16} className="text-[#8BAA83] mb-2" />
                                    <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">
                                        Epoch
                                    </span>
                                    <span className="font-serif text-xs md:text-sm font-bold text-[#C9A14A] leading-tight mt-1 block">
                                        {period}
                                    </span>
                                </div>
                            )}

                            {/* Species count */}
                            {count !== undefined && (
                                <div className="rounded-2xl border border-[#C9A14A]/15 bg-[#171613] p-3.5 shadow-sm">
                                    <Sparkles size={16} className="text-[#C9A14A] mb-2" />
                                    <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">
                                        Findings Count
                                    </span>
                                    <span className="font-serif text-xs md:text-sm font-bold text-[#C9A14A] leading-tight mt-1 block">
                                        {count > 1 ? `${count}+ Specimens` : "1 Specimen"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excavation Narrative */}
                    {(description || importance) && (
                        <div className="space-y-4 border-t border-[#C9A14A]/10 pt-5">
                            {description && (
                                <div>
                                    <h4 className="font-serif text-[10px] font-bold uppercase tracking-widest text-[#9A9489]">
                                        Geological History
                                    </h4>
                                    <p className="mt-2 text-xs text-[#D0C9BB] leading-relaxed font-sans font-medium">
                                        {description}
                                    </p>
                                </div>
                            )}

                            {importance && (
                                <div className="border-l-2 border-[#C9A14A] pl-3.5 mt-4">
                                    <h4 className="font-serif text-[10px] font-bold uppercase tracking-widest text-[#9A9489]">
                                        Paleontological Impact
                                    </h4>
                                    <p className="mt-2 text-xs italic text-[#D0C9BB] leading-relaxed font-medium">
                                        {importance}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Optional Present-day Local Context */}
                    {showLocalContext && (
                        <div className="space-y-4 border-t border-[#C9A14A]/10 pt-5">
                            <h4 className="font-serif text-[10px] font-bold uppercase tracking-widest text-[#9A9489]">
                                Present-Day Geographic Context
                            </h4>
                            
                            <div className="space-y-3 mt-3">
                                {environment && (
                                    <div className="flex items-center gap-2.5 text-xs text-[#D0C9BB] font-medium font-sans">
                                        <Trees size={14} className="text-[#8BAA83] shrink-0" />
                                        <span>Environment: <strong className="text-[#F5F2EA]">{environment}</strong></span>
                                    </div>
                                )}

                                {nearbyCity && nearbyCity !== "Unknown" && nearbyCity !== "" && (
                                    <div className="flex items-center gap-2.5 text-xs text-[#D0C9BB] font-medium font-sans">
                                        <Building2 size={14} className="text-[#8BAA83] shrink-0" />
                                        <span>Access Point: <strong className="text-[#F5F2EA]">{nearbyCity}</strong></span>
                                    </div>
                                )}

                                {geoFact && (
                                    <div className="rounded-2xl bg-[#C9A14A]/5 border border-[#C9A14A]/20 p-4 text-xs text-[#D0C9BB] font-medium leading-relaxed shadow-sm font-sans">
                                        <div className="flex items-center gap-1.5 text-[#C9A14A] font-bold text-[9px] uppercase tracking-widest mb-1.5">
                                            <Globe size={11} />
                                            <span>Geological Fact</span>
                                        </div>
                                        {geoFact}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default FossilSitePanel;
