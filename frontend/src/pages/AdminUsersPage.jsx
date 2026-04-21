import { useState, useEffect } from 'react'
import { getAllUsers, getUserStats, updateUserRoles, deactivateUser } from '../api/notificationApi'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

const RoleBadge = ({ roles }) => {
  const r = Array.isArray(roles) ? roles[0] : (roles || 'USER')
  const map = { ADMIN: 'badge-red', TECHNICIAN: 'badge-blue', USER: 'badge-teal' }
  return <span className={`badge ${map[r] || 'badge-gray'}`}>{r}</span>
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState([])
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const [uRes, sRes] = await Promise.all([getAllUsers(), getUserStats()])
        setUsers(uRes.data || [])
        setStats(sRes.data || null)
      } catch {
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const flash = (msg, isErr = false) => {
    if (isErr) { setError(msg); setTimeout(() => setError(''), 3500) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3500) }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoles(userId, [newRole])
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: [newRole] } : u))
      flash('Role updated successfully ✓')
    } catch { flash('Failed to update role', true) }
  }

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user? They will lose access.')) return
    try {
      await deactivateUser(userId)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: false } : u))
      flash('User deactivated ✓')
    } catch { flash('Failed to deactivate user', true) }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()))

  const STAT_CARDS = stats ? [
    { label: 'Total Users',  value: stats.totalUsers,     icon: '👥', color: '#0f766e', bg: '#f0fdf4' },
    { label: 'Active',       value: stats.activeUsers,    icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Admins',       value: stats.adminCount,     icon: '🔑', color: '#ef4444', bg: '#fef2f2' },
    { label: 'Technicians',  value: stats.technicianCount,icon: '🔧', color: '#3b82f6', bg: '#eff6ff' },
  ] : []

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 User Management</h1>
          <p className="page-subtitle">Manage roles and access for all campus users</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {error   && <div className="alert-error"   style={{ marginBottom: 16 }}>⚠ {error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>✓ {success}</div>}

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <input
          className="input"
          style={{ maxWidth: 340 }}
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="empty-state"><div className="spinner spinner-lg" /></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Status</th>
                <th>Change Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  {/* User column with avatar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {u.profilePicture
                        ? <img src={u.profilePicture} alt=""
                               style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        : <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0f766e, #0d9488)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: 13, fontWeight: 700,
                          }}>
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                      }
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>
                        {u.name || '—'}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{u.email}</td>
                  <td><RoleBadge roles={u.roles} /></td>
                  <td>
                    <span className={`badge ${u.active ? 'badge-green' : 'badge-gray'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={Array.isArray(u.roles) ? u.roles[0] : 'USER'}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    {u.active && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(u.id)}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state" style={{ padding: '32px' }}>
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}