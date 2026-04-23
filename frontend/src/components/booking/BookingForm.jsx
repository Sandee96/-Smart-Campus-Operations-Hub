import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'

export default function BookingForm({ prefillResourceId = '', prefilledResource = null }) {
  const navigate = useNavigate()
  const [loading, setLoading]       = useState(false)
  const [resources, setResources]   = useState([])
  const [resLoading, setResLoading] = useState(true)
  const [form, setForm] = useState({
    resourceId: prefillResourceId || '', startTime:'', endTime:'', purpose:'', expectedAttendees:1,
  })

  useEffect(() => {
    // If navigated from resource details, show only that resource and hide dropdown.
    if (prefillResourceId) {
      if (prefilledResource?.id) {
        setResources([prefilledResource])
        setForm(f => ({ ...f, resourceId: prefilledResource.id }))
        setResLoading(false)
        return
      }

      resourceApi.getById(prefillResourceId)
        .then(res => {
          const item = res.data?.data || res.data
          if (!item?.id) throw new Error('Invalid resource payload')
          setResources([item])
          setForm(f => ({ ...f, resourceId: item.id }))
        })
        .catch(() => toast.error('Could not load selected resource'))
        .finally(() => setResLoading(false))
      return
    }

    // Normal flow (no preselected resource)
    resourceApi.getAll()
      .then(res => {
        const list = res.data.data || []
        setResources(list)
        if (list.length > 0) setForm(f => ({ ...f, resourceId: list[0].id }))
      })
      .catch(() => toast.error('Could not load facilities'))
      .finally(() => setResLoading(false))
  }, [prefillResourceId, prefilledResource])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      toast.error('End time must be after start time')
      return
    }
    setLoading(true)
    try {
      await bookingApi.createBooking({
        ...form,
        startTime: new Date(form.startTime).toISOString().slice(0, 19),
        endTime:   new Date(form.endTime).toISOString().slice(0, 19),
        expectedAttendees: parseInt(form.expectedAttendees) || 1,
      })
      toast.success('Booking request submitted!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit booking')
    } finally { setLoading(false) }
  }

  const selected = resources.find(r => r.id === form.resourceId)

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Resource */}
      <div>
        <label>Facility / Resource</label>
        {resLoading ? (
          <div style={{ padding:'10px 0', color:'#94a3b8', fontSize:13 }}>
            Loading facilities...
          </div>
        ) : (
          prefillResourceId ? (
            <div className="card-flat" style={{ padding: '14px 16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {selected?.name || 'Selected Resource'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {selected?.type ? String(selected.type).replaceAll('_', ' ') : '—'}
                  </div>
                </div>
                {selected?.status && (
                  <span className={selected.status === 'ACTIVE' ? 'badge badge-green' : 'badge badge-red'}>
                    {selected.status === 'ACTIVE' ? 'Active' : 'Unavailable'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10, fontSize: 12, color: '#64748b' }}>
                {selected?.location && <span>📍 {selected.location}</span>}
                {selected?.capacity != null && <span>👥 {selected.capacity} people</span>}
              </div>
            </div>
          ) : (
            <select name="resourceId" value={form.resourceId} onChange={handleChange}
              className="input" required>
              {resources.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.type} · Capacity: {r.capacity}
                </option>
              ))}
            </select>
          )
        )}
        {selected && (
          <div style={{
            marginTop:8, background:'#f0fdf4', border:'1px solid #bbf7d0',
            borderRadius:8, padding:'8px 12px', fontSize:12, color:'#166534',
            display:'flex', gap:12,
          }}>
            <span>📍 {selected.location}</span>
            {selected.capacity && <span>👥 {selected.capacity}</span>}
            {selected.availabilityWindows?.[0] && (
              <span>
                🕐 {selected.availabilityWindows[0].dayOfWeek} {selected.availabilityWindows[0].startTime}–{selected.availabilityWindows[0].endTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Date/Time */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <label>Start Time</label>
          <input type="datetime-local" name="startTime" value={form.startTime}
            onChange={handleChange} className="input" required />
        </div>
        <div>
          <label>End Time</label>
          <input type="datetime-local" name="endTime" value={form.endTime}
            onChange={handleChange} className="input" required />
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label>Purpose</label>
        <textarea name="purpose" value={form.purpose} onChange={handleChange}
          className="input" rows={3} maxLength={500}
          placeholder="Describe why you need this resource" required
          style={{ resize:'vertical' }}/>
        <p style={{ fontSize:11, color:'#94a3b8', textAlign:'right', marginTop:4 }}>
          {form.purpose.length}/500
        </p>
      </div>

      {/* Attendees */}
      <div>
        <label>Expected Attendees</label>
        <input type="number" name="expectedAttendees" value={form.expectedAttendees}
          onChange={handleChange} min={1} max={selected?.capacity || 999}
          className="input" />
        {selected?.capacity && (
          <p style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>
            Max capacity: {selected.capacity}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:12 }}>
        <button type="submit" disabled={loading || resLoading}
          className="btn btn-primary" style={{ flex:1, padding:'11px 0' }}>
          {loading ? 'Submitting...' : '✓ Request Booking'}
        </button>
        <button type="button" onClick={() => navigate('/')}
          className="btn btn-secondary" style={{ padding:'11px 20px' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}