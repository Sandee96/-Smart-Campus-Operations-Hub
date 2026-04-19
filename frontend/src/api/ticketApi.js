import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/tickets",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTickets = () => API.get("/");
export const getMyTickets = () => API.get("/my");
export const getTicketById = (id) => API.get(`/${id}`);
export const createTicket = (data) => API.post("/", data);
export const updateTicketStatus = (id, data) => API.patch(`/${id}/status`, data);
export const deleteTicket = (id) => API.delete(`/${id}`);

export const getComments = (ticketId) => API.get(`/${ticketId}/comments`);
export const addComment = (ticketId, data) => API.post(`/${ticketId}/comments`, data);

export const uploadAttachments = (ticketId, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));

  return API.post(`/${ticketId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};