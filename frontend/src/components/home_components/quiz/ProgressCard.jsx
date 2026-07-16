import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function ProgressCard() {
    return (
        <motion.div
            animate={{
                y: [-4, 4, -4],
                x: [1.5, -1.5, 1.5]
            }}
            transition={{
                duration: 9.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="
            absolute
            bottom-2
            left-1/2
            -translate-x-1/2
            sm:bottom-4
            sm:left-4
            sm:translate-x-0
            z-30
            w-[92%]
            max-w-[240px]
            sm:max-w-[320px]
            rounded-xl
            sm:rounded-2xl
            bg-white/85
            backdrop-blur-md
            border
            border-white/60
            p-3
            sm:p-4
            shadow-[0_15px_35px_rgba(0,0,0,0.06)]
            "
        >
            <div className="mb-1.5 sm:mb-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-sm font-bold text-[#1E251C]">
                    Your Progress
                </span>

                <Leaf
                    className="text-[#496A3D] h-3 w-3 sm:h-4 sm:w-4"
                />
            </div>

            <div className="h-1.5 sm:h-2.5 overflow-hidden rounded-full bg-[#E7E2D5]">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.8 }}
                    className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-[#496A3D]
                    to-[#3D5C32]
                    "
                />
            </div>

            <div className="mt-1 flex justify-end">
                <span className="text-[9px] sm:text-xs font-extrabold text-[#496A3D]">
                    68% Completed
                </span>
            </div>
        </motion.div>
    );
}