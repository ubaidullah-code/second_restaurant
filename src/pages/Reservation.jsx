import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createReservation, checkAvailability, clearAvailability } from '../store/slices/reservationSlice';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const TIME_SLOTS = [
  { id: '12:00-14:00', label: '12:00 – 14:00', period: 'Lunch' },
  { id: '14:00-16:00', label: '14:00 – 16:00', period: 'Afternoon' },
  { id: '17:00-19:00', label: '17:00 – 19:00', period: 'Early Dinner' },
  { id: '19:00-21:00', label: '19:00 – 21:00', period: 'Dinner' },
  { id: '21:00-23:00', label: '21:00 – 23:00', period: 'Late Dinner' },
];

const Reservation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, availability, availabilityLoading } = useSelector((s) => s.reservations);
  const { isLogin, user } = useSelector((s) => s.auth); 
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  // Check availability when date+slot changes
  useEffect(() => {
    if (date && slot) {
      dispatch(checkAvailability({ date: format(date, 'yyyy-MM-dd'), slot }));
    } else {
      dispatch(clearAvailability());
    }
  }, [date, slot, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) return;

    const result = await dispatch(
      createReservation({
        date: format(date, 'yyyy-MM-dd'),
        timeSlot: slot,
        guests: Number(guests),
        notes,
        userId: user.userId
      })
    );

    if (!result.error) {
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    }
  };

  const isAvailable = availability?.available !== false;
  const seatsLeft = availability?.seatsLeft;

  if (success) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center pt-16">
        <div className="text-center page-enter">
          <div className="w-20 h-20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-amber-500" />
          </div>
          <h2 className="font-display text-3xl text-stone-100 mb-2">Reservation Confirmed!</h2>
          <p className="text-stone-400 mb-6">Redirecting to your bookings...</p>
          <div className="w-32 h-px bg-amber-500/30 mx-auto">
            <div className="h-full bg-amber-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto page-enter">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-subtitle">Book a Table</p>
          <h1 className="section-title text-4xl md:text-5xl">Reserve Your Evening</h1>
          <div className="gold-divider mx-auto" />
          <p className="text-stone-500 text-sm">
            Reservations are held for 15 minutes past the booking time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="card">
            <label className="flex items-center gap-2 text-amber-500 text-xs tracking-widest uppercase mb-4">
              <Calendar size={14} />
              Select Date
            </label>
            <DatePicker
              selected={date}
              onChange={setDate}
              minDate={new Date()}
              maxDate={addDays(new Date(), 60)}
              placeholderText="Choose a date"
              dateFormat="MMMM d, yyyy"
              className="input-field cursor-pointer"
              excludeDates={[]} // Add closed days if needed
            />
          </div>

          {/* Time Slot */}
          <div className="card">
            <label className="flex items-center gap-2 text-amber-500 text-xs tracking-widest uppercase mb-4">
              <Clock size={14} />
              Select Time Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIME_SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlot(s.id)}
                  className={`p-4 border text-left transition-all duration-200 ${
                    slot === s.id
                      ? 'border-amber-500 bg-amber-500/10 text-stone-100'
                      : 'border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <p className="text-xs text-amber-400 font-mono mb-1">{s.period}</p>
                  <p className="font-medium">{s.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Availability badge */}
          {slot && date && (
            <div className={`flex items-center gap-3 p-4 border text-sm ${
              availabilityLoading
                ? 'border-stone-700 text-stone-400'
                : isAvailable
                ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                : 'border-red-800 bg-red-950/30 text-red-400'
            }`}>
              {availabilityLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-600 border-t-amber-500 rounded-full animate-spin" />
                  Checking availability...
                </>
              ) : isAvailable ? (
                <>
                  <CheckCircle size={16} />
                  {seatsLeft ? `${seatsLeft} seats available` : 'Available for booking'}
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  This slot is fully booked. Please choose another.
                </>
              )}
            </div>
          )}

          {/* Guests */}
          <div className="card">
            <label className="flex items-center gap-2 text-amber-500 text-xs tracking-widest uppercase mb-4">
              <Users size={14} />
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 border border-stone-700 hover:border-amber-500 text-stone-400 hover:text-amber-500 transition-colors flex items-center justify-center text-xl"
              >
                −
              </button>
              <span className="font-display text-4xl text-stone-100 w-12 text-center">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(20, guests + 1))}
                className="w-10 h-10 border border-stone-700 hover:border-amber-500 text-stone-400 hover:text-amber-500 transition-colors flex items-center justify-center text-xl"
              >
                +
              </button>
              <span className="text-stone-500 text-sm ml-2">
                {guests === 1 ? 'guest' : 'guests'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <label className="block text-amber-500 text-xs tracking-widest uppercase mb-4">
              Special Requests (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dietary requirements, celebration, seating preference..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Summary + Submit */}
          {date && slot && (
            <div className="card border-amber-500/20 bg-amber-500/5">
              <p className="text-xs tracking-widest uppercase text-amber-500 mb-3">Reservation Summary</p>
              <div className="space-y-1 text-sm text-stone-300">
                <p>📅 {format(date, 'EEEE, MMMM d, yyyy')}</p>
                <p>🕐 {TIME_SLOTS.find((s) => s.id === slot)?.label}</p>
                <p>👥 {guests} {guests === 1 ? 'guest' : 'guests'}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={createLoading || !date || !slot || !isAvailable}
            className="btn-gold w-full py-4 text-base"
          >
            {createLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                Confirming Reservation...
              </span>
            ) : (
              'Confirm Reservation'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
