import axiosInstance from './axios';

// Fetch config
export const fetchConfig = async () => {
    const response = await axiosInstance.get('config');
    return response.data;
};

// Create config
export const createConfig = async (data) => {
    const response = await axiosInstance.post('config', data);
    return response.data;
};

// Update config
export const updateConfig = async (id, data) => {
    const response = await axiosInstance.put(`config/${id}`, data);
    return response.data;
};

// Delete config
export const deleteConfig = async (id) => {
    const response = await axiosInstance.delete(`config/${id}`);
    return response.data;
};
