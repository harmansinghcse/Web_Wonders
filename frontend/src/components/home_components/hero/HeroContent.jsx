import { motion } from "framer-motion";
import HeroStats from "./HeroStats";
import HeroButtons from "./HeroButtons";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15
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

export default function HeroContent() {
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
        >
            {/* Label */}
            <motion.div variants={itemVariants} className="mb-3 lg:mb-4 flex items-center gap-4">
                <div className="h-px w-14 bg-[#303030]" />

                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#000000]">
                    Journey Back In Time
                </p>

                <div className="h-px w-14 bg-[#303030]" />
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-0">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] 2xl:text-[5.2rem] font-semibold leading-[0.95] tracking-[-0.03em] text-[#241D18]">
                    Explore the
                </h1>

                <h2 className="font-display text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] 2xl:text-[5.2rem] italic font-semibold leading-[1.0] tracking-[-0.03em] text-[#006F0F]">
                    Age of Dinosaurs
                </h2>
            </motion.div>
            {/* Description */}
            <motion.p
                variants={itemVariants}
                className="mt-4 lg:mt-4 xl:mt-6 max-w-lg text-base lg:text-lg leading-7 lg:leading-8 text-[#222D1F] font-medium opacity-95"
            >
                Discover prehistoric giants, uncover ancient fossils, and
                journey through more than{" "}
                <span className="font-semibold text-[#36593D]">
                    180 million years
                </span>{" "}
                of Earth's forgotten history.
            </motion.p>

            {/* Stats */}
            <motion.div variants={itemVariants} className="mt-4 lg:mt-4 xl:mt-6">
                <HeroStats />
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="mt-4 lg:mt-4 xl:mt-6">
                <HeroButtons />
            </motion.div>
        </motion.div>
    );
}