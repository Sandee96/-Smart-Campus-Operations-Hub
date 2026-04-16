// src/services/mockAuthService.js
export const getCurrentUser = () => {
  return {
    id: "user123",
    name: "Chamini",
    role: "USER",
    isLoggedIn: true,
  };
};