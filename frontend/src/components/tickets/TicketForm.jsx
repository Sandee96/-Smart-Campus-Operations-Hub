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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Create New Ticket</h2>

      <input
        name="resourceId"
        value={form.resourceId}
        onChange={handleChange}
        placeholder="Resource ID"
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
        required
      >
        <option value="">Select category</option>
        {TICKET_CATEGORIES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Describe the issue"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 h-32"
        required
      />

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
        required
      >
        <option value="">Select priority</option>
        {TICKET_PRIORITIES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <input
        name="contactDetails"
        value={form.contactDetails}
        onChange={handleChange}
        placeholder="Preferred contact"
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium"
      >
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}