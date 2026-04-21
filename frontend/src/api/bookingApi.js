import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Attach JWT token to every request
// Change 'token' to match whatever key your Auth teammate uses in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token is expired or missing, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("smartcampus_user");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const bookingApi = {
  createBooking: (data) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my"),
  getAllBookings: () => api.get("/bookings"),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  approveReject: (id, action, note) =>
    api.patch(`/bookings/${id}/action`, { action, note }),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  checkIn: (token) => api.post(`/bookings/checkin?token=${token}`),
};
