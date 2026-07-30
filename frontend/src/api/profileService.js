import api from "./axios";

export const getProfile = async () => {
    const response = await api.get("/api/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch("/api/profile", data);
    return response.data;
};

export const getProfileById = async (id) => {
    const response = await api.get(`/api/profile/${id}`);
    return response.data;
};
