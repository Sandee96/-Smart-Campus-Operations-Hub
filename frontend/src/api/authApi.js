import axios from 'axios';

const BASE = 'http://localhost:8080';

export const getToken = () => localStorage.getItem('token');

export const parseJwt = (token) => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch { return null; }
};

export const getCurrentUser = () => {
    const token = getToken();
    if (!token) return null;
    return parseJwt(token);
};

export const hasRole = (role) => {
    const user = getCurrentUser();
    if (!user) return false;
    const roles = user.roles || '';
    return roles.includes(role);
};

export const isLoggedIn = () => {
    const token = getToken();
    if (!token) return false;
    const user = parseJwt(token);
    if (!user) return false;
    return user.exp * 1000 > Date.now();
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

export const getGoogleLoginUrl = () =>
    `${BASE}/oauth2/authorization/google`;

export const authAxios = axios.create({ baseURL: BASE });

authAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

authAxios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
    }
);