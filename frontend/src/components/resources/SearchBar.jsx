import { useState } from 'react';

const SearchBar = ({ onSearch, viewMode, onViewModeChange }) => {
    const [filters, setFilters] = useState({
        type: '', minCapacity: '', location: '', status: ''
    });
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => onSearch({
        ...filters,
        location: filters.location || query,
    });

    const handleClear = () => {
        setFilters({ type: '', minCapacity: '', location: '', status: '' });
        setQuery('');
        onSearch({});
    };

    const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all";
    const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

    return (
        <div className="mb-10">
            {/* Big search input */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-5 sm:px-6 py-4 sm:py-5">
                <div className="relative">
                    <svg className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by name, location, type, or description…"
                        className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                </div>
            </div>

            {/* Filters bar */}
            <div className="mt-5 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowFilters(v => !v)}
                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    aria-expanded={showFilters}
                >
                    <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Filters
                    </div>

                    <div className="flex items-center gap-2">
                        {typeof onViewModeChange === 'function' && (
                            <div className="flex border border-gray-200 rounded-2xl overflow-hidden bg-white">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onViewModeChange('grid'); }}
                                    className={`px-3.5 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    aria-label="Grid view"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onViewModeChange('list'); }}
                                    className={`px-3.5 py-2.5 transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    aria-label="List view"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="w-9 h-9 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white">
                            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </button>

                {/* Expanded filters */}
                {showFilters && (
                    <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 animate-slide-down">
                        <div className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Resource Type</label>
                                <select name="type" value={filters.type} onChange={handleChange} className={inputClass}>
                                    <option value="">All Types</option>
                                    <option value="LAB">Lab</option>
                                    <option value="LECTURE_HALL">Lecture Hall</option>
                                    <option value="MEETING_ROOM">Meeting Room</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Minimum Capacity</label>
                                <input
                                    type="number"
                                    name="minCapacity"
                                    value={filters.minCapacity}
                                    onChange={handleChange}
                                    placeholder="e.g., 30"
                                    className={inputClass}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleChange}
                                    placeholder="Search by location…"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Status</label>
                                <select name="status" value={filters.status} onChange={handleChange} className={inputClass}>
                                    <option value="">All Statuses</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="OUT_OF_SERVICE">Out of Service</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="bg-white text-gray-700 px-8 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;