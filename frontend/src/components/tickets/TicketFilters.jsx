import { TICKET_STATUSES } from "../../utils/ticketConstants";

export default function TicketFilters({ selected, onChange }) {
  const filters = ["ALL", ...TICKET_STATUSES];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selected === item
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}