import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: 'https://first-restuarant.vercel.app',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
};

// ── Restaurant ────────────────────────────────────────
export const restaurantAPI = {
  getDetails: () => api.get('/restaurant'),
};

// ── Reservations ──────────────────────────────────────
export const reservationAPI = {
  create: (data) => api.post('/restaurant/reservations', data),
  getUserReservations: (id) => api.get(`/restaurant/reservations/my/${id}`),
  cancel: (id) => api.patch(`/restaurant/reservations/${id}/cancel`),
  checkAvailability: (date, slot) => api.get(`/reservations/availability?date=${date}&slot=${slot}`),
};

// ── Spin Wheel ────────────────────────────────────────
export const spinAPI = {
  spin: () => api.post('/spin'),
  getLastSpin: () => api.get('/spin/last'),
};

export default api;
