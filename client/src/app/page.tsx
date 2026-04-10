// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-4xl text-center px-6 py-24">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-6">Smart Flight System</p>
        <h1 className="text-6xl font-semibold leading-tight mb-6 text-slate-950">Travel smarter with a modern airport experience.</h1>
        <p className="text-lg text-slate-600 mb-12">A polished interface for passenger booking, real-time operations, and admin control.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/passenger" className="btn btn-primary px-10 py-4">
            Passenger
          </Link>
          <Link href="/operations" className="btn btn-secondary px-10 py-4">
            Operations
          </Link>
          <Link href="/admin" className="btn btn-secondary px-10 py-4">
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}