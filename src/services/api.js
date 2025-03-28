import axios from "axios";

export const API_BASE_URL = "https://myfundi-server-93521f94d28e.herokuapp.com/api";


const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
