import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// A small utility to allow React components to inject the Clerk token
let authToken = null;
let tokenResolver = null;
let tokenPromise = new Promise((resolve) => {
    tokenResolver = resolve;
});

export const setAuthToken = (token) => {
    authToken = token;
    // If we have a token and someone is waiting, resolve it
    if (token && tokenResolver) {
        tokenResolver();
        tokenResolver = null;
    }
};

axiosInstance.interceptors.request.use(async (config) => {
    // 1. If we don't have a token yet, wait for it (avoids "Unauthorized" race condition on page load)
    const isAdminRoute = config.url && (config.url.startsWith('admin') || config.url.startsWith('/admin'));
    
    if (!authToken && !isAdminRoute) {
        // Wait up to 2 seconds for Clerk to provide the token
        await Promise.race([
            tokenPromise,
            new Promise(res => setTimeout(res, 2000))
        ]);
    }

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