import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/home_components/hero/Navbar";

import DinosaurMap from "../components/map/DinosaurMap";
import ExploreErasPanel from "../components/map/ExploreErasPanel";
import FeaturedDinosaurPanel from "../components/map/FeaturedDinosaurPanel";
import MapSearchBar from "../components/map/MapSearchBar";
import EraTimeline from "../components/map/EraTimeline";
import TrendingDinosaurs from "../components/map/TrendingDinosaurs";
import ProfessorRossFloating from "../components/map/ProfessorRossFloating";

import { getMapMarkers } from "../services/mapService";

import {
    AlertCircle,
    RefreshCw,
    Leaf,
    Beef,
    Apple,
    Landmark
} from "lucide-react";


export default function ExploreMap() {

    /* =========================================================
       MAP DATA
    ========================================================= */

    const [markers, setMarkers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    /* =========================================================
       FILTER STATES
    ========================================================= */

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedEra, setSelectedEra] = useState("");

    const [selectedDiet, setSelectedDiet] = useState("");

    const [selectedCountry, setSelectedCountry] = useState("");

    /* =========================================================
       ACTIVE DINOSAUR
    ========================================================= */

    const [
        activeDinosaurId,
        setActiveDinosaurId
    ] = useState(null);


    /* =========================================================
       MAP CAMERA
    ========================================================= */

    const [
        fitBoundsTrigger,
        setFitBoundsTrigger
    ] = useState(0);


    /* =========================================================
       LOAD DINOSAUR MARKERS
    ========================================================= */

    const loadMarkers = async () => {

        try {

            setLoading(true);

            setError(null);


            const data =
                await getMapMarkers();


            setMarkers(
                data || []
            );

        } catch (err) {

            console.error(
                "Failed to load dinosaur map:",
                err
            );


            setError(
                "Could not retrieve dinosaur locations. Please verify your connection."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadMarkers();

    }, []);


    /* =========================================================
       FILTER OPTIONS
    ========================================================= */

    const eras = useMemo(() => {

        return [
            ...new Set(
                markers.map(
                    (marker) =>
                        marker.era ||
                        marker.period
                )
            )
        ]
            .filter(Boolean)
            .sort();

    }, [markers]);


    const diets = useMemo(() => {

    return [
            ...new Set(
                markers.map(
                    (marker) =>
                        marker.diet
                )
            )
        ]
            .filter(Boolean)
            .sort();

    }, [markers]);


    const countries = useMemo(() => {

        return [
            ...new Set(
                markers.map(
                    (marker) =>
                        marker.country
                )
            )
        ]
            .filter(Boolean)
            .sort();

    }, [markers]);


    /* =========================================================
       FILTER MAP MARKERS
    ========================================================= */

    const filteredMarkers = useMemo(() => {

        const normalizedSearch =
            searchQuery
                .trim()
                .toLowerCase();


        return markers.filter(
            (marker) => {

                const markerName =
                    (
                        marker.name ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !normalizedSearch ||
                    markerName.includes(
                        normalizedSearch
                    );


                const markerEra =
                    (
                        marker.era ||
                        marker.period ||
                        ""
                    ).toLowerCase();


                const matchesEra =
                    !selectedEra ||
                    markerEra.includes(
                        selectedEra.toLowerCase()
                    );

                const markerDiet =
                    (
                        marker.diet ||
                        ""
                    ).toLowerCase();


                const matchesDiet =
                    !selectedDiet ||
                    markerDiet.includes(
                        selectedDiet
                            .toLowerCase()
                            .replace("ous", "")
                            .replace("ore", "")
                    );


                const matchesCountry =
                    !selectedCountry ||
                    marker.country === selectedCountry;


                return (
                    matchesSearch &&
                    matchesEra &&
                    matchesDiet &&
                    matchesCountry
                );

            }
        );

        }, [
            markers,
            searchQuery,
            selectedEra,
            selectedDiet,
            selectedCountry
        ]);


    /* =========================================================
       ACTIVE DINOSAUR OBJECT
    ========================================================= */

    const activeDinosaur =
        useMemo(() => {

            return (
                markers.find(
                    (marker) =>
                        marker.id ===
                        activeDinosaurId
                ) ||
                null
            );

        }, [
            markers,
            activeDinosaurId
        ]);


    /* =========================================================
       DEFAULT FEATURED DINOSAUR
    ========================================================= */

    const defaultFeaturedDinosaur =
        useMemo(() => {

            if (!markers.length) {

                return null;

            }


            const preferredDinosaurs = [

                "brachiosaurus",

                "tyrannosaurus-rex",

                "triceratops",

                "stegosaurus"

            ];


            for (
                const slug
                of preferredDinosaurs
            ) {

                const dinosaur =
                    markers.find(
                        (marker) =>
                            marker.slug === slug
                    );


                if (dinosaur) {

                    return dinosaur;

                }

            }


            return markers[0];

        }, [markers]);


    const featuredDinosaur =
        activeDinosaur ||
        defaultFeaturedDinosaur;


    /* =========================================================
       RESET FILTERS
    ========================================================= */

    const handleClearFilters = () => {

        setSearchQuery("");

        setSelectedEra("");

        setSelectedDiet("");

        setSelectedCountry("");

        setActiveDinosaurId(null);


        setFitBoundsTrigger(
            (previous) =>
                previous + 1
        );

    };


    /* =========================================================
       SEARCH DINOSAUR DIRECTLY
    ========================================================= */

    const handleSearchDinosaur = (
        query = searchQuery
    ) => {

        const normalizedQuery =
            query
                .trim()
                .toLowerCase();


        if (!normalizedQuery) {

            return;

        }


        /*
         * First try exact dinosaur name.
         */

        let dinosaur =
            markers.find(
                (marker) =>
                    (
                        marker.name ||
                        ""
                    ).toLowerCase() ===
                    normalizedQuery
            );


        /*
         * If exact dinosaur is not found,
         * try partial matching.
         */

        if (!dinosaur) {

            dinosaur =
                markers.find(
                    (marker) =>
                        (
                            marker.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                normalizedQuery
                            )
                );

        }


        if (!dinosaur) {

            return;

        }


        /*
         * Keep search field showing
         * the selected dinosaur.
         */

        setSearchQuery(
            dinosaur.name
        );


        /*
         * DinosaurMarker already watches
         * activeDinosaurId.

         * Therefore setting this automatically
         * triggers its existing map.flyTo()
         * functionality.
         */

        setActiveDinosaurId(
            dinosaur.id
        );

    };


    /* =========================================================
       SELECT DINOSAUR
       FROM TRENDING SECTION
    ========================================================= */

    const handleSelectDinosaur = (
        dinosaur
    ) => {

        if (!dinosaur) {

            return;

        }


        setActiveDinosaurId(
            dinosaur.id
        );


        /*
         * Move the visitor back
         * toward the map.
         */

        document
            .getElementById(
                "interactive-map-section"
            )
            ?.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

    };


    /* =========================================================
       TRENDING / FAMOUS DINOSAURS
    ========================================================= */

    const trendingDinosaurs =
        useMemo(() => {

            const famousSlugs = [

                "tyrannosaurus-rex",

                "triceratops",

                "velociraptor",

                "stegosaurus",

                "spinosaurus"

            ];


            const selected =
                famousSlugs
                    .map(
                        (slug) =>
                            markers.find(
                                (marker) =>
                                    marker.slug ===
                                    slug
                            )
                    )
                    .filter(Boolean);


            /*
             * Fill remaining cards if some
             * famous dinosaurs don't exist
             * in the current API response.
             */

            if (
                selected.length < 5
            ) {

                const selectedIds =
                    new Set(
                        selected.map(
                            (dinosaur) =>
                                dinosaur.id
                        )
                    );


                const fallback =
                    markers
                        .filter(
                            (dinosaur) =>
                                !selectedIds.has(
                                    dinosaur.id
                                )
                        )
                        .slice(
                            0,
                            5 -
                                selected.length
                        );


                return [
                    ...selected,
                    ...fallback
                ];

            }


            return selected;

        }, [markers]);


    /* =========================================================
       MAP TITLE
    ========================================================= */

    const currentMapTitle =
    selectedEra ||
    "Explore Prehistoric Earth";


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#d8d3c4]
                "
            >

                {/* =============================================
                    EXISTING NAVBAR
                    DO NOT CHANGE
                ============================================= */}

                <header
                    className="
                        relative
                        z-50
                        w-full
                        px-6
                        pt-6
                    "
                >

                    <Navbar />

                </header>


                <main
                    className="
                        mt-20
                        px-4
                        pb-10
                        sm:px-6
                        lg:mt-24
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-[1500px]
                            animate-pulse
                        "
                    >

                        <div
                            className="
                                h-[700px]
                                rounded-[28px]
                                border
                                border-[#314c38]/15
                                bg-[#e8e3d7]
                            "
                        />

                    </div>

                </main>

            </div>

        );

    }


    /* =========================================================
       ERROR SCREEN
    ========================================================= */

    if (error) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#d8d3c4]
                "
            >

                {/* EXISTING NAVBAR */}

                <header
                    className="
                        relative
                        z-50
                        w-full
                        px-6
                        pt-6
                    "
                >

                    <Navbar />

                </header>


                <main
                    className="
                        flex
                        min-h-[70vh]
                        items-center
                        justify-center
                        px-6
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-[28px]
                            border
                            border-[#31503b]/20
                            bg-[#eee9df]
                            p-8
                            text-center
                            shadow-xl
                        "
                    >

                        <AlertCircle
                            size={45}
                            className="
                                mx-auto
                                text-[#a14c3a]
                            "
                        />


                        <h2
                            className="
                                mt-4
                                font-serif
                                text-2xl
                                font-black
                                text-[#183524]
                            "
                        >
                            Map unavailable
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-relaxed
                                text-[#667064]
                            "
                        >
                            {error}
                        </p>


                        <button
                            onClick={
                                loadMarkers
                            }
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-[#245b35]
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-white
                                shadow-lg
                                transition
                                hover:bg-[#1d4b2c]
                                active:scale-95
                            "
                        >

                            <RefreshCw
                                size={16}
                            />

                            Reload Map

                        </button>

                    </div>

                </main>

            </div>

        );

    }


    /* =========================================================
       MAIN PAGE
    ========================================================= */

    return (

        <div
            className="
                min-h-screen
                bg-[#d6d1c3]
                font-sans
                text-[#193324]
            "
        >

            {/* =================================================
                EXISTING NAVBAR

                IMPORTANT:
                WE ARE NOT MODIFYING NAVBAR.
            ================================================= */}

            <header
                className="
                    relative
                    z-50
                    w-full
                    px-6
                    pt-6
                "
            >

                <Navbar />

            </header>


            {/* =================================================
                MAP PAGE CONTENT
            ================================================= */}

            <main
                className="
                    relative
                    mt-20
                    px-3
                    pb-10
                    sm:px-5
                    lg:mt-24
                    lg:px-6
                "
            >

                {/* MAIN EXPLORER CARD */}

                <div
                    className="
                        mx-auto
                        max-w-[1500px]
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-[#264d34]/20
                        bg-[#e9e4d8]
                        shadow-[0_25px_70px_rgba(22,45,30,0.20)]
                    "
                >


                    {/* =========================================
                        TOP MAP EXPLORER
                    ========================================= */}

                    <section
                        id="interactive-map-section"
                        className="
                            grid
                            min-h-[650px]
                            grid-cols-1
                            xl:grid-cols-[250px_minmax(0,1fr)_290px]
                        "
                    >


                        {/* =====================================
                            LEFT:
                            EXPLORE ERAS / FILTERS
                        ===================================== */}

                        <ExploreErasPanel

                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}

                            selectedEra={selectedEra}
                            setSelectedEra={setSelectedEra}

                            selectedDiet={selectedDiet}
                            setSelectedDiet={setSelectedDiet}

                            selectedCountry={selectedCountry}
                            setSelectedCountry={setSelectedCountry}

                            eras={eras}
                            diets={diets}
                            countries={countries}

                            dinosaurs={markers}

                            onSearch={handleSearchDinosaur}
                            onReset={handleClearFilters}

                        />


                        {/* =====================================
                            CENTER:
                            INTERACTIVE LEAFLET MAP
                        ===================================== */}

                        <div
                            className="
                                relative
                                min-h-[520px]
                                overflow-hidden
                                bg-[#506a52]
                            "
                        >


                            {/* MAP TITLE */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-1/2
                                    top-5
                                    z-[400]
                                    -translate-x-1/2
                                    text-center
                                "
                            >

                                <h1
                                    className="
                                        font-serif
                                        text-2xl
                                        font-black
                                        uppercase
                                        tracking-[0.04em]
                                        text-[#173923]
                                        drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]
                                        sm:text-3xl
                                    "
                                >

                                    {
                                        currentMapTitle
                                    }

                                </h1>

                            </div>


                            {/* =================================
                                EXISTING DINOSAUR MAP

                                We keep its functionality.
                            ================================= */}

                            <DinosaurMap

                                dinosaurs={
                                    filteredMarkers
                                }

                                activeDinosaurId={
                                    activeDinosaurId
                                }

                                setActiveDinosaurId={
                                    setActiveDinosaurId
                                }

                                fitBoundsTrigger={
                                    fitBoundsTrigger
                                }

                            />


                            {/* =================================
                                MAP LEGEND
                            ================================= */}

                            <div
                                className="
                                    absolute
                                    bottom-5
                                    left-1/2
                                    z-[400]
                                    flex
                                    -translate-x-1/2
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-[#334f3b]/15
                                    bg-[#f2eee5]/95
                                    px-4
                                    py-2.5
                                    shadow-xl
                                    backdrop-blur-xl
                                "
                            >

                                <LegendItem

                                    icon={Leaf}

                                    label="Herbivore"

                                    color="text-[#3e7b48]"

                                />


                                <LegendItem

                                    icon={Beef}

                                    label="Carnivore"

                                    color="text-[#b84c3c]"

                                />


                                <LegendItem

                                    icon={Apple}

                                    label="Omnivore"

                                    color="text-[#3e76a8]"

                                />


                                <LegendItem

                                    icon={Landmark}

                                    label="Fossil Site"

                                    color="text-[#947038]"

                                />

                            </div>

                        </div>


                        {/* =====================================
                            RIGHT:
                            FEATURED DINOSAUR
                        ===================================== */}

                        <FeaturedDinosaurPanel

                            dinosaur={
                                featuredDinosaur
                            }

                        />

                    </section>


                    {/* =========================================
                        DIRECT DINOSAUR SEARCH
                    ========================================= */}

                    <MapSearchBar

                        searchQuery={
                            searchQuery
                        }

                        setSearchQuery={
                            setSearchQuery
                        }

                        dinosaurs={
                            markers
                        }

                        onSearch={
                            handleSearchDinosaur
                        }

                    />


                    {/* =========================================
                        INTERACTIVE TIMELINE
                    ========================================= */}

                    <EraTimeline
                        selectedEra={selectedEra}
                        setSelectedEra={setSelectedEra}
                    />


                    {/* =========================================
                        TRENDING DINOSAURS
                    ========================================= */}

                    <TrendingDinosaurs

                        dinosaurs={
                            trendingDinosaurs
                        }

                        activeDinosaurId={
                            activeDinosaurId
                        }

                        onSelectDinosaur={
                            handleSelectDinosaur
                        }

                    />

                </div>

            </main>


            {/* =================================================
                FLOATING PROFESSOR ROSS

                Your own image will be added later.
            ================================================= */}

            <ProfessorRossFloating />

        </div>

    );

}


/* =============================================================
   MAP LEGEND ITEM
============================================================= */

function LegendItem({
    icon: Icon,
    label,
    color
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-1.5
                px-2
                text-[11px]
                font-bold
                text-[#4f5a50]
            "
        >

            <Icon
                size={14}
                className={
                    color
                }
            />

            <span>
                {label}
            </span>

        </div>

    );

}