import api from "../api/axios";

/**
 * Calls backend endpoint to generate a complete dinosaur object using AI.
 * @param {string} topic - Name of the dinosaur to generate (e.g. "Spinosaurus")
 * @returns {Promise<Object>} The generated dinosaur object
 */
export async function generateDinosaur(topic) {
    const response = await api.post("/api/acquisition/start", { topic });
    return response.data.data;
}
