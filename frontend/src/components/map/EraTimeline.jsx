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
                border-[#31583d]/18
                bg-gradient-to-b
                from-[#e9ede4]
                via-[#e4e9df]
                to-[#e8e9df]
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
                    -left-28
                    -top-28
                    h-80
                    w-80
                    rounded-full
                    bg-[#456d4e]/12
                    blur-[90px]
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    right-0
                    h-80
                    w-80
                    rounded-full
                    bg-[#aa8a50]/10
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
                                text-[#967642]
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
                            text-2xl
                            font-black
                            tracking-tight
                            text-[#1d402a]
                            sm:text-[28px]
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
                            text-[#627066]
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
                            rounded-xl
                            border
                            border-[#31583d]/20
                            bg-[#f4f6ef]/90
                            px-3.5
                            py-2.5
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.08em]
                            text-[#45604d]
                            shadow-[0_5px_15px_rgba(35,70,45,0.08)]
                            transition-all
                            duration-200
                            hover:border-[#31583d]/35
                            hover:bg-[#fafbf7]
                            hover:text-[#285238]
                            hover:shadow-md
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
                        bg-[#b3bdb1]
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
                        bg-[#77835a]
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
                        bg-[#3f704a]
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
                        bg-[#4f6f58]
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

                                                    : "text-[#718078]"
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
                                                    h-11
                                                    w-11
                                                    animate-pulse
                                                    rounded-full
                                                    bg-[#356844]/18
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

                                                        ? "scale-110 border-[#285f39] bg-[#356844] shadow-[0_0_0_5px_rgba(40,95,57,0.12)]"

                                                        : "border-[#718271] bg-[#e8ede5] group-hover:border-[#386747]"
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

                                                    ? `
                                                        border-[#356844]/35
                                                        bg-[#f5f7f1]
                                                        shadow-[0_10px_26px_rgba(38,81,49,0.14)]
                                                        ring-1
                                                        ring-[#356844]/8
                                                    `

                                                    : `
                                                        border-[#31583d]/12
                                                        bg-[#e1e7de]/75
                                                        shadow-[0_4px_14px_rgba(35,68,44,0.04)]
                                                        group-hover:border-[#31583d]/25
                                                        group-hover:bg-[#edf1e9]
                                                        group-hover:shadow-[0_8px_20px_rgba(35,68,44,0.08)]
                                                    `
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
                                                text-[#6d786f]
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
                                                mt-2.5
                                                flex
                                                items-center
                                                gap-1
                                                rounded-full
                                                bg-[#dce9dc]/70
                                                px-2
                                                py-1
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
                                bg-[#f0e9df]
                                shadow-[0_0_0_5px_rgba(142,103,78,0.10)]
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
                                border-[#936c52]/12
                                bg-[#eee5d9]/75
                                px-3
                                py-3
                                shadow-[0_5px_16px_rgba(111,78,57,0.06)]
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
                                    text-[#796f66]
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
                        text-[#718078]
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