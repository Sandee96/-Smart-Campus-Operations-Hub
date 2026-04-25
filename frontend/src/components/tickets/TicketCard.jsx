import TicketStatusBadge from "./TicketStatusBadge";

export default function TicketCard({
  ticket,
  isAdmin,
  onView,
  onUpdate,
  onDelete,
  onAssign,
}) {
  return (
    <div className="ticket-card">
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

      {isAdmin && (
        <p className="ticket-meta">
          Technician: {ticket.assignedTechnicianId || "Not assigned"}
        </p>
      )}

      <div className="ticket-actions">
        <button className="secondary-btn" onClick={() => onView(ticket.id)}>
          View
        </button>

        <button className="ticket-primary-btn" onClick={() => onUpdate(ticket.id)}>
          Update
        </button>

        {isAdmin && (
          <button className="assign-btn" onClick={() => onAssign(ticket.id)}>
            Assign Technician
          </button>
        )}

        <button className="danger-btn" onClick={() => onDelete(ticket.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}