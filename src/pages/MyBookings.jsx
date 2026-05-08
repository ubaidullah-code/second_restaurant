import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyReservations, cancelReservation } from '../store/slices/reservationSlice';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isPast } from 'date-fns';
import { Calendar, Clock, Users, Trash2, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_STYLES = {
  booked: 'bg-emerald-950/50 text-emerald-400 border-emerald-800',
  cancelled: 'bg-stone-800/50 text-stone-500 border-stone-700',
  completed: 'bg-amber-950/50 text-amber-400 border-amber-800',
};

const BookingCard = ({ reservation, onCancel, cancelLoading }) => {
  // FIX 1: Backend uses 'date' directly. Fallback to current date to prevent crash.
  const dateObj = reservation?.date ? parseISO(reservation.date) : new Date();
  
  const isPastDate = isPast(dateObj);
  const isCancelled = reservation.status === 'cancelled';
  const canCancel = !isCancelled && !isPastDate;

  // Safe timeSlot formatting
  const formatTime = (slot) => {
    if (!slot) return 'No time set';
    return slot.includes('-') ? slot.replace('-', ':00 – ') + ':00' : slot;
  };

  return (
    <div className={`card border border-stone-800 bg-stone-900/50 p-6 rounded-xl transition-all duration-200 ${isCancelled ? 'opacity-60' : 'hover:border-stone-600'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-stone-300 text-sm">
              <Calendar size={14} className="text-amber-500" />
              {/* Ensure dateObj is valid before formatting */}
              {isNaN(dateObj.getTime()) ? "Invalid Date" : format(dateObj, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-sm">
              <Clock size={14} className="text-amber-500" />
              {formatTime(reservation.timeSlot)}
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Users size={14} className="text-amber-500" />
            {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
          </div>

          {/* FIX 2: Backend uses 'note' (singular) */}
          {reservation.note && (
            <p className="text-stone-500 text-sm italic">"{reservation.note}"</p>
          )}
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
          <span className={`text-xs px-3 py-1 border font-mono tracking-wider uppercase ${STATUS_STYLES[reservation.status] || STATUS_STYLES.booked}`}>
            {reservation.status || 'booked'}
          </span>

          {canCancel && (
            <button
              onClick={() => onCancel(reservation._id)}
              disabled={cancelLoading === reservation._id}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs transition-colors disabled:opacity-50"
            >
              {cancelLoading === reservation._id ? (
                <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-stone-800">
        <p className="text-stone-600 text-xs font-mono">REF: {reservation._id?.slice(-8).toUpperCase()}</p>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // FIX 3: Defensive extraction of 'list'
  const { list, loading, cancelLoading } = useSelector((s) => s.reservations);
  const { user } = useSelector((s) => s.auth);
  const userId = user?.userId;

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyReservations(userId));
    }
  }, [dispatch, userId]);

  const handleCancel = (id) => {
    if (window.confirm('Cancel this reservation?')) {
      dispatch(cancelReservation(id));
    }
  };

  // FIX 4: Safety check for array and date parsing
  const safeList = Array.isArray(list) ? list : [];

  const upcoming = safeList.filter((r) => {
    if (!r.date) return false;
    const date = parseISO(r.date);
    return !isPast(date) && r.status !== 'cancelled';
  });

  const past = safeList.filter((r) => {
    if (!r.date) return true; // Show malformed data in past/cancelled
    const date = parseISO(r.date);
    return isPast(date) || r.status === 'cancelled';
  });

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-500 uppercase tracking-widest text-xs mb-2">Your Account</p>
            <h1 className="text-4xl font-serif text-stone-100">My Reservations</h1>
          </div>
          <button 
            onClick={() => navigate('/reserve')} 
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading reservations..." />
          </div>
        ) : safeList.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-800 rounded-2xl">
            <div className="w-16 h-16 border border-stone-700 flex items-center justify-center mx-auto mb-6">
              <Calendar size={28} className="text-stone-600" />
            </div>
            <h3 className="text-xl text-stone-400 mb-2">No reservations yet</h3>
            <p className="text-stone-600 text-sm mb-6">Reserve your first table at Maison Dorée</p>
            <button onClick={() => navigate('/reserve')} className="text-amber-500 hover:underline">
              Make a Reservation
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xs tracking-widest uppercase text-amber-500 font-mono mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-4">
                  {upcoming.map((r) => (
                    <BookingCard key={r._id} reservation={r} onCancel={handleCancel} cancelLoading={cancelLoading} />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-xs tracking-widest uppercase text-stone-500 font-mono mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-600 rounded-full" />
                  Past & Cancelled ({past.length})
                </h2>
                <div className="space-y-4">
                  {past.map((r) => (
                    <BookingCard key={r._id} reservation={r} onCancel={handleCancel} cancelLoading={cancelLoading} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;