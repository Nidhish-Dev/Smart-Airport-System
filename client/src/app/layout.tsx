// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Smart Flight System',
  description: 'College Project - Flight Operations & Passenger Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-950 min-h-screen">
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}