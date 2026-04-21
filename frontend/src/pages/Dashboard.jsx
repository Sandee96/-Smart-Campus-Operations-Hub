import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserStats } from '../api/notificationApi'
import { useNotificationCount } from '../hooks/useNotificationCount'

function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user') || localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function nameToColor(name) {
  const colors = ['#0f766e','#0d9488','#0891b2','#7c3aed','#be185d','#b45309','#15803d','#1d4ed8']
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const user      = getStoredUser()
  const navigate  = useNavigate()
  const { count } = useNotificationCount()
  const [stats,   setStats]   = useState(null)
  const [imgError, setImgError] = useState(false)

  const isAdmin      = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'
  const isTechnician = user?.roles?.includes('TECHNICIAN') || user?.role === 'TECHNICIAN'

  useEffect(() => {
    if (isAdmin) {
      getUserStats().then(r => setStats(r.data)).catch(() => {})
    }
  }, [isAdmin])

  const showPicture = user?.picture && !imgError
  const avatarColor = nameToColor(user?.name)
  const initials    = getInitials(user?.name)

  // Quick action cards — different per role
  const quickActions = isAdmin ? [
    { icon: '👥', label: 'Manage Users',   desc: 'View and update user roles',      path: '/admin/users',     color: '#0f766e', bg: '#f0fdf4' },
    { icon: '📋', label: 'All Bookings',   desc: 'Review and approve bookings',      path: '/admin/bookings',  color: '#3b82f6', bg: '#eff6ff' },
    { icon: '🔔', label: 'Notifications',  desc: `${count} unread`,                  path: '/notifications',   color: '#f59e0b', bg: '#fffbeb' },
    { icon: '🗂',  label: 'Resources',      desc: 'Manage campus resources',          path: '/admin/resources', color: '#8b5cf6', bg: '#f5f3ff' },
  ] : isTechnician ? [
    { icon: '🎫', label: 'My Tickets',     desc: 'View assigned tickets',            path: '/tickets',         color: '#0f766e', bg: '#f0fdf4' },
    { icon: '🔔', label: 'Notifications',  desc: `${count} unread`,                  path: '/notifications',   color: '#f59e0b', bg: '#fffbeb' },
    { icon: '💬', label: 'Comments',       desc: 'View ticket comments',             path: '/comments',        color: '#3b82f6', bg: '#eff6ff' },
    { icon: '⚙️',  label: 'Preferences',   desc: 'Notification settings',            path: '/settings',        color: '#8b5cf6', bg: '#f5f3ff' },
  ] : [
    { icon: '📋', label: 'My Bookings',    desc: 'View and manage your bookings',    path: '/bookings',        color: '#0f766e', bg: '#f0fdf4' },
    { icon: '🏛',  label: 'Browse Resources', desc: 'Find rooms and equipment',      path: '/resources',       color: '#3b82f6', bg: '#eff6ff' },
    { icon: '🎫', label: 'My Tickets',     desc: 'View maintenance requests',        path: '/tickets',         color: '#f59e0b', bg: '#fffbeb' },
    { icon: '🔔', label: 'Notifications',  desc: `${count} unread`,                  path: '/notifications',   color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  return (
    <div className="fade-up">
      {/* ── Welcome banner ──────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(15,118,110,0.25)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 60, bottom: -60,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        {/* Left: text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: '0 0 4px' }}>
            {getGreeting()},
          </p>
          <h1 style={{
            color: 'white', fontSize: 28, fontWeight: 700,
            letterSpacing: -0.5, margin: '0 0 8px',
          }}>
            {user?.name?.split(' ')[0] || 'Welcome'} 👋
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', borderRadius: 20,
            padding: '4px 12px',
          }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>
              {isAdmin ? '🔑 Administrator' : isTechnician ? '🔧 Technician' : '🎓 Student'}
            </span>
          </div>
        </div>

        {/* Right: profile avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          overflow: 'hidden', position: 'relative', zIndex: 1,
          background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 26,
          border: '3px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {showPicture
            ? <img src={user.picture} alt={user.name}
                   onError={() => setImgError(true)}
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span>{initials}</span>
          }
        </div>
      </div>

      {/* ── Admin stats (only for admin) ────────── */}
      {isAdmin && stats && (
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Users',   value: stats.totalUsers,     icon: '👥', color: '#0f766e', bg: '#f0fdf4' },
            { label: 'Active Users',  value: stats.activeUsers,    icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Admins',        value: stats.adminCount,     icon: '🔑', color: '#ef4444', bg: '#fef2f2' },
            { label: 'Technicians',   value: stats.technicianCount,icon: '🔧', color: '#3b82f6', bg: '#eff6ff' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Unread notification alert ────────────── */}
      {count > 0 && (
        <div
          onClick={() => navigate('/notifications')}
          style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: 12, padding: '14px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fef3c7'}
          onMouseOut={e =>  e.currentTarget.style.background = '#fffbeb'}
        >
          <span style={{ fontSize: 20 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, color: '#92400e', fontSize: 14 }}>
              You have {count} unread notification{count > 1 ? 's' : ''}
            </span>
          </div>
          <span style={{ color: '#b45309', fontSize: 13 }}>View all →</span>
        </div>
      )}

      {/* ── Quick actions grid ───────────────────── */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {quickActions.map(a => (
            <div
              key={a.path}
              onClick={() => navigate(a.path)}
              className="card"
              style={{
                padding: '20px 22px', cursor: 'pointer',
                borderTop: `3px solid ${a.color}`,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: a.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 12,
              }}>{a.icon}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 15, marginBottom: 4 }}>
                {a.label}
              </div>
              <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>
                {a.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── User info card ───────────────────────── */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>
          Your Profile
        </h2>
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            overflow: 'hidden', background: avatarColor, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 20,
          }}>
            {showPicture
              ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span>{initials}</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
            <div style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 2 }}>{user?.email || ''}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <span className="badge badge-teal">
                {isAdmin ? 'ADMIN' : isTechnician ? 'TECHNICIAN' : 'USER'}
              </span>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Preferences
          </button>
        </div>
      </div>
    </div>
  )
}