import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../api/authApi'
import logo from '../assets/unidesk_logo_cute_large.png'

export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = 'auto' }
  }, [])

  const handleStart = (path) => {
    if (isLoggedIn()) {
      navigate('/dashboard')
      return
    }
    navigate(path)
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'DM Sans, sans-serif',
      color: '#0f172a',
      overflowX: 'hidden'
    }}>
      {/* ── Navbar ────────────────────────────────────────── */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'fixed', width: '100%', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
            <img 
              src={logo} alt="Smart Campus Hub Logo" 
              style={{
                width: 42, height: 42, borderRadius: 12,
                boxShadow: '0 4px 12px rgba(15,118,110,0.15)',
                objectFit: 'contain', background: '#0f766e', padding: 3
              }} 
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Smart Campus Hub</div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>SLIIT · FACULTY OF COMPUTING</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['Home', 'Facilities', 'Bookings', 'About'].map((link, i) => (
              <span 
                key={link}
                onClick={() => i === 0 ? window.scrollTo(0,0) : scrollTo(link.toLowerCase())} 
                style={{ cursor: 'pointer', fontSize: 15, fontWeight: 500, color: '#64748b', transition: 'color 0.2s' }} 
                onMouseOver={e=>e.currentTarget.style.color='#0f766e'} 
                onMouseOut={e=>e.currentTarget.style.color='#64748b'}
              >
                {link}
              </span>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => handleStart('/login')}
              style={{
                background: 'white', border: '1px solid #0f766e', color: '#0f766e', borderRadius: 8,
                fontWeight: 600, fontSize: 14, padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
              onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
              Log In
            </button>
            <button
              onClick={() => handleStart('/auth/register')}
              style={{
                border: 'none', borderRadius: 8, background: '#0f766e',
                color: 'white', padding: '9px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#0d9488'}
              onMouseOut={e => e.currentTarget.style.background = '#0f766e'}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────── */}
      <main style={{ paddingTop: 75 }}>
        <section style={{ 
          position: 'relative', padding: '100px 24px 80px', textAlign: 'center',
          background: 'linear-gradient(135deg, #115e59 0%, #0f766e 100%)', color: 'white'
        }}>
          {/* Subtle radial glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 10, animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ 
              display: 'inline-block', padding: '6px 16px', borderRadius: 20, 
              background: 'rgba(255,255,255,0.1)', color: '#ccfbf1', fontSize: 13, fontWeight: 600, 
              marginBottom: 24, border: '1px solid rgba(255,255,255,0.2)'
            }}>
              🚀 SLIIT Campus Operations Platform
            </div>
            
            <h1 style={{ 
              margin: 0, color: 'white', fontSize: 'clamp(44px, 5vw, 64px)', 
              fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15,
              maxWidth: 800, marginInline: 'auto'
            }}>
              One Hub for Your<br/>
              <span style={{ color: '#99f6e4' }}>Entire Campus</span>
            </h1>
            
            <p style={{ 
              marginTop: 24, color: '#ccfbf1', fontSize: 'clamp(16px, 2vw, 19px)', 
              maxWidth: 700, marginInline: 'auto', lineHeight: 1.6, fontWeight: 400
            }}>
              Book facilities, report incidents, manage resources and stay notified — all in one smart platform built for students, staff and administrators.
            </p>
            
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => handleStart('/auth/register')}
                style={{
                  border: 'none', borderRadius: 8, background: 'white',
                  color: '#0f766e', padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                🚀 Get Started Free
              </button>
              <button
                onClick={() => scrollTo('facilities')}
                style={{
                  border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, background: 'rgba(255,255,255,0.05)',
                  color: 'white', padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              >
                📖 Learn More
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ marginTop: 70, display: 'flex', justifyContent: 'center', gap: 'clamp(30px, 6vw, 80px)', flexWrap: 'wrap' }}>
              {[
                { val: '48+', label: 'CAMPUS FACILITIES' },
                { val: '1,200+', label: 'ACTIVE USERS' },
                { val: '99.9%', label: 'UPTIME' },
                { val: '5 sec', label: 'AVG. BOOKING TIME' }
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 4 }}>{stat.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#99f6e4', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Section (What We Offer) ──────────────── */}
        <section id="facilities" style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 50 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', letterSpacing: '0.1em', marginBottom: 12 }}>WHAT WE OFFER</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>Everything your campus needs</h2>
              <p style={{ color: '#64748b', fontSize: 18, marginTop: 12 }}>From booking a lecture hall to reporting a broken AC — Smart Campus Hub has it covered.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {[
                { title: 'Facility Catalogue', desc: 'Browse all campus spaces — labs, halls, courts and meeting rooms. See live availability at a glance.', icon: '🏫', bg: '#f1f5f9' },
                { title: 'Smart Booking', desc: 'Reserve any facility in seconds. Built-in conflict detection prevents double bookings automatically.', icon: '📅', bg: '#eff6ff' },
                { title: 'Incident Tickets', desc: 'Report maintenance issues, upload photos, and track technician updates in real time.', icon: '🔧', bg: '#fff7ed' },
                { title: 'Smart Notifications', desc: 'Get instant alerts for booking confirmations, incident updates and role changes via email or in-app.', icon: '🔔', bg: '#fef2f2' },
              ].map(srv => (
                <div key={srv.title} style={{ 
                  padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', background: 'white',
                  transition: 'all 0.3s ease', cursor: 'default'
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,118,110,0.06)'; e.currentTarget.style.borderColor = '#0f766e' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: srv.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
                    {srv.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{srv.title}</h3>
                  <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6, fontSize: 15 }}>{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────── */}
        <section id="bookings" style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', letterSpacing: '0.1em', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 50px' }}>Four simple steps</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40, alignItems: 'flex-start' }}>
              {[
                { step: '1', title: 'Log In Securely', desc: 'Sign in with your SLIIT account using OAuth 2.0.' },
                { step: '2', title: 'Browse & Book', desc: 'Find the facility you need and confirm your booking.' },
                { step: '3', title: 'Report Incidents', desc: 'Easily submit maintenance tickets with photo evidence.' },
                { step: '4', title: 'Stay Updated', desc: 'Receive real-time notifications via email or in-app.' }
              ].map((item, i) => (
                <div key={item.step} style={{ flex: '1 1 200px', position: 'relative' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0f766e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, margin: '0 auto 20px', position: 'relative', zIndex: 2 }}>
                    {item.step}
                  </div>
                  {i < 3 && <div className="step-line" style={{ position: 'absolute', top: 24, right: '-50%', width: '100%', height: 2, background: '#e2e8f0', zIndex: 1 }} />}
                  <h4 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Role Based Access Cards ───────────────────────── */}
        <section id="about" style={{ padding: '80px 24px', background: 'white', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', letterSpacing: '0.1em', marginBottom: 12 }}>BUILT FOR EVERYONE</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>Who uses Smart Campus Hub?</h2>
            <p style={{ color: '#64748b', fontSize: 18, marginTop: 12 }}>Role-based access ensures every user sees exactly what they need.</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, maxWidth: 1100, margin: '0 auto'
          }}>
            {[
              { title: 'Students', icon: '🎓', badges: ['Book Facilities', 'Report Incidents', 'View Bookings'], text: 'Browse facilities, book rooms and report maintenance issues with ease.' },
              { title: 'Staff & Managers', icon: '👔', badges: ['Manage Facilities', 'Approve Bookings', 'View Reports'], text: 'Manage facility schedules, approve bookings and oversee campus resources.' },
              { title: 'Administrators', icon: '🔐', badges: ['Full Access', 'Manage Users', 'System Config'], text: 'Full system control — users, roles, analytics and all campus operations.' },
            ].map((card) => (
              <article
                key={card.title}
                style={{
                  border: '1px solid #e2e8f0', borderRadius: 16, background: 'white',
                  padding: 32, textAlign: 'center', transition: 'all 0.3s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,118,110,0.08)' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: 20, fontWeight: 800 }}>{card.title}</h3>
                <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>{card.text}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                  {card.badges.map(b => (
                    <span key={b} style={{ padding: '4px 10px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', fontSize: 12, fontWeight: 600 }}>{b}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#064e3b', color: 'white', padding: '60px 24px 30px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 60 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>🏫</span>
                <span style={{ fontWeight: 700, fontSize: 18 }}>Smart Campus Hub</span>
              </div>
              <p style={{ color: '#a7f3d0', fontSize: 14, lineHeight: 1.6 }}>
                A modern campus operations platform built by SLIIT IT Year 3 students for the PAF module, 2026.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20, color: '#a7f3d0' }}>PLATFORM</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#e2e8f0' }}>
                <span style={{ cursor: 'pointer' }}>Facilities</span>
                <span style={{ cursor: 'pointer' }}>Bookings</span>
                <span style={{ cursor: 'pointer' }}>Incidents</span>
                <span style={{ cursor: 'pointer' }}>Notifications</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20, color: '#a7f3d0' }}>ACCESS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#e2e8f0' }}>
                <span style={{ cursor: 'pointer' }}>Student Login</span>
                <span style={{ cursor: 'pointer' }}>Staff Login</span>
                <span style={{ cursor: 'pointer' }}>Admin Panel</span>
                <span style={{ cursor: 'pointer' }}>OAuth 2.0</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 20, color: '#a7f3d0' }}>SUPPORT</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#e2e8f0' }}>
                <span style={{ cursor: 'pointer' }}>Help Centre</span>
                <span style={{ cursor: 'pointer' }}>API Docs</span>
                <span style={{ cursor: 'pointer' }}>Report a Bug</span>
                <span style={{ cursor: 'pointer' }}>Contact IT</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(167,243,208,0.2)', paddingTop: 30, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <p style={{ margin: 0, color: '#a7f3d0', fontSize: 13 }}>
              © 2026 Smart Campus Operations Hub · SLIIT Faculty of Computing · IT3030 PAF
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ border: '1px solid rgba(167,243,208,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, color: '#a7f3d0' }}>React</span>
              <span style={{ border: '1px solid rgba(167,243,208,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, color: '#a7f3d0' }}>Spring Boot</span>
              <span style={{ border: '1px solid rgba(167,243,208,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, color: '#a7f3d0' }}>REST API</span>
              <span style={{ border: '1px solid rgba(167,243,208,0.3)', padding: '4px 10px', borderRadius: 20, fontSize: 11, color: '#a7f3d0' }}>OAuth 2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
