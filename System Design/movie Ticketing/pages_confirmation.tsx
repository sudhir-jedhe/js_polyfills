import Link from 'next/link'

export default function Confirmation() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="mb-4">Thank you for your booking. Your tickets have been reserved.</p>
      <p className="mb-8">A confirmation email has been sent to your registered email address.</p>
      <Link href="/">
        <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Return to Home
        </a>
      </Link>
    </div>
  )
}

