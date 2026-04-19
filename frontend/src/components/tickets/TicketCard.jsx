import TicketStatusBadge from "./TicketStatusBadge";

export default function TicketCard({ ticket, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{ticket.category}</h3>
          <p className="text-sm text-gray-500">{ticket.location}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
          {ticket.priority}
        </span>
        <span className="text-gray-400">{ticket.resourceId || "No resource"}</span>
      </div>
    </div>
  );
}