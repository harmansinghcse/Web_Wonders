import { motion } from "framer-motion";

export default function QuizFeature({
    icon,
    title,
    subtitle,
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/75 border border-white/90 shadow-[0_8px_30px_rgba(73,106,61,0.02)] hover:bg-white hover:border-[#496A3D]/25 hover:shadow-[0_15px_35px_rgba(73,106,61,0.05)] transition-all duration-300 w-full"
        >
            <div
                className="
                flex
                h-[48px]
                w-[48px]
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#EDF4E7]
                "
            >
                {icon}
            </div>

            <div>
                <h4
                    className="
                    text-base
                    font-bold
                    text-[#1A2416]
                    "
                >
                    {title}
                </h4>

                <p
                    className="
                    mt-0.5
                    text-[12px]
                    leading-5
                    text-[#3D4E37]
                    font-medium
                    "
                >
                    {subtitle}
                </p>
            </div>
        </motion.div>
    );
}