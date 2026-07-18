import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useEffect } from "react";
import DinosaurMarker from "./DinosaurMarker";

// Import Leaflet and Cluster CSS files directly
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

// Custom Leaflet Cluster icon styled in brand Forest Green (#2E4A37), Ivory (#F5F2EA) and Fossil Gold border (#C9A14A)
const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
        html: `
            <div class="flex items-center justify-center w-10 h-10">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#2E4A37] text-[#F5F2EA] font-serif font-bold text-xs border border-[#C9A14A]/60 shadow-xl ring-4 ring-[#2E4A37]/25 transition-transform duration-300 hover:scale-115">
                    ${count}
                </div>
            </div>
        `,
        className: "custom-dino-cluster",
        iconSize: L.point(40, 40, true)
    });
};

// Internal map controller to handle zoom centering dynamically based on filters/actions
const MapBoundsController = ({ dinosaurs, fitBoundsTrigger }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || dinosaurs.length === 0) return;

        // Extract coordinates of currently filtered dinosaurs
        const coords = dinosaurs.map(d => d.coordinates);
        
        // Compute bounding box
        const bounds = L.latLngBounds(coords);
        
        // Fit view with margins
        map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 6, // Don't zoom too far on singular matches
            animate: true,
            duration: 1.2
        });
    }, [dinosaurs, map, fitBoundsTrigger]);

    return null;
};

const DinosaurMap = ({ dinosaurs, activeDinosaurId, setActiveDinosaurId, fitBoundsTrigger }) => {
    const center = [25.0, 10.0];
    const zoom = 2.5;

    return (
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-[#C9A14A]/20 shadow-2xl bg-[#171613] dark:border-stone-850">
            <MapContainer
                center={center}
                zoom={zoom}
                minZoom={2}
                maxZoom={12}
                className="h-full w-full z-0 bg-[#0a0c0a]"
                scrollWheelZoom={true}
                zoomControl={true}
            >
                {/* Esri World Imagery Free Satellite basemap */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                
                {/* Dynamically fits the map viewport bounds based on filters */}
                <MapBoundsController dinosaurs={dinosaurs} fitBoundsTrigger={fitBoundsTrigger} />

                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                    showCoverageOnHover={false}
                    maxClusterRadius={50}
                >
                    {dinosaurs.map((dino) => (
                        <DinosaurMarker
                            key={dino.id}
                            dinosaur={dino}
                            activeDinosaurId={activeDinosaurId}
                            setActiveDinosaurId={setActiveDinosaurId}
                        />
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default DinosaurMap;
