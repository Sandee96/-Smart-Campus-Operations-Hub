import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        type: '', minCapacity: '', location: '', status: ''
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => onSearch(filters);

    const handleClear = () => {
        setFilters({ type: '', minCapacity: '', location: '', status: '' });
        onSearch({});
    };

    const inputClass = "border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all";

    return (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔍</span>
                <h3 className="font-bold text-gray-800">Search & Filter Resources</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select name="type" value={filters.type} onChange={handleChange} className={inputClass}>
                    <option value="">All Types</option>
                    <option value="LAB">🖥️ Lab</option>
                    <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                    <option value="MEETING_ROOM">🤝 Meeting Room</option>
                    <option value="EQUIPMENT">🔧 Equipment</option>
                </select>

                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="📍 Search location..."
                    className={inputClass}
                />

                <input
                    type="number"
                    name="minCapacity"
                    value={filters.minCapacity}
                    onChange={handleChange}
                    placeholder="👥 Min capacity..."
                    className={inputClass}
                />

                <select name="status" value={filters.status} onChange={handleChange} className={inputClass}>
                    <option value="">All Status</option>
                    <option value="ACTIVE">● Active</option>
                    <option value="OUT_OF_SERVICE">● Out of Service</option>
                </select>
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleSearch}
                    className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                    Search
                </button>
                <button
                    onClick={handleClear}
                    className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchBar;