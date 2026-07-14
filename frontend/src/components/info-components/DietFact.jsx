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
        y: 40,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function DietFact({ diet }) {
    return (
        <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-6 md:px-14 py-12 md:grid-cols-2">
            {/* Left */}
            <motion.div
                variants={left}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12"
            >
                <h2 className="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                    Diet
                </h2>

                <p className="mt-6 text-lg leading-8 text-[#4B4B4B]">
                    {diet.description}
                </p>

                <div className="mt-8">
                    <h3 className="mb-4 text-xl font-semibold text-[#2B241C]">
                        Favorite Food
                    </h3>

                    <motion.ul
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="space-y-3 text-gray-700"
                    >
                        {diet.favoriteFood.map((food) => (
                            <motion.li
                                key={food}
                                variants={card}
                                whileHover={{ x: 8 }}
                                className="flex items-center gap-3"
                            >
                                <span className="h-2 w-2 rounded-full bg-[#B88A3B]" />
                                {food}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </motion.div>

            {/* Right */}
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="p-8 md:p-12"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {diet.facts.map((fact) => (
                        <motion.div
                            key={fact.title}
                            variants={card}
                            whileHover={{
                                y: -8,
                                scale: 1.03,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                            }}
                            className="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6 transition-colors hover:border-[#C6A87C] hover:bg-[#FBF9F4]"
                        >
                            <h4 className="text-sm uppercase tracking-widest text-[#B88A3B]">
                                {fact.title}
                            </h4>

                            <p className="mt-3 text-gray-700">{fact.value}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
