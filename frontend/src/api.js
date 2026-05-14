import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});

export const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x800?text=Gorsel+Yok";
    if (url.startsWith('http')) return url;
    return "https://via.placeholder.com/600x800?text=Gorsel+Yok";
};

const getActiveToken = () => {
    return sessionStorage.getItem("adminToken") || localStorage.getItem("token");
};

export const getTokenPayload = (type = "user") => {
    const token = type === "admin"
        ? sessionStorage.getItem("adminToken")
        : localStorage.getItem("token");

    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
            if (type === "admin") sessionStorage.removeItem("adminToken");
            else localStorage.removeItem("token");
            return null;
        }
        return payload;
    } catch {
        return null;
    }
};

export const getUserRole = (type = "user") => {
    const payload = getTokenPayload(type);
    if (!payload) return null;
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || payload["role"]
        || null;
};

export const isAuthenticated = () => !!getTokenPayload("user");
export const isAdmin = () => getUserRole("admin") === "Admin";

api.interceptors.request.use(
    (config) => {
        const token = getActiveToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            const isAdminPage = window.location.pathname.startsWith("/admin");
            if (isAdminPage) {
                sessionStorage.removeItem("adminToken");
                toast.error("Oturum süreniz doldu.");
                window.location.href = "/admin";
            } else {
                localStorage.removeItem("token");
                toast.error("Oturum süreniz doldu, tekrar giriş yapın.");
                window.location.href = "/giris";
            }
        }
        return Promise.reject(err);
    }
);

export default api;