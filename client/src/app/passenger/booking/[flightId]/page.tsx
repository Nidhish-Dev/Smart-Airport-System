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

  if (!flight) return <div className="text-center py-20 text-slate-600">Loading flight...</div>;

  if (ticket) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-semibold mb-8 text-slate-950">Booking Successful!</h1>
        <div className="card p-8 rounded-3xl">
          <p className="text-xl mb-6 text-slate-900">Ticket ID: <span className="font-mono font-bold text-slate-950">{ticket.ticketId}</span></p>
          <QRCodeDisplay qrData={ticket.qrData} />
          <p className="mt-4 text-sm text-slate-600">Gate: <span className="font-medium text-slate-950">{flight.gate}</span></p>
          <p className="mt-2 text-sm text-slate-600">Departure: <span className="font-medium text-slate-950">{new Date(flight.departureTime).toLocaleDateString()} at {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
          <p className="mt-4 text-sm text-slate-600">Show this QR code at check-in</p>
        </div>
        <button onClick={() => router.push('/passenger')} className="btn btn-primary mt-10 px-10 py-4">
          Back to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8 text-slate-950">Book Ticket - {flight.flightNumber}</h1>

      <div className="card p-6 rounded-2xl mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">{flight.origin} → {flight.destination}</p>
            <p className="text-2xl font-semibold text-slate-950">{flight.flightNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-600 font-semibold">{flight.status}</p>
            <p className="text-sm text-slate-500">Departure: {new Date(flight.departureTime).toLocaleDateString()} at {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Seats: {flight.availableSeats}/{flight.capacity}
        </div>
      </div>

      <div className="card p-8 rounded-3xl">
        <form onSubmit={handleBook} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-600 mb-2">Passenger Name</label>
            <input
              type="text"
              required
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={form.passengerName}
              onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Seat Selection</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                readOnly
                className="flex-1 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950"
                value={form.seatNumber || 'Select a seat'}
                placeholder="Select a seat"
              />
              <button
                type="button"
                onClick={() => setShowSeatSelection(!showSeatSelection)}
                className="btn btn-secondary px-4 py-3"
              >
                {showSeatSelection ? 'Hide' : 'Select'}
              </button>
            </div>
            {showSeatSelection && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500 mb-4">Available Seats: {availableSeats.length}</p>
                <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                  {availableSeats.map(seat => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => handleSeatSelect(seat)}
                      className="btn btn-secondary py-2 px-3 text-sm"
                    >
                      {seat}
                    </button>
                  ))}
                </div>
                {availableSeats.length === 0 && (
                  <p className="text-sm text-slate-500">No seats available</p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !form.seatNumber}
            className="btn btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}