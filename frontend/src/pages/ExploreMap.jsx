import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/home_components/hero/Navbar";
import DinosaurMap from "../components/map/DinosaurMap";
import DinosaurSidebar from "../components/map/DinosaurSidebar";
import FossilSitePanel from "../components/map/FossilSitePanel";
import ControlPanel from "../components/map/ControlPanel";
import { getMapMarkers } from "../services/mapService";
import { getFossilSiteDetails } from "../services/locationService";
import { AlertCircle, RefreshCw, Compass, Globe, MapPin, Calendar, Award, Sparkles, Footprints } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageHelper";

export default function ExploreMap() {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Geocoded location details states
    const [locationData, setLocationData] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEra, setSelectedEra] = useState("");
    const [selectedDiet, setSelectedDiet] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");

    // Sidebar & Selection states
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeDinosaurId, setActiveDinosaurId] = useState(null);

    // Map bounds trigger counter
    const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

    // Screen resize listener for sidebar default state
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch markers
    const loadMarkers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMapMarkers();
            setMarkers(data || []);
        } catch (err) {
            console.error("Failed to load map markers:", err);
            setError("Could not retrieve dinosaur locations. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMarkers();
    }, []);

    // Resolve geocoded details asynchronously on marker selection
    useEffect(() => {
        if (!activeDinosaurId) {
            setLocationData(null);
            return;
        }

        const activeDino = markers.find((m) => m.id === activeDinosaurId);
        if (!activeDino || !activeDino.coordinates) return;

        const fetchLocationDetails = async () => {
            try {
                setLoadingLocation(true);
                const details = await getFossilSiteDetails(
                    activeDino.coordinates[0],
                    activeDino.coordinates[1],
                    activeDino.formation
                );
                setLocationData(details);
            } catch (err) {
                console.error("Failed to geocode location:", err);
                setLocationData(null);
            } finally {
                setLoadingLocation(false);
            }
        };

        fetchLocationDetails();
    }, [activeDinosaurId, markers]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedEra("");
        setSelectedDiet("");
        setSelectedCountry("");
        setActiveDinosaurId(null);
        setFitBoundsTrigger((prev) => prev + 1);
    };

    // Calculate filter boundaries
    const eras = useMemo(() => {
        return [...new Set(markers.map((m) => m.period))].filter(Boolean).sort();
    }, [markers]);

    const diets = useMemo(() => {
        return [...new Set(markers.map((m) => m.diet))].filter(Boolean).sort();
    }, [markers]);

    const countries = useMemo(() => {
        return [...new Set(markers.map((m) => m.country))].filter(Boolean).sort();
    }, [markers]);

    // Client-side filtering
    const filteredMarkers = useMemo(() => {
        return markers.filter((marker) => {
            const matchesSearch = marker.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesEra = !selectedEra || marker.period === selectedEra;
            const matchesDiet = !selectedDiet || marker.diet === selectedDiet;
            const matchesCountry = !selectedCountry || marker.country === selectedCountry;
            
            return matchesSearch && matchesEra && matchesDiet && matchesCountry;
        });
    }, [markers, searchQuery, selectedEra, selectedDiet, selectedCountry]);

    // Locate a random dinosaur from currently filtered markers
    const handleLocateRandom = () => {
        if (filteredMarkers.length === 0) return;
        const randomIndex = Math.floor(Math.random() * filteredMarkers.length);
        const randomDino = filteredMarkers[randomIndex];
        setActiveDinosaurId(randomDino.id);
    };

    // Reset manual fit bounds camera offset
    const handleFitBounds = () => {
        setFitBoundsTrigger((prev) => prev + 1);
    };

    // Dynamic stats computation based on current matching specimens
    const stats = {
        total: filteredMarkers.length,
        countries: new Set(filteredMarkers.map((m) => m.country)).size,
        formations: new Set(filteredMarkers.map((m) => m.formation)).size,
        eras: new Set(filteredMarkers.map((m) => m.period)).size
    };

    // Find the currently selected dinosaur object for the details panel
    const activeDinosaur = markers.find((m) => m.id === activeDinosaurId);

    // Highlighting three dinosaur specimens for "Recent Discoveries" section
    const recentDiscoveries = markers.filter(
        (m) => ["tyrannosaurus-rex", "triceratops", "velociraptor", "brachiosaurus", "stegosaurus"].includes(m.slug)
    ).slice(0, 3);

    const handleFocusDiscovery = (id) => {
        setActiveDinosaurId(id);
        // Scroll smoothly up to the map viewport container
        document.getElementById("interactive-map-section")?.scrollIntoView({
            behavior: "smooth"
        });
    };

    return (
        <div className="min-h-screen bg-[#171613] flex flex-col font-sans transition-colors duration-300">
            {/* Header Navbar */}
            <header className="relative z-50 w-full mb-6 pt-6 px-6">
                <Navbar />
            </header>

            {/* Content Container */}
            <main className="flex-1 flex flex-col px-6 pb-12 max-w-7xl mx-auto w-full gap-6 mt-20 lg:mt-24">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#8BAA83]">
                            <Sparkles size={14} />
                            <span>Interactive Museum Database</span>
                        </div>
                        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#F5F2EA] leading-tight tracking-tight mt-1">
                            Geographical Excavation Map
                        </h1>
                        <p className="mt-1.5 text-sm text-[#D0C9BB] font-medium leading-relaxed max-w-2xl font-sans">
                            Embark on a digital tour to locate where Earth's lost giants were unearthed. Filter by era, search specific specimens, and analyze fossil distribution patterns.
                        </p>
                    </div>
                </div>

                {/* Statistics Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat Card 1 */}
                    <div className="rounded-3xl border border-[#C9A14A]/15 bg-[#211D18] p-5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#2E4A37]/20 flex items-center justify-center text-[#8BAA83] border border-[#2E4A37]/35 shrink-0">
                            <Footprints size={20} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">Specimens</span>
                            <span className="font-serif text-2xl font-black text-[#C9A14A] leading-none block mt-0.5">
                                {loading ? "..." : stats.total}
                            </span>
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="rounded-3xl border border-[#C9A14A]/15 bg-[#211D18] p-5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#2E4A37]/20 flex items-center justify-center text-[#8BAA83] border border-[#2E4A37]/35 shrink-0">
                            <Globe size={20} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">Countries</span>
                            <span className="font-serif text-2xl font-black text-[#C9A14A] leading-none block mt-0.5">
                                {loading ? "..." : stats.countries}
                            </span>
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="rounded-3xl border border-[#C9A14A]/15 bg-[#211D18] p-5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#2E4A37]/20 flex items-center justify-center text-[#8BAA83] border border-[#2E4A37]/35 shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">Formations</span>
                            <span className="font-serif text-2xl font-black text-[#C9A14A] leading-none block mt-0.5">
                                {loading ? "..." : stats.formations}
                            </span>
                        </div>
                    </div>
                    {/* Stat Card 4 */}
                    <div className="rounded-3xl border border-[#C9A14A]/15 bg-[#211D18] p-5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#2E4A37]/20 flex items-center justify-center text-[#8BAA83] border border-[#2E4A37]/35 shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#9A9489]">Geological Eras</span>
                            <span className="font-serif text-2xl font-black text-[#C9A14A] leading-none block mt-0.5">
                                {loading ? "..." : stats.eras}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Skeletons */}
                {loading && (
                    <div className="flex-1 flex flex-col gap-5 animate-pulse min-h-[500px]">
                        <div className="h-28 rounded-3xl bg-[#211D18] border border-[#C9A14A]/10" />
                        <div className="flex-grow rounded-3xl bg-[#211D18] border border-[#C9A14A]/10" />
                    </div>
                )}

                {/* Error Banner */}
                {!loading && error && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#211D18] rounded-3xl border border-red-950/40 max-w-lg mx-auto my-12 text-[#D0C9BB]">
                        <AlertCircle className="text-red-500 mb-4 animate-bounce" size={48} />
                        <h2 className="font-serif text-xl font-bold text-[#F5F2EA]">
                            Failed to Load Map Context
                        </h2>
                        <p className="mt-2 text-sm text-[#9A9489]">
                            {error}
                        </p>
                        <button
                            onClick={loadMarkers}
                            className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E4A37] to-[#516858] text-white py-2.5 px-6 font-bold transition shadow-md border-none cursor-pointer hover:shadow-lg active:scale-95"
                        >
                            <RefreshCw size={16} />
                            <span>Reload Excavation Data</span>
                        </button>
                    </div>
                )}

                {/* Interactive Map Layout */}
                {!loading && !error && (
                    <div id="interactive-map-section" className="flex-grow flex flex-col gap-5 min-h-0">
                        {/* Control Panel */}
                        <ControlPanel
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
                            visibleCount={filteredMarkers.length}
                            totalCount={markers.length}
                            onClearFilters={handleClearFilters}
                            onLocateRandom={handleLocateRandom}
                            onFitBounds={handleFitBounds}
                        />

                        {/* Map & Sidebar Wrapper */}
                        <div className="flex-grow relative h-[500px] md:h-[600px] flex rounded-3xl overflow-hidden border border-[#C9A14A]/15 bg-[#171613]">
                            {/* Collapsible Sidebar */}
                            <div className="absolute inset-y-0 left-0 z-10 flex">
                                <DinosaurSidebar
                                    dinosaurs={filteredMarkers}
                                    activeDinosaurId={activeDinosaurId}
                                    setActiveDinosaurId={setActiveDinosaurId}
                                    isOpen={isSidebarOpen}
                                    setIsOpen={setIsSidebarOpen}
                                />
                            </div>

                            {/* Core Map Component */}
                            <div className="flex-grow h-full w-full relative z-0">
                                <DinosaurMap
                                    dinosaurs={filteredMarkers}
                                    activeDinosaurId={activeDinosaurId}
                                    setActiveDinosaurId={setActiveDinosaurId}
                                    fitBoundsTrigger={fitBoundsTrigger}
                                />

                                {/* Empty Search Results Overlay */}
                                {filteredMarkers.length === 0 && (
                                    <div className="absolute inset-0 bg-[#171613]/70 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 transition-all duration-300">
                                        <div className="bg-[#211D18] border border-[#C9A14A]/15 p-8 rounded-3xl shadow-2xl max-w-sm text-center">
                                            <div className="mx-auto w-16 h-16 bg-[#2E4A37]/20 flex items-center justify-center rounded-full text-[#8BAA83] mb-5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-serif text-xl font-black text-[#F5F2EA]">
                                                No Specimen Matches
                                            </h3>
                                            <p className="mt-2 text-xs text-[#D0C9BB] leading-normal font-sans">
                                                We searched our cabinets but couldn't find matching fossils. Reset filters to continue exploring.
                                            </p>
                                            <button
                                                onClick={handleClearFilters}
                                                className="mt-5 w-full rounded-full bg-gradient-to-r from-[#2E4A37] to-[#516858] text-white py-2.5 px-4 text-xs font-bold transition shadow-md border-none cursor-pointer hover:shadow-lg active:scale-95"
                                            >
                                                Clear Active Filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Collapsible Fossil Site Panel on the Right side */}
                            <div className="absolute inset-y-0 right-0 z-10 flex pointer-events-none">
                                <AnimatePresence>
                                    {activeDinosaur && (
                                        <FossilSitePanel
                                            dinosaur={activeDinosaur}
                                            locationData={locationData}
                                            loadingLocation={loadingLocation}
                                            onClose={() => setActiveDinosaurId(null)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* Featured Discoveries (Recent Acquisitions) Section */}
                {!loading && !error && markers.length > 0 && (
                    <section className="mt-8 border-t border-[#C9A14A]/10 pt-8">
                        <div className="flex items-center gap-2.5 mb-5">
                            <Award className="text-[#C9A14A]" size={20} />
                            <h2 className="font-serif text-2xl font-black text-[#F5F2EA] tracking-tight">
                                Featured Museum Specimens
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentDiscoveries.map((dino) => {
                                // Request high-quality 800px image from Cloudinary to prevent pixelation
                                const optimizedImg = getOptimizedImageUrl(dino.image, 800);

                                return (
                                    <div 
                                        key={dino.id}
                                        className="group overflow-hidden rounded-[20px] border border-[#C9A14A]/15 bg-[#211D18] shadow-lg hover:shadow-xl hover:border-[#C9A14A]/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full"
                                    >
                                        {/* Specimen thumbnail card image */}
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171613] shrink-0 border-b border-[#C9A14A]/15">
                                            {optimizedImg ? (
                                                <img
                                                    src={optimizedImg}
                                                    alt={dino.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#9A9489]">
                                                    Fossil Photo
                                                </div>
                                            )}
                                            {/* Tag banner */}
                                            <div className="absolute right-3 top-3 bg-stone-950/80 border border-[#C9A14A]/30 px-3 py-1 rounded-lg text-[9px] font-bold text-[#C9A14A] uppercase tracking-widest backdrop-blur-xs">
                                                {dino.period}
                                            </div>
                                        </div>

                                        {/* Text card details */}
                                        <div className="p-5 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-serif text-lg font-black text-[#F5F2EA] leading-snug group-hover:text-[#C9A14A] transition-colors">
                                                    {dino.name}
                                                </h3>
                                                <div className="mt-2.5 space-y-1.5 text-xs text-[#9A9489] leading-normal font-sans">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <MapPin size={12} className="text-[#C9A14A]" />
                                                        <span>{dino.formation}, {dino.country}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleFocusDiscovery(dino.id)}
                                                className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-full border border-[#C9A14A]/40 bg-transparent hover:bg-[#C9A14A]/10 text-[#D0C9BB] py-2.5 text-xs font-bold transition-all duration-300 active:scale-95"
                                            >
                                                <Compass size={13} className="text-[#C9A14A]" />
                                                <span>Locate Specimen</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
