'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/lib/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URLS.auth.signup, formData);
      alert('Signup successful! Please login.');
      router.push('/passenger/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card p-10 rounded-[2rem] w-full max-w-md">
        <h1 className="text-3xl font-semibold text-slate-950 mb-8 text-center">Passenger Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-600 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6">
          Already have an account? <a href="/passenger/login" className="text-slate-950 underline">Login</a>
        </p>
      </div>
    </div>
  );
}