'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/lib/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_URLS.auth.login, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/passenger');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
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
        <h1 className="text-3xl font-semibold text-slate-950 mb-8 text-center">Passenger Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6">
          Don't have an account? <a href="/passenger/signup" className="text-slate-950 underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}