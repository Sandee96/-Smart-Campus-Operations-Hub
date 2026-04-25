import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications, markAsRead, markAllAsRead, deleteNotification
} from '../api/notificationApi'
import { useNotificationCount } from '../hooks/useNotificationCount'

// ── FIX 1: Added ACCOUNT_APPROVED and ACCOUNT_REJECTED entries ─────────────
const TYPE_META = {
  BOOKING_APPROVED:      { icon: '✅', bg: '#f0fdf4', label: 'Approved'  },
  BOOKING_REJECTED:      { icon: '❌', bg: '#fef2f2', label: 'Rejected'  },
  BOOKING_CANCELLED:     { icon: '⊘',  bg: '#fffbeb', label: 'Cancelled' },
  TICKET_STATUS_CHANGED: { icon: '🔄', bg: '#eff6ff', label: 'Ticket'    },
  TICKET_ASSIGNED:       { icon: '👤', bg: '#f5f3ff', label: 'Assigned'  },
  NEW_COMMENT:           { icon: '💬', bg: '#f0fdfa', label: 'Comment'   },
  ROLE_CHANGED:          { icon: '🔑', bg: '#fdf4ff', label: 'Role'      },
  // ── Previously missing ────────────────────────────────────────────────────
  ACCOUNT_APPROVED:      { icon: '🎉', bg: '#f0fdf4', label: 'Account'   },
  ACCOUNT_REJECTED:      { icon: '🚫', bg: '#fef2f2', label: 'Account'   },
  // ─────────────────────────────────────────────────────────────────────────
  GENERAL:               { icon: 'ℹ️',  bg: '#f8fafc', label: 'Info'     },
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

// ── FIX 2: Added 'Account' filter pill ────────────────────────────────────
const FILTERS = ['All', 'Unread', 'Bookings', 'Tickets', 'Comments', 'Account']

export default function NotificationsPage() {
  const navigate = useNavigate()  // FIX 3: needed for navigate-on-click
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter]   = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
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

  // ── FIX 3: Navigate to the related entity after marking as read ──────────
  const handleClick = async (n) => {
    // Always mark as read first if unread
    if (!n.read) await handleMarkRead(n.id)

    // Then navigate to the related entity based on referenceType
    if (n.referenceType === 'BOOKING' && n.referenceId) {
      navigate(`/bookings/${n.referenceId}`)
    } else if (n.referenceType === 'TICKET' && n.referenceId) {
      navigate(`/tickets/${n.referenceId}`)
    }
    // USER and NONE reference types — no navigation, just mark as read
  }

  // ── FIX 2: Account filter added ──────────────────────────────────────────
  const filtered = notifications.filter(n => {
    if (filter === 'Unread')   return !n.read
    if (filter === 'Bookings') return n.type?.startsWith('BOOKING')
    if (filter === 'Tickets')  return n.type?.startsWith('TICKET')
    if (filter === 'Comments') return n.type === 'NEW_COMMENT'
    if (filter === 'Account')  return (
      n.type === 'ACCOUNT_APPROVED' ||
      n.type === 'ACCOUNT_REJECTED' ||
      n.type === 'ROLE_CHANGED'
    )
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  // Count for Account filter badge (so user can see pending role/account notifs)
  const accountCount = notifications.filter(n =>
    !n.read && (
      n.type === 'ACCOUNT_APPROVED' ||
      n.type === 'ACCOUNT_REJECTED' ||
      n.type === 'ROLE_CHANGED'
    )
  ).length

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
            {f === 'Unread' && unreadCount > 0
              ? `Unread (${unreadCount})`
              : f === 'Account' && accountCount > 0
              ? `Account (${accountCount})`
              : f}
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
            {filter !== 'All'
              ? `No ${filter.toLowerCase()} notifications yet`
              : "You're all caught up!"}
          </p>
        </div>
      ) : (
        filtered.map((n, i) => {
          const meta = TYPE_META[n.type] || TYPE_META.GENERAL

          // FIX 3: show pointer cursor only when clicking will navigate somewhere
          const isClickable = n.referenceType === 'BOOKING' || n.referenceType === 'TICKET' || !n.read

          return (
            <div
              key={n.id}
              className={`notif-item${!n.read ? ' unread' : ''} fade-up`}
              style={{
                animationDelay: `${i * 0.04}s`,
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={() => handleClick(n)}
            >
              {/* Icon */}
              <div className="notif-icon-wrap" style={{ background: meta.bg }}>
                <span>{meta.icon}</span>
              </div>

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  {/* Show a small "View →" hint when notification has a linked entity */}
                  {(n.referenceType === 'BOOKING' || n.referenceType === 'TICKET') && n.referenceId && (
                    <span style={{ fontSize: 11, color: '#0f766e', fontWeight: 600 }}>
                      View {n.referenceType === 'BOOKING' ? 'Booking' : 'Ticket'} →
                    </span>
                  )}
                </div>
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