// components/QRCodeDisplay.tsx
'use client';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface Props {
  qrData: string;
  size?: number;
}

export default function QRCodeDisplay({ qrData, size = 280 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrData && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' }
      });
    }
  }, [qrData, size]);

  return <canvas ref={canvasRef} className="mx-auto border-4 border-white rounded-xl" />;
}