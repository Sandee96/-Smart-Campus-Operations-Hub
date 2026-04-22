import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById, createResource, updateResource } from '../api/resourceApi';

const ResourceFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '', type: 'LAB', capacity: '',
        location: '', description: '', status: 'ACTIVE',
        availabilityWindows: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) fetchResource();
    }, [id]);

    const fetchResource = async () => {
        try {
            const data = await getResourceById(id);
            setFormData({
                name: data.name, type: data.type,
                capacity: data.capacity, location: data.location,
                description: data.description || '', status: data.status,
                availabilityWindows: data.availabilityWindows || []
            });
        } catch (err) {
            setError('Failed to load resource.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddWindow = () => {
        setFormData({
            ...formData,
            availabilityWindows: [
                ...formData.availabilityWindows,
                { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '18:00' }
            ]
        });
    };

    const handleWindowChange = (index, field, value) => {
        const updated = [...formData.availabilityWindows];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, availabilityWindows: updated });
    };

    const handleRemoveWindow = (index) => {
        setFormData({
            ...formData,
            availabilityWindows: formData.availabilityWindows.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const payload = { ...formData, capacity: parseInt(formData.capacity) };
            if (isEditMode) {
                await updateResource(id, payload);
                alert('Resource updated successfully!');
            } else {
                await createResource(payload);
                alert('Resource created successfully!');
            }
            navigate('/resources');
        } catch (err) {
            setError('Failed to save resource. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper-sm animate-fade-up">

            {/* Hero Header — same as friend's style */}
            <div style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                borderRadius: 16, padding: '28px 32px', marginBottom: 28,
                color: 'white', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -30, right: 40,
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                }} />
                <p style={{ fontSize: 24, margin: '0 0 4px', fontWeight: 700 }}>
                    {isEditMode ? '✏️ Update Resource' : '➕ New Resource'}
                </p>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.8 }}>
                    {isEditMode
                        ? 'Edit the details below to update this facility.'
                        : 'Fill in the details below to add a new facility or resource.'}
                </p>
            </div>

            {/* Form Card — same as friend's style */}
            <div className="card-flat" style={{ padding: '28px 32px' }}>

                {error && (
                    <div className="alert-error" style={{ marginBottom: 20 }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Basic Info */}
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                        Basic Information
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Resource Name *</label>
                            <input
                                className="input"
                                type="text" name="name" value={formData.name}
                                onChange={handleChange} required
                                placeholder="e.g. Lab A101"
                            />
                        </div>

                        <div>
                            <label>Type *</label>
                            <select className="input" name="type" value={formData.type} onChange={handleChange}>
                                <option value="LAB">🖥️ Lab</option>
                                <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                                <option value="MEETING_ROOM">🤝 Meeting Room</option>
                                <option value="EQUIPMENT">🔧 Equipment</option>
                            </select>
                        </div>

                        <div>
                            <label>Status *</label>
                            <select className="input" name="status" value={formData.status} onChange={handleChange}>
                                <option value="ACTIVE">● Active</option>
                                <option value="OUT_OF_SERVICE">● Out of Service</option>
                            </select>
                        </div>

                        <div>
                            <label>Capacity *</label>
                            <input
                                className="input"
                                type="number" name="capacity" value={formData.capacity}
                                onChange={handleChange} required min="1"
                                placeholder="e.g. 30"
                            />
                        </div>

                        <div>
                            <label>Location *</label>
                            <select
                                className="input"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a block</option>
                                <option value="Block A">Block A</option>
                                <option value="Block B">Block B</option>
                                <option value="Block C">Block C</option>
                                <option value="Block D">Block D</option>
                            </select>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Description */}
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 16px' }}>
                        Description
                    </p>
                    <div style={{ marginBottom: 20 }}>
                        <label>Optional</label>
                        <textarea
                            className="input"
                            name="description" value={formData.description}
                            onChange={handleChange} rows="3"
                            placeholder="Optional description..."
                            style={{ resize: 'none' }}
                        />
                    </div>

                    <div className="divider" />

                    {/* Availability Windows */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                            Availability Windows
                        </p>
                        <button
                            type="button"
                            onClick={handleAddWindow}
                            className="btn btn-primary btn-sm"
                        >
                            + Add Window
                        </button>
                    </div>

                    {formData.availabilityWindows.length === 0 && (
                        <div style={{
                            background: '#f8fafc', borderRadius: 12,
                            border: '1.5px dashed var(--border)',
                            padding: '20px 16px', textAlign: 'center',
                            color: 'var(--text-faint)', fontSize: 14,
                            marginBottom: 20
                        }}>
                            No availability windows added yet
                        </div>
                    )}

                    {formData.availabilityWindows.map((window, index) => (
                        <div key={index} style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
                            gap: 10, marginBottom: 10, alignItems: 'center',
                            background: '#f8fafc', padding: '12px 14px',
                            borderRadius: 12, border: '1px solid var(--border)'
                        }}>
                            <select
                                value={window.dayOfWeek}
                                onChange={(e) => handleWindowChange(index, 'dayOfWeek', e.target.value)}
                                className="input" style={{ padding: '8px 12px' }}
                            >
                                {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <input
                                type="time" value={window.startTime}
                                onChange={(e) => handleWindowChange(index, 'startTime', e.target.value)}
                                className="input" style={{ padding: '8px 12px' }}
                            />
                            <input
                                type="time" value={window.endTime}
                                onChange={(e) => handleWindowChange(index, 'endTime', e.target.value)}
                                className="input" style={{ padding: '8px 12px' }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveWindow(index)}
                                className="btn btn-danger btn-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <div className="divider" />

                    {/* Submit Buttons */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                        >
                            {loading ? '⏳ Saving...' : isEditMode ? '✅ Update Resource' : '➕ Create Resource'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/resources')}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ResourceFormPage;