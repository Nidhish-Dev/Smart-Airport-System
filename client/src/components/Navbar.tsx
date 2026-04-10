// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✈️</span>
          <h1 className="text-xl font-bold">SmartFlight</h1>
        </div>

        <div className="flex gap-8 text-sm font-medium">
          <Link href="/passenger" className={`${pathname.startsWith('/passenger') ? 'text-blue-400' : 'hover:text-gray-300'}`}>Passenger</Link>
          <Link href="/operations" className={`${pathname.startsWith('/operations') ? 'text-emerald-400' : 'hover:text-gray-300'}`}>Operations</Link>
          <Link href="/admin" className={`${pathname.startsWith('/admin') ? 'text-purple-400' : 'hover:text-gray-300'}`}>Admin</Link>
        </div>
      </div>
    </nav>
  );
}