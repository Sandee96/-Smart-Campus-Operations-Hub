import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { bookingApi } from '../api/bookingApi'
import { resourceApi } from '../api/resourceApi'
import BookingStatusBadge from '../components/booking/BookingStatusBadge'
import QrCodeDisplay from '../components/qr/QrCodeDisplay'

export default function BookingDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]   = useState(null)
  const [resource, setResource] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    bookingApi.getBookingById(id)
      .then(async res => {
        const b = res.data.data
        setBooking(b)
        if (b?.resourceId) {
          try {
            const rRes = await resourceApi.getById(b.resourceId)
            setResource(rRes.data.data)
          } catch { /* use fallback */ }
        }
      })
      .catch(() => toast.error('Booking not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ textAlign:'center', padding:'80px 0', color:'#94a3b8' }}>
      <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>
      <p style={{ fontSize:13 }}>Loading booking...</p>
    </div>
  )

  if (!booking) return (
    <div style={{ textAlign:'center', padding:'80px 0', color:'#ef4444' }}>
      <p>Booking not found.</p>
    </div>
  )

  return (
    <div className="page-wrapper-sm animate-fade-up">
      <button onClick={() => navigate(-1)} style={{
        background:'none', border:'none', cursor:'pointer',
        color:'#0f766e', fontSize:13, fontWeight:500,
        display:'flex', alignItems:'center', gap:4,
        marginBottom:20, padding:0,
      }}>← Back</button>

      <div className="card-flat" style={{ overflow:'hidden' }}>
        {/* Card header */}
        <div style={{
          background:'linear-gradient(135deg, #f0fdf4, #ccfbf1)',
          padding:'20px 24px',
          borderBottom:'1px solid #e2e8f0',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <h1 style={{ fontSize:18, margin:0 }}>Booking Details</h1>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div style={{ padding:'24px' }}>
          {/* Resource */}
          {resource ? (
            <div style={{
              background:'#f0fdf4', border:'1px solid #bbf7d0',
              borderRadius:10, padding:'14px 16px', marginBottom:20,
            }}>
              <p style={{ fontSize:11, color:'#166534', fontWeight:600,
                margin:'0 0 4px', letterSpacing:'0.05em' }}>FACILITY</p>
              <p style={{ fontSize:15, fontWeight:600, color:'#0f172a', margin:'0 0 4px' }}>
                {resource.name}
              </p>
              <p style={{ fontSize:12, color:'#64748b', margin:0 }}>
                {resource.type} · {resource.location} · Capacity: {resource.capacity}
              </p>
            </div>
          ) : (
            <div style={{
              background:'#f8fafc', borderRadius:10,
              padding:'14px 16px', marginBottom:20,
            }}>
              <p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 4px' }}>RESOURCE</p>
              <p style={{ fontSize:15, fontWeight:600, margin:0 }}>
                {booking.resourceName || booking.resourceId}
              </p>
            </div>
          )}

          {/* Detail grid */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:10, marginBottom:16,
          }}>
            {[
              ['Booked By', booking.userName],
              ['Email', booking.userEmail],
              ['Start Time', format(new Date(booking.startTime), 'dd MMM yyyy, HH:mm')],
              ['End Time', format(new Date(booking.endTime), 'dd MMM yyyy, HH:mm')],
              ['Attendees', booking.expectedAttendees || '—'],
              ['Created', format(new Date(booking.createdAt), 'dd MMM yyyy')],
            ].map(([k, v]) => (
              <div key={k} style={{
                background:'#f8fafc', borderRadius:8, padding:'10px 14px',
              }}>
                <p style={{ fontSize:10, color:'#94a3b8', margin:'0 0 3px',
                  fontWeight:600, letterSpacing:'0.05em' }}>{k.toUpperCase()}</p>
                <p style={{ fontSize:13, fontWeight:500, color:'#0f172a', margin:0 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Purpose */}
          <div style={{
            background:'#f8fafc', borderRadius:8,
            padding:'12px 14px', marginBottom:12,
          }}>
            <p style={{ fontSize:10, color:'#94a3b8', margin:'0 0 4px',
              fontWeight:600, letterSpacing:'0.05em' }}>PURPOSE</p>
            <p style={{ fontSize:13, color:'#0f172a', margin:0, lineHeight:1.5 }}>
              {booking.purpose}
            </p>
          </div>

          {booking.adminNote && (
            <div style={{
              background:'#fffbeb', border:'1px solid #fde68a',
              borderRadius:8, padding:'12px 14px', marginBottom:12,
            }}>
              <p style={{ fontSize:10, color:'#92400e', margin:'0 0 4px',
                fontWeight:600 }}>ADMIN NOTE</p>
              <p style={{ fontSize:13, color:'#92400e', margin:0 }}>
                {booking.adminNote}
              </p>
            </div>
          )}

          {booking.checkedInAt && (
            <div style={{
              background:'#eff6ff', border:'1px solid #bfdbfe',
              borderRadius:8, padding:'12px 14px', marginBottom:12,
            }}>
              <p style={{ fontSize:10, color:'#1e40af', margin:'0 0 4px',
                fontWeight:600 }}>CHECKED IN AT</p>
              <p style={{ fontSize:13, color:'#1e40af', margin:0 }}>
                {format(new Date(booking.checkedInAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
          )}

          {/* QR Code */}
          {booking.status === 'APPROVED' && booking.qrToken && (
            <div style={{ marginTop:8 }}>
              <QrCodeDisplay qrToken={booking.qrToken} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
