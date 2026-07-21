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
                border-[#274a34]/15
                bg-[#e8e3d7]
                xl:min-h-[650px]
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    border-b
                    border-[#274a34]/15
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
                        text-[#70806f]
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
                        text-[#183b27]
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
                        text-[#687269]
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
                        border-[#31533b]/15
                        bg-[#d9d5c9]
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
                            bg-[#245d38]
                            px-3
                            py-2.5
                            text-[11px]
                            font-bold
                            text-[#f5f1e8]
                            shadow-md
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
                            text-[#55635a]
                            transition
                            hover:bg-[#ece8de]
                            hover:text-[#234c31]
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
                    border-[#274a34]/15
                    px-4
                    pb-5
                    pt-5
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
                        className="text-[#2f6640]"
                    />


                    <span
                        className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-[#526159]
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
                            text-[#788078]
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
                            bg-[#f2eee5]
                            py-3
                            pl-9
                            pr-3
                            text-[11px]
                            font-semibold
                            text-[#243c2c]
                            outline-none
                            transition
                            placeholder:text-[#92988f]
                            focus:border-[#3d7049]
                            focus:ring-4
                            focus:ring-[#3d7049]/10
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
                        bg-[#285f39]
                        px-4
                        py-2.5
                        text-[11px]
                        font-bold
                        text-[#f8f4ea]
                        shadow-md
                        transition-all
                        hover:bg-[#214f30]
                        hover:shadow-lg
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >

                    <Search size={13} />

                    Locate Dinosaur

                </button>

            </div>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div
                className="
                    mt-auto
                    border-t
                    border-[#274a34]/15
                    bg-[#dedacf]/60
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
                        border-[#31583c]/20
                        bg-[#f1ede4]
                        px-4
                        py-2.5
                        text-[11px]
                        font-bold
                        text-[#295237]
                        shadow-sm
                        transition-all
                        hover:border-[#31583c]/35
                        hover:bg-[#f6f2e9]
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
                        text-[#737b73]
                        transition
                        hover:bg-[#d3d0c6]
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
                    text-[#657168]
                "
            >

                <Icon
                    size={12}
                    className="text-[#3d6b48]"
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
                    className="
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-[#31533b]/15
                        bg-[#f1ede4]
                        px-3
                        py-2.5
                        pr-9
                        text-[11px]
                        font-bold
                        text-[#344b3a]
                        outline-none
                        transition
                        focus:border-[#3d7049]
                        focus:ring-4
                        focus:ring-[#3d7049]/10
                    "
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
                        text-[#66736a]
                    "
                />

            </div>

        </div>

    );

};


export default ExploreErasPanel;