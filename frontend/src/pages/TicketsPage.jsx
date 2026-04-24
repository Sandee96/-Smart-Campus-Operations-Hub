import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../api/ticketApi";
import TicketCard from "../components/tickets/TicketCard";
import TicketFilters from "../components/tickets/TicketFilters";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getMyTickets();
      setTickets(res.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    if (selectedStatus === "ALL") return tickets;
    return tickets.filter((ticket) => ticket.status === selectedStatus);
  }, [tickets, selectedStatus]);

  return (
    <div className="main-content">
      <div className="page-card">
        <div className="action-row">
          <div>
            <h1 className="page-title">My Tickets</h1>
            <p className="page-subtitle">Track your reported maintenance issues</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={fetchTickets} className="secondary-btn">
              Refresh
            </button>
            <button
              onClick={() => navigate("/tickets/new")}
              className="primary-btn"
            >
              + New Ticket
            </button>
          </div>
        </div>

        <TicketFilters selected={selectedStatus} onChange={setSelectedStatus} />

        {loading ? (
          <p className="page-subtitle">Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <div className="alert alert-error">No tickets found for this filter.</div>
        ) : (
          <div className="ticket-grid">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}