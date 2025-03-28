import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";


const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
