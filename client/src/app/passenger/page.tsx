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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Passenger Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <Link key={flight._id} href={`/passenger/booking/${flight._id}`}>
              <div className="bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition border border-gray-700 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">{flight.origin} → {flight.destination}</p>
                    <p className="text-2xl font-bold">{flight.flightNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">{flight.status}</p>
                    <p className="text-sm text-gray-400">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Seats: {flight.availableSeats}/{flight.capacity}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">My Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-400">No tickets yet. Book your first flight above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} onClick={() => setSelectedTicket(ticket)} className="bg-gray-900 p-6 rounded-2xl border border-gray-700 cursor-pointer hover:bg-gray-800 transition">
                <p className="font-mono text-lg font-bold text-emerald-400">{ticket.ticketId}</p>
                <p className="text-xl mt-2">{ticket.passengerName}</p>
                <p className="text-gray-400">{ticket.flight.origin} → {ticket.flight.destination}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <div>Seat: <span className="font-medium">{ticket.seatNumber}</span></div>
                  <div className={ticket.checkedIn ? 'text-emerald-400' : 'text-yellow-400'}>
                    {ticket.checkedIn ? '✅ Checked In' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-3xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Ticket QR Code</h2>
            <p className="text-center mb-4">Ticket ID: <span className="font-mono font-bold">{selectedTicket.ticketId}</span></p>
            <QRCodeDisplay qrData={selectedTicket.qrData} />
            <p className="mt-4 text-sm text-gray-400 text-center">Gate: <span className="font-medium text-white">{selectedTicket.flight.gate}</span></p>
            <button onClick={() => setSelectedTicket(null)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}