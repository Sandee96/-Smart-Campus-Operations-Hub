import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteTicket,
  getAllTickets,
  getMyTickets,
  updateTicketStatus,
  assignTechnician,
} from "../api/ticketApi";
import TicketCard from "../components/tickets/TicketCard";
import TicketFilters from "../components/tickets/TicketFilters";

// Get logged-in user from localStorage
function getStoredUser() {
  try {
    const raw =
      localStorage.getItem("smartcampus_user") ||
      localStorage.getItem("user") ||
      null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = getStoredUser();
  const isAdmin =
    user?.role === "ROLE_ADMIN" ||
    user?.role === "ADMIN" ||
    (user?.roles || "").includes("ADMIN");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = isAdmin ? await getAllTickets() : await getMyTickets();
      setTickets(res.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmed) return;
    try {
      await deleteTicket(id);
      alert("Ticket deleted successfully");
      fetchTickets();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    if (isAdmin) {
      const newStatus = window.prompt(
        "Select status by typing number:\n1. OPEN\n2. IN_PROGRESS\n3. RESOLVED\n4. CLOSED\n5. REJECTED"
      );
      const statusMap = {
        "1": "OPEN",
        "2": "IN_PROGRESS",
        "3": "RESOLVED",
        "4": "CLOSED",
        "5": "REJECTED",
      };
      const selectedStatus = statusMap[newStatus];
      if (!selectedStatus) return;
      try {
        await updateTicketStatus(id, { status: selectedStatus });
        alert("Ticket status updated successfully");
        fetchTickets();
      } catch (error) {
        console.error("Update failed", error);
        alert("Update failed");
      }
    } else {
      navigate(`/tickets/edit/${id}`);
    }
  };

  const handleAssign = async (id) => {
    const technicianId = window.prompt("Enter technician ID or email");
    if (!technicianId) return;
    try {
      await assignTechnician(id, { technicianId });
      alert("Technician assigned successfully");
      fetchTickets();
    } catch (error) {
      console.error("Assign failed", error);
      alert("Failed to assign technician");
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
            <h1 className="page-title">
              {isAdmin ? "All Tickets" : "My Tickets"}
            </h1>
            <p className="page-subtitle">
              {isAdmin
                ? "Manage all reported incidents"
                : "Track your reported maintenance issues"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={fetchTickets} className="secondary-btn">
              Refresh
            </button>
            {!isAdmin && (
              <button
                onClick={() => navigate("/tickets/new")}
                className="primary-btn"
              >
                + New Ticket
              </button>
            )}
          </div>
        </div>

        <TicketFilters
          selected={selectedStatus}
          onChange={setSelectedStatus}
        />

        {loading ? (
          <p className="page-subtitle">Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <div className="alert alert-error">
            No tickets found for this filter.
          </div>
        ) : (
          <div className="ticket-grid">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isAdmin={isAdmin}
                onView={(id) => navigate(`/tickets/${id}`)}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}