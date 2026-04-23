import { QRCodeSVG } from 'qrcode.react'

export default function QrCodeDisplay({ qrToken }) {
  const checkInUrl = `${window.location.origin}/checkin?token=${qrToken}`

  return (
    <div className="flex flex-col items-center p-6 border rounded-xl bg-white shadow-md">
      <h3 className="text-base font-semibold text-gray-700 mb-4">Scan to Check In</h3>
      <QRCodeSVG value={checkInUrl} size={180} />
      <p className="mt-4 text-xs text-gray-400 text-center max-w-xs">
        Show this QR code at the venue. Valid only during your booking window (±15 min).
      </p>
    </div>
  )
}