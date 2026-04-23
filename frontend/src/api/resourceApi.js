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
  getAll: () =>
    api.get("/resources").then((res) => ({
      data: { data: res.data, success: true },
    })),
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
  updateStatus: (id, status) =>
    api.patch(`/resources/${id}/status`, { status }),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Named export aliases for backward compatibility
export const getAllResources = () =>
  resourceApi.getAll().then((r) => r.data?.data || r.data || []);

export const getResourceById = (id) =>
  resourceApi.getById(id).then((r) => r.data?.data || r.data);

export const searchResources = (filters) =>
  resourceApi.search(filters).then((r) => r.data);
export const createResource = (data) =>
  resourceApi.create(data).then((r) => r.data);
export const updateResource = (id, data) =>
  resourceApi.update(id, data).then((r) => r.data);
export const updateResourceStatus = (id, status) =>
  resourceApi.updateStatus(id, status).then((r) => r.data);
export const deleteResource = (id) => resourceApi.delete(id);