import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all resources
export const getAllResources = async () => {
    const response = await axios.get(`${API_BASE_URL}/resources`, getAuthHeader());
    return response.data;
};

// Get single resource by ID
export const getResourceById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/resources/${id}`, getAuthHeader());
    return response.data;
};

// Search/filter resources
export const searchResources = async (filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);
    const response = await axios.get(`${API_BASE_URL}/resources/search?${params}`, getAuthHeader());
    return response.data;
};

// Create resource (ADMIN)
export const createResource = async (resourceData) => {
    const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, getAuthHeader());
    return response.data;
};

// Update resource (ADMIN)
export const updateResource = async (id, resourceData) => {
    const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData, getAuthHeader());
    return response.data;
};

// Update resource status (ADMIN)
export const updateResourceStatus = async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/resources/${id}/status`, { status }, getAuthHeader());
    return response.data;
};

// Delete resource (ADMIN)
export const deleteResource = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/resources/${id}`, getAuthHeader());
    return response.data;
};