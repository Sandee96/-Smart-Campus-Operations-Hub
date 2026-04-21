import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../api/ticketApi";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge";
import CommentSection from "../components/tickets/CommentSection";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await getTicketById(id);
      setTicket(res.data);
    } catch (error) {
      console.error("Failed to fetch ticket", error);
    }
  };

  if (!ticket) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="details-grid">
        <div className="details-card">
          <div className="ticket-card-header">
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              {ticket.category}
            </h1>
            <TicketStatusBadge status={ticket.status} />
          </div>

          <p className="ticket-desc">{ticket.description}</p>

          <div className="info-boxes">
            <div className="info-box">
              <p className="info-label">Location</p>
              <p className="info-value">{ticket.location}</p>
            </div>

            <div className="info-box">
              <p className="info-label">Priority</p>
              <p className="info-value">{ticket.priority}</p>
            </div>

            <div className="info-box">
              <p className="info-label">Resource ID</p>
              <p className="info-value">{ticket.resourceId || "N/A"}</p>
            </div>

            <div className="info-box">
              <p className="info-label">Contact</p>
              <p className="info-value">{ticket.contactDetails}</p>
            </div>
          </div>
        </div>

        <CommentSection ticketId={id} />
      </div>
    </div>
  );
}