import axios from "axios";

export const axios1 = axios.create({
    baseURL: "https://api-mubr.onrender.com",
    withCredentials: true
})