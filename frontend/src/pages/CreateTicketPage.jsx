import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticketApi";
import TicketForm from "../components/tickets/TicketForm";

export default function CreateTicketPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await createTicket(formData);
      navigate(`/tickets/${res.data.id}`);
    } catch (error) {
      console.error("Failed to create ticket", error);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <TicketForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}