import { useNavigate } from 'react-router-dom';

const typeConfig = {
    LAB: { icon: '🖥️', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-700' },
    LECTURE_HALL: { icon: '🎓', color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', text: 'text-purple-700' },
    MEETING_ROOM: { icon: '🤝', color: 'from-teal-500 to-teal-700', bg: 'bg-teal-50', text: 'text-teal-700' },
    EQUIPMENT: { icon: '🔧', color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50', text: 'text-orange-700' },
};

const ResourceCard = ({ resource, onDelete, isAdmin }) => {
    const navigate = useNavigate();
    const config = typeConfig[resource.type] || typeConfig.LAB;
    const isActive = resource.status === 'ACTIVE';

    return (
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 hover:-translate-y-1 flex flex-col h-full">
            {/* Top gradient bar */}
            <div className={`h-2 bg-gradient-to-r ${config.color}`} />

            <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl`}>
                            {config.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base leading-tight">{resource.name}</h3>
                            <span className={`text-xs font-medium ${config.text} ${config.bg} px-2 py-0.5 rounded-full`}>
                                {resource.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                        {isActive ? '● Active' : '● Unavailable'}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-2.5 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>{resource.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>👥</span>
                        <span>Capacity: <strong>{resource.capacity}</strong></span>
                    </div>
                    {resource.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{resource.description}</p>
                    )}
                </div>

                {/* Availability */}
                {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {resource.availabilityWindows.slice(0, 3).map((w, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                {w.dayOfWeek.slice(0, 3)} {w.startTime}–{w.endTime}
                            </span>
                        ))}
                        {resource.availabilityWindows.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                                +{resource.availabilityWindows.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
                    <button
                        onClick={() => navigate(`/resources/${resource.id}`)}
                        className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    >
                        View Details
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => navigate(`/resources/edit/${resource.id}`)}
                                className="bg-amber-50 text-amber-700 border border-amber-200 py-2 px-3 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600/15"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDelete(resource.id)}
                                className="bg-red-50 text-red-600 border border-red-200 py-2 px-3 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/15"
                            >
                                🗑️
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;