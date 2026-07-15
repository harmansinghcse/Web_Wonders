import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuizButton() {
    return (
        <div className="pt-2">
            {/* Start Quiz Button */}
            <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                <Link
                    to="/quiz"
                    className="
                        group
                        flex
                        h-[60px]
                        w-[220px]
                        items-center
                        justify-between
                        rounded-2xl
                        bg-gradient-to-r
                        from-[#496A3D]
                        to-[#3D5C32]
                        px-6
                        text-lg
                        font-bold
                        text-white
                        shadow-[0_12px_28px_rgba(73,106,61,0.2)]
                        transition-all
                        duration-300
                        hover:from-[#3D5C32]
                        hover:to-[#314B27]
                        hover:shadow-[0_15px_35px_rgba(73,106,61,0.3)]
                    "
                >
                    <span>Start Quiz</span>

                    <ArrowRight
                        size={22}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                </Link>
            </motion.div>
        </div>
    );
}