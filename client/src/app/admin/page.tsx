// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flight } from '@/types';
import { API_URLS } from '@/lib/api';

export default function AdminPanel() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [checkedInTickets, setCheckedInTickets] = useState<any[]>([]);
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

  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  // Fetch all flights
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightsRes, ticketsRes] = await Promise.all([
          axios.get(API_URLS.flights),
          axios.get(API_URLS.tickets.all)
        ]);
        setFlights(flightsRes.data);
        setCheckedInTickets(ticketsRes.data.filter((t: any) => t.checkedIn));
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      await axios.post(API_URLS.flights, {
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
      const res = await axios.get(API_URLS.flights);
      setFlights(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add flight');
    }
  };

  // Update flight
  const updateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlight) return;

    try {
      await axios.put(`${API_URLS.flights}/${editingFlight._id}`, editingFlight);
      setSuccess('Flight updated successfully!');
      setEditingFlight(null);
      // Refresh flight list
      const res = await axios.get(API_URLS.flights);
      setFlights(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update flight');
    }
  };

  const startEdit = (flight: Flight) => {
    setEditingFlight({ ...flight });
  };

  const cancelEdit = () => {
    setEditingFlight(null);
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

      {/* Edit Flight Form */}
      {editingFlight && (
        <div className="bg-gray-900 p-8 rounded-3xl mb-12">
          <h2 className="text-2xl font-semibold mb-6">Edit Flight</h2>
          <form onSubmit={updateFlight} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Flight Number</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={editingFlight.flightNumber}
                onChange={(e) => setEditingFlight({ ...editingFlight, flightNumber: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Origin</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={editingFlight.origin}
                onChange={(e) => setEditingFlight({ ...editingFlight, origin: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Destination</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={editingFlight.destination}
                onChange={(e) => setEditingFlight({ ...editingFlight, destination: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Gate</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={editingFlight.gate}
                onChange={(e) => setEditingFlight({ ...editingFlight, gate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Departure Time</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={new Date(editingFlight.departureTime).toISOString().slice(0, 16)}
                onChange={(e) => setEditingFlight({ ...editingFlight, departureTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Arrival Time</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={new Date(editingFlight.arrivalTime).toISOString().slice(0, 16)}
                onChange={(e) => setEditingFlight({ ...editingFlight, arrivalTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Capacity</label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                value={editingFlight.capacity}
                onChange={(e) => setEditingFlight({ ...editingFlight, capacity: parseInt(e.target.value) })}
                min="50"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg transition flex-1"
              >
                Update Flight
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-600 hover:bg-gray-700 py-4 rounded-2xl font-semibold text-lg transition flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                <button
                  onClick={() => startEdit(f)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checked-in Tickets */}
      <h2 className="text-2xl font-semibold mb-6 mt-12">Checked-in Tickets</h2>

      {checkedInTickets.length === 0 ? (
        <p className="text-gray-400">No checked-in tickets yet.</p>
      ) : (
        <div className="grid gap-6">
          {checkedInTickets.map((t) => (
            <div
              key={t._id}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-700"
            >
              <p className="font-mono text-lg font-bold text-emerald-400">{t.ticketId}</p>
              <p className="text-xl mt-2">{t.passengerName}</p>
              <p className="text-gray-400">{t.email}</p>
              <p className="text-gray-400">{t.flight?.origin} → {t.flight?.destination}</p>
              <div className="mt-4 flex justify-between text-sm">
                <div>Seat: <span className="font-medium">{t.seatNumber}</span></div>
                <div className="text-emerald-400">
                  ✅ Checked In
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}