import { motion } from "framer-motion";
import QuizFeatures from "./QuizFeatures";
import QuizButton from "./QuizButton";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 16
        }
    }
};

export default function QuizContent() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full max-w-[620px] space-y-5 sm:space-y-6"
        >
            <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="h-px w-10 bg-[#496A3D]" />
                <span className="text-xs font-bold uppercase tracking-[0.38em] text-[#496A3D]">
                    Test Your Knowledge
                </span>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black leading-[1.0] lg:leading-[0.95] tracking-[-0.03em] text-[#1E251C]">
                    Interactive
                    <span className="block text-[#4B6A3E] drop-shadow-[0_1px_3px_rgba(75,106,62,0.1)]">
                        Jurassic Quiz
                    </span>
                </h2>
            </motion.div>

            <motion.p
                variants={itemVariants}
                className="max-w-[540px] text-[15px] sm:text-[17px] leading-7 sm:leading-[28px] text-[#2C3B24] font-medium opacity-90"
            >
                Challenge yourself with exciting dinosaur quizzes,
                earn DNA Points, unlock achievements and become a Jurassic expert.
            </motion.p>

            <motion.div variants={itemVariants}>
                <QuizFeatures />
            </motion.div>

            <motion.div variants={itemVariants}>
                <QuizButton />
            </motion.div>
        </motion.div>
    );
}