import axiosInstance from './axios';

// Login
export const login = async (credentials) => {
    const response = await axiosInstance.post('auth/login', credentials);
    return response.data;
};

// Logout
export const logout = async () => {
    const response = await axiosInstance.post('auth/logout');
    return response.data;
};
