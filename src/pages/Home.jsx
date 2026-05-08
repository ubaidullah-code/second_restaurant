import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Clock, Users, Star, ChevronRight, Utensils, Wine, Award } from 'lucide-react';

const RESTAURANT = {
  name: 'Maison Dorée',
  tagline: 'An Exceptional Culinary Journey',
  description:
    'Nestled in the heart of the city, Maison Dorée is where classical French technique meets contemporary artistry. Our chefs craft each dish as a love letter to the finest seasonal ingredients, transforming every meal into an unforgettable memory.',
  location: '14 Rue de la Paix, Downtown District',
  hours: 'Mon–Fri 12:00–22:00  ·  Sat–Sun 11:00–23:00',
  totalSeats: 80,
  rating: 4.9,
  reviews: 847,
  phone: '+92 21 3456 7890',
  features: [
    { icon: Utensils, label: 'À La Carte', desc: 'Seasonal tasting menus' },
    { icon: Wine, label: 'Curated Cellar', desc: '400+ wine selections' },
    { icon: Award, label: 'Michelin Rated', desc: '2 Michelin stars' },
  ],
};

const StatBadge = ({ label, value }) => (
  <div className="text-center">
    <p className="font-display text-3xl text-amber-400">{value}</p>
    <p className="text-stone-500 text-xs tracking-widest uppercase mt-1">{label}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient + pattern */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950" />
        </div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent ml-12 hidden lg:block" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent mr-12 hidden lg:block" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 page-enter">
          <p className="section-subtitle mb-6">Est. 2012 · Fine Dining</p>
          <h1 className="font-display text-6xl md:text-8xl text-stone-100 leading-none mb-6">
            {RESTAURANT.name}
          </h1>
          <p className="font-display italic text-amber-400 text-xl md:text-2xl mb-8">
            {RESTAURANT.tagline}
          </p>
          <div className="gold-divider mx-auto" />
          <p className="text-stone-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {RESTAURANT.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(isLogin ? '/reserve' : '/login')}
              className="btn-gold flex items-center justify-center gap-2 text-base px-10 py-4"
            >
              Reserve a Table <ChevronRight size={18} />
            </button>
            {!isLogin && (
              <button
                onClick={() => navigate('/register')}
                className="btn-outline flex items-center justify-center gap-2 text-base px-10 py-4"
              >
                Create Account
              </button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-amber-500 to-transparent" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-stone-800 bg-stone-900/50">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 divide-x divide-stone-800">
          <StatBadge value={`${RESTAURANT.totalSeats}`} label="Seats" />
          <StatBadge value={`${RESTAURANT.rating}★`} label="Rating" />
          <StatBadge value={`${RESTAURANT.reviews}+`} label="Reviews" />
        </div>
      </section>

      {/* Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle">About Us</p>
            <h2 className="section-title">A Table for Every Occasion</h2>
            <div className="gold-divider" />
            <p className="text-stone-400 leading-relaxed mb-8">
              Whether celebrating a milestone or simply seeking an extraordinary evening, Maison Dorée offers
              an atmosphere of refined elegance where every detail — from the hand-picked flowers to the
              sommelier's selection — is crafted with intention.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-stone-200 font-medium text-sm">Location</p>
                  <p className="text-stone-400 text-sm">{RESTAURANT.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-stone-200 font-medium text-sm">Hours</p>
                  <p className="text-stone-400 text-sm">{RESTAURANT.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-stone-200 font-medium text-sm">Capacity</p>
                  <p className="text-stone-400 text-sm">{RESTAURANT.totalSeats} seats available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-stone-200 font-medium text-sm">Rating</p>
                  <p className="text-stone-400 text-sm">{RESTAURANT.rating}/5 from {RESTAURANT.reviews} guests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {RESTAURANT.features.map((f) => (
              <div key={f.label} className="card flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-stone-100 font-medium mb-1">{f.label}</p>
                  <p className="text-stone-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate(isLogin ? '/reserve' : '/login')}
              className="btn-gold w-full mt-6 py-4 flex items-center justify-center gap-2"
            >
              Book Your Experience <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-8 text-center">
        <p className="font-display text-stone-600 text-sm">
          © 2025 Maison Dorée · All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default Home;
