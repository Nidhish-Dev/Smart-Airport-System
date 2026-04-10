// app/operations/checkin/page.tsx
'use client';
import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import axios from 'axios';
import { API_URLS } from '@/lib/api';

export default function CheckinPage() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (qrData: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URLS.checkin}/scan`, { qrData });
      
      setResult({
        success: true,
        message: res.data.msg || 'Check-in Successful!'
      });

      // Real-time update will be received via socket in dashboard
    } catch (err: any) {
      setResult({
        success: false,
        message: err.response?.data?.msg || 'Check-in Failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Operations - QR Check-in</h1>
      
      <div className="bg-gray-900 rounded-3xl p-10">
        <QRScanner onScanSuccess={handleScan} />
      </div>

      {loading && <p className="text-center mt-6 text-yellow-400">Processing check-in...</p>}

      {result && (
        <div className={`mt-8 p-6 rounded-2xl text-center text-lg font-semibold ${
          result.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
}