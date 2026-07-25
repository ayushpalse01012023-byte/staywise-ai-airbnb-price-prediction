import { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineChevronDown,
  HiOutlineCpuChip,
  HiOutlineBoltSlash,
  HiOutlineSignal,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { predictPrice } from '../api/predictionApi';

const NEIGHBOURHOOD_GROUPS = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const NEIGHBOURHOODS = ['Williamsburg', 'Harlem', 'Astoria', 'Bushwick', 'Chelsea', 'Upper West Side'];
const ROOM_TYPES = ['Entire home/apt', 'Private room', 'Shared room'];

const NUMBER_FIELDS = [
  { id: 'latitude', label: 'Latitude', placeholder: 'e.g. 40.7128' },
  { id: 'longitude', label: 'Longitude', placeholder: 'e.g. -74.0060' },
  { id: 'minimumNights', label: 'Minimum Nights', placeholder: 'e.g. 2' },
  { id: 'numberOfReviews', label: 'Number of Reviews', placeholder: 'e.g. 34' },
  { id: 'reviewsPerMonth', label: 'Reviews Per Month', placeholder: 'e.g. 1.4' },
  { id: 'hostListingsCount', label: 'Calculated Host Listings Count', placeholder: 'e.g. 3' },
  { id: 'availability365', label: 'Availability 365', placeholder: 'e.g. 210' },
  { id: 'reviewYear', label: 'Review Year', placeholder: 'e.g. 2024' },
  { id: 'reviewMonth', label: 'Review Month', placeholder: 'e.g. 6' },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function useParticles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: randomBetween(1, 2.6),
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        duration: randomBetween(14, 26),
        delay: randomBetween(0, 10),
        opacity: randomBetween(0.08, 0.28),
      })),
    [count]
  );
}

function AnimatedCounter({ to, duration = 1.6, delay = 0, prefix = '', suffix = '', decimals = 0 }) {
  const spanRef = useRef(null);
  const startRef = useRef(null);
  const startedRef = useRef(false);

  useAnimationFrame((time) => {
    if (!spanRef.current) return;
    if (!startedRef.current) {
      if (time < delay * 1000) return;
      startedRef.current = true;
      startRef.current = time;
    }
    const elapsed = (time - startRef.current) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = to * eased;
    spanRef.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
  });

  return (
    <span ref={spanRef} className="tabular-nums">
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ConfidenceRing({ percentage = 94.6, size = 84, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 24px rgba(190,60,110,0.22)' }}
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwFormRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="stwFormRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.5} duration={1.4} suffix="%" />
        </span>
        <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.15em] text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

function MiniGraph() {
  const points = '0,24 15,18 30,22 45,12 60,16 75,6 90,10 105,2';
  return (
    <svg viewBox="0 0 104 26" className="h-12 w-full overflow-visible">
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#stwFormLine)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="105"
        cy="2"
        r="2"
        fill="#fda4af"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.8))' }}
      />
      <defs>
        <linearGradient id="stwFormLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FloatingSelect({ label, icon: Icon, options, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== '';

  return (
    <div className="relative">
      <div
        className={`group relative rounded-2xl border bg-white/[0.02] backdrop-blur-md transition-colors duration-400 ${
          focused ? 'border-rose-400/40' : 'border-white/[0.08] hover:border-white/[0.14]'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400"
          style={{
            opacity: focused ? 1 : 0,
            boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 22px rgba(129,140,248,0.18)',
          }}
        />
        <div className="relative flex items-center gap-2.5 px-4 pb-2.5 pt-5">
          <Icon className="h-4 w-4 shrink-0 text-rose-400/80" />
          <select
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="peer w-full appearance-none bg-transparent text-sm font-medium text-white outline-none"
          >
            <option value="" disabled hidden />
            {options.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0a0a0c] text-white">
                {opt}
              </option>
            ))}
          </select>
          <HiOutlineChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 peer-focus:rotate-180" />
        </div>
        <motion.label
          animate={{
            top: hasValue || focused ? 6 : 18,
            fontSize: hasValue || focused ? 10 : 13,
            color: focused ? 'rgb(251,113,133)' : 'rgb(107,114,128)',
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-11 font-medium uppercase tracking-[0.08em]"
        >
          {label}
        </motion.label>
      </div>
    </div>
  );
}

function FloatingNumberInput({ label, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== '';

  return (
    <div className="relative">
      <div
        className={`group relative rounded-2xl border bg-white/[0.02] backdrop-blur-md transition-colors duration-400 ${
          focused ? 'border-rose-400/40' : 'border-white/[0.08] hover:border-white/[0.14]'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400"
          style={{
            opacity: focused ? 1 : 0,
            boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 22px rgba(129,140,248,0.18)',
          }}
        />
        <div className="relative px-4 pb-2.5 pt-5">
          <input
            type="number"
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ''}
            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <motion.label
          animate={{
            top: hasValue || focused ? 6 : 18,
            fontSize: hasValue || focused ? 10 : 13,
            color: focused ? 'rgb(251,113,133)' : 'rgb(107,114,128)',
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-4 font-medium uppercase tracking-[0.08em]"
        >
          {label}
        </motion.label>
      </div>
    </div>
  );
}

function PredictButton({ onClick }) {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 750);
    onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative isolate flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_10px_46px_rgba(190,60,110,0.42)]"
      style={{ animation: 'stw-shimmer 6s linear infinite' }}
    >
      <HiOutlineSparkles className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
      <span className="relative z-10">Predict Price</span>
      <HiOutlineArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/25"
          style={{ left: r.x, top: r.y, width: 10, height: 10, transform: 'translate(-50%, -50%)', animation: 'stw-ripple 0.75s ease-out forwards' }}
        />
      ))}
    </motion.button>
  );
}

