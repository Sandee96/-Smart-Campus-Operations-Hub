import { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../api/notificationApi';

const PREFS_CONFIG = [
    {
        key: 'bookingUpdates',
        label: 'Booking Updates',
        desc: 'Approved, rejected, and cancelled booking notifications',
        icon: '📅'
    },
    {
        key: 'ticketUpdates',
        label: 'Ticket Status Updates',
        desc: 'When your ticket status changes (In Progress, Resolved, etc.)',
        icon: '🎫'
    },
    {
        key: 'ticketAssigned',
        label: 'Ticket Assignments',
        desc: 'When a ticket is assigned to you as a technician',
        icon: '👤'
    },
    {
        key: 'newComments',
        label: 'New Comments',
        desc: 'When someone comments on your ticket',
        icon: '💬'
    },
    {
        key: 'roleChanges',
        label: 'Role Changes',
        desc: 'When your account role is updated by an admin',
        icon: '🔑'
    },
    {
        key: 'generalNotifications',
        label: 'General Notifications',
        desc: 'System announcements and general updates',
        icon: 'ℹ️'
    },
];

export default function NotificationPreferences() {
    const [prefs, setPrefs]     = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getPreferences();
                setPrefs(res.data || {});
            } catch {
                setError('Failed to load preferences');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleToggle = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updatePreferences(prefs);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError('Failed to save preferences');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleEnableAll = () => {
        const all = {};
        PREFS_CONFIG.forEach(p => { all[p.key] = true; });
        setPrefs(all);
    };

    const handleDisableAll = () => {
        const all = {};
        PREFS_CONFIG.forEach(p => { all[p.key] = false; });
        setPrefs(all);
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Notification Preferences</h1>
                <p className="page-subtitle">
                    Choose which notifications you want to receive
                </p>
            </div>

            {/* Alerts */}
            {error   && <div className="error-box"   style={{ marginBottom: '16px' }}>⚠ {error}</div>}
            {success && <div className="success-box" style={{ marginBottom: '16px' }}>✓ Preferences saved successfully!</div>}

            {loading ? (
                <div className="empty-state">
                    <div className="spinner spinner-lg" />
                </div>
            ) : (
                <div style={{ maxWidth: '580px' }}>
                    {/* Quick actions */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <button className="btn btn-outline btn-sm" onClick={handleEnableAll}>
                            Enable All
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={handleDisableAll}>
                            Disable All
                        </button>
                    </div>

                    {/* Toggles */}
                    {PREFS_CONFIG.map(p => (
                        <div key={p.key} className="toggle-wrap">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ fontSize: '20px', lineHeight: 1, marginTop: '1px' }}>
                                    {p.icon}
                                </span>
                                <div>
                                    <div style={{
                                        fontSize: '13.5px', fontWeight: 600,
                                        color: 'var(--text-dark)', marginBottom: '2px'
                                    }}>
                                        {p.label}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                        {p.desc}
                                    </div>
                                </div>
                            </div>
                            <label className="toggle" style={{ marginLeft: '16px' }}>
                                <input
                                    type="checkbox"
                                    checked={!!prefs[p.key]}
                                    onChange={() => handleToggle(p.key)} />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    ))}

                    {/* Save button */}
                    <div style={{ marginTop: '24px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                            style={{ opacity: saving ? 0.7 : 1 }}>
                            {saving ? (
                                <>
                                    <div className="spinner"
                                         style={{ width: '14px', height: '14px',
                                                  borderWidth: '2px' }} />
                                    Saving…
                                </>
                            ) : 'Save Preferences'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}