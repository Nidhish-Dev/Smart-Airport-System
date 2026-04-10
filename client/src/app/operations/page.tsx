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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-950">Operations Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor check-ins and open the scanner for live boarding.</p>
        </div>
        <Link href="/operations/checkin" className="btn btn-primary px-8 py-4">
          Open QR Scanner
        </Link>
      </div>

      <div className="card rounded-3xl p-8">
        <h2 className="text-2xl mb-6 text-slate-950">Checked-in Passengers</h2>
        {checkedInTickets.length === 0 ? (
          <p className="text-slate-500">No check-ins yet. Use the QR scanner to check in passengers.</p>
        ) : (
          <div className="space-y-4">
            {checkedInTickets.map((t, i) => (
              <div key={t._id || i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-950">{t.passengerName || 'Passenger'}</p>
                  <p className="text-sm text-slate-500">Ticket: {t.ticketId}</p>
                  <p className="text-sm text-slate-500">Flight: {t.flight?.flightNumber}</p>
                </div>
                <div className="text-right text-emerald-600 font-semibold self-center">
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