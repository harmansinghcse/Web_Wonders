import {
    Map,
    Clock3,
    Layers3,
    Globe2,
    Search,
    RotateCcw,
    ChevronDown,
    Footprints,
    Utensils
} from "lucide-react";


const ExploreErasPanel = ({
    searchQuery,
    setSearchQuery,

    selectedEra,
    setSelectedEra,

    selectedDiet,
    setSelectedDiet,

    selectedCountry,
    setSelectedCountry,

    eras = [],
    diets = [],
    countries = [],

    dinosaurs = [],

    onSearch,
    onReset
}) => {

    /* =========================================================
       SEARCH DINOSAUR
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        onSearch(searchQuery);

    };


    /* =========================================================
       GO TO TIMELINE
    ========================================================= */

    const handleTimelineView = () => {

        document
            .getElementById("era-timeline-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

    };


    /* =========================================================
       VIEW ALL DINOSAURS
    ========================================================= */

    const handleViewAll = () => {

        onReset();

        document
            .getElementById("interactive-map-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    };


    return (

        <aside
            className="
                relative
                z-20
                flex
                flex-col
                border-r
                border-[#31583d]/16
                bg-gradient-to-b
                from-[#F1F4EB]
                via-[#EAF0E6]
                to-[#E4EBE0]
                shadow-[8px_0_28px_rgba(31,81,51,0.07)]
                xl:min-h-[650px]
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    border-b
                    border-[#31583d]/15
                    bg-gradient-to-br
                    from-[#E4EDE0]
                    via-[#EDF2E8]
                    to-[#F3F4EC]
                    px-5
                    pb-5
                    pt-6
                "
            >

                <span
                    className="
                        block
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.22em]
                        text-[#967642]
                    "
                >
                    Prehistoric World
                </span>


                <h2
                    className="
                        mt-1
                        font-serif
                        text-2xl
                        font-black
                        tracking-tight
                        text-[#1F5133]
                    "
                >
                    Explore Eras
                </h2>


                <p
                    className="
                        mt-1.5
                        text-[11px]
                        font-medium
                        leading-relaxed
                        text-[#607064]
                    "
                >
                    Explore dinosaur discoveries across
                    prehistoric eras and locations.
                </p>

            </div>


            {/* =================================================
                MAP / TIMELINE VIEW
            ================================================= */}

            <div className="px-4 pt-5">

                <div
                    className="
                        grid
                        grid-cols-2
                        rounded-xl
                        border
                        border-[#327044]/16
                        bg-[#DDE9D8]/80
                        p-1
                        shadow-inner
                    "
                >

                    {/* MAP VIEW */}

                    <button
                        type="button"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-gradient-to-r
                            from-[#2C653C]
                            via-[#3E7B45]
                            to-[#5F963F]
                            px-3
                            py-2.5
                            text-[11px]
                            font-bold
                            text-[#f5f4ec]
                            shadow-[0_5px_14px_rgba(32,81,48,0.22)]
                            transition
                            active:scale-[0.98]
                        "
                    >

                        <Map size={14} />

                        Map View

                    </button>


                    {/* TIMELINE VIEW */}

                    <button
                        type="button"
                        onClick={handleTimelineView}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            px-3
                            py-2.5
                            text-[11px]
                            font-bold
                            text-[#496452]
                            transition
                            hover:bg-[#F5F3E9]/80
                            hover:text-[#1F5133]
                            active:scale-[0.98]
                        "
                    >

                        <Clock3 size={14} />

                        Timeline

                    </button>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="
                    space-y-4
                    px-4
                    py-5
                    bg-[#EDF2E8]/55
                "
            >

                {/* ERA */}

                <PanelSelect
                    label="Era"
                    icon={Layers3}
                    value={selectedEra}
                    onChange={setSelectedEra}
                    options={eras}
                    placeholder="All Eras"
                />


                {/* DIET */}

                <PanelSelect
                    label="Diet"
                    icon={Utensils}
                    value={selectedDiet}
                    onChange={setSelectedDiet}
                    options={diets}
                    placeholder="All Diets"
                />


                {/* COUNTRY / LOCATION */}

                <PanelSelect
                    label="Location"
                    icon={Globe2}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    options={countries}
                    placeholder="All Locations"
                />

            </div>


            {/* =================================================
                FIND DINOSAUR
            ================================================= */}

            <div
                className="
                    border-t
                    border-[#31583d]/15
                    px-4
                    pb-5
                    pt-5
                "
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-[#31583d]/20
                        bg-[#f0f3ea]
                        p-3.5
                        shadow-[0_8px_22px_rgba(32,72,45,0.09)]
                    "
                >

                <div
                    className="
                        mb-2.5
                        flex
                        items-center
                        gap-2
                    "
                >

                    <Search
                        size={14}
                        className="text-[#967642]"
                    />


                    <span
                        className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-[#31543c]
                        "
                    >
                        Find Dinosaur
                    </span>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="relative"
                >

                    <Search
                        size={14}
                        className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-[#627767]
                        "
                    />


                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="e.g. Brachiosaurus"
                        list="dinosaur-search-options"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-[#31533b]/20
                            bg-[#fafbf7]
                            py-3
                            pl-9
                            pr-3
                            text-[11px]
                            font-semibold
                            text-[#203e2b]
                            outline-none
                            transition-all
                            placeholder:text-[#879188]
                            hover:border-[#31583d]/35
                            focus:border-[#5F963F]/55
                            focus:ring-4
                            focus:ring-[#5F963F]/10
                        "
                    />


                    <datalist id="dinosaur-search-options">

                        {dinosaurs.map((dinosaur) => (

                            <option
                                key={dinosaur.id}
                                value={dinosaur.name}
                            />

                        ))}

                    </datalist>

                </form>


                <button
                    type="button"
                    onClick={() =>
                        onSearch(searchQuery)
                    }
                    disabled={!searchQuery.trim()}
                    className="
                        mt-2.5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#214b30]/15
                        bg-gradient-to-r
                        from-[#28583a]
                        via-[#356844]
                        to-[#447650]
                        px-4
                        py-2.5
                        text-[11px]
                        font-black
                        tracking-[0.03em]
                        text-[#f8f7f0]
                        shadow-[0_8px_20px_rgba(34,78,48,0.20)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_12px_26px_rgba(34,78,48,0.28)]
                        active:translate-y-0
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >

                    <Search size={13} />

                    Locate Dinosaur

                </button>

            </div>
        </div>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div
                className="
                    mt-auto
                    border-t
                    border-[#274a34]/15
                    bg-[#E4EBE0]/75
                    px-4
                    py-4
                "
            >

                <button
                    type="button"
                    onClick={handleViewAll}
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#9a7843]/30
                        bg-[#F5F0E3]/90
                        px-4
                        py-2.5
                        text-[11px]
                        font-bold
                        text-[#765A2B]
                        shadow-sm
                        transition-all
                        duration-200
                        hover:border-[#9a7843]/45
                        hover:bg-[#FAF3E2]
                        hover:shadow-md
                        active:scale-[0.98]
                    "
                >

                    <Footprints size={14} />

                    View All Dinosaurs

                </button>


                <button
                    type="button"
                    onClick={onReset}
                    className="
                        mt-2
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        px-4
                        py-2
                        text-[10px]
                        font-bold
                        text-[#5B6E60]
                        transition
                        hover:bg-[#D6E3D4]/80
                        hover:text-[#284d34]
                    "
                >

                    <RotateCcw size={12} />

                    Reset Filters

                </button>

            </div>

        </aside>

    );

};


/* =============================================================
   REUSABLE FILTER SELECT
============================================================= */

const PanelSelect = ({
    label,
    icon: Icon,
    value,
    onChange,
    options = [],
    placeholder
}) => {

    return (

        <div>

            <label
                className="
                    mb-1.5
                    flex
                    items-center
                    gap-1.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#4f6656]
                "
            >

                <Icon
                    size={12}
                    className="text-[#4D814F]"
                />

                {label}

            </label>


            <div className="relative">

                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className={`
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        px-3
                        py-2.5
                        pr-9
                        text-[11px]
                        font-bold
                        outline-none
                        transition-all
                        duration-200
                        focus:border-[#3d7049]/60
                        focus:ring-4
                        focus:ring-[#3d7049]/10

                        ${
                            value
                                ? `
                                    border-[#5F963F]/35
                                    bg-[#DDE9D8]
                                    text-[#285A36]
                                    shadow-[0_4px_12px_rgba(45,86,55,0.08)]
                                `
                                : `
                                    border-[#31583d]/18
                                    bg-[#F8F9F4]
                                    text-[#344b3a]
                                    hover:border-[#31583d]/30
                                `
                        }
                    `}
                >

                    <option value="">
                        {placeholder}
                    </option>


                    {options.map((option) => (

                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>

                    ))}

                </select>


                <ChevronDown
                    size={14}
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-[#58705f]
                    "
                />

            </div>

        </div>

    );

};


export default ExploreErasPanel;