import { authAxios } from './authApi';

export const getNotifications     = ()    => authAxios.get('/api/notifications');
export const getUnreadNotifications = ()  => authAxios.get('/api/notifications/unread');
export const getUnreadCount       = ()    => authAxios.get('/api/notifications/unread/count');
export const markAsRead           = (id)  => authAxios.put(`/api/notifications/${id}/read`);
export const markAllAsRead        = ()    => authAxios.put('/api/notifications/read-all');
export const deleteNotification   = (id)  => authAxios.delete(`/api/notifications/${id}`);
export const getPreferences       = ()    => authAxios.get('/api/users/me/preferences');
export const updatePreferences    = (p)   => authAxios.put('/api/users/me/preferences', p);
export const getAllUsers           = ()    => authAxios.get('/api/admin/users');
export const getUserStats         = ()    => authAxios.get('/api/admin/users/stats');
export const updateUserRoles      = (id, roles) => authAxios.put(`/api/admin/users/${id}/roles`, { roles });
export const deactivateUser       = (id)  => authAxios.delete(`/api/admin/users/${id}`);