import { useState } from "react";
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "../../utils/ticketConstants";

export default function TicketForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    resourceId: "",
    location: "",
    category: "",
    description: "",
    priority: "",
    contactDetails: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <h2 className="form-title">Create New Ticket</h2>

      <input
        name="resourceId"
        value={form.resourceId}
        onChange={handleChange}
        placeholder="Resource ID"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        {TICKET_CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Describe the issue"
        required
      />

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        required
      >
        <option value="">Select priority</option>
        {TICKET_PRIORITIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <input
        name="contactDetails"
        value={form.contactDetails}
        onChange={handleChange}
        placeholder="Preferred contact"
        required
      />

      <button type="submit" disabled={loading} className="primary-btn">
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}