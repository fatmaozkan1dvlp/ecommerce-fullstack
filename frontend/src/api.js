import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});
export const IMG_URL = import.meta.env.VITE_IMG_URL;

export default api;