import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import RegisterPage  from './pages/RegisterPage'
import PendingPage   from './pages/PendingPage'
import RejectedPage  from './pages/RejectedPage'

// ── Booking member's pages ────────────────────────────────────
import BookingsPage      from './pages/BookingsPage'
import CreateBookingPage from './pages/CreateBookingPage'
import BookingDetailPage from './pages/BookingDetailPage'
import QrCheckinPage     from './pages/QrCheckinPage'

// ── Resource member's pages ────────────────────────────────────
import ResourceListPage   from './pages/ResourceListPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourceFormPage   from './pages/ResourceFormPage'

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

// ── Main layout: sidebar + content (no navbar) ───────────────
function MainLayout({ children }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('smartcampus_user')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#f8fafc',
    }}>
      <Sidebar onLogout={handleLogout} />

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
        {/* ── Public (no sidebar) ────────────────────────── */}
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/pending"  element={<PendingPage />} />
        <Route path="/auth/rejected" element={<RejectedPage />} />
        <Route path="/403"           element={<Unauthorized403 />} />
        <Route path="/checkin"       element={<QrCheckinPage />} />

        {/* ── Protected (sidebar only) ────────────────────── */}
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
                  <Route path="resources"          element={<ResourceListPage mode="catalogue" />} />
                  <Route path="resources/:id"      element={<ResourceDetailPage />} />
                  <Route path="resources/create"   element={<ResourceFormPage />} />
                  <Route path="resources/edit/:id" element={<ResourceFormPage />} />
                  <Route path="admin/resources"    element={<ResourceListPage mode="manage" />} />

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