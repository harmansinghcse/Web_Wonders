import {
    MapPin,
    CalendarDays,
    TrendingUp,
    ArrowRight,
    Compass
} from "lucide-react";

import {
    getOptimizedImageUrl
} from "../../utils/imageHelper";


const TrendingDinosaurs = ({
    dinosaurs = [],
    activeDinosaurId,
    onSelectDinosaur
}) => {

    /* =========================================================
       DON'T RENDER IF THERE IS NO DATA
    ========================================================= */

    if (!dinosaurs.length) {
        return null;
    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <section
            className="
                relative
                overflow-hidden
                border-t
                border-[#31583d]/18
                bg-gradient-to-b
                from-[#E4EBE0]
                via-[#E9EFE4]
                to-[#DDE9D8]
                px-5
                py-9
                sm:px-8
                lg:px-10
            "
        >

            {/* =================================================
                SUBTLE BACKGROUND DECORATION
            ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-28
                    bottom-0
                    h-72
                    w-72
                    rounded-full
                    bg-[#5F963F]/11
                    blur-[100px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-72
                    w-72
                    rounded-full
                    bg-[#C49A45]/10
                    blur-[100px]
                "
            />


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    mb-6
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >

                <div>

                    {/* SMALL LABEL */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <TrendingUp
                            size={13}
                            className="
                                text-[#4D814F]
                            "
                        />


                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-[#9A793A]
                            "
                        >
                            Popular Discoveries
                        </span>

                    </div>


                    {/* TITLE */}

                    <h2
                        className="
                            mt-1.5
                            font-serif
                            text-xl
                            font-black
                            tracking-tight
                            text-[#1F5133]
                            sm:text-[28px]
                        "
                    >
                        Famous Dinosaurs
                    </h2>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-1.5
                            max-w-xl
                            text-[11px]
                            font-medium
                            leading-relaxed
                            text-[#607064]
                        "
                    >
                        Explore some of the most famous
                        dinosaurs and locate their discoveries
                        across the prehistoric world.
                    </p>

                </div>


                {/* EXPLORE LABEL */}

                <div
                    className="
                        hidden
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#327044]/15
                        bg-[#F5F3E9]/70
                        px-3
                        py-1.5
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-[#496A52]
                        sm:flex
                    "
                >

                    <Compass
                        size={12}
                    />

                    Select to locate on map

                </div>

            </div>


            {/* =================================================
                DINOSAUR CARDS
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-5
                "
            >

                {dinosaurs.map(
                    (dinosaur) => {

                        const isActive =
                            activeDinosaurId ===
                            dinosaur.id;


                        const optimizedImage =
                            getOptimizedImageUrl(
                                dinosaur.image,
                                500
                            );


                        const displayPeriod =
                            dinosaur.period ||
                            dinosaur.era ||
                            "Prehistoric";


                        const displayLocation =
                            dinosaur.country ||
                            dinosaur.region ||
                            "Unknown Location";


                        return (

                            <button
                                key={
                                    dinosaur.id
                                }
                                type="button"
                                onClick={() =>
                                    onSelectDinosaur(
                                        dinosaur
                                    )
                                }
                                className={`
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    text-left
                                    shadow-sm
                                    transition-[0_5px_16px_rgba(30,64,40,0.07)]
                                    duration-300
                                    hover:-translate-y-1.5
                                    hover:shadow-[0_18px_36px_rgba(31,81,51,0.16)]
                                    active:translate-y-0
                                    active:scale-[0.99]

                                    ${
                                        isActive

                                            ?  `
                                                border-[#5F963F]/40
                                                bg-[#F7F8F3]
                                                ring-2
                                                ring-[#5F963F]/15
                                                shadow-[0_14px_32px_rgba(48,112,64,0.16)]
                                            `

                                            : `
                                                border-[#327044]/15
                                                bg-[#F3F5EE]/90
                                                hover:border-[#5F963F]/30
                                            `
                                    }
                                `}
                            >

                                {/* =================================
                                    DINOSAUR IMAGE
                                ================================= */}

                                <div
                                    className="
                                        relative
                                        aspect-[16/11]
                                        overflow-hidden
                                        bg-[#42634A]
                                    "
                                >

                                    {optimizedImage ? (

                                        <img
                                            src={
                                                optimizedImage
                                            }
                                            alt={
                                                dinosaur.name
                                            }
                                            loading="lazy"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition-transform
                                                duration-700
                                                group-hover:scale-[1.07]
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
                                                from-[#4b7052]
                                                via-[#365b40]
                                                to-[#213e2b]
                                            "
                                        >

                                            <span
                                                className="
                                                    font-serif
                                                    text-xs
                                                    font-black
                                                    uppercase
                                                    tracking-[0.16em]
                                                    text-[#e7e3d8]/70
                                                "
                                            >
                                                Dinosaur
                                            </span>

                                        </div>

                                    )}


                                    {/* IMAGE GRADIENT */}

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            bg-gradient-to-t
                                            from-[#102719]/82
                                            via-[#173521]/10
                                            to-black/5
                                        "
                                    />


                                    {/* PERIOD BADGE */}

                                    <span
                                        className="
                                            absolute
                                            left-3
                                            top-3
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-lg
                                            border
                                            border-[#C49A45]/30
                                            bg-[#1F5133]/88
                                            px-2
                                            py-1
                                            text-[8px]
                                            font-black
                                            uppercase
                                            tracking-[0.1em]
                                            text-[#f3efe6]
                                            shadow-sm
                                            backdrop-blur-md
                                        "
                                    >

                                        <CalendarDays
                                            size={9}
                                            className="
                                                text-[#D9B75F]
                                            "
                                        />

                                        {
                                            displayPeriod
                                        }

                                    </span>


                                    {/* ACTIVE INDICATOR */}

                                    {isActive && (

                                        <span
                                            className="
                                                absolute
                                                right-3
                                                top-3
                                                flex
                                                items-center
                                                gap-1
                                                rounded-full
                                                border
                                                border-white/20
                                                bg-[#327044]/92
                                                px-2
                                                py-1
                                                text-[7px]
                                                font-black
                                                uppercase
                                                tracking-[0.1em]
                                                text-[#f4f0e7]
                                                shadow-[0_4px_12px_rgba(31,81,51,0.20)]
                                                backdrop-blur-md
                                            "
                                        >

                                            <MapPin
                                                size={8}
                                            />

                                            On Map

                                        </span>

                                    )}


                                    {/* NAME OVER IMAGE */}

                                    <div
                                        className="
                                            absolute
                                            bottom-3
                                            left-3
                                            right-3
                                        "
                                    >

                                        <h3
                                            className="
                                                truncate
                                                font-serif
                                                text-[17px]
                                                font-black
                                                tracking-tight
                                                text-[#f6f3e9]
                                                drop-shadow-md
                                            "
                                        >
                                            {
                                                dinosaur.name
                                            }
                                        </h3>

                                    </div>

                                </div>


                                {/* =================================
                                    CARD INFORMATION
                                ================================= */}

                                <div
                                    className="
                                        px-4
                                        pb-4
                                        pt-3.5
                                    "
                                >

                                    {/* LOCATION */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[9px]
                                            font-semibold
                                            text-[#607064]
                                        "
                                    >

                                        <MapPin
                                            size={10}
                                            className="
                                                shrink-0
                                                text-[#]]
                                            "
                                        />


                                        <span
                                            className="
                                                truncate
                                            "
                                        >
                                            {
                                                displayLocation
                                            }
                                        </span>

                                    </div>


                                    {/* LOCATE ACTION */}

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                            border-t
                                            border-[#327044]/14
                                            pt-2.5
                                        "
                                    >

                                        <span
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.1em]
                                                text-[#53685a]
                                                transition-colors
                                                group-hover:text-[#285d39]
                                            "
                                        >
                                            {isActive
                                                ? "Currently on Map"
                                                : "Locate Dinosaur"}
                                        </span>


                                        <div
                                            className="
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-[#327044]/14
                                                bg-[#DDE9D8]
                                                text-[#327044]
                                                transition-all
                                                duration-300
                                                group-hover:translate-x-0.5
                                                group-hover:border-[#5F963F]
                                                group-hover:bg-[#5F963F]
                                                group-hover:text-[#FFFDF5]
                                                group-hover:shadow-[0_5px_12px_rgba(40,95,57,0.20)]
                                            "
                                        >

                                            <ArrowRight
                                                size={11}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </button>

                        );

                    }
                )}

            </div>

        </section>

    );

};


export default TrendingDinosaurs;