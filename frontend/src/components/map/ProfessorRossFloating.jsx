import {
    MessageCircle,
    Sparkles,
    ArrowUpRight
} from "lucide-react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";


const ProfessorRossFloating = () => {
    const professorImage = "/ross-avatar.png";

    return (

        <div
            className="
                pointer-events-none
                fixed
                bottom-5
                right-5
                z-[1000]
                sm:bottom-7
                sm:right-7
            "
        >

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}

                transition={{
                    delay: 0.5,
                    duration: 0.45,
                    ease: [
                        0.16,
                        1,
                        0.3,
                        1
                    ]
                }}

                className="
                    pointer-events-auto
                "
            >

                <Link
                    to="/professor"
                    aria-label="Ask Professor Ross"
                    className="
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-[#31583c]/20
                        bg-[#e8e3d7]/95
                        p-2
                        pr-3
                        shadow-[0_12px_35px_rgba(24,59,39,0.22)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#31583c]/35
                        hover:bg-[#f0ece3]
                        hover:shadow-[0_18px_40px_rgba(24,59,39,0.28)]
                        active:translate-y-0
                        active:scale-[0.98]
                    "
                >

                    {/* =========================================
                        SUBTLE AI GLOW
                    ========================================= */}

                    <span
                        className="
                            pointer-events-none
                            absolute
                            -inset-1
                            -z-10
                            rounded-[20px]
                            bg-[#3d7049]/10
                            opacity-0
                            blur-xl
                            transition-opacity
                            duration-300
                            group-hover:opacity-100
                        "
                    />


                    {/* =========================================
                        PROFESSOR IMAGE / PLACEHOLDER
                    ========================================= */}

                    <div
                        className="
                            relative
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#31583c]/20
                            bg-gradient-to-br
                            from-[#d5d5c8]
                            to-[#c6cabd]
                            shadow-inner
                            sm:h-14
                            sm:w-14
                        "
                    >

                        {professorImage ? (

                            <img
                                src={professorImage}
                                alt="Professor Ross"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            /*
                             * Temporary placeholder.
                             *
                             * This automatically disappears
                             * once professorImage is added.
                             */

                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    text-[#315e3d]
                                "
                            >

                                <MessageCircle
                                    size={22}
                                />

                            </div>

                        )}


                        {/* =====================================
                            ONLINE INDICATOR
                        ===================================== */}

                        <span
                            className="
                                absolute
                                bottom-1
                                right-1
                                h-2.5
                                w-2.5
                                rounded-full
                                border-2
                                border-[#e8e3d7]
                                bg-[#438252]
                                shadow-sm
                            "
                        />

                    </div>


                    {/* =========================================
                        TEXT
                    ========================================= */}

                    <div
                        className="
                            hidden
                            min-w-0
                            sm:block
                        "
                    >

                        {/* SMALL LABEL */}

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >

                            <Sparkles
                                size={9}
                                className="
                                    text-[#9b7b3f]
                                "
                            />


                            <span
                                className="
                                    text-[7px]
                                    font-black
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#7a827a]
                                "
                            >
                                AI Dinosaur Expert
                            </span>

                        </div>


                        {/* PROFESSOR NAME */}

                        <div
                            className="
                                mt-0.5
                                flex
                                items-center
                                gap-1.5
                            "
                        >

                            <span
                                className="
                                    font-serif
                                    text-[13px]
                                    font-black
                                    text-[#20432c]
                                "
                            >
                                Ask Professor Ross
                            </span>


                            <ArrowUpRight
                                size={11}
                                className="
                                    text-[#54705b]
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                "
                            />

                        </div>


                        {/* SUBTEXT */}

                        <p
                            className="
                                mt-0.5
                                text-[8px]
                                font-medium
                                text-[#7b837b]
                            "
                        >
                            Curious about dinosaurs?
                        </p>

                    </div>


                    {/* =========================================
                        MOBILE SPARKLE
                    ========================================= */}

                    <div
                        className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-[#315e3d]/10
                            text-[#315e3d]
                            sm:hidden
                        "
                    >

                        <Sparkles
                            size={11}
                        />

                    </div>

                </Link>

            </motion.div>

        </div>

    );

};


export default ProfessorRossFloating;