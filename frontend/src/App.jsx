import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// ── Layout ────────────────────────────────────────────────────
import Sidebar from './components/layout/Sidebar'

// ── Jayani's pages ────────────────────────────────────────────
import Dashboard               from './pages/Dashboard'
import NotificationsPage       from './pages/NotificationsPage'
import AdminUsersPage          from './pages/AdminUsersPage'
import NotificationPreferences from './pages/NotificationPreferences'
import LoginPage               from './pages/LoginPage'
import AuthCallback            from './pages/AuthCallback'
import Unauthorized403         from './pages/Unauthorized403'

// ── Booking member's pages ────────────────────────────────────
import BookingsPage      from './pages/BookingsPage'
import CreateBookingPage from './pages/CreateBookingPage'
import BookingDetailPage from './pages/BookingDetailPage'
import QrCheckinPage     from './pages/QrCheckinPage'

// ── Placeholders for other teammates ─────────────────────────
const Placeholder = ({ name }) => (
  <div style={{ padding: '40px 0' }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{name}</h1>
    <p style={{ color: '#94a3b8', fontSize: 15 }}>This page is being built by another team member.</p>
  </div>
)

// ── Auth helpers ──────────────────────────────────────────────
function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user') || localStorage.getItem('user') || null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function isLoggedIn() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    const base64  = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    return payload.exp * 1000 > Date.now()
  } catch { return false }
}

function hasRole(role) {
  const user = getStoredUser()
  if (!user) return false
  return (user.roles || user.role || '').includes(role)
}

// ── Protected route ───────────────────────────────────────────
const ProtectedRoute = ({ children, role }) => {
  if (!isLoggedIn())          return <Navigate to="/login" replace />
  if (role && !hasRole(role)) return <Navigate to="/403"   replace />
  return children
}

// ── Top Navbar (from App 1) ───────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user     = getStoredUser()
  const isAdmin  = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' ||
                   (user?.roles || '').includes('ADMIN')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('smartcampus_user')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
            boxShadow: '0 2px 8px rgba(15,118,110,0.3)',
          }}>SC</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', lineHeight: 1.1 }}>
              Smart Campus Hub
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.05em' }}>
              SLIIT · OPERATIONS
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {[
            { to: '/bookings',     label: 'My Bookings' },
            { to: '/bookings/new', label: 'New Booking' },
            { to: '/dashboard',    label: 'Dashboard' },
            { to: '/notifications',label: 'Notifications' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s ease',
              background: isActive(to) ? '#f0fdf4' : 'transparent',
              color: isActive(to) ? '#0f766e' : '#64748b',
              borderBottom: isActive(to) ? '2px solid #0f766e' : '2px solid transparent',
            }}>{label}</Link>
          ))}

          {isAdmin && (
            <Link to="/admin/bookings" style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s ease',
              background: isActive('/admin/bookings') ? '#fffbeb' : 'transparent',
              color: isActive('/admin/bookings') ? '#b45309' : '#92400e',
              borderBottom: isActive('/admin/bookings') ? '2px solid #f59e0b' : '2px solid transparent',
            }}>⚡ Admin Panel</Link>
          )}
        </div>

        {/* User info + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {isAdmin ? '🔑 Admin' : '🎓 Student'}
              </div>
            </div>
          )}
          {user && (
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 12,
              overflow: 'hidden',
            }}>
              {user.picture
                ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user.name?.charAt(0).toUpperCase()
              }
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12, padding: '7px 14px', borderRadius: 8,
              border: '1.5px solid #e2e8f0', background: 'white',
              color: '#64748b', cursor: 'pointer', fontWeight: 500,
              transition: 'all 0.15s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
            onMouseOut={e  => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
          >Sign Out</button>
        </div>
      </div>
    </nav>
  )
}

// ── Main layout: Navbar on top, then sidebar + content ────────
function MainLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#f8fafc',
    }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + scrollable content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '32px 36px',
          background: '#f8fafc',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {

  // Capture token from OAuth2 redirect URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      try {
        const base64  = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const decoded = JSON.parse(window.atob(base64))
        const userObj = {
          id:      decoded.sub,
          name:    decoded.name    || '',
          email:   decoded.email   || '',
          picture: decoded.picture || '',
          roles:   decoded.roles   || 'USER',
          role:    decoded.roles?.split(',')?.[0] || 'USER',
        }
        localStorage.setItem('smartcampus_user', JSON.stringify(userObj))
        localStorage.setItem('user', JSON.stringify(userObj))
      } catch { /* silent */ }
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#0f766e', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* ── Public (no navbar/sidebar) ──────────────────── */}
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/403"           element={<Unauthorized403 />} />
        <Route path="/checkin"       element={<QrCheckinPage />} />

        {/* ── Protected (with navbar + sidebar) ───────────── */}
        <Route path="/*" element={
          isLoggedIn()
            ? (
              <MainLayout>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />

                  {/* ── JAYANI's pages ───────────────────── */}
                  <Route path="dashboard"     element={<Dashboard />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="settings"      element={<NotificationPreferences />} />
                  <Route path="admin/users"   element={
                    hasRole('ADMIN')
                      ? <AdminUsersPage />
                      : <Navigate to="/403" replace />
                  } />

                  {/* ── BOOKING member's pages ───────────── */}
                  <Route path=""               element={<BookingsPage mode="my" />} />
                  <Route path="bookings"       element={<BookingsPage mode="my" />} />
                  <Route path="admin/bookings" element={<BookingsPage mode="admin" />} />
                  <Route path="bookings/new"   element={<CreateBookingPage />} />
                  <Route path="bookings/:id"   element={<BookingDetailPage />} />

                  {/* ── RESOURCE member ──────────────────── */}
                  <Route path="resources"       element={<Placeholder name="🏛 Resources" />} />
                  <Route path="admin/resources" element={<Placeholder name="🗂 Manage Resources" />} />

                  {/* ── TICKET member ────────────────────── */}
                  <Route path="tickets"  element={<Placeholder name="🎫 Tickets" />} />
                  <Route path="comments" element={<Placeholder name="💬 Comments" />} />

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            )
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}