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
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
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
    setSubmitting(true);

    if (!newFlight.flightNumber || !newFlight.origin || !newFlight.destination || 
        !newFlight.departureTime || !newFlight.arrivalTime || !newFlight.gate) {
      setError('Please fill all required fields');
      setSubmitting(false);
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
    } finally {
      setSubmitting(false);
    }
  };

  // Update flight
  const updateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlight) return;
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      await axios.put(`${API_URLS.flights}/${editingFlight._id}`, editingFlight);
      setSuccess('Flight updated successfully!');
      setEditingFlight(null);
      // Refresh flight list
      const res = await axios.get(API_URLS.flights);
      setFlights(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update flight');
    } finally {
      setUpdating(false);
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
      <div className="card p-8 rounded-3xl mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-slate-950">Add New Flight</h2>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">{error}</div>}
        {success && <div className="bg-emerald-100 text-emerald-700 p-4 rounded-xl mb-6">{success}</div>}

        <form onSubmit={createFlight} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-600 mb-2">Flight Number</label>
            <input
              type="text"
              placeholder="AI-123"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.flightNumber}
              onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Origin</label>
            <input
              type="text"
              placeholder="Delhi"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.origin}
              onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Destination</label>
            <input
              type="text"
              placeholder="Mumbai"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.destination}
              onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Gate</label>
            <input
              type="text"
              placeholder="A12"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.gate}
              onChange={(e) => setNewFlight({ ...newFlight, gate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Departure Time</label>
            <input
              type="datetime-local"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.departureTime}
              onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Arrival Time</label>
            <input
              type="datetime-local"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.arrivalTime}
              onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Capacity</label>
            <input
              type="number"
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
              value={newFlight.capacity}
              onChange={(e) => setNewFlight({ ...newFlight, capacity: parseInt(e.target.value) })}
              min="50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 btn btn-primary py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding flight...' : 'Add Flight'}
          </button>
        </form>
      </div>

      {/* Edit Flight Form */}
      {editingFlight && (
        <div className="card p-8 rounded-3xl mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-slate-950">Edit Flight</h2>
          <form onSubmit={updateFlight} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Flight Number</label>
              <input
                type="text"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={editingFlight.flightNumber}
                onChange={(e) => setEditingFlight({ ...editingFlight, flightNumber: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Origin</label>
              <input
                type="text"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={editingFlight.origin}
                onChange={(e) => setEditingFlight({ ...editingFlight, origin: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Destination</label>
              <input
                type="text"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={editingFlight.destination}
                onChange={(e) => setEditingFlight({ ...editingFlight, destination: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Gate</label>
              <input
                type="text"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={editingFlight.gate}
                onChange={(e) => setEditingFlight({ ...editingFlight, gate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Departure Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={new Date(editingFlight.departureTime).toISOString().slice(0, 16)}
                onChange={(e) => setEditingFlight({ ...editingFlight, departureTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Arrival Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={new Date(editingFlight.arrivalTime).toISOString().slice(0, 16)}
                onChange={(e) => setEditingFlight({ ...editingFlight, arrivalTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Capacity</label>
              <input
                type="number"
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
                value={editingFlight.capacity}
                onChange={(e) => setEditingFlight({ ...editingFlight, capacity: parseInt(e.target.value) })}
                min="50"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary py-4 rounded-2xl font-semibold text-lg transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Flight'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn btn-secondary py-4 rounded-2xl font-semibold text-lg transition flex-1"
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
        <p className="text-slate-500">Loading flights...</p>
      ) : flights.length === 0 ? (
        <p className="text-slate-500">No flights added yet.</p>
      ) : (
        <div className="grid gap-6">
          {flights.map((f) => (
            <div
              key={f._id}
              className="card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-slate-200"
            >
              <div>
                <p className="text-xl font-semibold text-slate-950">{f.flightNumber}</p>
                <p className="text-slate-600">
                  {f.origin} → {f.destination} | Gate: <span className="text-slate-950">{f.gate}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(f.departureTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-950 font-semibold">
                  {f.availableSeats} / {f.capacity} seats
                </p>
                <p className="text-sm text-slate-500">{f.status}</p>
                <button
                  onClick={() => startEdit(f)}
                  className="btn btn-secondary mt-2 px-4 py-3"
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
        <p className="text-slate-500">No checked-in tickets yet.</p>
      ) : (
        <div className="grid gap-6">
          {checkedInTickets.map((t) => (
            <div
              key={t._id}
              className="card p-6 rounded-2xl"
            >
              <p className="font-mono text-lg font-semibold text-slate-950">{t.ticketId}</p>
              <p className="text-xl mt-2 text-slate-950">{t.passengerName}</p>
              <p className="text-slate-600">{t.email}</p>
              <p className="text-slate-600">{t.flight?.origin} → {t.flight?.destination}</p>
              <div className="mt-4 flex justify-between text-sm">
                <div>Seat: <span className="font-medium text-slate-950">{t.seatNumber}</span></div>
                <div className="text-emerald-600">
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