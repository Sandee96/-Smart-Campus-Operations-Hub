import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getGoogleLoginUrl, isLoggedIn } from '../api/authApi'
import logo from '../assets/unidesk_logo_cute_large.png'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn()) navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* ── Left Panel (Branding) ───────────────────── */}
      <div className="login-left-panel" style={{
        width: '45%', 
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px',
        position: 'relative', overflow: 'hidden',
        color: 'white'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.4), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.3), transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo area */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', zIndex: 10 }} 
          onClick={() => navigate('/')}
        >
          <img 
            src={logo} 
            alt="UniDesk Logo" 
            style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.95)', padding: 4, objectFit: 'contain' }} 
          />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>UniDesk</span>
        </div>

        {/* Hero text */}
        <div style={{ zIndex: 10, animation: 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
          <div style={{ 
            display: 'inline-block', padding: '6px 14px', borderRadius: 20, 
            background: 'rgba(15,118,110,0.2)', color: '#2dd4bf', fontSize: 13, fontWeight: 700, 
            marginBottom: 20, border: '1px solid rgba(45,212,191,0.2)', letterSpacing: '0.05em' 
          }}>
            WELCOME BACK
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            Your Campus, <br/>
            <span style={{ color: '#2dd4bf' }}>Connected.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.6, marginBottom: 36, maxWidth: '90%' }}>
            Access your unified dashboard to manage bookings, resolve maintenance tickets, and track campus resources in real-time.
          </p>
          
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ borderLeft: '3px solid #0f766e', paddingLeft: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 4 }}>100%</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Paperless Operations</div>
            </div>
            <div style={{ borderLeft: '3px solid #0ea5e9', paddingLeft: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 4 }}>24/7</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Resource Availability</div>
            </div>
          </div>
        </div>

        <div style={{ zIndex: 10, fontSize: 14, color: '#64748b' }}>
          © {new Date().getFullYear()} SLIIT Operations.
        </div>
      </div>

      {/* ── Right Panel (Form) ───────────────────── */}
      <div style={{ 
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '40px', background: '#ffffff', position: 'relative' 
      }}>
        {/* Back Button (Top Left) */}
        <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 50 }}>
          <div 
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a' }}
            onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b' }}
          >
            ← Back to Home
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 500, marginTop: 40, animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: 20, background: '#f0fdf4', color: '#0f766e',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, 
              margin: '0 auto 24px', border: '1px solid #ccfbf1', boxShadow: '0 8px 16px rgba(15,118,110,0.06)'
            }}>
              👋
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Sign in to UniDesk
            </h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.6 }}>
              Use your SLIIT Google account to securely access the operations hub.
            </p>
          </div>

          {/* Google Auth Button */}
          <a 
            href={getGoogleLoginUrl()} 
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '18px', borderRadius: 16, border: '2px solid #e2e8f0', background: 'white',
              color: '#0f172a', fontSize: 17, fontWeight: 700, textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#0f766e'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,118,110,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <div style={{ marginTop: 32, fontSize: 15, color: '#64748b', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/auth/register" style={{ color: '#0f766e', fontWeight: 700, textDecoration: 'none' }}>
              Sign up here
            </Link>
          </div>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #f1f5f9', fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
            By signing in, you agree to our <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  )
}