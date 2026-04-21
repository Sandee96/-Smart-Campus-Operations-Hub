import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseJwt } from '../api/authApi'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (token) {
      localStorage.setItem('token', token)

      const decoded = parseJwt(token)
      if (decoded) {
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

        // Role-based redirect
        const roles = decoded.roles || ''
        if (roles.includes('ADMIN'))      navigate('/dashboard', { replace: true })
        else if (roles.includes('TECHNICIAN')) navigate('/tickets', { replace: true })
        else navigate('/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)',
    }}>
      <div style={{
        width: 54, height: 54, borderRadius: 14,
        background: 'linear-gradient(135deg, #0f766e, #0d9488)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 800, fontSize: 18,
        boxShadow: '0 4px 16px rgba(15,118,110,0.35)', marginBottom: 8,
      }}>UD</div>
      <div className="spinner spinner-lg" />
      <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
        Signing you in to UniDesk…
      </p>
    </div>
  )
}