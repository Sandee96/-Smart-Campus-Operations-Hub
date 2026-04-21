import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { bookingApi } from '../api/bookingApi'

export default function QrCheckinPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setError('No QR token in URL.'); setLoading(false); return }
    bookingApi.checkIn(token)
      .then(res => setResult(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Check-in failed'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#f8fafc', padding:24,
    }}>
      <div style={{
        background:'white', borderRadius:20,
        boxShadow:'0 10px 40px rgba(0,0,0,0.10)',
        padding:'48px 40px', maxWidth:400, width:'100%',
        textAlign:'center', border:'1px solid #e2e8f0',
      }}>
        {loading && (
          <>
            <div style={{ fontSize:40, marginBottom:16 }}>⏳</div>
            <p style={{ color:'#94a3b8', fontSize:15 }}>Verifying your QR code...</p>
          </>
        )}

        {result && (
          <div className="animate-scale-in">
            <div style={{
              width:72, height:72, borderRadius:'50%',
              background:'linear-gradient(135deg, #10b981, #059669)',
              margin:'0 auto 20px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:32, color:'white',
              boxShadow:'0 8px 24px rgba(16,185,129,0.3)',
            }}>✓</div>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#14532d', marginBottom:8 }}>
              Check-In Successful!
            </h2>
            <div style={{
              background:'#f0fdf4', border:'1px solid #bbf7d0',
              borderRadius:12, padding:'16px 20px', margin:'16px 0',
            }}>
              <p style={{ fontWeight:600, fontSize:15, color:'#0f172a', margin:'0 0 6px' }}>
                {result.resourceName || result.resourceId}
              </p>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 4px' }}>
                {format(new Date(result.startTime), 'dd MMM yyyy')} ·{' '}
                {format(new Date(result.startTime), 'HH:mm')} –{' '}
                {format(new Date(result.endTime), 'HH:mm')}
              </p>
              <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>
                Booked by {result.userName}
              </p>
            </div>
            <Link to="/" style={{
              display:'inline-block', marginTop:8,
              fontSize:13, color:'#0f766e', fontWeight:500,
            }}>← Back to Home</Link>
          </div>
        )}

        {error && !loading && (
          <div className="animate-scale-in">
            <div style={{
              width:72, height:72, borderRadius:'50%',
              background:'linear-gradient(135deg, #ef4444, #dc2626)',
              margin:'0 auto 20px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:32, color:'white',
              boxShadow:'0 8px 24px rgba(239,68,68,0.3)',
            }}>✕</div>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#7f1d1d', marginBottom:8 }}>
              Check-In Failed
            </h2>
            <p style={{ fontSize:14, color:'#64748b', marginBottom:20 }}>{error}</p>
            <Link to="/" style={{
              display:'inline-block',
              fontSize:13, color:'#0f766e', fontWeight:500,
            }}>← Back to Home</Link>
          </div>
        )}
      </div>
    </div>
  )
}