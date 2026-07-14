import api from "../api/axios";

export const getDashboard = async () => {
    const response = await api.get("/api/quiz/dashboard");
    return response.data.data;
};

export const getTopicDetails = async (slug) => {
    const response = await api.get(`/api/quiz/topics/${slug}`);
    return response.data.data;
};

export const startQuiz = async (slug, difficulty) => {
    const response = await api.get(`/api/quiz/topics/${slug}/play?difficulty=${difficulty}`);
    return response.data.data;
};

export const submitQuiz = async (sessionId, answers) => {
    const response = await api.post("/api/quiz/result", { sessionId, answers });
    return response.data.data;
};
