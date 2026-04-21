import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources, searchResources, deleteResource } from '../api/resourceApi';

const typeConfig = {
    LAB: { icon: '🖥️', color: 'bg-blue-100 text-blue-700', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
    LECTURE_HALL: { icon: '🎓', color: 'bg-purple-100 text-purple-700', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
    MEETING_ROOM: { icon: '🤝', color: 'bg-teal-100 text-teal-700', badge: 'bg-teal-50 text-teal-600 border-teal-200' },
    EQUIPMENT: { icon: '🔧', color: 'bg-orange-100 text-orange-700', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
};

const ResourceCard = ({ resource, onDelete, isAdmin, onClick }) => {
    const config = typeConfig[resource.type] || typeConfig.LAB;
    const isActive = resource.status === 'ACTIVE';

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-11 h-11 rounded-xl ${config.color} flex items-center justify-center text-xl`}>
                    {config.icon}
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    isActive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isActive ? 'Active' : 'Unavailable'}
                </span>
            </div>

            <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                {resource.name}
            </h3>

            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-lg border mb-3 ${config.badge}`}>
                {resource.type.replace('_', ' ')}
            </span>

            <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{resource.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Capacity: <strong className="text-gray-700">{resource.capacity}</strong></span>
                </div>
            </div>

            {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {resource.availabilityWindows.slice(0, 2).map((w, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                            {w.dayOfWeek.slice(0, 3)} {w.startTime}–{w.endTime}
                        </span>
                    ))}
                    {resource.availabilityWindows.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-lg">
                            +{resource.availabilityWindows.length - 2} more
                        </span>
                    )}
                </div>
            )}

            {isAdmin && (
                <div className="flex gap-2 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={(e) => { e.stopPropagation(); window.location.href = `/resources/edit/${resource.id}`; }}
                        className="flex-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 py-2 rounded-xl hover:bg-amber-100 transition-colors"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(resource.id); }}
                        className="flex-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

const ResourceListPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ type: '', status: '', minCapacity: '', location: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    let isAdmin = false;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            isAdmin = payload.roles === 'ADMIN' ||
                (Array.isArray(payload.roles) && payload.roles.includes('ADMIN'));
        } catch (e) { isAdmin = false; }
    }

    useEffect(() => { fetchResources(); }, []);

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
            const hasFilters = Object.values(filters).some(v => v !== '') || searchText !== '';
            const searchFilters = {
                ...filters,
                location: filters.location || searchText,
            };
            const data = hasFilters
                ? await searchResources(searchFilters)
                : await getAllResources();
            setResources(data);
            setError(null);
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setFilters({ type: '', status: '', minCapacity: '', location: '' });
        setSearchText('');
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

    const stats = [
        { label: 'Total Resources', value: resources.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
        { label: 'Available Now', value: resources.filter(r => r.status === 'ACTIVE').length, icon: '✅', color: 'bg-green-50 text-green-700' },
        { label: 'Labs', value: resources.filter(r => r.type === 'LAB').length, icon: '🖥️', color: 'bg-purple-50 text-purple-700' },
        { label: 'Lecture Halls', value: resources.filter(r => r.type === 'LECTURE_HALL').length, icon: '🎓', color: 'bg-teal-50 text-teal-700' },
    ];

    const inputClass = "border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-full";

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Facilities & Assets Catalogue</h1>
                        <p className="text-gray-500 text-sm mt-1">Browse and search available campus resources for your bookings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-blue-600">{resources.length} Resources</span>
                        <span className="text-sm font-semibold text-green-600">{resources.filter(r => r.status === 'ACTIVE').length} Active</span>
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/resources/create')}
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
                            >
                                + Add Resource
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-6">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-2xl p-4 border border-white`}>
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-2xl font-black">{stat.value}</div>
                            <div className="text-sm font-medium opacity-80">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by name, location, type, or description..."
                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                showFilters
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Filters
                        </button>
                        <button
                            onClick={handleSearch}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
                        >
                            Search
                        </button>

                        {/* View Toggle */}
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2.5 transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Resource Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="">All Types</option>
                                        <option value="LAB">🖥️ Lab</option>
                                        <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                                        <option value="MEETING_ROOM">🤝 Meeting Room</option>
                                        <option value="EQUIPMENT">🔧 Equipment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Minimum Capacity</label>
                                    <input
                                        type="number"
                                        value={filters.minCapacity}
                                        onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                                        placeholder="e.g., 30"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                                    <input
                                        type="text"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        placeholder="Search by location..."
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="ACTIVE">✅ Active</option>
                                        <option value="OUT_OF_SERVICE">❌ Out of Service</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={handleSearch} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
                                    Apply Filters
                                </button>
                                <button onClick={handleClear} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {!loading && (
                    <p className="text-sm text-gray-500 mb-4">
                        Found <strong className="text-gray-800">{resources.length}</strong> resource{resources.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4 animate-bounce">⏳</div>
                        <p className="text-gray-400">Loading resources...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
                        ⚠️ {error}
                    </div>
                )}

                {/* Resources Grid */}
                {!loading && !error && resources.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-500 text-lg font-medium">No resources found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                        <button onClick={handleClear} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                            Clear filters
                        </button>
                    </div>
                )}

                {!loading && !error && resources.length > 0 && (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {resources.map(resource => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onDelete={handleDelete}
                                    isAdmin={isAdmin}
                                    onClick={() => navigate(`/resources/${resource.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {resources.map(resource => {
                                const config = typeConfig[resource.type] || typeConfig.LAB;
                                return (
                                    <div
                                        key={resource.id}
                                        onClick={() => navigate(`/resources/${resource.id}`)}
                                        className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex items-center gap-4"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-xl flex-shrink-0`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-gray-900">{resource.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-lg border ${config.badge}`}>
                                                    {resource.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>📍 {resource.location}</span>
                                                <span>👥 {resource.capacity} people</span>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex-shrink-0 ${
                                            resource.status === 'ACTIVE'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-600 border-red-200'
                                        }`}>
                                            {resource.status === 'ACTIVE' ? '● Active' : '● Unavailable'}
                                        </span>
                                        {isAdmin && (
                                            <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/resources/edit/${resource.id}`)}
                                                    className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors"
                                                >✏️ Edit</button>
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
                                                >🗑️</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ResourceListPage;