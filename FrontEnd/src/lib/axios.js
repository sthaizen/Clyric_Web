import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    // If the endpoint is like "/admin/stats" and baseURL has a path (like "/api"),
    // Axios will natively drop the "/api" making it just "/admin/stats".
    // Stripping the leading slash fixes this by making it relative.
    if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1);
    }
    // Also ensure the baseURL ends with a slash so simple relative paths append properly.
    if (config.baseURL && !config.baseURL.endsWith('/')) {
        config.baseURL += '/';
    }
    return config;
});

export default axiosInstance;