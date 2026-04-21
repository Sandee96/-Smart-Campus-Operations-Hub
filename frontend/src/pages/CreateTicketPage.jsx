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
    <div className="main-content">
      <div className="form-card">
        <TicketForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}