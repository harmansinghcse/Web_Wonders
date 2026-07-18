import { Link } from "react-router-dom";
import { MapPin, Calendar, Beef, Leaf, Apple, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../../utils/imageHelper";

const MarkerPopup = ({ dinosaur }) => {
    const { name, scientificName, slug, image, formation, country, period, diet } = dinosaur;

    const getDietDetails = (dietName) => {
        const d = (dietName || "").toLowerCase();
        if (d.includes("carni")) {
            return {
                icon: Beef,
                color: "bg-[#B5462F]/15 text-[#B5462F] border-[#B5462F]/30",
                label: "Carnivore"
            };
        } else if (d.includes("herbi")) {
            return {
                icon: Leaf,
                color: "bg-[#2E4A37]/20 text-[#8BAA83] border-[#2E4A37]/35",
                label: "Herbivore"
            };
        } else {
            return {
                icon: Apple,
                color: "bg-[#C9A14A]/10 text-[#C9A14A] border-[#C9A14A]/25",
                label: "Omnivore"
            };
        }
    };

    const dietInfo = getDietDetails(diet);
    const DietIcon = dietInfo.icon;

    // Use optimized resolution of 600px for card view to prevent pixelation
    const optimizedImage = getOptimizedImageUrl(image, 600);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 sm:w-72 overflow-hidden rounded-[20px] bg-[#2B2621]/95 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-[#C9A14A]/20 font-sans backdrop-blur-md"
        >
            {/* Dinosaur Image */}
            <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-[#171613]">
                {optimizedImage ? (
                    <img
                        src={optimizedImage}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2E4A37]/10 text-[#2E4A37]">
                        <span className="font-serif text-base font-bold tracking-wider">JURASSIC</span>
                    </div>
                )}
                {/* Diet Badge */}
                <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full border px-2.5 py-0.75 text-[9px] font-bold tracking-widest uppercase backdrop-blur-md shadow-sm ${dietInfo.color}`}>
                    <DietIcon size={9} />
                    {dietInfo.label}
                </span>

                {/* Vignette gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                
                {/* Era Overlay */}
                <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5 text-[9px] font-black text-[#F5F2EA] uppercase tracking-widest bg-[#2E4A37]/90 border border-[#C9A14A]/30 px-2 py-0.75 rounded-md backdrop-blur-xs">
                    <Calendar size={10} className="text-[#C9A14A]" />
                    {period}
                </div>
            </div>

            {/* Details Content */}
            <div className="p-4 sm:p-5">
                <div>
                    <h3 className="font-serif text-lg sm:text-xl font-black text-[#F5F2EA] leading-tight tracking-tight">
                        {name}
                    </h3>
                    {scientificName && scientificName.toLowerCase() !== name.toLowerCase() && (
                        <p className="text-xs italic text-[#9A9489] font-medium mt-0.5 font-serif">
                            {scientificName}
                        </p>
                    )}
                </div>
                
                <div className="mt-3.5 space-y-2.5 text-xs text-[#D0C9BB]">
                    <div className="flex items-start gap-2.5">
                        <MapPin size={14} className="text-[#C9A14A] shrink-0 mt-0.5" />
                        <div className="leading-tight">
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">
                                Discovery Site
                            </span>
                            <span className="font-bold text-[#F5F2EA] mt-0.5 block">
                                {formation}
                            </span>
                            <span className="block text-[10px] text-[#9A9489] mt-0.5">
                                {country}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Specimen Navigation Button */}
                <Link
                    to={`/dinosaur/${slug}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2E4A37] to-[#516858] text-[#F5F2EA] py-2.5 px-4 text-center text-xs font-bold shadow-md hover:shadow-lg hover:shadow-[#2E4A37]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 border-none cursor-pointer"
                >
                    <span>Explore Specimen</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        </motion.div>
    );
};

export default MarkerPopup;
