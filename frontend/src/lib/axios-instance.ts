import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const axiosPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
