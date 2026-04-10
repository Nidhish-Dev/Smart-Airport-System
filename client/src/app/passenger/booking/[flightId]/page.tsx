// app/passenger/booking/[flightId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Flight } from '@/types';

export default function BookingPage() {
  const { flightId } = useParams();
  const router = useRouter();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [form, setForm] = useState({ passengerName: '', email: '', seatNumber: '' });
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/flights/${flightId}`)
      .then(res => setFlight(res.data))
      .catch(() => router.push('/passenger'));
  }, [flightId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/tickets/book', {
        ...form,
        flightId
      });
      setTicket(res.data);
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!flight) return <div className="text-center py-20">Loading flight...</div>;

  if (ticket) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">Booking Successful!</h1>
        <div className="bg-gray-900 p-8 rounded-3xl">
          <p className="text-xl mb-6">Ticket ID: <span className="font-mono font-bold">{ticket.ticketId}</span></p>
          <QRCodeDisplay qrData={ticket.qrData} />
          <p className="mt-8 text-sm text-gray-400">Show this QR code at check-in</p>
        </div>
        <button onClick={() => router.push('/passenger')} className="mt-10 bg-blue-600 px-8 py-3 rounded-xl">
          Back to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Book Ticket - {flight.flightNumber}</h1>

      <div className="bg-gray-900 p-8 rounded-3xl">
        <form onSubmit={handleBook} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Passenger Name</label>
            <input
              type="text"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
              value={form.passengerName}
              onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Seat Number (optional)</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
              value={form.seatNumber}
              onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
              placeholder="Auto assigned"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}