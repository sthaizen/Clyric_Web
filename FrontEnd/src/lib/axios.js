import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// A small utility to allow React components to inject the Clerk token
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

axiosInstance.interceptors.request.use((config) => {
    // 1. Attach Auth Token if available (exclude admin routes)
    const isAdminRoute = config.url && (config.url.startsWith('admin') || config.url.startsWith('/admin'));
    
    if (authToken && !isAdminRoute) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    // 2. Fix URL construction (Vite baseURL + relative path)
    if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1);
    }
    if (config.baseURL && !config.baseURL.endsWith('/')) {
        config.baseURL += '/';
    }

    return config;
});

export default axiosInstance;