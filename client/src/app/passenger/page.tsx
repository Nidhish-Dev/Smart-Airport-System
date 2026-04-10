// app/passenger/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Ticket, Flight } from '@/types';
import { API_URLS } from '@/lib/api';

export default function PassengerPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/passenger/login');
      return;
    }
    setUser(JSON.parse(userData || '{}'));

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [ticketsRes, flightsRes] = await Promise.all([
          axios.get(API_URLS.tickets.my, config),
          axios.get(API_URLS.flights)
        ]);
        setTickets(ticketsRes.data);
        setFlights(flightsRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/passenger/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/passenger/login');
  };

  if (loading) return <div className="text-center py-12 text-slate-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-slate-950">Passenger Portal</h1>
          <p className="text-slate-600 mt-2">Welcome back, {user?.name}.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary px-5 py-3">
          Logout
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-slate-950">Available Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <Link key={flight._id} href={`/passenger/booking/${flight._id}`}>
              <div className="card p-6 rounded-2xl hover:shadow-lg transition border-slate-200 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">{flight.origin} → {flight.destination}</p>
                    <p className="text-2xl font-semibold text-slate-950">{flight.flightNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 font-semibold">{flight.status}</p>
                    <p className="text-sm text-slate-500">{new Date(flight.departureTime).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-500">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  Seats: {flight.availableSeats}/{flight.capacity}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-slate-950">My Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-slate-500">No tickets yet. Book your first flight above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} onClick={() => setSelectedTicket(ticket)} className="card p-6 rounded-2xl border-slate-200 cursor-pointer hover:shadow-lg transition">
                <p className="font-mono text-lg font-semibold text-slate-950">{ticket.ticketId}</p>
                <p className="text-xl mt-2 text-slate-950">{ticket.passengerName}</p>
                <p className="text-slate-600">{ticket.flight.origin} → {ticket.flight.destination}</p>
                <p className="text-sm text-slate-500 mt-1">Departure: {new Date(ticket.flight.departureTime).toLocaleDateString()} at {new Date(ticket.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="mt-4 flex justify-between text-sm text-slate-600">
                  <div>Seat: <span className="font-medium text-slate-950">{ticket.seatNumber}</span></div>
                  <div className={ticket.checkedIn ? 'text-emerald-600' : 'text-yellow-600'}>
                    {ticket.checkedIn ? '✅ Checked In' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-8 rounded-3xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-6 text-center text-slate-950">Ticket QR Code</h2>
            <p className="text-center mb-4 text-slate-600">Ticket ID: <span className="font-mono font-semibold text-slate-950">{selectedTicket.ticketId}</span></p>
            <QRCodeDisplay qrData={selectedTicket.qrData} />
            <p className="mt-4 text-sm text-slate-600 text-center">Gate: <span className="font-medium text-slate-950">{selectedTicket.flight.gate}</span></p>
            <p className="mt-2 text-sm text-slate-600 text-center">Departure: <span className="font-medium text-slate-950">{new Date(selectedTicket.flight.departureTime).toLocaleDateString()} at {new Date(selectedTicket.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
            <button onClick={() => setSelectedTicket(null)} className="btn btn-primary mt-6 w-full py-3">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}