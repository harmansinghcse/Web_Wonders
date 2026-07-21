import {
    Clock3,
    RotateCcw,
    Sparkles
} from "lucide-react";


const EraTimeline = ({
    selectedEra,
    setSelectedEra
}) => {

    /* =========================================================
       TIMELINE ERAS
    ========================================================= */

    const timelineEras = [

        {
            name: "Triassic",
            years: "252–201 MYA",
            range: "252",
            description:
                "The dawn of the dinosaurs",
            position: "start"
        },

        {
            name: "Jurassic",
            years: "201–145 MYA",
            range: "201",
            description:
                "Age of the giants",
            position: "middle"
        },

        {
            name: "Cretaceous",
            years: "145–66 MYA",
            range: "145",
            description:
                "Dinosaurs at their peak",
            position: "end"
        }

    ];


    /* =========================================================
       SELECT ERA
    ========================================================= */

    const handleSelectEra = (
        eraName
    ) => {

        /*
         * Clicking the currently selected era
         * again removes the filter.
         */

        if (
            selectedEra === eraName
        ) {

            setSelectedEra("");

            return;

        }


        setSelectedEra(
            eraName
        );


        /*
         * After choosing an era,
         * move the visitor back to the map.
         */

        setTimeout(() => {

            document
                .getElementById(
                    "interactive-map-section"
                )
                ?.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

        }, 180);

    };


    /* =========================================================
       SHOW ALL ERAS
    ========================================================= */

    const handleShowAll = () => {

        setSelectedEra("");

    };


    return (

        <section
            id="era-timeline-section"
            className="
                relative
                overflow-hidden
                border-t
                border-[#294d35]/15
                bg-[#e8e3d7]
                px-5
                py-7
                sm:px-8
                lg:px-10
            "
        >

            {/* =================================================
                SUBTLE BACKGROUND EFFECTS
            ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    bg-[#56775a]/10
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-28
                    right-0
                    h-64
                    w-64
                    rounded-full
                    bg-[#a68a52]/8
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
                    mb-7
                    flex
                    flex-col
                    gap-4
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

                        <Clock3
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
                            Journey Through Time
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
                        Explore the Dinosaur Eras
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
                        Travel across millions of years
                        and discover how dinosaurs changed
                        throughout the Mesozoic Era.
                    </p>

                </div>


                {/* SHOW ALL */}

                {selectedEra && (

                    <button
                        type="button"
                        onClick={
                            handleShowAll
                        }
                        className="
                            flex
                            w-fit
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-[#31583c]/15
                            bg-[#f0ece3]
                            px-3
                            py-2
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.08em]
                            text-[#49604f]
                            shadow-sm
                            transition-all
                            hover:border-[#31583c]/30
                            hover:bg-[#f5f1e8]
                            hover:text-[#285238]
                            active:scale-[0.97]
                        "
                    >

                        <RotateCcw
                            size={11}
                        />

                        Show All Eras

                    </button>

                )}

            </div>


            {/* =================================================
                TIMELINE
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-5xl
                "
            >

                {/* =============================================
                    DESKTOP TIMELINE LINE
                ============================================= */}

                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        top-[49px]
                        hidden
                        h-[3px]
                        rounded-full
                        bg-[#b5b4a8]
                        md:block
                    "
                />


                {/* =============================================
                    TIMELINE COLORED SEGMENTS
                ============================================= */}

                <div
                    className="
                        absolute
                        left-[8%]
                        top-[49px]
                        hidden
                        h-[3px]
                        w-[28%]
                        rounded-l-full
                        bg-[#627c55]
                        md:block
                    "
                />


                <div
                    className="
                        absolute
                        left-[36%]
                        top-[49px]
                        hidden
                        h-[3px]
                        w-[28%]
                        bg-[#47704c]
                        md:block
                    "
                />


                <div
                    className="
                        absolute
                        left-[64%]
                        top-[49px]
                        hidden
                        h-[3px]
                        w-[28%]
                        rounded-r-full
                        bg-[#8a684b]
                        md:block
                    "
                />


                {/* =============================================
                    ERA CARDS
                ============================================= */}

                <div
                    className="
                        relative
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-4
                        md:gap-4
                    "
                >

                    {timelineEras.map(
                        (
                            era,
                            index
                        ) => {

                            const isActive =
                                selectedEra ===
                                era.name;


                            return (

                                <button
                                    key={
                                        era.name
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleSelectEra(
                                            era.name
                                        )
                                    }
                                    className="
                                        group
                                        relative
                                        flex
                                        min-h-[150px]
                                        flex-col
                                        items-center
                                        rounded-2xl
                                        px-3
                                        pb-4
                                        pt-3
                                        text-center
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                    "
                                >

                                    {/* =================================
                                        MILLION YEARS
                                    ================================= */}

                                    <span
                                        className={`
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.13em]
                                            transition-colors

                                            ${
                                                isActive

                                                    ? "text-[#2d5d3b]"

                                                    : "text-[#7c847d]"
                                            }
                                        `}
                                    >
                                        {
                                            era.years
                                        }
                                    </span>


                                    {/* =================================
                                        TIMELINE NODE
                                    ================================= */}

                                    <div
                                        className="
                                            relative
                                            z-10
                                            mt-4
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        {/* ACTIVE GLOW */}

                                        {isActive && (

                                            <span
                                                className="
                                                    absolute
                                                    h-10
                                                    w-10
                                                    animate-pulse
                                                    rounded-full
                                                    bg-[#356844]/15
                                                "
                                            />

                                        )}


                                        {/* NODE */}

                                        <span
                                            className={`
                                                relative
                                                flex
                                                h-6
                                                w-6
                                                items-center
                                                justify-center
                                                rounded-full
                                                border-[3px]
                                                shadow-sm
                                                transition-all
                                                duration-300

                                                ${
                                                    isActive

                                                        ? "scale-110 border-[#285f39] bg-[#f4f0e7] shadow-[0_0_0_5px_rgba(40,95,57,0.12)]"

                                                        : "border-[#718271] bg-[#e8e3d7] group-hover:border-[#386747]"
                                                }
                                            `}
                                        >

                                            <span
                                                className={`
                                                    h-2
                                                    w-2
                                                    rounded-full

                                                    ${
                                                        isActive

                                                            ? "bg-[#285f39]"

                                                            : "bg-[#718271]"
                                                    }
                                                `}
                                            />

                                        </span>

                                    </div>


                                    {/* =================================
                                        ERA CARD
                                    ================================= */}

                                    <div
                                        className={`
                                            mt-4
                                            w-full
                                            rounded-xl
                                            border
                                            px-3
                                            py-3
                                            transition-all
                                            duration-300

                                            ${
                                                isActive

                                                    ? "border-[#356844]/30 bg-[#f2eee5] shadow-[0_8px_22px_rgba(38,81,49,0.12)]"

                                                    : "border-[#31533b]/10 bg-[#dedacf]/55 group-hover:border-[#31533b]/20 group-hover:bg-[#e5e1d7]"
                                            }
                                        `}
                                    >

                                        <h3
                                            className={`
                                                font-serif
                                                text-sm
                                                font-black
                                                transition-colors

                                                ${
                                                    isActive

                                                        ? "text-[#245a37]"

                                                        : "text-[#344e3b]"
                                                }
                                            `}
                                        >
                                            {
                                                era.name
                                            }
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                font-medium
                                                leading-relaxed
                                                text-[#7b837c]
                                            "
                                        >
                                            {
                                                era.description
                                            }
                                        </p>

                                    </div>


                                    {/* SELECTED INDICATOR */}

                                    {isActive && (

                                        <div
                                            className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-1
                                                text-[8px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-[#356844]
                                            "
                                        >

                                            <Sparkles
                                                size={9}
                                            />

                                            Viewing on Map

                                        </div>

                                    )}

                                </button>

                            );

                        }
                    )}


                    {/* =========================================
                        EXTINCTION EVENT
                    ========================================= */}

                    <div
                        className="
                            relative
                            flex
                            min-h-[150px]
                            flex-col
                            items-center
                            rounded-2xl
                            px-3
                            pb-4
                            pt-3
                            text-center
                        "
                    >

                        {/* DATE */}

                        <span
                            className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.13em]
                                text-[#8c7668]
                            "
                        >
                            66 MYA
                        </span>


                        {/* NODE */}

                        <div
                            className="
                                relative
                                z-10
                                mt-4
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center
                                rounded-full
                                border-[3px]
                                border-[#8e674e]
                                bg-[#e8e3d7]
                                shadow-[0_0_0_5px_rgba(142,103,78,0.08)]
                            "
                        >

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#8e674e]
                                "
                            />

                        </div>


                        {/* EVENT CARD */}

                        <div
                            className="
                                mt-4
                                w-full
                                rounded-xl
                                border
                                border-[#936c52]/15
                                bg-[#dfd7ca]/60
                                px-3
                                py-3
                            "
                        >

                            <h3
                                className="
                                    font-serif
                                    text-sm
                                    font-black
                                    text-[#795945]
                                "
                            >
                                Mass Extinction
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    font-medium
                                    leading-relaxed
                                    text-[#857a70]
                                "
                            >
                                The end of the age
                                of non-avian dinosaurs
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                FOOTER NOTE
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    mt-5
                    text-center
                "
            >

                <p
                    className="
                        text-[9px]
                        font-medium
                        text-[#818981]
                    "
                >
                    Select an era to filter dinosaur
                    discoveries displayed on the map.
                </p>

            </div>

        </section>

    );

};


export default EraTimeline;