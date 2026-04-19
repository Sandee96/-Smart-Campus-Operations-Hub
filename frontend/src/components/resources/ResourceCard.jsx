import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ resource, onDelete, isAdmin }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        return status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'LAB': return '🖥️';
            case 'LECTURE_HALL': return '🎓';
            case 'MEETING_ROOM': return '🤝';
            case 'EQUIPMENT': return '🔧';
            default: return '🏢';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>📍 {resource.location}</p>
                <p>👥 Capacity: {resource.capacity}</p>
                <p>🏷️ Type: {resource.type}</p>
                {resource.description && (
                    <p>📝 {resource.description}</p>
                )}
            </div>

            {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Availability:</p>
                    {resource.availabilityWindows.map((window, index) => (
                        <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {window.dayOfWeek} {window.startTime}-{window.endTime}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => navigate(`/resources/${resource.id}`)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
                >
                    View Details
                </button>
                {isAdmin && (
                    <>
                        <button
                            onClick={() => navigate(`/resources/edit/${resource.id}`)}
                            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(resource.id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResourceCard;