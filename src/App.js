import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { fetchProfile } from './store/slices/authSlice';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservation from './pages/Reservation';
import MyBookings from './pages/MyBookings';
import SpinWheel from './pages/SpinWheel';

const AppContent = () => {
  const dispatch = useDispatch();
  const { profileLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (profileLoading) {
    return <LoadingSpinner fullPage text="Loading..." />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-stone-950 text-stone-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/reserve"
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spin"
            element={
              <ProtectedRoute>
                <SpinWheel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1917',
              color: '#f5f5f4',
              border: '1px solid #44403c',
              borderRadius: '0',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#1c1917' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1c1917' },
            },
          }}
        />
      </div>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
  <AppContent />
  </Provider>
);

export default App;
