const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

let markersCache = null;

export async function getMapMarkers() {
    if (markersCache) {
        return markersCache;
    }
    const response = await fetch(`${BASE_URL}/api/map/markers`);
    if (!response.ok) {
        throw new Error("Failed to fetch map markers");
    }
    const data = await response.json();
    markersCache = data.data;
    return markersCache;
}
