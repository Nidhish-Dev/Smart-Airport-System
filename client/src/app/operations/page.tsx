// app/operations/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSocket } from '@/lib/socket';
import { Ticket } from '@/types';

export default function OperationsDashboard() {
  const [checkedInTickets, setCheckedInTickets] = useState<Ticket[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => setSocketConnected(true));
    socket.on('ticket-checked-in', (data: any) => {
      setCheckedInTickets(prev => [data, ...prev]);
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
        <h2 className="text-2xl mb-6">Recently Checked-in Passengers (Real-time)</h2>
        {checkedInTickets.length === 0 ? (
          <p className="text-gray-400">No check-ins yet. Use the QR scanner on another device.</p>
        ) : (
          <div className="space-y-4">
            {checkedInTickets.map((t, i) => (
              <div key={i} className="flex justify-between bg-gray-800 p-5 rounded-2xl">
                <div>
                  <p className="font-semibold">{t.passengerName || 'Passenger'}</p>
                  <p className="text-sm text-gray-400">Ticket: {t.ticketId}</p>
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