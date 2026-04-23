const STATUS_CONFIG = {
  PENDING:    { bg:'#fffbeb', color:'#92400e', border:'#fde68a', dot:'#f59e0b', label:'Pending' },
  APPROVED:   { bg:'#f0fdf4', color:'#14532d', border:'#bbf7d0', dot:'#10b981', label:'Approved' },
  REJECTED:   { bg:'#fef2f2', color:'#7f1d1d', border:'#fecaca', dot:'#ef4444', label:'Rejected' },
  CANCELLED:  { bg:'#f8fafc', color:'#475569', border:'#e2e8f0', dot:'#94a3b8', label:'Cancelled' },
  CHECKED_IN: { bg:'#eff6ff', color:'#1e3a5f', border:'#bfdbfe', dot:'#3b82f6', label:'Checked In' },
}

export default function BookingStatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      background:c.bg, color:c.color,
      border:`1px solid ${c.border}`,
      borderRadius:20, padding:'4px 10px',
      fontSize:11, fontWeight:600, letterSpacing:'0.02em',
      whiteSpace:'nowrap',
    }}>
      <span style={{
        width:6, height:6, borderRadius:'50%',
        background:c.dot, flexShrink:0,
      }}/>
      {c.label}
    </span>
  )
}