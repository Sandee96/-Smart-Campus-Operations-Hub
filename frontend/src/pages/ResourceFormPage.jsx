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

    const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate('/resources')}
                        className="text-white/70 hover:text-white mb-4 flex items-center gap-2 text-sm"
                    >
                        ← Back to Facilities
                    </button>
                    <h1 className="text-3xl font-black">
                        {isEditMode ? '✏️ Edit Resource' : '➕ Add New Resource'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {isEditMode ? 'Update resource details' : 'Add a new facility to the catalogue'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className={labelClass}>Resource Name *</label>
                            <input
                                type="text" name="name" value={formData.name}
                                onChange={handleChange} required
                                className={inputClass} placeholder="e.g. Lab A101"
                            />
                        </div>

                        {/* Type + Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Type *</label>
                                <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                                    <option value="LAB">🖥️ Lab</option>
                                    <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                                    <option value="MEETING_ROOM">🤝 Meeting Room</option>
                                    <option value="EQUIPMENT">🔧 Equipment</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                    <option value="ACTIVE">● Active</option>
                                    <option value="OUT_OF_SERVICE">● Out of Service</option>
                                </select>
                            </div>
                        </div>

                        {/* Capacity + Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Capacity *</label>
                                <input
                                    type="number" name="capacity" value={formData.capacity}
                                    onChange={handleChange} required min="1"
                                    className={inputClass} placeholder="e.g. 30"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Location *</label>
                                <input
                                    type="text" name="location" value={formData.location}
                                    onChange={handleChange} required
                                    className={inputClass} placeholder="e.g. Block A"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description" value={formData.description}
                                onChange={handleChange} rows="3"
                                className={inputClass} placeholder="Optional description..."
                            />
                        </div>

                        {/* Availability Windows */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className={labelClass + " mb-0"}>Availability Windows</label>
                                <button
                                    type="button" onClick={handleAddWindow}
                                    className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    + Add Window
                                </button>
                            </div>

                            {formData.availabilityWindows.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    No availability windows added yet
                                </p>
                            )}

                            {formData.availabilityWindows.map((window, index) => (
                                <div key={index} className="flex gap-2 mb-2 items-center bg-gray-50 p-3 rounded-xl">
                                    <select
                                        value={window.dayOfWeek}
                                        onChange={(e) => handleWindowChange(index, 'dayOfWeek', e.target.value)}
                                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white flex-1"
                                    >
                                        {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="time" value={window.startTime}
                                        onChange={(e) => handleWindowChange(index, 'startTime', e.target.value)}
                                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                                    />
                                    <span className="text-gray-400 text-sm">to</span>
                                    <input
                                        type="time" value={window.endTime}
                                        onChange={(e) => handleWindowChange(index, 'endTime', e.target.value)}
                                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                                    />
                                    <button
                                        type="button" onClick={() => handleRemoveWindow(index)}
                                        className="text-red-400 hover:text-red-600 text-lg font-bold"
                                    >✕</button>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? '⏳ Saving...' : isEditMode ? '✅ Update Resource' : '➕ Create Resource'}
                            </button>
                            <button
                                type="button" onClick={() => navigate('/resources')}
                                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResourceFormPage;