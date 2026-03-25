import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7126/api",
    timeout: 5000
});

export default api;