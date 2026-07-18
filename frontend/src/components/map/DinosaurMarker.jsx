import { useState, useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerPopup from "./MarkerPopup";
import { getOptimizedImageUrl } from "../../utils/imageHelper";

// Create custom leaflet marker icon using Tailwind styled divIcon with realistic dinosaur image avatars
const createCustomIcon = (diet, isActive, image) => {
    const d = diet.toLowerCase();
    
    // Diet specific premium gradients aligned with Jurassic Explorer design system
    let colorClass = "from-[#C9A14A] to-[#8C6D2B] text-[#F5F2EA] shadow-[#C9A14A]/40 ring-[#C9A14A]/20";
    let pointerColor = "border-t-[#8C6D2B]";
    
    if (d.includes("carni")) {
        colorClass = "from-[#B5462F] to-[#7A2C1D] text-[#F5F2EA] shadow-[#B5462F]/40 ring-[#B5462F]/20";
        pointerColor = "border-t-[#7A2C1D]";
    } else if (d.includes("herbi")) {
        colorClass = "from-[#2E4A37] to-[#1C3023] text-[#F5F2EA] shadow-[#2E4A37]/40 ring-[#2E4A37]/20";
        pointerColor = "border-t-[#1C3023]";
    }

    // Active state glow ring pulsing
    const pulseRing = isActive 
        ? "absolute -inset-2.5 rounded-full animate-pulse opacity-45 bg-current blur-xs" 
        : "absolute -inset-0.5 rounded-full opacity-0 hover:opacity-20 hover:scale-110 bg-current transition-all duration-300";
    
    const scaleClass = isActive 
        ? "scale-130 border-[#F5F2EA] ring-8 z-[1000] shadow-2xl" 
        : "hover:scale-115 hover:z-[999] hover:shadow-lg border-stone-250 ring-4";

    // Embed realistic optimized thumbnail image, fallback to dino emoji if empty
    const badgeContent = image 
        ? `<img src="${image}" alt="specimen" class="w-full h-full object-cover rounded-full select-none pointer-events-none" />`
        : `<span class="transform select-none">🦕</span>`;

    const iconHtml = `
        <div class="relative flex flex-col items-center justify-center w-12 h-12">
            <!-- Ripple/Glow Ring -->
            <span class="${pulseRing} ${colorClass.split(" ")[0]}"></span>
            
            <!-- Specimen Badge -->
            <div class="relative flex items-center justify-center w-9 h-9 rounded-full border-2 bg-gradient-to-br shadow-md overflow-hidden transition-all duration-300 transform ${colorClass} ${scaleClass}">
                ${badgeContent}
            </div>
            
            <!-- Pin Arrow pointer -->
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${pointerColor} -mt-0.5 filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.15)]"></div>
        </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: "custom-dino-marker-wrapper",
        iconSize: [48, 48],
        iconAnchor: [24, 45], // Anchors exactly at the arrow point
        popupAnchor: [0, -42]
    });
};

const DinosaurMarker = ({ dinosaur, activeDinosaurId, setActiveDinosaurId }) => {
    const markerRef = useRef(null);
    const map = useMap();
    const { coordinates, id, diet, image } = dinosaur;
    const isActive = activeDinosaurId === id;

    // React to search selection or sidebar click
    useEffect(() => {
        if (isActive) {
            // Smoothly fly to dinosaur location
            map.flyTo(coordinates, 9, {
                animate: true,
                duration: 1.5,
                easeLinearity: 0.25
            });

            // Delay opening popup slightly to let flyTo transition initialize smoothly
            const timer = setTimeout(() => {
                if (markerRef.current) {
                    markerRef.current.openPopup();
                }
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isActive, coordinates, map]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch optimized 300px avatar image for the marker badge
    const markerAvatar = getOptimizedImageUrl(image, 300);

    return (
        <Marker
            position={coordinates}
            icon={createCustomIcon(diet, isActive, markerAvatar)}
            ref={markerRef}
            eventHandlers={{
                click: () => {
                    setActiveDinosaurId(id);
                },
                popupclose: () => {
                    if (activeDinosaurId === id) {
                        setActiveDinosaurId(null);
                    }
                }
            }}
        >
            <Popup 
                className="dino-leaflet-popup" 
                maxWidth={isMobile ? 240 : 300} 
                minWidth={isMobile ? 220 : 270}
            >
                <MarkerPopup dinosaur={dinosaur} />
            </Popup>
        </Marker>
    );
};

export default DinosaurMarker;
