import { Link } from "react-router-dom";

import {
    MapPin,
    CalendarDays,
    Leaf,
    Beef,
    Apple,
    ArrowUpRight,
    Landmark,
    Sparkles
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import {
    getOptimizedImageUrl
} from "../../utils/imageHelper";


const FeaturedDinosaurPanel = ({
    dinosaur
}) => {

    /* =========================================================
       EMPTY STATE
    ========================================================= */

    if (!dinosaur) {

        return (

            <aside
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    border-l
                    border-[#31583d]/20
                    bg-[#e4e9de]
                    p-6
                    text-center
                "
            >

                <div>

                    <Landmark
                        size={34}
                        className="
                            mx-auto
                            text-[#4f7659]
                        "
                    />


                    <h3
                        className="
                            mt-3
                            font-serif
                            text-lg
                            font-black
                            text-[#23422d]
                        "
                    >
                        No Specimen Selected
                    </h3>


                    <p
                        className="
                            mt-2
                            text-xs
                            leading-relaxed
                            text-[#667368]
                        "
                    >
                        Select a dinosaur from the map
                        to view its details.
                    </p>

                </div>

            </aside>

        );

    }


    /* =========================================================
       DINOSAUR DATA
    ========================================================= */

    const {
        id,
        name,
        scientificName,
        slug,
        image,
        period,
        era,
        diet,
        country,
        formation
    } = dinosaur;


    /* =========================================================
       OPTIMIZED IMAGE
    ========================================================= */

    const optimizedImage =
        getOptimizedImageUrl(
            image,
            700
        );


    /* =========================================================
       DIET DETAILS
    ========================================================= */

    const getDietDetails = (
        dietName
    ) => {

        const normalizedDiet =
            (
                dietName ||
                ""
            ).toLowerCase();


        if (
            normalizedDiet.includes(
                "carni"
            )
        ) {

            return {

                icon: Beef,

                label:
                    diet ||
                    "Carnivore",

                className:
                    "bg-[#a74d3d]/12 text-[#964235] border-[#a74d3d]/25"

            };

        }


        if (
            normalizedDiet.includes(
                "herbi"
            )
        ) {

            return {

                icon: Leaf,

                label:
                    diet ||
                    "Herbivore",

                className:
                    "bg-[#3f7049]/12 text-[#32643e] border-[#3f7049]/25"

            };

        }


        return {

            icon: Apple,

            label:
                diet ||
                "Omnivore",

            className:
                "bg-[#557899]/12 text-[#426987] border-[#557899]/25"

        };

    };


    const dietDetails =
        getDietDetails(
            diet
        );


    const DietIcon =
        dietDetails.icon;


    /* =========================================================
       ERA / PERIOD DISPLAY
    ========================================================= */

    const prehistoricPeriod =
        period ||
        era ||
        "Prehistoric Era";


    /* =========================================================
       LOCATION
    ========================================================= */

    const location =
        country ||
        "Location Unknown";


    /* =========================================================
       PROFILE ROUTE
    ========================================================= */

    const dinosaurRoute =
        slug
            ? `/dinosaur/${slug}`
            : id
                ? `/dinosaur/${id}`
                : "#";


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <aside
            className="
                relative
                overflow-hidden
                border-l
                border-[#31583d]/20
                bg-gradient-to-b
                from-[#e7ece2]
                via-[#edf0e7]
                to-[#e4e9de]
                shadow-[-8px_0_28px_rgba(31,64,41,0.08)]
                xl:min-h-[650px]
            "
        >

            <AnimatePresence
                mode="wait"
            >

                <motion.div

                    key={
                        id ||
                        slug ||
                        name
                    }

                    initial={{
                        opacity: 0,
                        x: 15
                    }}

                    animate={{
                        opacity: 1,
                        x: 0
                    }}

                    exit={{
                        opacity: 0,
                        x: -10
                    }}

                    transition={{
                        duration: 0.3
                    }}

                    className="
                        flex
                        h-full
                        flex-col
                    "
                >

                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    <div
                        className="
                            relative
                            aspect-[4/3]
                            w-full
                            overflow-hidden
                            bg-[#3f6248]
                        "
                    >

                        {optimizedImage ? (

                            <img
                                src={
                                    optimizedImage
                                }
                                alt={
                                    name
                                }
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    hover:scale-105
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    bg-gradient-to-br
                                    from-[#46654d]
                                    to-[#294b35]
                                "
                            >

                                <span
                                    className="
                                        font-serif
                                        text-lg
                                        font-black
                                        uppercase
                                        tracking-[0.18em]
                                        text-[#e9e5da]/70
                                    "
                                >
                                    Jurassic
                                </span>

                            </div>

                        )}


                        {/* IMAGE VIGNETTE */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-[#122d1c]/80
                                via-[#173321]/10
                                to-black/15
                            "
                        />


                        {/* FEATURED LABEL */}

                        <div
                            className="
                                absolute
                                left-4
                                top-4
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-[#d5bc78]/30
                                bg-[#173923]/88
                                px-3
                                py-1.5
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.15em]
                                text-[#f3efe6]
                                shadow-lg
                                backdrop-blur-md
                            "
                        >

                            <Sparkles
                                size={11}
                                className="
                                    text-[#e0c276]
                                "
                            />

                            Specimen Profile

                        </div>


                        {/* PERIOD OVER IMAGE */}

                        <div
                            className="
                                absolute
                                bottom-4
                                left-4
                                right-4
                            "
                        >

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-[#d8bd72]/35
                                    bg-[#214d31]/92
                                    px-2.5
                                    py-1.5
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#f5f1e8]
                                    shadow-lg
                                    backdrop-blur-md
                                "
                            >

                                <CalendarDays
                                    size={11}
                                    className="
                                        text-[#d8bd72]
                                    "
                                />

                                {
                                    prehistoricPeriod
                                }

                            </span>

                        </div>

                    </div>


                    {/* =========================================
                        CONTENT
                    ========================================= */}

                    <div
                        className="
                            relative
                            flex
                            flex-1
                            flex-col
                            px-5
                            pb-5
                            pt-5
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-16
                                top-0
                                h-36
                                w-36
                                rounded-full
                                bg-[#52755b]/10
                                blur-[45px]
                            "
                        />

                        {/* DINOSAUR NAME */}

                        <div>

                            <span
                                className="
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#967642]
                                "
                            >
                                Selected Dinosaur
                            </span>


                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-[27px]
                                    font-black
                                    leading-none
                                    tracking-tight
                                    text-[#183b27]
                                "
                            >
                                {name}
                            </h2>


                            {scientificName &&
                                scientificName
                                    .toLowerCase() !==
                                    (
                                        name ||
                                        ""
                                    ).toLowerCase() && (

                                <p
                                    className="
                                        mt-1.5
                                        font-serif
                                        text-xs
                                        italic
                                        text-[#687568]
                                    "
                                >
                                    {
                                        scientificName
                                    }
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            DIET
                        ===================================== */}

                        <div
                            className="
                                mt-4
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <span
                                className={`
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-black
                                    ${dietDetails.className}
                                `}
                            >

                                <DietIcon
                                    size={12}
                                />

                                {
                                    dietDetails.label
                                }

                            </span>


                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-[#426b4d]/20
                                    bg-[#dce8dc]/70 
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-black
                                    text-[#3e6548]
                                "
                            >

                                <CalendarDays
                                    size={12}
                                />

                                {
                                    prehistoricPeriod
                                }

                            </span>

                        </div>


                        {/* =====================================
                            DIVIDER
                        ===================================== */}

                        <div
                            className="
                                my-5
                                h-px
                                bg-gradient-to-r
                                from-transparent
                                via-[#31583d]/25
                                to-transparent
                            "
                        />


                        {/* =====================================
                            DISCOVERY LOCATION
                        ===================================== */}

                        <InformationRow

                            icon={
                                MapPin
                            }

                            title="Discovery Location"

                            primary={
                                location
                            }

                        />


                        {/* =====================================
                            FORMATION
                        ===================================== */}

                        {formation && (

                            <InformationRow

                                icon={
                                    Landmark
                                }

                                title="Geological Formation"

                                primary={
                                    formation
                                }

                            />

                        )}


                        {/* =====================================
                            SPACER
                        ===================================== */}

                        <div
                            className="
                                flex-1
                            "
                        />


                        {/* =====================================
                            PROFILE BUTTON
                        ===================================== */}

                        <Link
                            to={
                                dinosaurRoute
                            }
                            className="
                                mt-6
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-[#214b30]/15
                                bg-gradient-to-r
                                from-[#255637]
                                via-[#326642]
                                to-[#44764f]
                                px-5
                                py-3
                                text-xs
                                font-black
                                text-[#f7f5ed]
                                shadow-[0_8px_20px_rgba(36,87,52,0.20)]
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:shadow-[0_13px_28px_rgba(36,87,52,0.28)]
                                active:translate-y-0
                                active:scale-[0.98]
                            "
                        >

                            Explore Dinosaur

                            <ArrowUpRight
                                size={15}
                            />

                        </Link>

                    </div>

                </motion.div>

            </AnimatePresence>

        </aside>

    );

};


/* =============================================================
   INFORMATION ROW
============================================================= */

const InformationRow = ({
    icon: Icon,
    title,
    primary
}) => {

    return (

        <div
            className="
                mb-4
                flex
                items-start
                gap-3
            "
        >

            {/* ICON */}

            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#31583d]/18
                    bg-[#dbe5d9]
                    text-[#356344]
                    shadow-[0_3px_10px_rgba(38,79,49,0.08)]
                "
            >

                <Icon
                    size={15}
                />

            </div>


            {/* TEXT */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <span
                    className="
                        block
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-[#718075]
                    "
                >
                    {title}
                </span>


                <span
                    className="
                        mt-0.5
                        block
                        text-[11px]
                        font-bold
                        leading-relaxed
                        text-[#294633]
                    "
                >
                    {primary}
                </span>

            </div>

        </div>

    );

};


export default FeaturedDinosaurPanel;