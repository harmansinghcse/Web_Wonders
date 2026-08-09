import { motion } from "framer-motion";

export default function TimelineFooter({
    eras,
    activeEra,
    setActiveEra,
    currentEra,
    balancedSmoothSpring,
}) {
    return (
        <footer className="relative z-10 mt-6 rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-xl shadow-lg">
            {/* Time Ruler Ticks */}
            <div className="flex justify-between text-xs font-semibold tracking-wider text-gray-400">
                <span>{eras[0].start} (Triassic Dawn)</span>

                <span className="hidden sm:inline">
                    201 Ma
                </span>

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
                    className="absolute left-4 top-0 h-1 rounded-full"
                    style={{
                        backgroundColor:
                            currentEra.theme.primary,
                    }}
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
                                {/* Golden/Theme Pulsing Halo for active node */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeHalo"
                                        className="absolute inset-0 rounded-full border animate-ping"
                                        style={{
                                            borderColor:
                                                era.theme.primary,
                                            backgroundColor:
                                                era.theme.bgGlow,
                                            animationDuration:
                                                "2s",
                                        }}
                                    />
                                )}

                                {/* Outer Circle Ring */}
                                <div
                                    className="h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                                    style={{
                                        borderColor: isActive
                                            ? era.theme.primary
                                            : "rgba(255,255,255,0.3)",
                                        backgroundColor: isActive
                                            ? "#0a0c0a"
                                            : "black",
                                        transform: isActive
                                            ? "scale(1.25)"
                                            : "scale(1)",
                                    }}
                                >
                                    <div
                                        className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor:
                                                isActive
                                                    ? era.theme.primary
                                                    : "transparent",
                                        }}
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
                            whileHover={{
                                y: -3,
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            transition={
                                balancedSmoothSpring
                            }
                            onClick={() =>
                                setActiveEra(index)
                            }
                            className={`group rounded-2xl p-3 text-center transition-all duration-300 border ${
                                isActive
                                    ? "shadow-lg"
                                    : "border-transparent hover:bg-white/5"
                            }`}
                            style={{
                                borderColor: isActive
                                    ? era.theme.border
                                    : "transparent",
                                backgroundColor: isActive
                                    ? era.theme.badgeBg
                                    : "transparent",
                            }}
                        >
                            <h3
                                className="font-serif text-sm font-bold transition-colors sm:text-lg md:text-xl"
                                style={{
                                    color: isActive
                                        ? era.theme.primary
                                        : "rgb(156, 163, 175)",
                                }}
                            >
                                {era.name}
                            </h3>

                            <p className="mt-1 text-[9px] font-semibold text-gray-400 sm:text-[10px] md:text-xs">
                                {era.start} – {era.end}
                            </p>
                        </motion.button>
                    );
                })}
            </div>
        </footer>
    );
}