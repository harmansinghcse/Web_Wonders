import api from "../api/axios";

/**
 * Send a PUT request to update an existing dinosaur by ID
 * @param {string} id - Dinosaur Mongoose Object ID
 * @param {FormData} formData - Multipart form data including the JSON string and files
 * @returns {Promise<object>} - Updated dinosaur response
 */
export const updateDinosaur = async (id, formData) => {
    const { data } = await api.put(`/api/dinosaur/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

/**
 * Send a DELETE request to delete a dinosaur by ID
 * @param {string} id - Dinosaur Mongoose Object ID
 * @returns {Promise<object>} - Deletion response
 */
export const deleteDinosaur = async (id) => {
    const { data } = await api.delete(`/api/dinosaur/${id}`);
    return data;
};
