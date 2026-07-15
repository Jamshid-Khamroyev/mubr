import axios from "axios";

export const axios1 = axios.create({
    // baseURL: "https://quiz-arena-for-school-backend.onrender.com",
    baseURL: "http://localhost:4000",
    withCredentials: true
})