import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar           from './components/layout/Sidebar'
import BookingsPage      from './pages/BookingsPage'
import CreateBookingPage from './pages/CreateBookingPage'
import BookingDetailPage from './pages/BookingDetailPage'
import QrCheckinPage     from './pages/QrCheckinPage'

function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user')
      || localStorage.getItem('user') || null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = getStoredUser()
  const isAdmin   = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('smartcampus_user')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:32 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:'linear-gradient(135deg, #0f766e, #0d9488)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontWeight:700, fontSize:13,
            boxShadow:'0 2px 8px rgba(15,118,110,0.3)',
          }}>SC</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:'#0f172a', lineHeight:1.1 }}>
              Smart Campus Hub
            </div>
            <div style={{ fontSize:10, color:'#94a3b8', letterSpacing:'0.05em' }}>
              SLIIT · OPERATIONS
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display:'flex', gap:2, flex:1 }}>
          {[
            { to:'/', label:'My Bookings' },
            { to:'/bookings/new', label:'New Booking' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:500,
              textDecoration:'none', transition:'all 0.15s ease',
              background: isActive(to) ? '#f0fdf4' : 'transparent',
              color: isActive(to) ? '#0f766e' : '#64748b',
              borderBottom: isActive(to) ? '2px solid #0f766e' : '2px solid transparent',
            }}>{label}</Link>
          ))}

          {isAdmin && (
            <Link to="/admin/bookings" style={{
              padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:600,
              textDecoration:'none', transition:'all 0.15s ease',
              background: isActive('/admin/bookings') ? '#fffbeb' : 'transparent',
              color: isActive('/admin/bookings') ? '#b45309' : '#92400e',
              borderBottom: isActive('/admin/bookings') ? '2px solid #f59e0b' : '2px solid transparent',
            }}>⚡ Admin Panel</Link>
          )}
        </div>

        {/* User info */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#0f172a', lineHeight:1.2 }}>
                {user.name}
              </div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>
                {isAdmin ? '🔑 Admin' : '🎓 Student'}
              </div>
            </div>
          )}
          {user && (
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:'linear-gradient(135deg, #0f766e, #0d9488)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontWeight:700, fontSize:12,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button onClick={handleLogout} style={{
            fontSize:12, padding:'7px 14px', borderRadius:8,
            border:'1.5px solid #e2e8f0', background:'white',
            color:'#64748b', cursor:'pointer', fontWeight:500,
            transition:'all 0.15s ease',
          }}
          onMouseOver={e => { e.target.style.borderColor='#ef4444'; e.target.style.color='#ef4444'; }}
          onMouseOut={e =>  { e.target.style.borderColor='#e2e8f0'; e.target.style.color='#64748b'; }}
          >Sign Out</button>
        </div>
      </div>
    </nav>
  )
}

export default function App() {

  // Capture JWT token from OAuth2 redirect URL and save to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      window.history.replaceState({}, '', '/')
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

      {/* App shell: navbar + sidebar + main content */}
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f8fafc' }}>

        {/* Top navbar — hidden on QR checkin page */}
        <Routes>
          <Route path="/checkin" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        {/* Sidebar + main */}
        <div style={{ display:'flex', flex:1 }}>

          {/* Sidebar — hidden on QR checkin page */}
          <Routes>
            <Route path="/checkin" element={null} />
            <Route path="*" element={<Sidebar notifCount={3} />} />
          </Routes>

          {/* Main content */}
          <main style={{ flex:1, minWidth:0, overflowX:'hidden' }}>
            <Routes>
              <Route path="/"               element={<BookingsPage mode="my" />} />
              <Route path="/admin/bookings" element={<BookingsPage mode="admin" />} />
              <Route path="/bookings/new"   element={<CreateBookingPage />} />
              <Route path="/bookings/:id"   element={<BookingDetailPage />} />
              <Route path="/checkin"        element={<QrCheckinPage />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  )
}