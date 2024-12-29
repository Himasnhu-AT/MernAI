import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Vite API URL to integrate TPO backend
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
    }
});

export default axiosInstance;
