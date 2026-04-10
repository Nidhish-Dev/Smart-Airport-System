// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_URLS = {
  auth: {
    login: `${API_BASE}/api/auth/login`,
    signup: `${API_BASE}/api/auth/signup`,
  },
  flights: `${API_BASE}/api/flights`,
  tickets: {
    book: `${API_BASE}/api/tickets/book`,
    my: `${API_BASE}/api/tickets/my`,
    all: `${API_BASE}/api/tickets`,
  },
  checkin: `${API_BASE}/api/checkin`,
};

export default API_BASE;