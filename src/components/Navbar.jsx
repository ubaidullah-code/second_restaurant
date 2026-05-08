import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, user } = useSelector((s) => s.auth);
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    setOpen(false);
  };

  const navLinks = isLogin
    ? [
        { to: '/', label: 'Home' },
        { to: '/reserve', label: 'Reserve' },
        { to: '/my-bookings', label: 'My Bookings' },
        { to: '/spin', label: '🎰 Spin' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <UtensilsCrossed size={20} className="text-amber-500" />
            <span className="font-display text-xl text-stone-100 group-hover:text-amber-400 transition-colors">
              Maison Dorée
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${isActive(l.to) ? 'text-amber-400' : ''}`}
              >
                {l.label}
              </Link>
            ))}
            {isLogin && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-stone-700">
                <span className="text-stone-500 text-sm font-mono">{user?.name || user?.email}</span>
                <button onClick={handleLogout} className="btn-outline text-xs py-1.5 px-4">
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-stone-400 hover:text-amber-400 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-stone-950 border-t border-stone-800 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block nav-link py-2 ${isActive(l.to) ? 'text-amber-400' : ''}`}
              >
                {l.label}
              </Link>
            ))}
            {isLogin && (
              <>
                <div className="border-t border-stone-800 pt-3 mt-3">
                  <p className="text-stone-500 text-xs font-mono mb-3">{user?.name || user?.email}</p>
                  <button onClick={handleLogout} className="btn-outline text-xs py-2 w-full">
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
