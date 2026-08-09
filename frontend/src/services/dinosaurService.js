const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function searchDinosaurs(query) {
    const response = await fetch(
        `${BASE_URL}/api/dinosaur/search?query=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
        throw new Error("Failed to search dinosaurs");
    }

    const data = await response.json();

    return data.data;
}

export async function getAllDinosaurs() {
    const response = await fetch(`${BASE_URL}/api/dinosaur`);
    if (!response.ok) {
        throw new Error("Failed to fetch dinosaurs");
    }
    const data = await response.json();
    return data.data;
}
