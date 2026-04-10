// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-white/95 border-b border-slate-200 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Smart Airport System</h1>
        </div>

        <div className="flex flex-wrap gap-6 text-sm uppercase tracking-[0.3em] text-slate-700">
          <Link href="/passenger" className={`${pathname.startsWith('/passenger') ? 'text-slate-950' : 'hover:text-slate-950'}`}>Passenger</Link>
          <Link href="/operations" className={`${pathname.startsWith('/operations') ? 'text-slate-950' : 'hover:text-slate-950'}`}>Operations</Link>
          <Link href="/admin" className={`${pathname.startsWith('/admin') ? 'text-slate-950' : 'hover:text-slate-950'}`}>Admin</Link>
        </div>
      </div>
    </nav>
  );
}