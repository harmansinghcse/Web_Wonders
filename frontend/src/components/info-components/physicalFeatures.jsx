import { motion } from "framer-motion";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const card = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
        },
    },
};

export default function PhysicalFeatures({ physicalFeatures }) {
    return (
        <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="mb-14 text-5xl font-bold uppercase tracking-wide text-[#222]"
                >
                    Physical Features
                </motion.h2>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid gap-10 border-y border-[#d8d3c4] py-12 md:grid-cols-2 lg:grid-cols-4"
                >
                    {physicalFeatures.features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={card}
                            whileHover={{
                                y: -10,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                            }}
                            className="group rounded-2xl p-5 transition-colors duration-300 hover:bg-[#f8f5ee]"
                        >
                            <motion.img
                                src={feature.image}
                                alt={feature.title}
                                whileHover={{
                                    scale: 1.08,
                                    rotate: 2,
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                                className="mx-auto h-36 object-contain"
                            />

                            <h3 className="mt-6 text-2xl font-bold uppercase">
                                {feature.title}
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
