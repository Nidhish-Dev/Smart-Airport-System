// app/operations/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { getSocket } from '@/lib/socket';
import { Ticket } from '@/types';
import { API_URLS } from '@/lib/api';

export default function OperationsDashboard() {
  const [checkedInTickets, setCheckedInTickets] = useState<Ticket[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Load existing checked-in tickets
    const loadCheckedInTickets = async () => {
      try {
        const res = await axios.get(API_URLS.tickets.all);
        const checkedIn = res.data.filter((t: any) => t.checkedIn);
        setCheckedInTickets(checkedIn);
      } catch (err) {
        console.error('Failed to load checked-in tickets:', err);
      }
    };

    loadCheckedInTickets();

    // Set up socket for real-time updates
    const socket = getSocket();

    socket.on('connect', () => setSocketConnected(true));
    socket.on('ticket-checked-in', (data: any) => {
      setCheckedInTickets(prev => {
        // Avoid duplicates
        const exists = prev.some(t => t._id === data._id);
        if (exists) return prev;
        return [data, ...prev];
      });
    });

    return () => {
      socket.off('ticket-checked-in');
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Operations Dashboard</h1>
        <Link href="/operations/checkin" className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-2xl font-semibold">
          Open QR Scanner for Check-in
        </Link>
      </div>

      <div className="bg-gray-900 rounded-3xl p-8">
        <h2 className="text-2xl mb-6">Checked-in Passengers</h2>
        {checkedInTickets.length === 0 ? (
          <p className="text-gray-400">No check-ins yet. Use the QR scanner to check in passengers.</p>
        ) : (
          <div className="space-y-4">
            {checkedInTickets.map((t, i) => (
              <div key={t._id || i} className="flex justify-between bg-gray-800 p-5 rounded-2xl">
                <div>
                  <p className="font-semibold">{t.passengerName || 'Passenger'}</p>
                  <p className="text-sm text-gray-400">Ticket: {t.ticketId}</p>
                  <p className="text-sm text-gray-400">Flight: {t.flight?.flightNumber}</p>
                </div>
                <div className="text-right text-emerald-400">
                  ✅ Checked In
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}