import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Same token interceptor as bookingApi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const resourceApi = {
  // Get all active resources for the booking form dropdown
  // Adjust the endpoint path to match what your Catalog teammate built
  getAll: () => api.get("/resources?status=ACTIVE"),

  // Get a single resource by ID for the booking detail page
  getById: (id) => api.get(`/resources/${id}`),
};
