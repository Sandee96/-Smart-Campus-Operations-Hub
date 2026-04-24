import { useState, useEffect } from 'react'
import { getAllUsers, getUserStats, updateUserRoles, deactivateUser, getPendingUsers, approveUser, rejectUser } from '../api/notificationApi'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

const RoleBadge = ({ roles }) => {
  const r = Array.isArray(roles) ? roles[0] : (roles || 'USER')
  const map = { ADMIN: 'badge-red', TECHNICIAN: 'badge-blue', USER: 'badge-teal' }
  return <span className={`badge ${map[r] || 'badge-gray'}`}>{r}</span>
}

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('active') // 'active' or 'pending'
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRoles, setSelectedRoles] = useState({}) // For pending user approval role selection

  const fetchData = async () => {
    try {
      setLoading(true)
      const [uRes, pRes, sRes] = await Promise.all([
        getAllUsers(),
        getPendingUsers(),
        getUserStats()
      ])
      
      const allActive = uRes.data || []
      // The backend might return all users including pending in getAllUsers.
      // So we filter out pending from active users just in case.
      const activeOnly = allActive.filter(u => u.accountStatus !== 'PENDING' && u.accountStatus !== 'REJECTED')
      
      setUsers(activeOnly)
      setPendingUsers(pRes.data || [])
      setStats(sRes.data || null)
      
      // Initialize selected roles for pending users based on their requested type
      const initialRoles = {}
      ;(pRes.data || []).forEach(u => {
         // Default to TECHNICIAN if they requested TECHNICIAN, else USER or STAFF (STAFF maps to USER usually, but they might need a specific role)
         initialRoles[u.id] = u.userType === 'TECHNICIAN' ? 'TECHNICIAN' : 'USER'
      })
      setSelectedRoles(initialRoles)

    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

  const handleApprove = async (userId) => {
    const role = selectedRoles[userId] || 'USER'
    try {
      await approveUser(userId, [role])
      flash('User approved successfully ✓')
      fetchData() // Refresh lists
    } catch { flash('Failed to approve user', true) }
  }

  const handleReject = async (userId) => {
    if (!window.confirm('Reject this user? They will not be able to log in.')) return
    try {
      await rejectUser(userId)
      flash('User rejected ✓')
      fetchData() // Refresh lists
    } catch { flash('Failed to reject user', true) }
  }

  const filteredUsers = (activeTab === 'active' ? users : pendingUsers).filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#0f766e', bg: '#f0fdf4' },
    { label: 'Active', value: stats.activeUsers, icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Admins', value: stats.adminCount, icon: '🔑', color: '#ef4444', bg: '#fef2f2' },
    { label: 'Pending', value: pendingUsers.length, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
  ] : []

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 User Management</h1>
          <p className="page-subtitle">Manage roles, access, and pending approvals</p>
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
      {error && <div className="alert-error" style={{ marginBottom: 16 }}>⚠ {error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>✓ {success}</div>}

      {/* Controls: Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 14 }}>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`filter-pill ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Users ({users.length})
          </button>
          <button 
            className={`filter-pill ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
            style={{ 
               borderColor: activeTab === 'pending' ? '#0f766e' : (pendingUsers.length > 0 ? '#f59e0b' : ''),
               color: activeTab === 'pending' ? 'white' : (pendingUsers.length > 0 ? '#b45309' : ''),
               background: activeTab === 'pending' ? '#0f766e' : (pendingUsers.length > 0 ? '#fffbeb' : '')
            }}
          >
            Pending Approvals {pendingUsers.length > 0 && `(${pendingUsers.length})`}
          </button>
        </div>

        <input
          className="input"
          style={{ maxWidth: 340 }}
          placeholder="🔍 Search by name or email…"
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
                {activeTab === 'active' ? (
                  <>
                    <th>Current Role</th>
                    <th>Status</th>
                    <th>Change Role</th>
                    <th>Action</th>
                  </>
                ) : (
                  <>
                    <th>Requested Type</th>
                    <th>Assign Role</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
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
                  
                  {activeTab === 'active' ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <td>
                        <span className={`badge ${u.userType === 'TECHNICIAN' ? 'badge-blue' : 'badge-amber'}`}>
                          {u.userType || 'STAFF'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="role-select"
                          value={selectedRoles[u.id] || 'USER'}
                          onChange={e => setSelectedRoles({...selectedRoles, [u.id]: e.target.value})}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(u.id)}>
                            Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(u.id)}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state" style={{ padding: '32px' }}>
                      <div className="empty-icon">
                         {activeTab === 'active' ? '👥' : '🎉'}
                      </div>
                      <p>{activeTab === 'active' ? 'No users found' : 'No pending approvals!'}</p>
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