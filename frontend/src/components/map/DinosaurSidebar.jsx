import { ChevronLeft, ChevronRight, MapPin, Compass, Beef, Leaf, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "../../utils/imageHelper";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 28 } }
};

const DinosaurSidebar = ({
    dinosaurs,
    activeDinosaurId,
    setActiveDinosaurId,
    isOpen,
    setIsOpen
}) => {
    // Diet branding aligned with website's dark earth museum theme
    const getDietDetails = (diet) => {
        const d = (diet || "").toLowerCase();
        if (d.includes("carni")) {
            return { icon: Beef, color: "text-[#B5462F] bg-[#B5462F]/10 border-[#B5462F]/20" };
        } else if (d.includes("herbi")) {
            return { icon: Leaf, color: "text-[#8BAA83] bg-[#2E4A37]/20 border-[#2E4A37]/35" };
        }
        return { icon: Apple, color: "text-[#C9A14A] bg-[#C9A14A]/10 border-[#C9A14A]/30" };
    };

    return (
        <div className="relative flex h-full items-stretch pointer-events-none">
            {/* Sidebar container styled as a specimen catalog */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ x: -330, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -330, opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 220 }}
                        className="pointer-events-auto z-20 flex w-76 sm:w-84 shrink-0 flex-col border-r border-[#C9A14A]/15 bg-[#211D18] shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header Area */}
                        <div className="flex h-20 items-center justify-between border-b border-[#C9A14A]/10 px-5 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <Compass className="text-[#C9A14A]" size={20} />
                                <h2 className="font-serif text-lg font-black text-[#F5F2EA] tracking-tight">
                                    Specimen Catalog
                                </h2>
                            </div>
                            <span className="rounded-xl bg-[#2E4A37]/20 px-3 py-1 text-xs font-bold text-[#8BAA83] border border-[#2E4A37]/30">
                                {dinosaurs.length}
                            </span>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 scrollbar-thin scrollbar-thumb-stone-850 scrollbar-track-transparent">
                            {dinosaurs.length > 0 ? (
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-3"
                                >
                                    {dinosaurs.map((dino) => {
                                        const { id, name, diet, period, country, image } = dino;
                                        const isActive = activeDinosaurId === id;
                                        const dietInfo = getDietDetails(diet);
                                        const DietIcon = dietInfo.icon;

                                        // Fetch optimized 300px thumbnail to prevent pixelation
                                        const thumbnail = getOptimizedImageUrl(image, 300);

                                        return (
                                            <motion.button
                                                variants={itemVariants}
                                                key={id}
                                                onClick={() => setActiveDinosaurId(id)}
                                                whileHover={{ scale: 1.01, y: -0.5 }}
                                                whileTap={{ scale: 0.99 }}
                                                className={`w-full flex items-center gap-3.5 rounded-2xl p-3 text-left border transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-[#2B2621] border-[#2E4A37] shadow-[0_0_15px_rgba(46,74,55,0.25)] ring-2 ring-[#2E4A37]/20"
                                                        : "bg-[#2B2621]/45 border-[#C9A14A]/10 hover:bg-[#2B2621]/70 hover:border-[#C9A14A]/30 hover:shadow-lg"
                                                }`}
                                            >
                                                {/* Thumbnail */}
                                                <div className="h-14 w-14 aspect-square shrink-0 overflow-hidden rounded-xl border border-[#C9A14A]/15 bg-[#171613]">
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={name}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-[10px] font-serif font-black text-[#9A9489]">
                                                            FOSSIL
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-serif text-sm font-bold truncate leading-tight ${isActive ? "text-[#C9A14A]" : "text-[#F5F2EA]"}`}>
                                                        {name}
                                                    </h3>
                                                    <p className="mt-1 text-[10px] text-[#9A9489] font-medium truncate uppercase tracking-wider">
                                                        {period} • {country}
                                                    </p>
                                                    
                                                    {/* Diet Tag Badge */}
                                                    <div className="mt-2 flex">
                                                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold border ${dietInfo.color}`}>
                                                            <DietIcon size={9} />
                                                            {diet}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Selection Pin */}
                                                <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#171613] border border-[#C9A14A]/10 shadow-sm transition-transform duration-300">
                                                    <MapPin
                                                        size={12}
                                                        className={isActive ? "text-[#8BAA83] scale-110 animate-pulse" : "text-[#9A9489]"}
                                                    />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                    <div className="rounded-full bg-[#171613] p-4 text-[#9A9489] border border-[#C9A14A]/10">
                                        <Compass size={28} className="animate-pulse" />
                                    </div>
                                    <h4 className="mt-4 font-serif text-sm font-bold text-[#F5F2EA]">
                                        No matches found
                                    </h4>
                                    <p className="mt-1.5 text-xs text-[#9A9489] leading-normal max-w-xs font-sans">
                                        Refine your text filters or try resetting dropdown options.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Sidebar Toggle Button */}
            <div className="pointer-events-auto z-20 flex items-center shrink-0">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-16 w-8 items-center justify-center rounded-r-2xl border-y border-r border-[#C9A14A]/15 bg-[#211D18]/90 shadow-md backdrop-blur-xl text-[#C9A14A] hover:text-[#F5F2EA] active:bg-[#2E4A37]/10"
                    aria-label={isOpen ? "Hide Excavation List" : "Show Excavation List"}
                >
                    {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>
        </div>
    );
};

export default DinosaurSidebar;
