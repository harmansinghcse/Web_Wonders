import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

export default function SpecimenModal({
    selectedSpecimen,
    currentEra,
    theme,
    ultraBezier,
    balancedSmoothSpring,
    setSelectedSpecimen,
    navigate,
}) {
    if (!selectedSpecimen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.35, ease: ultraBezier }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-black/90 p-6 text-white shadow-2xl space-y-4"
            style={{
                borderColor:
                    theme?.border ||
                    "rgba(255,255,255,0.2)",
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
                        backgroundColor:
                            theme?.badgeBg ||
                            "rgba(255,255,255,0.1)",
                        color:
                            theme?.primary ||
                            "#E7D3A7",
                    }}
                >
                    {selectedSpecimen.diet ||
                        "Fossil Specimen"}
                </div>

                <span className="text-xs text-gray-400">
                    {selectedSpecimen.period ||
                        currentEra.name}
                </span>
            </div>

            <h3
                className="font-serif text-2xl font-bold"
                style={{
                    color:
                        theme?.primary ||
                        "#ffffff",
                }}
            >
                {selectedSpecimen.name}
            </h3>

            {selectedSpecimen.scientificName && (
                <p
                    className="text-xs font-bold italic"
                    style={{
                        color:
                            theme?.primary ||
                            "#E7D3A7",
                    }}
                >
                    {selectedSpecimen.scientificName}
                </p>
            )}

            {selectedSpecimen.image && (
                <img
                    src={selectedSpecimen.image}
                    alt={selectedSpecimen.name}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                            currentEra.dinosaur;
                    }}
                    className="h-48 w-full rounded-2xl object-cover border border-white/10 bg-black/40"
                />
            )}

            {selectedSpecimen.desc && (
                <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedSpecimen.desc}
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                        Length
                    </span>

                    <span className="font-extrabold text-white">
                        {selectedSpecimen.length ||
                            "N/A"}
                    </span>
                </div>

                <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                        Weight
                    </span>

                    <span className="font-extrabold text-white">
                        {selectedSpecimen.weight ||
                            "N/A"}
                    </span>
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
                    borderColor:
                        theme?.border ||
                        "rgba(255,255,255,0.2)",
                    backgroundColor:
                        theme?.badgeBg ||
                        "rgba(255,255,255,0.1)",
                    color:
                        theme?.primary ||
                        "#ffffff",
                }}
            >
                <span>
                    Inspect in Dinosaur Explorer
                </span>

                <ExternalLink size={14} />
            </motion.button>
        </motion.div>
    );
}