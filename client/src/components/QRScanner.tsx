// components/QRScanner.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Props {
  onScanSuccess: (qrData: string) => void;
}

export default function QRScanner({ onScanSuccess }: Props) {
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (!scanning) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText: string) => {
        onScanSuccess(decodedText);
        setScanning(false);
        scannerRef.current?.clear();
      },
      (error: any) => {
        // console.log("Scan error:", error);
      }
    );

    return () => {
      scannerRef.current?.clear();
    };
  }, [scanning]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="qr-reader" className="rounded-2xl overflow-hidden" />
      {!scanning && (
        <button
          onClick={() => setScanning(true)}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold"
        >
          Scan Again
        </button>
      )}
    </div>
  );
}