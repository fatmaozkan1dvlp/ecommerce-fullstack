import axios from "axios";
import { toast } from "react-hot-toast"; 

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});

export const IMG_URL = import.meta.env.VITE_IMG_URL;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {

            const token = localStorage.getItem("token");

            if (token) {
                toast.error("Oturum süreniz doldu, tekrar giriş yapın");
                localStorage.removeItem("token");
                window.location.href = "/giris";
            }

        }
        return Promise.reject(err);
    }
);


export default api;