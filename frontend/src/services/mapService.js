const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export async function getMapMarkers() {
    const response = await fetch(`${BASE_URL}/api/map/markers`);
    if (!response.ok) {
        throw new Error("Failed to fetch map markers");
    }
    const data = await response.json();
    return data.data;
}
