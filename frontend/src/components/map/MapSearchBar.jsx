import {
    Search,
    Navigation,
    X,
    MapPin
} from "lucide-react";


const MapSearchBar = ({
    searchQuery,
    setSearchQuery,
    dinosaurs = [],
    onSearch
}) => {

    /* =========================================================
       SUBMIT SEARCH
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        onSearch(searchQuery);

    };


    /* =========================================================
       CLEAR SEARCH
    ========================================================= */

    const handleClear = () => {

        setSearchQuery("");

    };


    return (

        <section
            className="
                border-t
                border-[#294d35]/15
                bg-[#dfdbd0]
                px-5
                py-5
                sm:px-8
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    max-w-5xl
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                "
            >

                {/* =================================================
                    LEFT LABEL
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-3
                        md:min-w-[190px]
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#31583c]/15
                            bg-[#d1d2c5]
                            text-[#326442]
                            shadow-sm
                        "
                    >

                        <Navigation
                            size={17}
                        />

                    </div>


                    <div>

                        <span
                            className="
                                block
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.18em]
                                text-[#788078]
                            "
                        >
                            Explore the Map
                        </span>


                        <h3
                            className="
                                mt-0.5
                                font-serif
                                text-sm
                                font-black
                                text-[#21422d]
                            "
                        >
                            Find a Dinosaur
                        </h3>

                    </div>

                </div>


                {/* =================================================
                    SEARCH FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        min-w-0
                        flex-1
                        gap-2
                    "
                >

                    {/* =============================================
                        INPUT
                    ============================================= */}

                    <div
                        className="
                            relative
                            min-w-0
                            flex-1
                        "
                    >

                        <Search
                            size={16}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[#788279]
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
                            placeholder="Search Tyrannosaurus, Triceratops, Brachiosaurus..."
                            list="map-dinosaur-search-options"
                            autoComplete="off"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-[#31543b]/20
                                bg-[#f3efe6]
                                py-3.5
                                pl-11
                                pr-10
                                text-xs
                                font-semibold
                                text-[#253f2e]
                                outline-none
                                shadow-sm
                                transition-all
                                placeholder:text-[#929990]
                                focus:border-[#3b7249]
                                focus:ring-4
                                focus:ring-[#3b7249]/10
                            "
                        />


                        {/* =========================================
                            CLEAR BUTTON
                        ========================================= */}

                        {searchQuery && (

                            <button
                                type="button"
                                onClick={
                                    handleClear
                                }
                                aria-label="Clear dinosaur search"
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    flex
                                    h-6
                                    w-6
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-[#7c847d]
                                    transition
                                    hover:bg-[#dedacf]
                                    hover:text-[#294a34]
                                "
                            >

                                <X
                                    size={13}
                                />

                            </button>

                        )}


                        {/* =========================================
                            DINOSAUR AUTOCOMPLETE
                        ========================================= */}

                        <datalist
                            id="map-dinosaur-search-options"
                        >

                            {dinosaurs.map(
                                (dinosaur) => (

                                    <option
                                        key={
                                            dinosaur.id
                                        }
                                        value={
                                            dinosaur.name
                                        }
                                    />

                                )
                            )}

                        </datalist>

                    </div>


                    {/* =============================================
                        SEARCH BUTTON
                    ============================================= */}

                    <button
                        type="submit"
                        disabled={
                            !searchQuery.trim()
                        }
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#285f39]
                            px-4
                            text-xs
                            font-black
                            text-[#f8f4ea]
                            shadow-md
                            transition-all
                            duration-300
                            hover:bg-[#214f30]
                            hover:shadow-lg
                            active:scale-[0.97]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                            sm:px-6
                        "
                    >

                        <MapPin
                            size={15}
                        />


                        <span
                            className="
                                hidden
                                sm:inline
                            "
                        >
                            Locate
                        </span>

                    </button>

                </form>

            </div>

        </section>

    );

};


export default MapSearchBar;