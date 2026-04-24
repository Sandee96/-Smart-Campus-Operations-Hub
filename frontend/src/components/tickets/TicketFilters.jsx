import { TICKET_STATUSES } from "../../utils/ticketConstants";

export default function TicketFilters({ selected, onChange }) {
  const filters = ["ALL", ...TICKET_STATUSES];

  return (
    <div className="filter-row">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`filter-chip ${selected === item ? "active" : ""}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}