import axios from "axios"
import { BASE_URL } from "./api"

export const axiosClient = axios.create(
    {
        baseURL: BASE_URL,
        withCredentials: true
    }
)

// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             window.location.href = '/room/login';
//         }
//         return Promise.reject(error);
//     }
// );