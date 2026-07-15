import { motion } from "framer-motion";
import CreateFeatures from "./CreateFeatures";
import CreateShowcase from "./CreateShowcase";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const createBg = "/create-bg.png";

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

export default function CreateSection() {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-[#EFEAE0] px-6 py-20 sm:px-8 lg:px-12">
            {/* Background */}
            <img
                src={createBg}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-right"
            />

            {/* Overlay so left-side text stays readable */}
            {/* <div className="absolute inset-0 bg-linear-to-r from-[#EFEAE0] via-[#EFEAE0]/80 to-transparent" /> */}

            {/* Content sits above background */}
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div variants={itemVariants} className="mb-6 flex items-center gap-4">
                        <div className="h-px w-12 bg-[#2f2f2f]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#000000]">
                            Unleash Your Creativity
                        </p>
                        <div className="h-px w-12 bg-[#2f2f2f]" />
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="font-display text-4xl leading-[1.05] text-[#000000] font-bold sm:text-5xl lg:text-6xl">
                        Create Your
                        <br />
                        <span className="text-[#006c16]">Own Dinosaur</span>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="mt-6 max-w-md text-base font-medium leading-7 text-[#2b2b2b] sm:text-lg sm:leading-8">
                        Design your very own prehistoric creature. Choose its
                        era, diet, habitat, abilities and more.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <CreateFeatures />
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate("/create")}
                        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#006815] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#2A4530] sm:px-8 sm:py-4 sm:text-base cursor-pointer"
                    >
                        Start Creating
                        <ArrowRight
                            size={18}
                            className="transition group-hover:translate-x-1 font-bold"
                        />
                    </motion.button>
                </motion.div>

                <CreateShowcase />
            </div>
        </section>
    );
}
