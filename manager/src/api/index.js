import axios1 from "axios";

export const axios = axios1.create({
    baseURL: "http://localhost:4000",
    withCredentials: true
})