import axios from 'axios';

const API = axios.create({
    baseURL: '', // Using proxy from vite.config.js
});

// Request interceptor for injecting Auth token
API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for handling 401s (token expiry)
API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default API;
