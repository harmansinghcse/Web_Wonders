import { motion } from "framer-motion";
import quizDino from "../../../assets/home-assets/quiz-dino.png";
import DNAStatsCard from "./DNAStatsCard";
import ProgressCard from "./ProgressCard";

export default function QuizVisual() {
    return (
        <div className="relative flex h-[280px] sm:h-[400px] lg:h-[480px] w-full items-center justify-center">
            {/* Background Circle */}
            <motion.div
                animate={{
                    scale: [0.96, 1.02, 0.96]
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="
                absolute
                h-[180px]
                w-[180px]
                sm:h-[300px]
                sm:w-[300px]
                lg:h-[340px]
                lg:w-[340px]
                rounded-full
                bg-gradient-to-br
                from-[#EAF3E4]
                to-[#D8E7D2]
                opacity-60
                "
            />

            {/* Dinosaur */}
            <motion.img
                src={quizDino}
                alt="Baby Dinosaur"
                animate={{
                    y: [-6, 6, -6],
                    rotate: [-0.5, 0.5, -0.5]
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="
                relative
                z-20
                w-[200px]
                sm:w-[340px]
                lg:w-[440px]
                object-contain
                drop-shadow-[0_15px_40px_rgba(73,106,61,0.15)]
                "
            />

            <DNAStatsCard />

            <ProgressCard />
        </div>
    );
}
