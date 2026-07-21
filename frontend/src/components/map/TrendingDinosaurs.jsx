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
                border-[#294d35]/15
                bg-[#dedacf]
                px-5
                py-8
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
                    -left-24
                    bottom-0
                    h-60
                    w-60
                    rounded-full
                    bg-[#4f7354]/8
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-56
                    w-56
                    rounded-full
                    bg-[#a78b54]/8
                    blur-3xl
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
                                text-[#3e704a]
                            "
                        />


                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-[#748078]
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
                            text-[#1d402a]
                            sm:text-2xl
                        "
                    >
                        Trending Dinosaurs
                    </h2>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-1.5
                            max-w-xl
                            text-[11px]
                            font-medium
                            leading-relaxed
                            text-[#6f7970]
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
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-[#56705c]
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
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_15px_30px_rgba(29,64,42,0.14)]
                                    active:translate-y-0
                                    active:scale-[0.99]

                                    ${
                                        isActive

                                            ? "border-[#2f6841]/35 bg-[#f2eee5] ring-2 ring-[#2f6841]/15"

                                            : "border-[#31543b]/15 bg-[#eae6dc] hover:border-[#31543b]/30"
                                    }
                                `}
                            >

                                {/* =================================
                                    DINOSAUR IMAGE
                                ================================= */}

                                <div
                                    className="
                                        relative
                                        aspect-[16/10]
                                        overflow-hidden
                                        bg-[#526b54]
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
                                                group-hover:scale-105
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
                                                from-[#526b54]
                                                to-[#294c35]
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
                                            from-[#142c1d]/75
                                            via-transparent
                                            to-transparent
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
                                            border-white/15
                                            bg-[#1d422b]/85
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
                                                text-[#d5ba70]
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
                                                border-white/15
                                                bg-[#285f39]/90
                                                px-2
                                                py-1
                                                text-[7px]
                                                font-black
                                                uppercase
                                                tracking-[0.1em]
                                                text-[#f4f0e7]
                                                shadow-sm
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
                                                text-base
                                                font-black
                                                tracking-tight
                                                text-[#f4f0e7]
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
                                        px-3.5
                                        pb-3.5
                                        pt-3
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
                                            text-[#6e786f]
                                        "
                                    >

                                        <MapPin
                                            size={10}
                                            className="
                                                shrink-0
                                                text-[#487052]
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
                                            border-[#31543b]/10
                                            pt-2.5
                                        "
                                    >

                                        <span
                                            className="
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.1em]
                                                text-[#66756a]
                                                transition-colors
                                                group-hover:text-[#315e3d]
                                            "
                                        >
                                            Locate Dinosaur
                                        </span>


                                        <div
                                            className="
                                                flex
                                                h-6
                                                w-6
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#d6d6ca]
                                                text-[#396247]
                                                transition-all
                                                duration-300
                                                group-hover:bg-[#285f39]
                                                group-hover:text-[#f5f1e8]
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