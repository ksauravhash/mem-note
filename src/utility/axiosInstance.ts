import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000, 
});

// Function to check if the server is up and running
export const checkServerHealth = async () => {
    try {
        // Try to hit a lightweight endpoint - we'll use a simple GET request to the base URL
        const response = await axiosInstance.get('/test', { timeout: 5000 });
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        return false;
    }
};

export default axiosInstance;
