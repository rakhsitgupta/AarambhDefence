import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Remove any double quotes from token
            const cleanToken = token.replace(/"/g, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
    // For DELETE requests, ensure we don't send a body
    if (method === 'DELETE') {
        return axiosInstance({
            method: 'DELETE',
            url: url,
            headers: headers ? { ...axiosInstance.defaults.headers, ...headers } : axiosInstance.defaults.headers,
            params: params ? params : null,
        }).then(response => response.data);
    }

    // For all other methods, use the original logic
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? { ...axiosInstance.defaults.headers, ...headers } : axiosInstance.defaults.headers,
        params: params ? params : null,
    }).then(response => response.data);
}