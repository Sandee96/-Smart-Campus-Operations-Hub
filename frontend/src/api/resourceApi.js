import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const resourceApi = {
  getAll: () => api.get("/resources"),

  getById: (id) => api.get(`/resources/${id}`),

  search: (filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
    if (filters.location) params.append("location", filters.location);
    if (filters.status) params.append("status", filters.status);
    return api.get(`/resources/search?${params}`);
  },

  create: (resourceData) => api.post("/resources", resourceData),

  update: (id, resourceData) => api.put(`/resources/${id}`, resourceData),

  updateStatus: (id, status) => api.patch(`/resources/${id}/status`, { status }),

  delete: (id) => api.delete(`/resources/${id}`),
};