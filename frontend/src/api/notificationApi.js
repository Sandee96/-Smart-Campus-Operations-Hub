import { authAxios } from './authApi'

// ── Notification endpoints ─────────────────────────────────────
export const getNotifications       = ()       => authAxios.get('/api/notifications')
export const getUnreadNotifications = ()       => authAxios.get('/api/notifications/unread')
export const getUnreadCount         = ()       => authAxios.get('/api/notifications/unread/count')
export const createNotification     = (dto)    => authAxios.post('/api/notifications', dto)
export const markAsRead             = (id)     => authAxios.put(`/api/notifications/${id}/read`)
export const markAllAsRead          = ()       => authAxios.put('/api/notifications/read-all')
export const deleteNotification     = (id)     => authAxios.delete(`/api/notifications/${id}`)

// ── Preference endpoints ───────────────────────────────────────
export const getPreferences         = ()       => authAxios.get('/api/users/me/preferences')
export const updatePreferences      = (prefs)  => authAxios.put('/api/users/me/preferences', prefs)

// ── Admin / User endpoints ─────────────────────────────────────
export const getAllUsers             = ()       => authAxios.get('/api/admin/users')
export const getPendingUsers        = ()       => authAxios.get('/api/admin/users/pending')
export const getUserStats           = ()       => authAxios.get('/api/admin/users/stats')
export const updateUserRoles        = (id, r)  => authAxios.put(`/api/admin/users/${id}/roles`, { roles: r })
export const approveUser            = (id, r)  => authAxios.put(`/api/admin/users/${id}/approve`, { roles: r })
export const rejectUser             = (id)     => authAxios.put(`/api/admin/users/${id}/reject`)
export const deactivateUser         = (id)     => authAxios.delete(`/api/admin/users/${id}`)