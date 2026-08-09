import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";

export default function TimelineDinosaurs({
    currentEra,
    setSelectedSpecimen,
    navigate,
}) {
    return (
        <div
            className="my-6 rounded-3xl border p-6 backdrop-blur-xl shadow-lg transition-colors duration-500"
            style={{
                borderColor: currentEra.theme.border,
                backgroundColor: currentEra.theme.cardBg,
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                    <Sparkles
                        size={16}
                        style={{
                            color: currentEra.theme.primary,
                        }}
                    />

                    <span>
                        APPROVED SYSTEM DINOSAURS (
                        {currentEra.name.toUpperCase()} ERA)
                    </span>
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
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 22,
                        }}
                        onClick={() =>
                            setSelectedSpecimen(dino)
                        }
                        className="group rounded-2xl border border-white/10 bg-black/50 overflow-hidden hover:border-white/40 transition-all duration-300 cursor-pointer shadow-xl"
                    >
                        <div className="relative h-44 w-full overflow-hidden bg-black/60">
                            <img
                                src={dino.image}
                                alt={dino.name}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                        currentEra.dinosaur;
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

                            <p
                                className="text-xs font-semibold italic mt-0.5"
                                style={{
                                    color: currentEra.theme.primary,
                                }}
                            >
                                {dino.scientificName}
                            </p>

                            <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[11px] text-gray-400">
                                <span>
                                    Length:{" "}
                                    <strong className="text-white">
                                        {dino.length}
                                    </strong>
                                </span>

                                <span>
                                    Weight:{" "}
                                    <strong className="text-white">
                                        {dino.weight}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}