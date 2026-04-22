import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources, searchResources, deleteResource } from '../api/resourceApi';

function decodeJwtPayload(token) {
    if (!token) return null;
    try {
        const part = token.split('.')[1];
        if (!part) return null;
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        return JSON.parse(window.atob(padded));
    } catch {
        return null;
    }
}

function isAdminFromToken(token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return false;
    const rolesRaw = payload.roles ?? payload.role ?? '';
    const roles = Array.isArray(rolesRaw)
        ? rolesRaw
        : String(rolesRaw).split(',').map(r => r.trim()).filter(Boolean);
    return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
}

const typeConfig = {
    LAB: { icon: '🖥️', label: 'Lab' },
    LECTURE_HALL: { icon: '🎓', label: 'Hall' },
    MEETING_ROOM: { icon: '🤝', label: 'Room' },
    EQUIPMENT: { icon: '🔧', label: 'Equipment' },
};

const ResourceListPage = ({ mode = 'catalogue' }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [viewMode, setViewMode] = useState(mode === 'manage' ? 'list' : 'grid');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const canManage = mode === 'manage' && isAdminFromToken(token);

    useEffect(() => {
        if (!token) {
            window.location.href = 'http://localhost:8080/oauth2/authorization/google';
            return;
        }
        // Keep view mode deterministic per screen (prevents "flipping" after refresh/navigation).
        setViewMode(mode === 'manage' ? 'list' : 'grid');
        fetchResources();
    }, [mode, token]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const data = await getAllResources();
            setResources(data);
            setError(null);
        } catch (err) {
            setError('Failed to load resources.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (typeFilter) filters.type = typeFilter;
            if (statusFilter) filters.status = statusFilter;
            if (searchText) filters.location = searchText;
            const hasFilters = Object.keys(filters).length > 0;
            const data = hasFilters ? await searchResources(filters) : await getAllResources();
            setResources(data);
            setError(null);
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setSearchText('');
        setTypeFilter('');
        setStatusFilter('');
        await fetchResources();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(id);
                setResources(resources.filter(r => r.id !== id));
            } catch (err) {
                alert('Failed to delete resource.');
            }
        }
    };

    const getHoursText = (r) => {
        const w = r?.availabilityWindows?.[0];
        if (!w) return '—';
        return `${w.startTime} - ${w.endTime}`;
    };

    const stats = [
        { label: 'Total', value: resources.length, icon: '📦', accent: '#3b82f6' },
        { label: 'Available', value: resources.filter(r => r.status === 'ACTIVE').length, icon: '✅', accent: '#16a34a' },
        { label: 'Labs', value: resources.filter(r => r.type === 'LAB').length, icon: '🖥️', accent: '#8b5cf6' },
        { label: 'Halls', value: resources.filter(r => r.type === 'LECTURE_HALL').length, icon: '🎓', accent: '#0f766e' },
        { label: 'Rooms', value: resources.filter(r => r.type === 'MEETING_ROOM').length, icon: '🤝', accent: '#0891b2' },
        { label: 'Equipment', value: resources.filter(r => r.type === 'EQUIPMENT').length, icon: '🔧', accent: '#ea580c' },
    ];

    return (
        <div className="page-wrapper animate-fade-up">

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                borderRadius: 16, padding: '28px 32px', marginBottom: 28,
                color: 'white', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: -30, right: 60, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                        <p style={{ fontSize: 24, margin: '0 0 4px', fontWeight: 700 }}>
                            🏫 Facilities & Assets Catalogue
                        </p>
                        <p style={{ fontSize: 13, margin: 0, opacity: 0.8 }}>
                            Browse and search available campus resources for your bookings
                        </p>
                    </div>
                    {canManage && (
                        <button
                            onClick={() => navigate('/resources/create')}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1.5px solid rgba(255,255,255,0.3)',
                                color: 'white', borderRadius: 10,
                                padding: '9px 18px', fontSize: 13,
                                fontWeight: 700, cursor: 'pointer',
                                whiteSpace: 'nowrap', flexShrink: 0,
                            }}
                        >
                            + Add Resource
                        </button>
                    )}
                </div>

                {/* Stats inside hero */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 24 }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: 12, padding: '14px 16px',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search & Filter Card */}
            <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search input */}
                    <div style={{ position: 'relative', flex: '1 1 220px' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', fontSize: 15 }}>🔍</span>
                        <select
    className="input"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    style={{ flex: '1 1 220px' }}
>
    <option value="">All Locations</option>
    <option value="Block A">Block A</option>
    <option value="Block B">Block B</option>
    <option value="Block C">Block C</option>
    <option value="Block D">Block D</option>
</select>
                    </div>

                    {/* Type filter */}
                    <select
                        className="input"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{ flex: '1 1 140px' }}
                    >
                        <option value="">All Types</option>
                        <option value="LAB">🖥️ Lab</option>
                        <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                        <option value="MEETING_ROOM">🤝 Meeting Room</option>
                        <option value="EQUIPMENT">🔧 Equipment</option>
                    </select>

                    {/* Status filter */}
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ flex: '1 1 140px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">✅ Active</option>
                        <option value="OUT_OF_SERVICE">❌ Out of Service</option>
                    </select>

                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
                    <button onClick={handleClear} className="btn btn-secondary">Clear</button>

                    {/* View toggle (catalogue only) */}
                    {mode !== 'manage' && (
                        <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginLeft: 'auto' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '7px 12px', fontSize: 15, cursor: 'pointer', border: 'none',
                                    background: viewMode === 'grid' ? 'var(--teal)' : 'white',
                                    color: viewMode === 'grid' ? 'white' : 'var(--text-faint)',
                                }}
                            >⊞</button>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '7px 12px', fontSize: 15, cursor: 'pointer', border: 'none',
                                    background: viewMode === 'list' ? 'var(--teal)' : 'white',
                                    color: viewMode === 'list' ? 'white' : 'var(--text-faint)',
                                }}
                            >☰</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Results count */}
            {!loading && (
                <p style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 16 }}>
                    Found <strong style={{ color: 'var(--text-main)' }}>{resources.length}</strong> resource{resources.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* Loading */}
            {loading && (
                <div className="empty-state">
                    <div className="spinner spinner-lg" />
                    <p style={{ color: 'var(--text-faint)', marginTop: 12 }}>Loading resources...</p>
                </div>
            )}

            {/* Error */}
            {error && <div className="alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

            {/* Empty */}
            {!loading && !error && resources.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No resources found</p>
                    <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>Try adjusting your search or filters</p>
                    <button onClick={handleClear} className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                        Clear filters
                    </button>
                </div>
            )}

            {/* Grid View */}
            {!loading && !error && resources.length > 0 && viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {resources.map(resource => {
                        const config = typeConfig[resource.type] || { icon: '🏢', label: resource.type };
                        const isActive = resource.status === 'ACTIVE';
                        return (
                            <div
                                key={resource.id}
                                className="card"
                                style={{ padding: '20px', cursor: 'pointer' }}
                                onClick={() => navigate(`/resources/${resource.id}`)}
                            >
                                {/* Card top */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: 'var(--teal-light)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                    }}>
                                        {config.icon}
                                    </div>
                                    <span className={isActive ? 'badge badge-green' : 'badge badge-red'}>
                                        {isActive ? 'Active' : 'Unavailable'}
                                    </span>
                                </div>

                                {/* Name + type */}
                                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)', marginBottom: 4 }}>
                                    {resource.name}
                                </p>
                                <span className="badge badge-teal" style={{ marginBottom: 12, fontSize: 11 }}>
                                    {config.label}
                                </span>

                                {/* Details */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-muted)' }}>
                                        <span>📍</span>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {resource.location}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-muted)' }}>
                                        <span>👥</span>
                                        <span>Capacity: <strong style={{ color: 'var(--text-main)' }}>{resource.capacity}</strong></span>
                                    </div>
                                </div>

                                {/* Availability */}
                                {resource.availabilityWindows?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                                        {resource.availabilityWindows.slice(0, 2).map((w, i) => (
                                            <span key={i} style={{
                                                fontSize: 11, background: '#f1f5f9',
                                                color: 'var(--text-muted)', borderRadius: 8,
                                                padding: '3px 8px',
                                            }}>
                                                {w.dayOfWeek.slice(0, 3)} {w.startTime}–{w.endTime}
                                            </span>
                                        ))}
                                        {resource.availabilityWindows.length > 2 && (
                                            <span style={{ fontSize: 11, color: 'var(--text-faint)', padding: '3px 8px' }}>
                                                +{resource.availabilityWindows.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div
                                    style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border-soft)' }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => navigate(`/resources/${resource.id}`)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1, fontSize: 12 }}
                                    >
                                        View Details →
                                    </button>
                                    {canManage && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/resources/edit/${resource.id}`)}
                                                className="btn btn-sm"
                                                style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: 12 }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resource.id)}
                                                className="btn btn-danger btn-sm"
                                                style={{ fontSize: 12 }}
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* List View */}
            {!loading && !error && resources.length > 0 && viewMode === 'list' && (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Hours</th>
                                {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(r => {
                                const config = typeConfig[r.type] || { icon: '🏢', label: r.type };
                                return (
                                    <tr
                                        key={r.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/resources/${r.id}`)}
                                    >
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{
                                                    width: 34, height: 34, borderRadius: 9,
                                                    background: 'var(--teal-light)',
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: 17, flexShrink: 0,
                                                }}>
                                                    {config.icon}
                                                </span>
                                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                                    {r.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{config.label}</td>
                                        <td>{r.capacity} people</td>
                                        <td>{r.location}</td>
                                        <td>
                                            <span className={r.status === 'ACTIVE' ? 'badge badge-green' : 'badge badge-red'}>
                                                {r.status === 'ACTIVE' ? 'Active' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                                            {getHoursText(r)}
                                        </td>
                                        {canManage && (
                                            <td onClick={e => e.stopPropagation()}>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        className="icon-btn icon-btn-edit"
                                                        aria-label="Edit resource"
                                                        title="Edit"
                                                        onClick={() => navigate(`/resources/edit/${r.id}`)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="icon-btn icon-btn-delete"
                                                        aria-label="Delete resource"
                                                        title="Delete"
                                                        onClick={() => handleDelete(r.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ResourceListPage;