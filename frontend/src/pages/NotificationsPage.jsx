import { useState, useEffect } from 'react'
import {
  getNotifications, markAsRead, markAllAsRead, deleteNotification
} from '../api/notificationApi'
import { useNotificationCount } from '../hooks/useNotificationCount'

const TYPE_META = {
  BOOKING_APPROVED:      { icon: '✅', bg: '#f0fdf4', label: 'Approved' },
  BOOKING_REJECTED:      { icon: '❌', bg: '#fef2f2', label: 'Rejected' },
  BOOKING_CANCELLED:     { icon: '⊘',  bg: '#fffbeb', label: 'Cancelled' },
  TICKET_STATUS_CHANGED: { icon: '🔄', bg: '#eff6ff', label: 'Ticket' },
  TICKET_ASSIGNED:       { icon: '👤', bg: '#f5f3ff', label: 'Assigned' },
  NEW_COMMENT:           { icon: '💬', bg: '#f0fdfa', label: 'Comment' },
  ROLE_CHANGED:          { icon: '🔑', bg: '#fdf4ff', label: 'Role' },
  GENERAL:               { icon: 'ℹ️',  bg: '#f8fafc', label: 'Info' },
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const FILTERS = ['All', 'Unread', 'Bookings', 'Tickets', 'Comments']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { refresh } = useNotificationCount()

  const load = async () => {
    try {
      setLoading(true)
      const res = await getNotifications()
      setNotifications(res.data || [])
    } catch {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      refresh()
    } catch { /* silent */ }
  }

  const handleMarkAll = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      refresh()
    } catch { /* silent */ }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      refresh()
    } catch { /* silent */ }
  }

  const filtered = notifications.filter(n => {
    if (filter === 'Unread')   return !n.read
    if (filter === 'Bookings') return n.type?.startsWith('BOOKING')
    if (filter === 'Tickets')  return n.type?.startsWith('TICKET')
    if (filter === 'Comments') return n.type === 'NEW_COMMENT'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div>
      {/* ── Header ──────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* ── Filters ─────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-pill${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}{f === 'Unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────── */}
      {loading ? (
        <div className="empty-state"><div className="spinner spinner-lg" /></div>
      ) : error ? (
        <div className="alert-error">⚠ {error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 16 }}>No notifications</p>
          <p style={{ fontSize: 14 }}>
            {filter !== 'All' ? `No ${filter.toLowerCase()} notifications yet` : "You're all caught up!"}
          </p>
        </div>
      ) : (
        filtered.map((n, i) => {
          const meta = TYPE_META[n.type] || TYPE_META.GENERAL
          return (
            <div
              key={n.id}
              className={`notif-item${!n.read ? ' unread' : ''} fade-up`}
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => !n.read && handleMarkRead(n.id)}
            >
              {/* Icon */}
              <div className="notif-icon-wrap" style={{ background: meta.bg }}>
                <span>{meta.icon}</span>
              </div>

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{timeAgo(n.createdAt)}</div>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                {!n.read && <div className="notif-dot" />}
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '3px 8px', fontSize: 12 }}
                  onClick={(e) => handleDelete(n.id, e)}
                >✕</button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}