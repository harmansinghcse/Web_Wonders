import { motion } from "framer-motion";

const left = {
    hidden: {
        opacity: 0,
        x: -60,
    },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
        },
    },
};

const right = {
    hidden: {
        opacity: 0,
        x: 60,
    },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            delay: 0.15,
        },
    },
};

export default function Fossil({ about, fossil }) {
    return (
        <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    {/* Description */}
                    <motion.div
                        variants={left}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="mb-8 text-2xl font-extrabold uppercase text-[#1B1B1B] lg:text-4xl">
                            {about.heading}
                        </h2>

                        {about.paragraphs.map((paragraph, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.12,
                                    duration: 0.5,
                                }}
                                className={`text-lg leading-9 text-gray-700 ${
                                    index !== about.paragraphs.length - 1
                                        ? "mb-8"
                                        : ""
                                }`}
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </motion.div>

                    {/* Fossil */}
                    <motion.div
                        variants={right}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.div
                            whileHover={{
                                y: -8,
                                transition: {
                                    duration: 0.25,
                                },
                            }}
                            className="relative overflow-hidden rounded-[30px] shadow-2xl"
                        >
                            <motion.img
                                src={fossil.image}
                                alt={`${about.heading} Fossil`}
                                whileHover={{
                                    scale: 1.05,
                                }}
                                transition={{
                                    duration: 0.5,
                                }}
                                className="h-80 sm:h-96 md:h-130 w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.4,
                                }}
                                className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex items-center gap-3 sm:gap-4"
                            >
                                <div className="flex h-10 w-10 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#C79A4A] bg-black/50 text-xl sm:text-3xl text-[#C79A4A]">
                                    🦴
                                </div>

                                <div>
                                    <h3 className="text-lg sm:text-3xl font-bold uppercase tracking-wide text-white">
                                        Fossil Record
                                    </h3>

                                    <p className="text-sm text-gray-300">
                                        Discoveries across{" "}
                                        {fossil.locations.join(", ")}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
