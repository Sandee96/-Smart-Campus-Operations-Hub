import { useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import BookingCard from '../components/booking/BookingCard'

const STATUS_FILTERS = ['ALL','PENDING','APPROVED','REJECTED','CANCELLED','CHECKED_IN']

function getStoredUser() {
  try {
    const raw = localStorage.getItem('smartcampus_user')
      || localStorage.getItem('user') || null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const STATUS_COUNTS_COLOR = {
  PENDING:   '#f59e0b',
  APPROVED:  '#10b981',
  REJECTED:  '#ef4444',
  CANCELLED: '#94a3b8',
  CHECKED_IN:'#3b82f6',
}

export default function BookingsPage({ mode = 'my' }) {
  const { bookings, loading, error, refetch } = useBookings(mode)
  const [filter, setFilter] = useState('ALL')
  const user    = getStoredUser()
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter)

  // Count by status
  const counts = {}
  bookings.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1 })

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <div className="section-header animate-fade-up">
        <div>
          <h1 style={{ fontSize:24, margin:0, marginBottom:4 }}>
            {mode === 'admin' ? 'All Bookings' : 'My Bookings'}
          </h1>
          <p style={{ fontSize:13, color:'#64748b', margin:0 }}>
            {mode === 'admin'
              ? `Admin view · ${user?.name}`
              : `Showing bookings for ${user?.name || 'you'}`}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={refetch}
          style={{ fontSize:12, padding:'7px 14px' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Stat pills — admin only */}
      {mode === 'admin' && bookings.length > 0 && (
        <div className="animate-fade-up stagger-children"
          style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
          <div style={{
            background:'white', border:'1px solid #e2e8f0',
            borderRadius:10, padding:'10px 18px', fontSize:13,
          }}>
            <span style={{ color:'#94a3b8', fontSize:11, fontWeight:500 }}>TOTAL</span>
            <div style={{ fontWeight:700, fontSize:22, color:'#0f172a' }}>{bookings.length}</div>
          </div>
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} style={{
              background:'white', border:'1px solid #e2e8f0',
              borderRadius:10, padding:'10px 18px', fontSize:13,
              borderTop:`3px solid ${STATUS_COUNTS_COLOR[status] || '#94a3b8'}`,
            }}>
              <span style={{ color:'#94a3b8', fontSize:11, fontWeight:500 }}>
                {status}
              </span>
              <div style={{ fontWeight:700, fontSize:22, color:'#0f172a' }}>{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:24 }}
        className="animate-fade-up">
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`filter-pill ${filter === s ? 'active' : ''}`}>
            {s}
            {counts[s] && filter !== s ? (
              <span style={{
                marginLeft:4, background:'#f1f5f9', color:'#64748b',
                borderRadius:10, padding:'0px 6px', fontSize:10, fontWeight:600,
              }}>{counts[s]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div style={{ textAlign:'center', padding:'48px 0', color:'#94a3b8' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>
          <p style={{ fontSize:13 }}>Loading bookings...</p>
        </div>
      )}

      {error && (
        <div style={{
          background:'#fef2f2', border:'1px solid #fecaca',
          borderRadius:12, padding:'16px 20px', color:'#7f1d1d', fontSize:13,
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state card-flat">
          <div className="empty-state-icon">📭</div>
          <p style={{ fontWeight:600, color:'#475569', marginBottom:4 }}>No bookings found</p>
          <p style={{ fontSize:13, color:'#94a3b8' }}>
            {filter !== 'ALL'
              ? `No bookings with status "${filter}"`
              : mode === 'my' ? 'You have no bookings yet.' : 'No bookings in the system.'}
          </p>
        </div>
      )}

      <div style={{ display:'grid', gap:12 }} className="stagger-children">
        {filtered.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onRefresh={refetch}
            isAdmin={mode === 'admin' && isAdmin}
          />
        ))}
      </div>
    </div>
  )
}
