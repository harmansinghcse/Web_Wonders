import { ChevronRight, MapPin, Calendar, Beef } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * --------------------------------------------
 * Component: DinosaurCard
 * Purpose:
 * Displays a single dinosaur card with its
 * image, basic information, statistics,
 * and a link to the detailed page.
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
        >
            <Link to={`/dinosaur/${dinosaur.slug}`} className="group block">
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#D8D2C5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Image */}
                    <div className="relative aspect-16/10 overflow-hidden">
                        <img
                            src={dinosaur.images.heroBackground}
                            alt={dinosaur.name}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute bottom-5 left-5">
                            <h2 className="text-3xl font-bold text-white">
                                {dinosaur.name}
                            </h2>

                            <p className="italic text-white/80">
                                {dinosaur.scientificName}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-6">
                        {/* Meta */}
                        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
                            <div className="flex min-w-0 items-center gap-2">
                                <Calendar size={16} className="shrink-0" />
                                <span className="wrap-break-words">
                                    {dinosaur.stats.period}
                                </span>
                            </div>

                            <div className="flex min-w-0 items-center gap-2">
                                <MapPin size={16} className="shrink-0" />
                                <span className="wrap-break-words">
                                    {dinosaur.stats.location}
                                </span>
                            </div>

                            <div className="flex min-w-0 items-center gap-2">
                                <Beef size={16} className="shrink-0" />
                                <span className="wrap-break-words">
                                    {dinosaur.stats.diet}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            <div className="rounded-xl bg-[#F7F5EF] p-4 text-center">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    Length
                                </p>

                                <p className="mt-2 font-bold text-[#2E4A37]">
                                    {dinosaur.stats.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#F7F5EF] p-4 text-center">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    Weight
                                </p>

                                <p className="mt-2 font-bold text-[#2E4A37]">
                                    {dinosaur.stats.weight}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#F7F5EF] p-4 text-center">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    Speed
                                </p>

                                <p className="mt-2 font-bold text-[#2E4A37]">
                                    {dinosaur.stats.speed}
                                </p>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="mt-6 flex items-center justify-end text-[#47613F]">
                            <span className="font-semibold">Explore</span>

                            <ChevronRight
                                size={20}
                                className="ml-2 transition group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
