import { useState, useEffect } from 'react';
import {
    getAllUsers, getUserStats, updateUserRoles, deactivateUser
} from '../api/notificationApi';

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const RoleBadge = ({ role }) => {
    const map = {
        ADMIN:      'badge badge-red',
        TECHNICIAN: 'badge badge-blue',
        USER:       'badge badge-teal',
    };
    return <span className={map[role] || 'badge badge-gray'}>{role}</span>;
};

export default function AdminUsersPage() {
    const [users, setUsers]   = useState([]);
    const [stats, setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [uRes, sRes] = await Promise.all([getAllUsers(), getUserStats()]);
                setUsers(uRes.data || []);
                setStats(sRes.data || null);
            } catch {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRoles(userId, [newRole]);
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, roles: [newRole] } : u));
            setSuccess('Role updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to update role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeactivate = async (userId) => {
        if (!window.confirm('Deactivate this user?')) return;
        try {
            await deactivateUser(userId);
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, active: false } : u));
            setSuccess('User deactivated');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to deactivate user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">Manage roles and access for all users</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="stats-grid">
                    {[
                        { label: 'Total Users',   value: stats.totalUsers,    color: '#0d9488', bg: '#f0fdfa' },
                        { label: 'Active Users',  value: stats.activeUsers,   color: '#16a34a', bg: '#f0fdf4' },
                        { label: 'Admins',        value: stats.adminCount,    color: '#ef4444', bg: '#fef2f2' },
                        { label: 'Technicians',   value: stats.technicianCount, color: '#3b82f6', bg: '#eff6ff' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon"
                                 style={{ background: s.bg }}>
                                <svg width="18" height="18" fill="none"
                                     stroke={s.color} strokeWidth="2"
                                     viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                </svg>
                            </div>
                            <div className="stat-value"
                                 style={{ color: s.color }}>
                                {s.value}
                            </div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Alerts */}
            {error   && <div className="error-box"   style={{ marginBottom: '16px' }}>⚠ {error}</div>}
            {success && <div className="success-box" style={{ marginBottom: '16px' }}>✓ {success}</div>}

            {/* Search */}
            <div style={{ marginBottom: '16px' }}>
                <input
                    className="form-input"
                    style={{ maxWidth: '320px' }}
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            {loading ? (
                <div className="empty-state">
                    <div className="spinner spinner-lg" />
                </div>
            ) : (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Change Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                            {u.profilePicture
                                                ? <img src={u.profilePicture} alt=""
                                                       style={{ width: '30px', height: '30px',
                                                                borderRadius: '50%', objectFit: 'cover' }} />
                                                : <div style={{
                                                      width: '30px', height: '30px', borderRadius: '50%',
                                                      background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                                                      display: 'flex', alignItems: 'center',
                                                      justifyContent: 'center', color: 'white',
                                                      fontSize: '12px', fontWeight: 700
                                                  }}>
                                                      {u.name?.charAt(0) || 'U'}
                                                  </div>
                                            }
                                            <span style={{ fontWeight: 500, color: 'var(--text-dark)', fontSize: '13.5px' }}>
                                                {u.name || '—'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                                        {u.email}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {(u.roles || []).map(r =>
                                                <RoleBadge key={r} role={r} />)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.active ? 'badge-green' : 'badge-gray'}`}>
                                            {u.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="role-select"
                                            value={u.roles?.[0] || 'USER'}
                                            onChange={e => handleRoleChange(u.id, e.target.value)}>
                                            {ROLES.map(r =>
                                                <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        {u.active && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeactivate(u.id)}>
                                                Deactivate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <p style={{ color: 'var(--text-light)' }}>No users found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}