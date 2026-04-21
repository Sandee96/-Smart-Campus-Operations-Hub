import { useState, useEffect } from 'react';
import {
    getNotifications, markAsRead, markAllAsRead, deleteNotification
} from '../api/notificationApi';
import { useNotificationCount } from '../hooks/useNotificationCount';

const TYPE_COLORS = {
    BOOKING_APPROVED:      { bg: '#f0fdf4', icon: '#16a34a' },
    BOOKING_REJECTED:      { bg: '#fef2f2', icon: '#ef4444' },
    BOOKING_CANCELLED:     { bg: '#fffbeb', icon: '#f59e0b' },
    TICKET_STATUS_CHANGED: { bg: '#eff6ff', icon: '#3b82f6' },
    TICKET_ASSIGNED:       { bg: '#f5f3ff', icon: '#8b5cf6' },
    NEW_COMMENT:           { bg: '#f0fdfa', icon: '#0d9488' },
    ROLE_CHANGED:          { bg: '#fdf4ff', icon: '#a855f7' },
    GENERAL:               { bg: '#f8fafc', icon: '#64748b' },
};

const TypeIcon = ({ type }) => {
    const color = TYPE_COLORS[type]?.icon || '#64748b';
    const icons = {
        BOOKING_APPROVED: '✓',
        BOOKING_REJECTED: '✗',
        BOOKING_CANCELLED: '⊘',
        TICKET_STATUS_CHANGED: '↻',
        TICKET_ASSIGNED: '👤',
        NEW_COMMENT: '💬',
        ROLE_CHANGED: '🔑',
        GENERAL: 'ℹ',
    };
    return (
        <div className="notif-icon"
             style={{ background: TYPE_COLORS[type]?.bg || '#f8fafc' }}>
            <span style={{ color, fontSize: '16px' }}>
                {icons[type] || 'ℹ'}
            </span>
        </div>
    );
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const FILTERS = ['All', 'Unread', 'Bookings', 'Tickets', 'Comments'];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { refresh } = useNotificationCount();

    const load = async () => {
        try {
            setLoading(true);
            const res = await getNotifications();
            setNotifications(res.data || []);
        } catch {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n));
            refresh();
        } catch { /* silent */ }
    };

    const handleMarkAll = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            refresh();
        } catch { /* silent */ }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            refresh();
        } catch { /* silent */ }
    };

    const filtered = notifications.filter(n => {
        if (filter === 'Unread') return !n.read;
        if (filter === 'Bookings') return n.type?.startsWith('BOOKING');
        if (filter === 'Tickets') return n.type?.startsWith('TICKET');
        if (filter === 'Comments') return n.type === 'NEW_COMMENT';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                            : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-outline btn-sm" onClick={handleMarkAll}>
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="notif-filters">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        className={`filter-chip${filter === f ? ' active' : ''}`}
                        onClick={() => setFilter(f)}>
                        {f}
                        {f === 'Unread' && unreadCount > 0 &&
                            <span style={{ marginLeft: '4px' }}>({unreadCount})</span>}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="empty-state">
                    <div className="spinner spinner-lg" />
                </div>
            ) : error ? (
                <div className="error-box">⚠ {error}</div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="24" height="24" fill="none" stroke="var(--text-light)" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </div>
                    <p style={{ fontWeight: 600, color: 'var(--text-mid)' }}>
                        No notifications
                    </p>
                    <p style={{ fontSize: '13px' }}>
                        {filter !== 'All' ? `No ${filter.toLowerCase()} notifications` : "You're all caught up!"}
                    </p>
                </div>
            ) : (
                <div>
                    {filtered.map((n, i) => (
                        <div
                            key={n.id}
                            className={`notif-item${!n.read ? ' unread' : ''}`}
                            style={{ animationDelay: `${i * 0.04}s` }}
                            onClick={() => !n.read && handleMarkRead(n.id)}>
                            <TypeIcon type={n.type} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="notif-title">{n.title}</div>
                                <div className="notif-msg">{n.message}</div>
                                <div className="notif-time">{timeAgo(n.createdAt)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                {!n.read && (
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: 'var(--teal)', flexShrink: 0
                                    }} />
                                )}
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ color: 'var(--red)', padding: '3px 7px' }}
                                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}>
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}