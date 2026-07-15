import { motion } from "framer-motion";
import { Dna } from "lucide-react";

export default function DNAStatsCard() {
    return (
        <motion.div
            animate={{
                y: [4, -4, 4],
                x: [-2, 2, -2]
            }}
            transition={{
                duration: 9.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="
            absolute
            right-2
            top-4
            sm:right-4
            sm:top-8
            z-30
            flex
            items-center
            gap-2
            sm:gap-3
            rounded-xl
            sm:rounded-2xl
            bg-white/80
            backdrop-blur-md
            border
            border-white/60
            px-3
            py-2
            sm:px-4
            sm:py-3
            shadow-[0_15px_35px_rgba(0,0,0,0.06)]
            "
        >
            <div
                className="
                flex
                h-8
                w-8
                sm:h-10
                sm:w-10
                items-center
                justify-center
                rounded-full
                bg-[#EDF4E7]
                "
            >
                <Dna
                    className="text-[#496A3D] h-4 w-4 sm:h-5 sm:w-5"
                />
            </div>

            <div>
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#3D4E37] opacity-80">
                    DNA POINTS
                </p>

                <h3 className="text-lg sm:text-2xl font-extrabold text-[#496A3D] leading-tight">
                    1,250
                </h3>
            </div>
        </motion.div>
    );
}