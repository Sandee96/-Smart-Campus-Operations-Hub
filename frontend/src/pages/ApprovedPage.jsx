import { useNavigate } from 'react-router-dom'
import logo from '../assets/unidesk_logo_cute_large.png'

export default function ApprovedPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        fontFamily: 'DM Sans, sans-serif', padding: 20, position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.06), transparent 70%)', top: -150, left: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.08), transparent 70%)', bottom: -100, right: -100, pointerEvents: 'none' }} />

      <div
        style={{
          width: '100%', maxWidth: 480, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)', borderRadius: 24, padding: '48px 32px',
          textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
          animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
          <img src={logo} alt="UniDesk" style={{ width: 64, height: 64, borderRadius: 16, padding: 4, background: 'white', boxShadow: '0 8px 16px rgba(15,118,110,0.1)' }} />
          <div style={{ position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white', fontSize: 14 }}>✓</div>
        </div>
        
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Access Granted!</h1>
        <p style={{ marginTop: 12, color: '#475569', lineHeight: 1.7, fontSize: 17, marginBottom: 32 }}>
          Your account request has been officially approved. You now have full access to your UniDesk dashboard and tools.
        </p>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('smartcampus_user')
            localStorage.removeItem('user')
            navigate('/login')
          }}
          style={{
            width: '100%', border: 'none', borderRadius: 14,
            background: 'linear-gradient(135deg, #0f766e, #0d9488)',
            color: 'white', padding: '16px 24px', fontWeight: 700, fontSize: 18,
            cursor: 'pointer', boxShadow: '0 10px 25px rgba(15,118,110,0.3)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Sign In Now →
        </button>
      </div>
    </div>
  )
}
