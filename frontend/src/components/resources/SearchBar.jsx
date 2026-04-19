import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: ''
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        onSearch(filters);
    };

    const handleClear = () => {
        setFilters({ type: '', minCapacity: '', location: '', status: '' });
        onSearch({});
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">🔍 Search & Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                {/* Type Filter */}
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Types</option>
                    <option value="LAB">Lab</option>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                </select>

                {/* Location Filter */}
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="Search by location..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Capacity Filter */}
                <input
                    type="number"
                    name="minCapacity"
                    value={filters.minCapacity}
                    onChange={handleChange}
                    placeholder="Min capacity..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Status Filter */}
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-sm"
                >
                    Search
                </button>
                <button
                    onClick={handleClear}
                    className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 text-sm"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchBar;