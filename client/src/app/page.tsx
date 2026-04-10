// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold mb-4">✈️ Smart Flight System</h1>
        <p className="text-xl text-gray-300 mb-10">Best Idea for College Project</p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/passenger" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Passenger Portal
          </Link>
          <Link href="/operations" className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Operations Dashboard
          </Link>
          <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}