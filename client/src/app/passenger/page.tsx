// app/passenger/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Ticket, Flight } from '@/types';

export default function PassengerPortal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, flightsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/tickets'),
          axios.get('http://localhost:8000/api/flights')
        ]);
        setTickets(ticketsRes.data);
        setFlights(flightsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Passenger Portal</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <Link key={flight._id} href={`/passenger/booking/${flight._id}`}>
              <div className="bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition border border-gray-700">
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
                  Gate: <span className="font-medium text-white">{flight.gate}</span> | Seats: {flight.availableSeats}/{flight.capacity}
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
              <div key={ticket._id} className="bg-gray-900 p-6 rounded-2xl border border-gray-700">
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
    </div>
  );
}