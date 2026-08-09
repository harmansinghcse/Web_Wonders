import { motion } from "framer-motion";

export default function TimelineMilestones({ currentEra }) {
    return (
        <div
            className="my-6 rounded-3xl border p-6 backdrop-blur-xl shadow-lg transition-colors duration-500"
            style={{
                borderColor: currentEra.theme.border,
                backgroundColor: currentEra.theme.cardBg,
            }}
        >
            <h3 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-white sm:text-base mb-6">
                <span
                    style={{
                        color: currentEra.theme.primary,
                    }}
                >
                    ℹ️
                </span>

                <span>
                    KEY ERA MILESTONES & GEOLOGICAL EVENTS
                </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentEra.milestones.map((m, idx) => {
                    const shades = [
                        {
                            bg: "bg-gradient-to-br from-[#2b1b0b]/90 via-[#1b1106]/85 to-[#0a0602]/95",
                            border: "border-amber-500/40 hover:border-amber-400",
                            badgeBg:
                                "bg-amber-500/20 text-amber-300 border-amber-500/50",
                            titleColor:
                                "text-amber-100 group-hover:text-amber-300",
                            glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
                        },
                        {
                            bg: "bg-gradient-to-br from-[#0b281c]/90 via-[#071a12]/85 to-[#030d08]/95",
                            border: "border-emerald-500/40 hover:border-emerald-400",
                            badgeBg:
                                "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
                            titleColor:
                                "text-emerald-100 group-hover:text-emerald-300",
                            glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
                        },
                        {
                            bg: "bg-gradient-to-br from-[#2c0b0b]/90 via-[#1c0606]/85 to-[#0c0202]/95",
                            border: "border-red-500/40 hover:border-red-400",
                            badgeBg:
                                "bg-red-500/20 text-red-300 border-red-500/50",
                            titleColor:
                                "text-red-100 group-hover:text-red-300",
                            glow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
                        },
                    ];

                    const shade = shades[idx % shades.length];

                    return (
                        <motion.div
                            key={`m-${idx}`}
                            whileHover={{ y: -7, scale: 1.03 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                            className={`group rounded-2xl border p-4 font-sans transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg ${shade.bg} ${shade.border} ${shade.glow}`}
                        >
                            <span
                                className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase border mb-3 ${shade.badgeBg}`}
                            >
                                {m.ma}
                            </span>

                            <h4
                                className={`font-serif text-sm font-bold tracking-tight transition-colors ${shade.titleColor}`}
                            >
                                {m.title}
                            </h4>

                            <p className="text-xs text-gray-300/90 mt-2 leading-relaxed font-medium">
                                {m.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}