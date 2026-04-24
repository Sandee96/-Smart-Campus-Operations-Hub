import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeRegistration, parseJwt, getToken, getGoogleLoginUrl, isLoggedIn } from '../api/authApi'
import logo from '../assets/unidesk_logo_cute_large.png'

export default function RegisterPage() {
  const navigate   = useNavigate()
  const [selected, setSelected] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      const decoded = parseJwt(token)
      if (decoded?.name) setUserName(decoded.name.split(' ')[0])
      if (decoded?.email) setUserEmail(decoded.email)
      setHasToken(true)

      const pending = sessionStorage.getItem('pendingUserType')
      if (pending) { setSelected(pending); sessionStorage.removeItem('pendingUserType') }
    } else {
      const existingToken = getToken()
      if (existingToken && isLoggedIn()) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate])

  const handleGoogleSignup = () => {
    if (!selected) { setError('Please select your account type first.'); return }
    sessionStorage.setItem('pendingUserType', selected)
    window.location.href = getGoogleLoginUrl()
  }

  const handleSubmit = async () => {
    if (!selected) { setError('Please select your account type to continue.'); return }
    setLoading(true); setError('')
    try {
      const res = await completeRegistration(selected)
      const { status, token } = res.data

      if (status === 'ACTIVE' && token) {
        localStorage.setItem('token', token)
        const decoded = parseJwt(token)
        if (decoded) {
          const userObj = {
            id: decoded.sub, name: decoded.name || '',
            email: decoded.email || '', picture: decoded.picture || '',
            roles: decoded.roles || 'USER',
            role: decoded.roles?.split(',')?.[0] || 'USER',
          }
          localStorage.setItem('smartcampus_user', JSON.stringify(userObj))
          localStorage.setItem('user', JSON.stringify(userObj))
        }
        navigate('/dashboard', { replace: true })
      } else if (status === 'PENDING') {
        localStorage.removeItem('token')
        localStorage.removeItem('smartcampus_user')
        localStorage.removeItem('user')
        navigate(`/auth/pending?email=${encodeURIComponent(userEmail)}`, { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const USER_TYPES = [
    {
      value: 'STUDENT', icon: '🎓', label: 'Student',
      desc: 'Instant access to book facilities and manage resources',
      color: '#0f766e', bg: '#f0fdf4',
      accessLabel: '✅ Instant access', accessColor: '#16a34a',
    },
    {
      value: 'STAFF', icon: '👔', label: 'Staff Member',
      desc: 'Faculty or admin staff access',
      color: '#3b82f6', bg: '#eff6ff',
      accessLabel: '⏳ Requires admin approval', accessColor: '#b45309',
    },
    {
      value: 'TECHNICIAN', icon: '🔧', label: 'Technician',
      desc: 'Handle maintenance tickets and operations',
      color: '#8b5cf6', bg: '#f5f3ff',
      accessLabel: '⏳ Requires admin approval', accessColor: '#b45309',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* ── Left Panel (Branding) ───────────────────── */}
      <div style={{
        width: '45%', 
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px',
        position: 'relative', overflow: 'hidden',
        color: 'white'
      }}>
        {/* Decorative glass circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo area */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', zIndex: 10 }} 
          onClick={() => navigate('/')}
        >
          <img 
            src={logo} 
            alt="UniDesk Logo" 
            style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.95)', padding: 4, objectFit: 'contain' }} 
          />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>UniDesk</span>
        </div>

        {/* Hero text */}
        <div style={{ zIndex: 10, animation: 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-1px' }}>
            Smart Campus Operations Hub
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 36, maxWidth: '90%' }}>
            A unified platform to book resources, manage facilities, and track maintenance tickets across the entire SLIIT campus.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🏛', text: 'Book rooms and labs instantly' },
              { icon: '🎫', text: 'Track maintenance and tech support' },
              { icon: '🔔', text: 'Receive automated notifications' },
              { icon: '🔐', text: 'Secure one-click Google access' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, 
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ zIndex: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          © {new Date().getFullYear()} SLIIT Operations.
        </div>
      </div>

      {/* ── Right Panel (Form) ───────────────────── */}
      <div style={{ 
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '40px', background: '#f8fafc', position: 'relative' 
      }}>
        {/* Back Button (Top Left) */}
        <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 50 }}>
          <div 
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
            onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}
          >
            ← Back to Home
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 540, marginTop: 40, animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>
              {hasToken ? `Welcome${userName ? `, ${userName}` : ''}! 👋` : 'Create your account'}
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
              {hasToken
                ? 'Tell us what best describes you so we can set up your dashboard.'
                : 'Select your account type to get started with UniDesk.'}
            </p>
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 12 }}>I AM A…</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {USER_TYPES.map(type => (
              <div
                key={type.value}
                onClick={() => { setSelected(type.value); setError('') }}
                style={{
                  border: selected === type.value ? `2px solid ${type.color}` : '1.5px solid #e2e8f0',
                  borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
                  background: selected === type.value ? type.bg : 'white',
                  display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: selected === type.value ? `0 4px 20px ${type.color}20` : '0 2px 4px rgba(0,0,0,0.02)',
                  transform: selected === type.value ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                <div style={{ 
                  width: 46, height: 46, borderRadius: 12, background: type.bg, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 
                }}>
                  {type.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 2 }}>{type.label}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.4, marginBottom: 6 }}>{type.desc}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: type.accessColor, letterSpacing: '0.02em' }}>{type.accessLabel}</div>
                </div>
                <div style={{ 
                  width: 20, height: 20, borderRadius: '50%', 
                  border: selected === type.value ? `6px solid ${type.color}` : '2px solid #cbd5e1', 
                  transition: 'all 0.2s ease', flexShrink: 0 
                }} />
              </div>
            ))}
          </div>

          {(selected === 'STAFF' || selected === 'TECHNICIAN') && (
            <div style={{ 
              background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, 
              padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400e', lineHeight: 1.6,
              animation: 'fadeUp 0.3s ease'
            }}>
              <strong>Note:</strong> Your account will require approval from the campus administrator before you can access the system.
            </div>
          )}

          {error && <div className="alert-error" style={{ marginBottom: 16, borderRadius: 12 }}>⚠ {error}</div>}

          {/* CTA */}
          {hasToken ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !selected}
              style={{
                width: '100%', padding: '18px', borderRadius: 14,
                background: selected ? 'linear-gradient(135deg, #0f766e, #0d9488)' : '#e2e8f0',
                color: selected ? 'white' : '#94a3b8', fontWeight: 600, fontSize: 17,
                border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: selected ? '0 8px 20px rgba(15,118,110,0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {loading
                ? <><div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Setting up your account…</>
                : 'Complete Registration →'
              }
            </button>
          ) : (
            <button
              onClick={handleGoogleSignup}
              disabled={!selected}
              style={{
                width: '100%', padding: '16px', borderRadius: 14,
                background: 'white', border: '1.5px solid #e2e8f0',
                color: '#0f172a', fontWeight: 600, fontSize: 16,
                cursor: selected ? 'pointer' : 'not-allowed', opacity: selected ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'all 0.2s',
                boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
              onMouseOver={e => {
                if (selected) {
                  e.currentTarget.style.borderColor = '#0f766e'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseOut={e => {
                if (selected) {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          )}

          <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 24 }}>
            Already have an account?{' '}
            <span style={{ color: '#0f766e', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}