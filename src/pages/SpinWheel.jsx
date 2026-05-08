import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { spinWheel, fetchLastSpin, clearSpinResult } from '../store/slices/spinSlice';
import { Gift, RotateCcw, X } from 'lucide-react';

const REWARDS = [
  { label: '10% OFF', color: '#f59e0b', emoji: '🏷️' },
  { label: '20% OFF', color: '#d97706', emoji: '💫' },
  { label: 'Free Drink', color: '#92400e', emoji: '🍷' },
  { label: 'Try Again', color: '#44403c', emoji: '🔄' },
  { label: '15% OFF', color: '#b45309', emoji: '✨' },
  { label: 'Free Dessert', color: '#78350f', emoji: '🍮' },
  { label: '5% OFF', color: '#fbbf24', emoji: '🎁' },
  { label: 'Try Again', color: '#57534e', emoji: '🔄' },
];

const SEGMENT_ANGLE = 360 / REWARDS.length;

const SpinWheel = () => {
  const dispatch = useDispatch();
  const { loading, canSpin, result, lastSpin } = useSelector((s) => s.spin);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    dispatch(fetchLastSpin());
    return () => dispatch(clearSpinResult());
  }, [dispatch]);

  const handleSpin = async () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setShowResult(false);

    const res = await dispatch(spinWheel());
    if (res.error) { setSpinning(false); return; }

    const rewardLabel = res.payload?.reward || res.payload?.result;
    const rewardIndex = REWARDS.findIndex((r) => r.label === rewardLabel) ?? 0;

    // Calculate target rotation: many full spins + land on reward
    const targetDeg = 360 * 8 + (360 - rewardIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
    const newRotation = rotation + targetDeg;
    setRotation(newRotation);

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setCurrentResult(REWARDS[rewardIndex] || REWARDS[0]);
      setShowResult(true);
    }, 4200);
  };

  const drawWheel = () => {
    const size = 320;
    const cx = size / 2;
    const segments = REWARDS.map((reward, i) => {
      const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
      const r = cx - 4;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cx + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cx + r * Math.sin(endAngle);
      const midAngle = (startAngle + endAngle) / 2;
      const tx = cx + (r * 0.65) * Math.cos(midAngle);
      const ty = cx + (r * 0.65) * Math.sin(midAngle);
      const textAngle = ((i + 0.5) * SEGMENT_ANGLE - 90);

      return (
        <g key={i}>
          <path
            d={`M ${cx} ${cx} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={reward.color}
            stroke="#0c0a09"
            strokeWidth="2"
          />
          <text
            x={tx}
            y={ty}
            transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
            fontFamily="DM Sans, sans-serif"
          >
            {reward.label}
          </text>
        </g>
      );
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments}
        {/* Center circle */}
        <circle cx={cx} cy={cx} r="20" fill="#0c0a09" stroke="#f59e0b" strokeWidth="3" />
        <circle cx={cx} cy={cx} r="8" fill="#f59e0b" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto page-enter text-center">
        {/* Header */}
        <div className="mb-10">
          <p className="section-subtitle">Daily Reward</p>
          <h1 className="section-title text-4xl md:text-5xl">Lucky Spin</h1>
          <div className="gold-divider mx-auto" />
          <p className="text-stone-500 text-sm">Spin once per day to win exclusive discounts</p>
        </div>

        {/* Wheel */}
        <div className="relative inline-block mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-amber-500" />
          </div>

          {/* Wheel container */}
          <div
            ref={wheelRef}
            className={`rounded-full overflow-hidden shadow-2xl shadow-amber-900/20 ${
              spinning ? '' : 'transition-none'
            }`}
            style={{ width: 320, height: 320 }}
          >
            {drawWheel()}
          </div>

          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-amber-500/40 pointer-events-none"
            style={{ boxShadow: '0 0 40px rgba(245, 158, 11, 0.15)' }}
          />
        </div>

        {/* Spin Button */}
        <div className="space-y-4">
          {canSpin ? (
            <button
              onClick={handleSpin}
              disabled={spinning || loading}
              className="btn-gold px-12 py-4 text-base animate-pulse-gold disabled:animate-none flex items-center gap-2 mx-auto"
            >
              {spinning ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <RotateCcw size={18} /> Spin Now
                </>
              )}
            </button>
          ) : (
            <div className="card text-center">
              <Gift size={32} className="text-amber-500 mx-auto mb-3" />
              <p className="text-stone-300 font-medium mb-1">You've spun today!</p>
              <p className="text-stone-500 text-sm">Come back tomorrow for another spin</p>
              {lastSpin && (
                <div className="mt-4 pt-4 border-t border-stone-800">
                  <p className="text-xs text-stone-500">Last reward:</p>
                  <p className="text-amber-400 font-medium mt-1">{lastSpin.reward || lastSpin.result}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rewards list */}
        <div className="mt-12">
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-4">Possible Rewards</p>
          <div className="grid grid-cols-2 gap-3">
            {REWARDS.filter((r) => r.label !== 'Try Again').map((r) => (
              <div key={r.label} className="card flex items-center gap-3 text-left">
                <span className="text-xl">{r.emoji}</span>
                <span className="text-stone-300 text-sm">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && currentResult && (
        <div className="fixed inset-0 bg-stone-950/90 flex items-center justify-center z-50 px-4">
          <div className="card max-w-sm w-full text-center border-amber-500/30 bg-stone-900 page-enter">
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-300"
            >
              <X size={18} />
            </button>
            <div className="text-6xl mb-4">{currentResult.emoji}</div>
            <p className="section-subtitle">You Won!</p>
            <h2 className="font-display text-4xl text-amber-400 mb-2">{currentResult.label}</h2>
            <div className="gold-divider mx-auto" />
            <p className="text-stone-400 text-sm mb-6">
              Show this screen to your waiter to redeem your reward
            </p>
            <button onClick={() => setShowResult(false)} className="btn-gold w-full">
              Claim Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
