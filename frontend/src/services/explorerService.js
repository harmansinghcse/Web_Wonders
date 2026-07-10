import api from "../api/axios";

export const getExplorerDinosaurs = async (params) => {
    const { data } = await api.get("/api/dinosaur", {
        params,
    });

    return data;
};
