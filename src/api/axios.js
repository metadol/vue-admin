import axios from 'axios';

// Create a single axios instance with the common base URL
const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8001/node-bot/api/v1/', // Common base URL for all requests
    baseURL: 'http://localhost:5000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
