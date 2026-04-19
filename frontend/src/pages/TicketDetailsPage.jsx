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
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{ticket.category}</h1>
            <TicketStatusBadge status={ticket.status} />
          </div>

          <p className="text-gray-600 mb-6">{ticket.description}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-medium">{ticket.location}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Priority</p>
              <p className="font-medium">{ticket.priority}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Resource ID</p>
              <p className="font-medium">{ticket.resourceId || "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Contact</p>
              <p className="font-medium">{ticket.contactDetails}</p>
            </div>
          </div>
        </div>

        <CommentSection ticketId={id} />
      </div>
    </div>
  );
}