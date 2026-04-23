import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import BookingStatusBadge from './BookingStatusBadge'
import { bookingApi } from '../../api/bookingApi'

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user')
      || localStorage.getItem('user') || null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export default function BookingCard({ booking, onRefresh, isAdmin = false }) {
  const navigate    = useNavigate()
  const currentUser = getCurrentUser()
  const [loading, setLoading]   = useState(false)
  const [showNote, setShowNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  const handleCancel = async () => {
    if (!confirm('Cancel this booking?')) return
    setLoading(true)
    try {
      await bookingApi.cancelBooking(booking.id)
      toast.success('Booking cancelled')
      onRefresh?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed')
    } finally { setLoading(false) }
  }

  const handleAction = async (action) => {
    setLoading(true)
    try {
      await bookingApi.approveReject(booking.id, action, noteText)
      toast.success(`Booking ${action === 'APPROVED' ? 'approved' : 'rejected'}`)
      setShowNote(null); setNoteText('')
      onRefresh?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally { setLoading(false) }
  }

  const isOwner  = currentUser?.id === booking.userId
  const canCancel = ['PENDING','APPROVED'].includes(booking.status) && (isAdmin || isOwner)

  return (
    <div className="card animate-fade-up" style={{ padding:'20px 24px' }}>
      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <span style={{
              width:36, height:36, borderRadius:10, flexShrink:0,
              background:'linear-gradient(135deg, #ccfbf1, #99f6e4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16,
            }}>🏛</span>
            <div>
              <p style={{ fontWeight:600, fontSize:15, color:'#0f172a', margin:0, lineHeight:1.3 }}>
                {booking.resourceName || booking.resourceId}
              </p>
              {booking.resourceType && (
                <span style={{
                  fontSize:10, background:'#f1f5f9', color:'#64748b',
                  borderRadius:4, padding:'1px 6px', fontWeight:500,
                }}>{booking.resourceType}</span>
              )}
            </div>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Info grid */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)',
        gap:10, marginBottom:14,
        background:'#f8fafc', borderRadius:10, padding:'12px 16px',
      }}>
        <div>
          <p style={{ fontSize:10, color:'#94a3b8', marginBottom:2, fontWeight:500 }}>DATE</p>
          <p style={{ fontSize:13, color:'#0f172a', fontWeight:500 }}>
            {format(new Date(booking.startTime), 'dd MMM yyyy')}
          </p>
        </div>
        <div>
          <p style={{ fontSize:10, color:'#94a3b8', marginBottom:2, fontWeight:500 }}>TIME</p>
          <p style={{ fontSize:13, color:'#0f172a', fontWeight:500 }}>
            {format(new Date(booking.startTime), 'HH:mm')} – {format(new Date(booking.endTime), 'HH:mm')}
          </p>
        </div>
        <div>
          <p style={{ fontSize:10, color:'#94a3b8', marginBottom:2, fontWeight:500 }}>ATTENDEES</p>
          <p style={{ fontSize:13, color:'#0f172a', fontWeight:500 }}>
            {booking.expectedAttendees || '—'}
          </p>
        </div>
      </div>

      {/* Purpose */}
      <p style={{ fontSize:13, color:'#475569', marginBottom:12, lineHeight:1.5 }}>
        🎯 {booking.purpose}
      </p>

      {/* Admin note */}
      {booking.adminNote && (
        <div style={{
          background:'#fffbeb', border:'1px solid #fde68a',
          borderRadius:8, padding:'8px 12px', marginBottom:12,
          fontSize:12, color:'#92400e',
        }}>
          📝 {booking.adminNote}
        </div>
      )}

      {/* Admin sees user info */}
      {isAdmin && (
        <p style={{ fontSize:11, color:'#94a3b8', marginBottom:12 }}>
          👤 {booking.userName} · {booking.userEmail}
        </p>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <button className="btn btn-secondary" style={{ fontSize:12, padding:'6px 14px' }}
          onClick={() => navigate(`/bookings/${booking.id}`)}>
          View Details →
        </button>

        {canCancel && (
          <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 14px' }}
            onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        )}

        {isAdmin && booking.status === 'PENDING' && (
          <>
            <button className="btn btn-success" style={{ fontSize:12, padding:'6px 14px' }}
              onClick={() => setShowNote(showNote === 'APPROVED' ? null : 'APPROVED')}
              disabled={loading}>
              ✓ Approve
            </button>
            <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 14px' }}
              onClick={() => setShowNote(showNote === 'REJECTED' ? null : 'REJECTED')}
              disabled={loading}>
              ✕ Reject
            </button>
          </>
        )}
      </div>

      {/* Inline note box */}
      {showNote && (
        <div className="animate-slide-down" style={{
          marginTop:14, paddingTop:14,
          borderTop:'1px solid #e2e8f0',
        }}>
          <label>{showNote === 'APPROVED' ? 'Approval note (optional)' : 'Reason for rejection'}</label>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            rows={2}
            placeholder="Add a note..."
            className="input"
            style={{ marginBottom:10, resize:'none' }}
          />
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => handleAction(showNote)}
              disabled={loading}
              className={`btn ${showNote === 'APPROVED' ? 'btn-primary' : 'btn-danger'}`}
              style={{ fontSize:12, padding:'6px 16px' }}
            >
              {loading ? 'Saving...' : `Confirm ${showNote === 'APPROVED' ? 'Approval' : 'Rejection'}`}
            </button>
            <button className="btn btn-secondary" style={{ fontSize:12, padding:'6px 12px' }}
              onClick={() => { setShowNote(null); setNoteText('') }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}