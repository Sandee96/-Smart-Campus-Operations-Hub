import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user')
      || localStorage.getItem('user') || null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const NAV_ITEMS = [
  {
    section: 'CAMPUS',
    items: [
      { to: '/dashboard',              icon: '🏠', label: 'Dashboard',   badge: null },
      { to: '/',              icon: '📋', label: 'Bookings',   badge: null },
      { to: '/resources',     icon: '🏛', label: 'Resources',     badge: null },
      { to: '/notifications', icon: '🔔', label: 'Notifications', badge: 'notif' },
      { to: '/tickets',       icon: '🎫', label: 'Tickets',       badge: null },
      { to: '/comments',      icon: '💬', label: 'Comments',      badge: null },
    ]
  },
]

const ADMIN_ITEMS = {
  section: 'ADMIN',
  items: [
    { to: '/admin/bookings',  icon: '⚡', label: 'All Bookings',     badge: null },
    { to: '/admin/resources', icon: '🗂', label: 'Manage Resources', badge: null },
  ]
}

export default function Sidebar({ notifCount = 0 }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const user      = getStoredUser()
  const isAdmin   = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('smartcampus_user')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const allSections = isAdmin
    ? [...NAV_ITEMS, ADMIN_ITEMS]
    : NAV_ITEMS

  return (
    <aside style={{
      width: collapsed ? 68 : 240,
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
    }}>

      {/* ── Logo ─────────────────────────────────── */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
        minHeight: 68,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 13,
              boxShadow: '0 2px 8px rgba(15,118,110,0.3)',
            }}>SC</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontWeight: 700, fontSize: 13, color: '#0f172a',
                lineHeight: 1.2, whiteSpace: 'nowrap',
              }}>Smart Campus</div>
              <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.05em' }}>
                SLIIT · OPS
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
          }}>SC</div>
        )}

        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 11, color: '#94a3b8',
            transition: 'all 0.15s ease',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Nav sections ─────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {allSections.map(section => (
          <div key={section.section} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <p style={{
                fontSize: 9, fontWeight: 700, color: '#cbd5e1',
                letterSpacing: '0.1em', padding: '6px 10px 4px',
                margin: 0,
              }}>{section.section}</p>
            )}
            {collapsed && (
              <div style={{ height: 1, background: '#f1f5f9', margin: '8px 6px' }} />
            )}

            {section.items.map(item => {
              const active = isActive(item.to)
              const badgeNum = item.badge === 'notif' ? notifCount : 0

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
                    background: active ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'transparent',
                    color: active ? '#0f766e' : '#64748b',
                    fontWeight: active ? 600 : 400,
                    fontSize: 13,
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    borderLeft: active ? '3px solid #0f766e' : '3px solid transparent',
                  }}
                  onMouseOver={e => {
                    if (!active) {
                      e.currentTarget.style.background = '#f8fafc'
                      e.currentTarget.style.color = '#0f172a'
                    }
                  }}
                  onMouseOut={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#64748b'
                    }
                  }}
                >
                  <span style={{
                    fontSize: 16, flexShrink: 0,
                    filter: active ? 'none' : 'grayscale(30%)',
                    position: 'relative',
                  }}>
                    {item.icon}
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

                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                      {badgeNum > 0 && (
                        <span style={{
                          background: '#ef4444', color: 'white',
                          borderRadius: 10, padding: '1px 7px',
                          fontSize: 10, fontWeight: 700, flexShrink: 0,
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

      {/* ── User profile at bottom ────────────────── */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        padding: collapsed ? '14px 10px' : '14px 14px',
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 12,
            }}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: '#0f172a',
                margin: 0, whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>
                {isAdmin ? '🔑 Admin' : '🎓 Student'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#ef4444', cursor: 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
              onMouseOut={e =>  e.currentTarget.style.background = '#fef2f2'}
            >↪</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 11,
            }}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#ef4444', cursor: 'pointer', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >↪</button>
          </div>
        )}
      </div>
    </aside>
  )
}