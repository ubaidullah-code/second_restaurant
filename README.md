# 🍽️ Maison Dorée — Restaurant Reservation Frontend

A production-grade React + Redux frontend for a single-restaurant reservation system.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and edit environment
cp .env.example .env
# Edit REACT_APP_API_URL to point to your backend

# 3. Start development server
npm start
```

## 🏗️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client (withCredentials + Bearer token) |
| Tailwind CSS | Styling |
| React Hot Toast | Toast notifications |
| React DatePicker | Date selection |
| Lucide React | Icons |

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page with restaurant info
│   ├── Login.jsx         # Auth login form
│   ├── Register.jsx      # Auth registration form
│   ├── Reservation.jsx   # Table booking with date/slot picker
│   ├── MyBookings.jsx    # View & cancel user reservations
│   └── SpinWheel.jsx     # Daily discount spin game
│
├── components/
│   ├── Navbar.jsx         # Responsive navigation
│   ├── ProtectedRoute.jsx # Route guard using Redux auth state
│   └── LoadingSpinner.jsx # Reusable spinner
│
├── store/
│   ├── index.js           # Redux store configuration
│   └── slices/
│       ├── authSlice.js         # Login/Register/Logout/Profile
│       ├── reservationSlice.js  # CRUD reservations + availability
│       └── spinSlice.js         # Spin wheel + daily limit
│
├── services/
│   └── api.js             # Axios instance + all API calls
│
├── App.js                 # Root with Router + Toaster
└── index.js               # React entry point
```

## 🔐 Auth Flow

1. App loads → `fetchProfile()` dispatched in `useEffect`
2. If `/profile` returns 200 → `isLogin = true`, user set in Redux
3. If 401 → `isLogin = false`, protected routes redirect to `/login`
4. JWT stored in httpOnly cookie + `localStorage` as fallback
5. Logout clears localStorage and Redux state

## 🍽️ API Endpoints Expected

```
POST   /register          → { name, email, password }
POST   /login             → { email, password }
POST   /logout
GET    /profile

GET    /restaurant
POST   /reservations      → { date, timeSlot, guests, notes }
GET    /reservations/my
PATCH  /reservations/:id/cancel
GET    /reservations/availability?date=&slot=

POST   /spin
GET    /spin/last
```

## 🎨 Design System

- **Font**: Playfair Display (headings) + DM Sans (body) + DM Mono (labels)
- **Palette**: Stone 950 background, Amber 500 accent, Stone 100 text
- **Style**: Luxury dark-mode, editorial, restaurant-fine-dining aesthetic
- **Responsive**: Mobile-first, full-screen hero, stacked cards on mobile

## 🎰 Spin Wheel

- Users can spin once per day
- Possible rewards: 10% OFF, 15% OFF, 20% OFF, Free Drink, Free Dessert
- Result stored in backend and shown in a modal
- Lock state persists via `/spin/last` API

## ⚙️ Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000
```
# second_restaurant
