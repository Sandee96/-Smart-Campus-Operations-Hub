import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkStatus } from '../api/authApi'
import logo from '../assets/unidesk_logo_cute_large.png'

export default function PendingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const e = params.get('email')
    if (e) setEmail(e)

    if (!e) return

    const interval = setInterval(async () => {
      try {
        const res = await checkStatus(e)
        if (res.data.status === 'ACTIVE') {
          clearInterval(interval)
          navigate('/auth/approved')
        } else if (res.data.status === 'REJECTED') {
          clearInterval(interval)
          navigate(`/auth/rejected?email=${encodeURIComponent(e)}`)
        }
      } catch (err) {
        console.error('Error polling status:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [location, navigate])

  const message = useMemo(
    () => 'Your account is waiting for admin approval. You can sign in after approval is completed. This page will automatically update once approved.',
    [],
  )

  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)',
        fontFamily: 'DM Sans, sans-serif', padding: 20, position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.06), transparent 70%)', top: -150, right: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.08), transparent 70%)', bottom: -100, left: -100, pointerEvents: 'none' }} />

      <div
        style={{
          width: '100%', maxWidth: 480, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)', borderRadius: 24, padding: '40px 32px',
          textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
          animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}
      >
        <img src={logo} alt="UniDesk" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 24, padding: 4, background: 'white', boxShadow: '0 8px 16px rgba(15,118,110,0.1)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div className="spinner" style={{ width: 20, height: 20, borderWidth: 3, borderTopColor: '#0f766e', borderColor: 'rgba(15,118,110,0.2)' }} />
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Approval Pending</h1>
        </div>
        
        <p style={{ marginTop: 0, color: '#64748b', lineHeight: 1.7, fontSize: 16 }}>{message}</p>

        <div
          style={{
            marginTop: 24, padding: '14px 16px', borderRadius: 12,
            border: '1px solid rgba(245,158,11,0.3)', background: '#fffbeb',
            color: '#b45309', fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left'
          }}
        >
          <span style={{ fontSize: 20 }}>⏳</span>
          Staff and Technician accounts require manual admin verification before accessing the system.
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('smartcampus_user')
            localStorage.removeItem('user')
            navigate('/login')
          }}
          style={{
            marginTop: 32, width: '100%', border: '2px solid #e2e8f0', borderRadius: 14,
            background: 'white', color: '#0f172a', padding: '14px 16px', fontWeight: 700, fontSize: 16,
            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Cancel & Back to Sign in
        </button>
      </div>
    </div>
  )
}
