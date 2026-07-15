import axios1 from "axios";

export const axios = axios1.create({
    baseURL: "https://api-mubr.onrender.com",
    withCredentials: true
})