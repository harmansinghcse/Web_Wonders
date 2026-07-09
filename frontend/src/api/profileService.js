import api from "./axios";

export const getProfile = async () => {
    const response = await api.get("/api/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch("/api/profile", data);
    return response.data;
};
