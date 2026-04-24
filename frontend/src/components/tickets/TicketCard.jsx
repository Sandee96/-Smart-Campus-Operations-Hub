import TicketStatusBadge from "./TicketStatusBadge";

export default function TicketCard({ ticket, onClick }) {
  return (
    <div onClick={onClick} className="ticket-card">
      <div className="ticket-card-header">
        <div>
          <h3>{ticket.category}</h3>
          <p className="ticket-meta">{ticket.location}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <p className="ticket-desc">{ticket.description}</p>

      <div className="ticket-footer">
        <span className="priority-badge">{ticket.priority}</span>
        <span className="ticket-meta">{ticket.resourceId || "No resource"}</span>
      </div>
    </div>
  );
}