import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketById, updateTicketDetails } from "../api/ticketApi";
import { TICKET_PRIORITIES } from "../utils/ticketConstants";

export default function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    description: "",
    priority: "",
    contactDetails: "",
  });

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await getTicketById(id);
      setFormData({
        location: res.data.location || "",
        description: res.data.description || "",
        priority: res.data.priority || "",
        contactDetails: res.data.contactDetails || "",
      });
    };

    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTicketDetails(id, formData);
      alert("Ticket updated successfully");
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update ticket");
    }
  };

  return (
    <div className="ticket-page-wrapper">
      <div className="ticket-form-wrapper">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <h2 className="ticket-form-title">Edit Ticket</h2>

          <div className="ticket-form-group">
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select priority</option>
              {TICKET_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="ticket-form-group">
            <label>Contact Details</label>
            <input
              name="contactDetails"
              value={formData.contactDetails}
              onChange={handleChange}
              required
            />
          </div>

         <div className="form-actions">
  <button type="submit" className="primary-btn">
    Save Changes
  </button>

  <button
    type="button"
    className="secondary-btn"
    onClick={() => navigate("/tickets")}
  >
    Cancel
  </button>
</div>
        </form>
      </div>
    </div>
  );
}