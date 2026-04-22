import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById } from '../api/resourceApi';

const typeConfig = {
    LAB: { icon: '🖥️', label: 'Lab' },
    LECTURE_HALL: { icon: '🎓', label: 'Lecture Hall' },
    MEETING_ROOM: { icon: '🤝', label: 'Meeting Room' },
    EQUIPMENT: { icon: '🔧', label: 'Equipment' },
};

const ResourceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchResource(); }, [id]);

    const fetchResource = async () => {
        try {
            setLoading(true);
            const data = await getResourceById(id);
            setResource(data);
        } catch (err) {
            setError('Resource not found.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <div className="empty-state">
                <div className="spinner spinner-lg" />
                <p style={{ color: 'var(--text-faint)', marginTop: 12 }}>Loading resource...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper">
            <div className="empty-state">
                <div className="empty-icon">❌</div>
                <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{error}</p>
                <button
                    onClick={() => navigate('/resources')}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 8 }}
                >
                    ← Back to Resources
                </button>
            </div>
        </div>
    );

    const config = typeConfig[resource.type] || { icon: '🏢', label: resource.type };
    const isActive = resource.status === 'ACTIVE';

    return (
        <div className="page-wrapper-sm animate-fade-up">

            {/* Hero Banner — matches team style */}
            <div style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                borderRadius: 16, padding: '28px 32px', marginBottom: 28,
                color: 'white', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: -30, right: 60, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Back button */}
                <button
                    onClick={() => navigate('/resources')}
                    style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white', borderRadius: 8,
                        padding: '5px 12px', fontSize: 12,
                        fontWeight: 600, cursor: 'pointer',
                        marginBottom: 18, display: 'inline-flex',
                        alignItems: 'center', gap: 6,
                    }}
                >
                    ← Back to Resources
                </button>

                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14,
                            background: 'rgba(255,255,255,0.15)',
                            border: '1.5px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 28, flexShrink: 0,
                        }}>
                            {config.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                                {resource.name}
                            </p>
                            <p style={{ fontSize: 13, margin: 0, opacity: 0.8 }}>
                                {config.label}
                            </p>
                        </div>
                    </div>

                    <span className={isActive ? 'badge badge-green' : 'badge badge-red'}
                        style={{ flexShrink: 0, fontSize: 12, padding: '5px 14px' }}>
                        {isActive ? 'Active' : 'Out of Service'}
                    </span>
                </div>

                {/* Primary action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                    <button
                        type="button"
                        disabled={!isActive}
                        onClick={() => navigate(`/bookings/new?resourceId=${resource.id}`, { state: { resource } })}
                        style={{
                            background: isActive ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                            border: '1.5px solid rgba(255,255,255,0.30)',
                            color: 'white',
                            borderRadius: 10,
                            padding: '10px 16px',
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: isActive ? 'pointer' : 'not-allowed',
                            opacity: isActive ? 1 : 0.65,
                        }}
                        title={isActive ? 'Create a booking request' : 'This resource is not available right now'}
                    >
                        📅 Book this Resource
                    </button>
                </div>
            </div>

            {/* Details + Availability */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

                {/* Details Card */}
                <div className="card" style={{ padding: '22px 24px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                        📋 Details
                    </p>
                    <div>
                        {[
                            { label: 'Location', value: `📍 ${resource.location}` },
                            { label: 'Capacity', value: `👥 ${resource.capacity} people` },
                            { label: 'Type', value: config.label },
                            { label: 'Status', value: resource.status },
                        ].map((row, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '12px 0',
                                borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none',
                            }}>
                                <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>{row.label}</span>
                                <span style={{
                                    fontSize: 13, fontWeight: 600,
                                    color: row.label === 'Status'
                                        ? (isActive ? 'var(--success)' : 'var(--danger)')
                                        : 'var(--text-main)',
                                }}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Availability Card */}
                <div className="card" style={{ padding: '22px 24px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                        🗓️ Availability
                    </p>
                    {resource.availabilityWindows && resource.availabilityWindows.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {resource.availabilityWindows.map((w, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', background: 'var(--bg)',
                                    borderRadius: 10, padding: '10px 14px',
                                    border: '1px solid var(--border-soft)',
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
                                        {w.dayOfWeek}
                                    </span>
                                    <span style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'DM Mono, monospace' }}>
                                        {w.startTime} – {w.endTime}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '24px 0' }}>
                            <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>No availability windows set</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {resource.description && (
                <div className="card" style={{ padding: '22px 24px', marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        📝 Description
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        {resource.description}
                    </p>
                </div>
            )}

            {/* Timestamps */}
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-faint)', marginBottom: 16 }}>
                <span>Created: {new Date(resource.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(resource.updatedAt).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default ResourceDetailPage;