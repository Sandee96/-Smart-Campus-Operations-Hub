import { useState, useEffect } from 'react'
import { getPreferences, updatePreferences } from '../api/notificationApi'

const PREFS = [
  { key: 'bookingUpdates',       icon: '📅', label: 'Booking Updates',      desc: 'Approved, rejected, and cancelled booking notifications' },
  { key: 'ticketUpdates',        icon: '🎫', label: 'Ticket Status Updates', desc: 'When your ticket status changes (In Progress, Resolved, etc.)' },
  { key: 'ticketAssigned',       icon: '👤', label: 'Ticket Assignments',    desc: 'When a ticket is assigned to you as a technician' },
  { key: 'newComments',          icon: '💬', label: 'New Comments',          desc: 'When someone comments on your ticket' },
  { key: 'roleChanges',          icon: '🔑', label: 'Role Changes',          desc: 'When your account role is updated by an admin' },
  { key: 'generalNotifications', icon: 'ℹ️',  label: 'General Notifications', desc: 'System announcements and general updates' },
]

export default function NotificationPreferences() {
  const [prefs,   setPrefs]   = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getPreferences()
        setPrefs(res.data || {})
      } catch {
        setError('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const toggle  = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const enableAll  = () => { const a = {}; PREFS.forEach(p => { a[p.key] = true  }); setPrefs(a) }
  const disableAll = () => { const a = {}; PREFS.forEach(p => { a[p.key] = false }); setPrefs(a) }

  const save = async () => {
    try {
      setSaving(true)
      await updatePreferences(prefs)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save')
      setTimeout(() => setError(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Notification Preferences</h1>
          <p className="page-subtitle">Choose which notifications you want to receive</p>
        </div>
      </div>

      {error   && <div className="alert-error"   style={{ marginBottom: 16 }}>⚠ {error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>✓ Preferences saved!</div>}

      {loading ? (
        <div className="empty-state"><div className="spinner spinner-lg" /></div>
      ) : (
        <div style={{ maxWidth: 580 }}>
          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button className="btn btn-secondary btn-sm" onClick={enableAll}>Enable All</button>
            <button className="btn btn-secondary btn-sm" onClick={disableAll}>Disable All</button>
          </div>

          {/* Toggle rows */}
          {PREFS.map(p => (
            <div key={p.key} className="toggle-row">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                <span style={{ fontSize: 22, lineHeight: 1, marginTop: 1 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{p.desc}</div>
                </div>
              </div>
              <label className="toggle" style={{ marginLeft: 16 }}>
                <input type="checkbox" checked={!!prefs[p.key]} onChange={() => toggle(p.key)} />
                <span className="toggle-track" />
              </label>
            </div>
          ))}

          {/* Save */}
          <div style={{ marginTop: 26 }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving
                ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                : '💾 Save Preferences'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}