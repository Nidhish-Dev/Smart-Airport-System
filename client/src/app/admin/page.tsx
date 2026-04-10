// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flight } from '@/types';

export default function AdminPanel() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newFlight, setNewFlight] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    gate: '',
    capacity: 150,
  });

  // Fetch all flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/flights');
        setFlights(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load flights');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  // Create new flight
  const createFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newFlight.flightNumber || !newFlight.origin || !newFlight.destination || 
        !newFlight.departureTime || !newFlight.arrivalTime || !newFlight.gate) {
      setError('Please fill all required fields');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/flights', {
        ...newFlight,
        capacity: Number(newFlight.capacity),
      });
      
      setSuccess('Flight added successfully!');
      setNewFlight({
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        gate: '',
        capacity: 150,
      });

      // Refresh flight list
      const res = await axios.get('http://localhost:8000/api/flights');
      setFlights(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add flight');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Admin Panel - Flight Management</h1>

      {/* Add New Flight Form */}
      <div className="bg-gray-900 p-8 rounded-3xl mb-12">
        <h2 className="text-2xl font-semibold mb-6">Add New Flight</h2>

        {error && <div className="bg-red-900 text-red-300 p-4 rounded-xl mb-6">{error}</div>}
        {success && <div className="bg-green-900 text-green-300 p-4 rounded-xl mb-6">{success}</div>}

        <form onSubmit={createFlight} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Flight Number</label>
            <input
              type="text"
              placeholder="AI-123"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.flightNumber}
              onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Origin</label>
            <input
              type="text"
              placeholder="Delhi"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.origin}
              onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Destination</label>
            <input
              type="text"
              placeholder="Mumbai"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.destination}
              onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Gate</label>
            <input
              type="text"
              placeholder="A12"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.gate}
              onChange={(e) => setNewFlight({ ...newFlight, gate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Departure Time</label>
            <input
              type="datetime-local"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.departureTime}
              onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Arrival Time</label>
            <input
              type="datetime-local"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.arrivalTime}
              onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Capacity</label>
            <input
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              value={newFlight.capacity}
              onChange={(e) => setNewFlight({ ...newFlight, capacity: parseInt(e.target.value) })}
              min="50"
              required
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-semibold text-lg transition"
          >
            Add Flight
          </button>
        </form>
      </div>

      {/* All Flights List */}
      <h2 className="text-2xl font-semibold mb-6">All Flights</h2>

      {loading ? (
        <p className="text-gray-400">Loading flights...</p>
      ) : flights.length === 0 ? (
        <p className="text-gray-400">No flights added yet.</p>
      ) : (
        <div className="grid gap-6">
          {flights.map((f) => (
            <div
              key={f._id}
              className="bg-gray-900 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-700"
            >
              <div>
                <p className="text-xl font-bold">{f.flightNumber}</p>
                <p className="text-gray-400">
                  {f.origin} → {f.destination} | Gate: <span className="text-white">{f.gate}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(f.departureTime).toLocaleString()} 
                </p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">
                  {f.availableSeats} / {f.capacity} seats
                </p>
                <p className="text-sm text-gray-400">{f.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}