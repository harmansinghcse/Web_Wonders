import { motion } from "framer-motion";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const item = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut",
        },
    },
};

export default function DinoIntro({ hero }) {
    return (
        <div className="relative z-10 mx-auto mt-24 flex w-full max-w-7xl grow flex-col justify-center px-8 md:px-16">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-2xl"
            >
                <motion.h2
                    variants={item}
                    className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#c6a87c]"
                >
                    {hero.tagLine}
                </motion.h2>

                <motion.h1
                    variants={item}
                    className="mb-2 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-[5.5rem]"
                >
                    {hero.title}
                    <br />
                    <span className="text-[#c6a87c]">
                        {hero.highlightedTitle}
                    </span>
                </motion.h1>

                <motion.p
                    variants={item}
                    className="mt-8 max-w-xl pr-4 text-base leading-relaxed text-gray-200 md:text-lg"
                >
                    {hero.description}
                </motion.p>
            </motion.div>
        </div>
    );
}
