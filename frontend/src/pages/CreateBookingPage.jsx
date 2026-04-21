import BookingForm from '../components/booking/BookingForm'

export default function CreateBookingPage() {
  return (
    <div className="page-wrapper-sm animate-fade-up">
      {/* Hero header */}
      <div style={{
        background:'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
        borderRadius:16, padding:'28px 32px', marginBottom:28,
        color:'white', position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:-20, right:-20,
          width:120, height:120, borderRadius:'50%',
          background:'rgba(255,255,255,0.06)',
        }}/>
        <div style={{
          position:'absolute', bottom:-30, right:40,
          width:80, height:80, borderRadius:'50%',
          background:'rgba(255,255,255,0.04)',
        }}/>
        <p style={{ fontSize:24, margin:'0 0 4px', fontWeight:700 }}>
          📝 New Booking Request
        </p>
        <p style={{ fontSize:13, margin:0, opacity:0.8 }}>
          Fill in the details below to request a facility booking
        </p>
      </div>

      {/* Form card */}
      <div className="card-flat" style={{ padding:'28px 32px' }}>
        <BookingForm />
      </div>
    </div>
  )
}