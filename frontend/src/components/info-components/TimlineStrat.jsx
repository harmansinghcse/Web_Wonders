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
            duration: 0.7,
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
            duration: 0.7,
        },
    },
};

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
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
            duration: 0.5,
        },
    },
};

export default function TimelineStrat({ timeline, hunting }) {
    return (
        <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-6 md:px-14 py-12 md:grid-cols-2">
            {/* Timeline */}
            <motion.div
                variants={left}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12"
            >
                <h2 className="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                    {timeline.period} Timeline
                </h2>

                <div className="mt-10 space-y-4">
                    <div>
                        <span className="font-semibold">Lived:</span>{" "}
                        {timeline.livedFrom} – {timeline.livedTo}
                    </div>

                    <div>
                        <span className="font-semibold">Extinction:</span>{" "}
                        {timeline.extinction}
                    </div>
                </div>

                <p className="mt-10 text-sm italic text-gray-500">
                    All information is based on fossil discoveries and
                    scientific research.
                </p>
            </motion.div>

            {/* Hunting */}
            <motion.div
                variants={right}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="p-8 md:p-12"
            >
                <h2 className="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                    {hunting.huntingStyle}
                </h2>

                <p className="mt-5 leading-8 text-gray-700">
                    {hunting.strategy}
                </p>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    {hunting.traits.map((trait) => (
                        <motion.div
                            key={trait.title}
                            variants={item}
                            whileHover={{
                                y: -6,
                                scale: 1.03,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                            }}
                            className="group flex gap-4 rounded-xl p-3 transition-colors hover:bg-[#F8F4EC]"
                        >
                            <motion.div
                                whileHover={{
                                    rotate: 10,
                                    scale: 1.1,
                                }}
                                className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#EED6A2] text-xl sm:text-2xl"
                            >
                                {trait.icon}
                            </motion.div>

                            <div>
                                <h3 className="font-semibold uppercase text-[#2B241C]">
                                    {trait.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-600">
                                    {trait.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
