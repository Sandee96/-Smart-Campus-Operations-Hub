import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById, updateResourceStatus, deleteResource } from '../api/resourceApi';

const typeConfig = {
    LAB: { icon: '🖥️', color: 'from-blue-500 to-blue-700' },
    LECTURE_HALL: { icon: '🎓', color: 'from-purple-500 to-purple-700' },
    MEETING_ROOM: { icon: '🤝', color: 'from-teal-500 to-teal-700' },
    EQUIPMENT: { icon: '🔧', color: 'from-orange-500 to-orange-700' },
};

const ResourceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    let isAdmin = false;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            isAdmin = payload.roles === 'ADMIN' ||
                (Array.isArray(payload.roles) && payload.roles.includes('ADMIN'));
        } catch (e) { isAdmin = false; }
    }

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

    const handleStatusChange = async (newStatus) => {
        try {
            const updated = await updateResourceStatus(id, newStatus);
            setResource(updated);
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this resource?')) {
            try {
                await deleteResource(id);
                navigate('/resources');
            } catch (err) {
                alert('Failed to delete.');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl animate-bounce mb-4">⏳</div>
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4">❌</div>
                <p className="text-red-500">{error}</p>
                <button onClick={() => navigate('/resources')} className="mt-4 text-blue-500 underline">
                    Back to Resources
                </button>
            </div>
        </div>
    );

    const config = typeConfig[resource.type] || typeConfig.LAB;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className={`bg-gradient-to-r ${config.color} text-white`}>
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <button
                        onClick={() => navigate('/resources')}
                        className="text-white/80 hover:text-white mb-6 flex items-center gap-2 text-sm"
                    >
                        ← Back to Facilities
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-6xl">{config.icon}</div>
                        <div>
                            <h1 className="text-3xl font-black">{resource.name}</h1>
                            <p className="text-white/80 mt-1">{resource.type.replace('_', ' ')}</p>
                        </div>
                        <div className="ml-auto">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                resource.status === 'ACTIVE'
                                    ? 'bg-green-400 text-green-900'
                                    : 'bg-red-400 text-red-900'
                            }`}>
                                {resource.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4 text-lg">📋 Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium text-gray-800">📍 {resource.location}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Capacity</span>
                                <span className="font-medium text-gray-800">👥 {resource.capacity} people</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Type</span>
                                <span className="font-medium text-gray-800">{resource.type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-bold ${resource.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                                    {resource.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Availability Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4 text-lg">🗓️ Availability</h2>
                        {resource.availabilityWindows && resource.availabilityWindows.length > 0 ? (
                            <div className="space-y-2">
                                {resource.availabilityWindows.map((w, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                                        <span className="font-medium text-gray-700">{w.dayOfWeek}</span>
                                        <span className="text-gray-500 text-sm">{w.startTime} – {w.endTime}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No availability windows set</p>
                        )}
                    </div>
                </div>

                {/* Description */}
                {resource.description && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
                        <h2 className="font-bold text-gray-800 mb-3 text-lg">📝 Description</h2>
                        <p className="text-gray-600 leading-relaxed">{resource.description}</p>
                    </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-400 mb-6 flex gap-4">
                    <span>Created: {new Date(resource.createdAt).toLocaleString()}</span>
                    <span>Updated: {new Date(resource.updatedAt).toLocaleString()}</span>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4 text-lg">⚙️ Admin Actions</h2>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => navigate(`/resources/edit/${resource.id}`)}
                                className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
                            >
                                ✏️ Edit Resource
                            </button>
                            {resource.status === 'ACTIVE' ? (
                                <button
                                    onClick={() => handleStatusChange('OUT_OF_SERVICE')}
                                    className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                                >
                                    🔴 Mark Out of Service
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange('ACTIVE')}
                                    className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors"
                                >
                                    🟢 Mark Active
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceDetailPage;