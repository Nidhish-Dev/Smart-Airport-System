// app/passenger/booking/[flightId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Flight } from '@/types';
import { API_URLS } from '@/lib/api';

export default function BookingPage() {
  const { flightId } = useParams();
  const router = useRouter();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [form, setForm] = useState({ passengerName: '', email: '', seatNumber: '' });
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightRes, ticketsRes] = await Promise.all([
          axios.get(`${API_URLS.flights}/${flightId}`),
          axios.get(API_URLS.tickets.all)
        ]);
        setFlight(flightRes.data);
        setTickets(ticketsRes.data.filter((t: any) => t.flight._id === flightId));
      } catch (err) {
        console.error(err);
        router.push('/passenger');
      }
    };
    fetchData();
  }, [flightId, router]);

  const occupiedSeats = tickets
    .filter(t => t.seatNumber && t.seatNumber !== 'Auto')
    .map(t => parseInt(t.seatNumber));

  const availableSeats = Array.from({ length: flight?.capacity || 0 }, (_, i) => i + 1)
    .filter(seat => !occupiedSeats.includes(seat));

  const handleSeatSelect = (seat: number) => {
    setForm({ ...form, seatNumber: seat.toString() });
    setShowSeatSelection(false);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      router.push('/passenger/login');
      return;
    }

    try {
      const res = await axios.post(API_URLS.tickets.book, {
        ...form,
        flightId
      }, {
        headers: { Authorization: `Bearer ${token}` }
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
          <p className="mt-4 text-sm text-gray-400">Gate: <span className="font-medium text-white">{flight.gate}</span></p>
          <p className="mt-4 text-sm text-gray-400">Show this QR code at check-in</p>
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
            <label className="block text-sm mb-2">Seat Selection</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                readOnly
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                value={form.seatNumber || 'Select a seat'}
                placeholder="Select a seat"
              />
              <button
                type="button"
                onClick={() => setShowSeatSelection(!showSeatSelection)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl font-semibold"
              >
                {showSeatSelection ? 'Hide' : 'Select'}
              </button>
            </div>
            {showSeatSelection && (
              <div className="mt-4 bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-4">Available Seats: {availableSeats.length}</p>
                <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                  {availableSeats.map(seat => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => handleSeatSelect(seat)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold"
                    >
                      {seat}
                    </button>
                  ))}
                </div>
                {availableSeats.length === 0 && (
                  <p className="text-yellow-400 text-sm">No seats available</p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !form.seatNumber}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}