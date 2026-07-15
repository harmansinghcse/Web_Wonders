import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export const chatWithRoss = async (message) => {
    const response = await API.post("/api/ai/chat", {
        message,
    });

    return response.data;
};
