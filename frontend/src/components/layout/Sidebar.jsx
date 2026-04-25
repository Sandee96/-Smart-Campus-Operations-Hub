import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useNotificationCount } from '../../hooks/useNotificationCount'
import logo from '../../assets/unidesk_logo_cute_large.png'

function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user')
      || localStorage.getItem('user') || null
    if (raw) return JSON.parse(raw)
    const token = localStorage.getItem('token')
    if (!token) return null
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  } catch { return null }
}

function nameToColor(name) {
  const colors = [
    '#0f766e', '#0d9488', '#0891b2', '#7c3aed',
    '#be185d', '#b45309', '#15803d', '#1d4ed8',
  ]
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ── Returns a friendly role label based on roles array ───────
function getRoleLabel(user) {
  const roles = user?.roles || ''
  if (roles.includes('ADMIN'))      return '🔑 Admin'
  if (roles.includes('TECHNICIAN')) return '🔧 Technician'
  // USER role — show userType if available
  const userType = user?.userType
  if (userType === 'STAFF')         return '👔 Staff'
  return '🎓 Student'
}

const NAV_ITEMS = [
  {
    section: 'CAMPUS',
    items: [
      { to: '/dashboard',     icon: '🏠', label: 'Dashboard',     badge: null },
      { to: '/bookings',      icon: '📋', label: 'Bookings',      badge: null },
      { to: '/resources',     icon: '🏛',  label: 'Resources',     badge: null },
      { to: '/notifications', icon: '🔔', label: 'Notifications', badge: 'notif' },
      { to: '/tickets',       icon: '🎫', label: 'Tickets',       badge: null },
      { to: '/comments',      icon: '💬', label: 'Comments',      badge: null },
      { to: '/settings',      icon: '⚙️',  label: 'Preferences',  badge: null },
    ],
  },
]

const ADMIN_ITEMS = {
  section: 'ADMIN',
  items: [
    { to: '/admin/bookings',  icon: '⚡', label: 'All Bookings',     badge: null },
    { to: '/admin/resources', icon: '🗂',  label: 'Manage Resources', badge: null },
    { to: '/admin/users',     icon: '👥', label: 'Users',            badge: null },
  ],
}

export default function Sidebar({ onLogout }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const user      = getStoredUser()
  const { count } = useNotificationCount()
  const [collapsed, setCollapsed] = useState(false)
  const [imgError,  setImgError]  = useState(false)

  const isAdmin = user?.roles?.includes('ADMIN')
    || user?.role === 'ROLE_ADMIN'
    || user?.role === 'ADMIN'

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('smartcampus_user')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  const allSections = isAdmin ? [...NAV_ITEMS, ADMIN_ITEMS] : NAV_ITEMS

  const showPicture = user?.picture && !imgError
  const avatarColor = nameToColor(user?.name)
  const initials    = getInitials(user?.name)
  const roleLabel   = getRoleLabel(user)

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        minWidth: collapsed ? 68 : 240,
        minHeight: '100vh',
        background: '#5eead4',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ───────────────────────────────── */}
      <div style={{
        padding: collapsed ? '16px 10px' : '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
        minHeight: 72,
      }}>

        {/* Expanded logo + text side by side */}
        {!collapsed && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
          }}>
            <img
              src={logo}
              alt="UniDesk"
              style={{
                width: 56,
                height: 56,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}>UniDesk</div>
              <div style={{
                fontSize: 10,
                color: '#0f766e',
                letterSpacing: '0.08em',
                fontWeight: 600,
                marginTop: 2,
              }}>SLIIT · OPS</div>
            </div>
          </div>
        )}

        {/* Collapsed logo */}
        {collapsed && (
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.3)',
          }}>
            <img
              src={logo}
              alt="UniDesk"
              style={{
                width: 46,
                height: 46,
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 13,
            color: '#0f766e',
            transition: 'all 0.15s ease',
            alignSelf: collapsed ? 'center' : 'flex-start',
            marginTop: collapsed ? 0 : 4,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
          onMouseOut={e =>  e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Nav sections ────────────────────────── */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {allSections.map(section => (
          <div key={section.section} style={{ marginBottom: 8 }}>

            {/* Section label */}
            {!collapsed
              ? <p style={{
                  fontSize: 9, fontWeight: 700,
                  color: '#0f766e',
                  letterSpacing: '0.1em',
                  padding: '6px 10px 4px',
                  margin: 0,
                }}>{section.section}</p>
              : <div style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.4)',
                  margin: '8px 6px',
                }} />
            }

            {section.items.map(item => {
              const active   = isActive(item.to)
              const badgeNum = item.badge === 'notif' ? count : 0

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: collapsed ? '9px 0' : '9px 12px',
                    borderRadius: 9,
                    marginBottom: 2,
                    textDecoration: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: active
                      ? 'rgba(255,255,255,0.6)'
                      : 'transparent',
                    color: active ? '#0f766e' : '#0f5f58',
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    borderLeft: active
                      ? '3px solid #0f766e'
                      : '3px solid transparent',
                  }}
                  onMouseOver={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.35)'
                      e.currentTarget.style.color = '#0f172a'
                    }
                  }}
                  onMouseOut={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#0f5f58'
                    }
                  }}
                >
                  {/* Icon */}
                  <span style={{
                    fontSize: 17,
                    flexShrink: 0,
                    position: 'relative',
                  }}>
                    {item.icon}
                    {/* Badge dot when collapsed */}
                    {collapsed && badgeNum > 0 && (
                      <span style={{
                        position: 'absolute', top: -4, right: -6,
                        width: 14, height: 14, borderRadius: '50%',
                        background: '#ef4444', color: 'white',
                        fontSize: 8, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid white',
                      }}>{badgeNum > 9 ? '9+' : badgeNum}</span>
                    )}
                  </span>

                  {/* Label + badge when expanded */}
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                      {badgeNum > 0 && (
                        <span style={{
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: 10,
                          padding: '1px 7px',
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>{badgeNum > 99 ? '99+' : badgeNum}</span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User profile at bottom ───────────────── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.3)',
        padding: collapsed ? '14px 10px' : '14px',
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Avatar */}

            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              overflow: 'hidden', position: 'relative',
              background: avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 13,
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}>
              {showPicture
                ? <img
                    src={user.picture}
                    alt={user.name}
                    onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                : <span>{initials}</span>
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 13, fontWeight: 600, color: '#0f172a',
                margin: 0, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user?.name || 'User'}</p>

              <p style={{ fontSize: 11, color: '#0f5f58', margin: 0 }}>
                {roleLabel}
              </p>
            </div>
          </div>
        ) : (

          /* Collapsed avatar */

          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            overflow: 'hidden', margin: '0 auto',
            background: avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
          }}>
            {showPicture
              ? <img
                  src={user.picture}
                  alt=""
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              : <span>{initials}</span>
            }
          </div>
        )}


        {/* Sign Out button — only when expanded */}

        {!collapsed && (
          <button
            onClick={handleLogout}
            style={{
              marginTop: 10,
              width: '100%',
              padding: '7px 0',
              borderRadius: 8,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseOut={e =>  e.currentTarget.style.background = '#fef2f2'}
          >
            Sign Out
          </button>
        )}
      </div>
    </aside>
  )
}