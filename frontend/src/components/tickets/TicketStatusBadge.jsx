export default function TicketStatusBadge({ status }) {
  const badgeClass = `badge badge-${status.toLowerCase().replace("_", "")}`;

  return <span className={badgeClass}>{status}</span>;
}