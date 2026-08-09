import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";

export default function TimelineHero({ currentEra }) {
    return (
        <div
            className="my-6 relative z-10 grid grid-cols-1 items-center gap-8 rounded-[36px] border p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-10 transition-colors duration-500"
            style={{
                borderColor: currentEra.theme.border,
                backgroundColor: currentEra.theme.cardBg,
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
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                    >
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                            style={{
                                backgroundColor:
                                    currentEra.theme.badgeBg,
                                color: currentEra.theme.primary,
                            }}
                        >
                            <Sparkles size={12} />

                            {currentEra.theme.name.toUpperCase()}{" "}
                            • GEOLOGICAL PERIOD
                        </div>

                        <h1 className="mt-4 font-serif text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                            {currentEra.name}
                        </h1>

                        <h2
                            className="mt-3 text-lg font-bold sm:text-xl md:text-2xl"
                            style={{
                                color: currentEra.theme.primary,
                            }}
                        >
                            {currentEra.tagline}
                        </h2>

                        <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base sm:leading-loose">
                            {currentEra.description}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin
                                    size={16}
                                    style={{
                                        color: currentEra.theme.primary,
                                    }}
                                />

                                <span>
                                    Span:{" "}
                                    <strong className="text-white">
                                        {currentEra.start}
                                    </strong>{" "}
                                    to{" "}
                                    <strong className="text-white">
                                        {currentEra.end}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right: Dinosaur Representation */}
            <div className="relative flex h-64 items-center justify-center sm:h-80 lg:h-96">
                <div
                    className="absolute h-40 w-64 rounded-full blur-3xl transition-colors duration-500"
                    style={{
                        backgroundColor:
                            currentEra.theme.bgGlow,
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentEra.dinosaur}
                        src={currentEra.dinosaur}
                        alt={`${currentEra.name} dinosaur`}
                        onError={(e) => {
                            if (currentEra.id === "triassic") {
                                e.currentTarget.src =
                                    "/triassic-dino.webp";
                            } else if (
                                currentEra.id === "jurassic"
                            ) {
                                e.currentTarget.src =
                                    "/jurassic-dino.webp";
                            } else {
                                e.currentTarget.src =
                                    "/trex-dino.webp";
                            }
                        }}
                        initial={{
                            opacity: 0,
                            x: 40,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            y: [0, -10, 0],
                        }}
                        exit={{
                            opacity: 0,
                            x: -40,
                            scale: 0.95,
                        }}
                        transition={{
                            opacity: { duration: 0.3 },
                            x: {
                                duration: 0.35,
                                ease: "easeOut",
                            },
                            scale: { duration: 0.35 },
                            y: {
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    />
                </AnimatePresence>
            </div>
        </div>
    );
}