import { motion } from "framer-motion";
import {
    Thermometer,
    Wind,
    Globe,
    Trees,
} from "lucide-react";

export default function TimelineClimate({ currentEra }) {
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
                    <Thermometer
                        size={18}
                        style={{
                            color: currentEra.theme.primary,
                        }}
                    />

                    <span>
                        ATMOSPHERIC & ENVIRONMENTAL CLIMATE DASHBOARD (
                        {currentEra.name.toUpperCase()})
                    </span>
                </h3>

                <span className="w-fit rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    LIVE METRICS
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Temperature */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                >
                    <div
                        className="rounded-xl p-2.5 bg-white/5"
                        style={{
                            color: currentEra.theme.primary,
                        }}
                    >
                        <Thermometer size={20} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            AVG TEMPERATURE
                        </p>

                        <p className="text-xl font-bold text-white mt-1">
                            {currentEra.climate.temp}
                        </p>

                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                            {currentEra.climate.tempSub}
                        </p>
                    </div>
                </motion.div>

                {/* Oxygen */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                >
                    <div className="rounded-xl p-2.5 bg-white/5 text-emerald-400">
                        <Wind size={20} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            OXYGEN (O₂)
                        </p>

                        <p className="text-xl font-bold text-white mt-1">
                            {currentEra.climate.oxygen}
                        </p>

                        <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                            {currentEra.climate.co2}
                        </p>
                    </div>
                </motion.div>

                {/* Continental Drift */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                >
                    <div className="rounded-xl p-2.5 bg-white/5 text-blue-400">
                        <Globe size={20} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            CONTINENTAL DRIFT
                        </p>

                        <p className="text-sm font-bold text-white mt-1 leading-snug">
                            {currentEra.climate.drift}
                        </p>
                    </div>
                </motion.div>

                {/* Flora */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 transition-colors duration-300 hover:border-white/30 hover:bg-black/60 shadow-lg cursor-pointer"
                >
                    <div className="rounded-xl p-2.5 bg-white/5 text-green-400">
                        <Trees size={20} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            DOMINANT FLORA
                        </p>

                        <p className="text-xs font-bold text-white mt-1 leading-snug">
                            {currentEra.climate.flora}
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}