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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
            <p className="text-gray-500 mt-1">Track your reported maintenance issues</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchTickets}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/tickets/new")}
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
            >
              + New Ticket
            </button>
          </div>
        </div>

        <div className="mb-6">
          <TicketFilters selected={selectedStatus} onChange={setSelectedStatus} />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-4">
            No tickets found for this filter.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
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