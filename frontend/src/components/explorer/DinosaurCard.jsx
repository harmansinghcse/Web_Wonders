import { ChevronRight, MapPin, Calendar, Beef } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * --------------------------------------------
 * Component: DinosaurCard
 * Purpose:
 * Displays a single dinosaur card with uniform card sizing,
 * equal heights across grid items, and overflow protection.
 * --------------------------------------------
 */

export default function DinosaurCard({ dinosaur }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.3,
                ease: "easeOut",
            }}
            className="h-full"
        >
            <Link to={`/dinosaur/${dinosaur.slug}`} className="group block h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#D8D2C5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    
                    {/* Dinosaur Image Container */}
                    <div className="relative aspect-16/10 overflow-hidden shrink-0">
                        <img
                            src={dinosaur.images?.heroBackground || dinosaur.images?.main}
                            alt={dinosaur.name}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                        <div className="absolute bottom-4 left-5 right-5">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white truncate" title={dinosaur.name}>
                                {dinosaur.name}
                            </h2>

                            <p className="italic text-white/80 text-xs sm:text-sm truncate" title={dinosaur.scientificName}>
                                {dinosaur.scientificName}
                            </p>
                        </div>
                    </div>

                    {/* Card Body - Uniform Height Distribution */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                        <div>
                            {/* Meta Details Grid (Period, Location, Diet) */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs sm:text-sm text-gray-600">
                                <div className="flex min-w-0 items-center gap-2" title={dinosaur.stats?.period}>
                                    <Calendar size={15} className="shrink-0 text-[#47613F]" />
                                    <span className="truncate">
                                        {dinosaur.stats?.period || "Unknown Era"}
                                    </span>
                                </div>

                                <div className="flex min-w-0 items-center gap-2" title={dinosaur.stats?.location}>
                                    <MapPin size={15} className="shrink-0 text-[#47613F]" />
                                    <span className="truncate">
                                        {dinosaur.stats?.location || "Global"}
                                    </span>
                                </div>

                                <div className="flex min-w-0 items-center gap-2" title={dinosaur.stats?.diet}>
                                    <Beef size={15} className="shrink-0 text-[#47613F]" />
                                    <span className="truncate">
                                        {dinosaur.stats?.diet || "Specimen"}
                                    </span>
                                </div>
                            </div>

                            {/* Stat Boxes Grid - Fixed Uniform Min Height & Overflow Bounding */}
                            <div className="mt-5 grid grid-cols-3 gap-2.5">
                                <div className="rounded-xl bg-[#F7F5EF] p-2.5 sm:p-3 text-center flex flex-col justify-center min-h-[76px] overflow-hidden border border-[#EBE7DD]">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 truncate">
                                        Length
                                    </p>

                                    <p className="mt-1 font-extrabold text-[#2E4A37] text-xs sm:text-sm leading-tight line-clamp-2" title={dinosaur.stats?.length}>
                                        {dinosaur.stats?.length || "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F7F5EF] p-2.5 sm:p-3 text-center flex flex-col justify-center min-h-[76px] overflow-hidden border border-[#EBE7DD]">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 truncate">
                                        Weight
                                    </p>

                                    <p className="mt-1 font-extrabold text-[#2E4A37] text-xs sm:text-sm leading-tight line-clamp-2" title={dinosaur.stats?.weight}>
                                        {dinosaur.stats?.weight || "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F7F5EF] p-2.5 sm:p-3 text-center flex flex-col justify-center min-h-[76px] overflow-hidden border border-[#EBE7DD]">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 truncate">
                                        Speed
                                    </p>

                                    <p className="mt-1 font-extrabold text-[#2E4A37] text-xs sm:text-sm leading-tight line-clamp-2" title={dinosaur.stats?.speed}>
                                        {dinosaur.stats?.speed || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Explore Link */}
                        <div className="mt-5 flex items-center justify-end text-[#47613F] pt-2 border-t border-gray-100">
                            <span className="font-semibold text-xs sm:text-sm">Explore</span>

                            <ChevronRight
                                size={18}
                                className="ml-1.5 transition group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
