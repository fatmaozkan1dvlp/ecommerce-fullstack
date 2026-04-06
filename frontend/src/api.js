import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});
export const IMG_URL = import.meta.env.VITE_IMG_URL;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default api;