function PredictionForm() {
  const [neighbourhoodGroup, setNeighbourhoodGroup] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [roomType, setRoomType] = useState('');
  const [numbers, setNumbers] = useState({
    latitude: '',
    longitude: '',
    minimumNights: '',
    numberOfReviews: '',
    reviewsPerMonth: '',
    hostListingsCount: '',
    availability365: '',
    reviewYear: '',
    reviewMonth: '',
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleNumberChange = (id) => (e) => {
    setNumbers((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload = {
      latitude: Number(numbers.latitude),
      longitude: Number(numbers.longitude),
      neighbourhood_group: neighbourhoodGroup,
      neighbourhood: neighbourhood,
      room_type: roomType,
      minimum_nights: Number(numbers.minimumNights),
      number_of_reviews: Number(numbers.numberOfReviews),
      reviews_per_month: Number(numbers.reviewsPerMonth),
      calculated_host_listings_count: Number(numbers.hostListingsCount),
      availability_365: Number(numbers.availability365),
      review_year: Number(numbers.reviewYear),
      review_month: Number(numbers.reviewMonth),
    };

    setLoading(true);
    setError(null);

    try {
      const result = await predictPrice(payload);
      setPrediction(result);
      console.log('Prediction:', result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FloatingSelect
          label="Neighbourhood Group"
          icon={HiOutlineMapPin}
          options={NEIGHBOURHOOD_GROUPS}
          value={neighbourhoodGroup}
          onChange={(e) => setNeighbourhoodGroup(e.target.value)}
        />
        <FloatingSelect
          label="Neighbourhood"
          icon={HiOutlineMapPin}
          options={NEIGHBOURHOODS}
          value={neighbourhood}
          onChange={(e) => setNeighbourhood(e.target.value)}
        />
        <div className="sm:col-span-2">
          <FloatingSelect
            label="Room Type"
            icon={HiOutlineBuildingOffice2}
            options={ROOM_TYPES}
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          />
        </div>

        {NUMBER_FIELDS.map((field) => (
          <FloatingNumberInput
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={numbers[field.id]}
            onChange={handleNumberChange(field.id)}
          />
        ))}
      </div>

      <div className="relative mt-7">
        <PredictButton onClick={handleSubmit} />
      </div>
    </motion.div>
  );
}

function AIAssistantCard() {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 7);
    rotateX.set(-relY * 7);
  };
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 via-fuchsia-500/5 to-indigo-500/10 blur-2xl" />

      <div style={{ animation: 'stw-form-float 6s ease-in-out infinite' }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ y: -6 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/[0.05] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-indigo-400/[0.08] blur-2xl" />

          <div className="relative flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <motion.span
                whileHover={{ rotate: 12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]"
              >
                <HiOutlineCpuChip className="h-4.5 w-4.5 text-rose-300" />
              </motion.span>
              <div>
                <p className="text-[13px] font-semibold text-white">AI Assistant</p>
                <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Streaming
                </p>
              </div>
            </div>
            <HiOutlineSignal className="h-4 w-4 text-gray-600" />
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Prediction Readiness</p>
              <p className="mt-1.5 text-2xl font-bold leading-none tracking-[-0.01em] text-white">
                <AnimatedCounter to={0.18} decimals={2} delay={0.4} duration={1.2} suffix="s" />
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <HiOutlineBoltSlash className="h-3.5 w-3.5 text-rose-400/70" />
                Estimated Inference Speed
              </p>
            </div>
            <ConfidenceRing percentage={94.6} />
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineCheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                Model
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">XGBoost Ready</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineCheckCircle className="h-3.5 w-3.5 text-emerald-400/80" />
                Backend
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">FastAPI Connected</p>
            </div>
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <HiOutlineSignal className="h-3 w-3 text-rose-400/70" />
                Live Analytics
              </span>
              <span className="text-emerald-400/80">Active</span>
            </div>
            <div className="mt-2">
              <MiniGraph />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PredictionFormSection() {
  const particles = useParticles(30);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-form-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-form-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-form-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-form-ray-sweep {
          0% { transform: translateX(-30%) rotate(6deg); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateX(130%) rotate(6deg); opacity: 0; }
        }
        @keyframes stw-form-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        @keyframes stw-ripple {
          from { width: 10px; height: 10px; opacity: 0.4; }
          to { width: 220px; height: 220px; margin-left: -105px; margin-top: -105px; opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-form-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-form-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-form-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-20%] top-1/4 h-20 w-[55%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          style={{ animation: 'stw-form-ray-sweep 12s linear infinite' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              '--stw-op': p.opacity,
              opacity: p.opacity,
              animation: `stw-form-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            Enter Property Details for the{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              AI Prediction Form
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Fill in your Airbnb property information and our machine learning
            model will estimate its expected nightly price instantly.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <PredictionForm />
          <AIAssistantCard />
        </div>
      </div>
    </section>
  );
}

export default PredictionFormSection;