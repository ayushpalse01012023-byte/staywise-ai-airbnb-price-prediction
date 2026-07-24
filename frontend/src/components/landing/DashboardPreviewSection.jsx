import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineSignal,
} from 'react-icons/hi2';
import {
  HiOutlineLocationMarker,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineChip,
} from 'react-icons/hi';

const FEATURES = [
  'Real-time Prediction',
  'Interactive Dashboard',
  'Confidence Analysis',
  'FastAPI Backend',
  'XGBoost Regression',
  'Beautiful Visualizations',
];

const THINKING_STATES = ['Analyzing...', 'Extracting Features...', 'Running Model...', 'Prediction Ready'];

const TIMELINE_STEPS = ['Features Received', 'Data Cleaned', 'XGBoost Running', 'Prediction Complete'];

const PIPELINE_STAGES = ['Input Features', 'FastAPI', 'XGBoost', 'Prediction', 'Dashboard'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function useCyclingIndex(length, intervalMs) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [length, intervalMs]);
  return index;
}

function useLoopedCounter(target, { holdMs = 2400, cycleMs = 5200, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useAnimationFrame((time) => {
    if (startRef.current === null) startRef.current = time;
    const elapsed = (time - startRef.current) % cycleMs;
    if (elapsed < cycleMs - holdMs) {
      const progress = elapsed / (cycleMs - holdMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(+(target * eased).toFixed(decimals));
    } else {
      setValue(+target.toFixed(decimals));
    }
  });

  return value;
}

function ConfidenceRing({ percentage, size = 76, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 24px rgba(190,60,110,0.22)' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwDashRingLive)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="stwDashRingLive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-white tabular-nums">{percentage.toFixed(1)}%</span>
        <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.15em] text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

function MetricBar({ label, percentage, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-gray-500">
        <span>{label}</span>
        <span className="text-gray-400 tabular-nums">{percentage}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-400/80 to-indigo-400/80"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function LiveLineChart() {
  const [series, setSeries] = useState(() =>
    Array.from({ length: 9 }, (_, i) => ({ x: i * 13, y: randomBetween(6, 28) }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const shifted = prev.slice(1).map((point, i) => ({ x: i * 13, y: point.y }));
        const lastY = shifted[shifted.length - 1]?.y ?? 16;
        const nextY = Math.min(30, Math.max(4, lastY + randomBetween(-7, 7)));
        shifted.push({ x: (shifted.length) * 13, y: nextY });
        return shifted;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const points = series.map((p) => `${p.x},${32 - p.y}`).join(' ');
  const last = series[series.length - 1];

  return (
    <div className="relative">
      <svg viewBox="0 0 104 32" className="h-16 w-full overflow-visible">
        {[8, 16, 24].map((y) => (
          <line key={y} x1="0" y1={y} x2="104" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        ))}
        <motion.polyline
          points={points}
          fill="none"
          stroke="url(#stwDashLiveLine)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
        <motion.circle
          cx={last.x}
          cy={32 - last.y}
          r="2.2"
          fill="#fda4af"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.8))' }}
        />
        <defs>
          <linearGradient id="stwDashLiveLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AIThinkingBadge() {
  const index = useCyclingIndex(THINKING_STATES.length, 1600);
  const isReady = index === THINKING_STATES.length - 1;

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em]">
      <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <AnimatePresence mode="wait">
        <motion.span
          key={THINKING_STATES[index]}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className={isReady ? 'text-emerald-400/90' : 'text-gray-500'}
        >
          {THINKING_STATES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function PredictionTimeline() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= TIMELINE_STEPS.length) {
        clearInterval(interval);
        window.setTimeout(() => setVisibleCount(0), 2600);
      }
    }, 650);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {TIMELINE_STEPS.map((step, i) => (
        <motion.div
          key={step}
          animate={{ opacity: i < visibleCount ? 1 : 0.25, x: i < visibleCount ? 0 : -6 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 text-xs"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-300 ${
              i < visibleCount ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            {i < visibleCount && <HiOutlineCheck className="h-2.5 w-2.5 text-emerald-400" />}
          </span>
          <span className={i < visibleCount ? 'text-gray-300' : 'text-gray-600'}>{step}</span>
        </motion.div>
      ))}
    </div>
  );
}

function MiniStatCard({ icon: Icon, label, value, secondary, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors duration-300 hover:border-rose-400/25 hover:bg-white/[0.04]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.18), 0 0 18px rgba(190,60,110,0.12)' }} />
      <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
        <Icon className="h-3.5 w-3.5 text-rose-400/70 transition-transform duration-300 group-hover:rotate-6" />
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-white">{value}</p>
      {secondary && <p className="mt-0.5 text-[10px] text-gray-600">{secondary}</p>}
    </motion.div>
  );
}

function DataFlowStrip() {
  return (
    <div className="relative mt-6 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
      {PIPELINE_STAGES.map((stage, i) => (
        <div key={stage} className="relative flex flex-1 items-center">
          <span className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.08em] text-gray-500">
            {stage}
          </span>
          {i < PIPELINE_STAGES.length - 1 && (
            <div className="relative mx-1.5 h-px flex-1 bg-white/[0.06]">
              <motion.span
                className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-300 to-indigo-300"
                style={{ boxShadow: '0 0 6px rgba(244,63,150,0.7)' }}
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: i * 0.35 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareXSpring = useSpring(glareX, { stiffness: 100, damping: 20 });
  const glareYSpring = useSpring(glareY, { stiffness: 100, damping: 20 });

  const glareBackground = useTransform(
    [glareXSpring, glareYSpring],
    ([x, y]) => `radial-gradient(320px circle at ${x}% ${y}%, rgba(255,255,255,0.08), transparent 70%)`
  );

  const price = useLoopedCounter(182, { holdMs: 2600, cycleMs: 5600, decimals: 0 });
  const confidence = useLoopedCounter(94.6, { holdMs: 2600, cycleMs: 5600, decimals: 1 });
  const inference = useLoopedCounter(0.18, { holdMs: 2600, cycleMs: 5600, decimals: 2 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 8);
    rotateX.set(-relY * 8);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      style={{ perspective: 1300 }}
      className="relative mx-auto w-full max-w-lg lg:mx-0"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 via-fuchsia-500/5 to-indigo-500/10 blur-2xl" />
      <motion.div
        className="pointer-events-none absolute -inset-4 rounded-[2.5rem]"
        style={{ background: 'radial-gradient(circle, rgba(190,60,110,0.12), transparent 70%)' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={{ animation: 'stw-dash-float 6s ease-in-out infinite' }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ y: -6 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7"
        >
          <motion.div className="pointer-events-none absolute inset-0 rounded-[1.75rem]" style={{ background: glareBackground }} />
          <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/[0.05] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-indigo-400/[0.08] blur-2xl" />

          <div className="relative flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">AI Engine Active</p>
                <AIThinkingBadge />
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <HiOutlineChip className="h-4 w-4 text-gray-600" />
            </motion.div>
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Estimated Price</p>
              <p className="mt-1.5 text-4xl font-bold leading-none tracking-[-0.01em] text-white tabular-nums">
                ${price}
                <span className="text-sm font-medium text-gray-500">/night</span>
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                Manhattan
              </p>
            </div>
            <ConfidenceRing percentage={confidence} />
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <MiniStatCard icon={HiOutlineHome} label="Property Type" value="Entire Apartment" secondary="Whole unit" delay={0.05} />
            <MiniStatCard icon={HiOutlineCheck} label="Room Type" value="Entire Home" secondary="Private access" delay={0.1} />
            <MiniStatCard icon={HiOutlineCalendar} label="Availability" value="245 Days" secondary="Per year" delay={0.15} />
            <MiniStatCard icon={HiOutlineSignal} label="Status" value="Success" secondary={`${inference.toFixed(2)}s runtime`} delay={0.2} />
          </div>

          <div className="relative mt-6 space-y-4">
            <MetricBar label="Model Confidence" percentage={95} delay={0.6} />
            <MetricBar label="Data Match Quality" percentage={88} delay={0.75} />
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <HiOutlineSignal className="h-3 w-3 text-rose-400/70" />
                Live Analytics
              </span>
              <span className="text-emerald-400/80">Streaming</span>
            </div>
            <div className="mt-2">
              <LiveLineChart />
            </div>
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">Prediction Timeline</p>
            <PredictionTimeline />
          </div>

          <DataFlowStrip />
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeatureItem({ label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 4 }}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 backdrop-blur-md transition-colors duration-300 hover:border-rose-400/20 hover:bg-white/[0.04]"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-indigo-500/20">
        <HiOutlineCheck className="h-3.5 w-3.5 text-rose-300" />
      </span>
      <span className="text-sm font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
    </motion.div>
  );
}

function CommandButton() {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [sparks, setSparks] = useState([]);

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 750);
  };

  const handleHoverStart = () => {
    const newSparks = Array.from({ length: 6 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x: randomBetween(10, 90),
      y: randomBetween(10, 90),
      delay: randomBetween(0, 0.3),
    }));
    setSparks(newSparks);
    window.setTimeout(() => setSparks([]), 900);
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -2 }}
      onHoverStart={handleHoverStart}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative mt-8 inline-block"
    >
      <NavLink
        to="/predict"
        onClick={handleClick}
        className="group relative isolate flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_10px_48px_rgba(190,60,110,0.45)]"
        style={{ animation: 'stw-shimmer 6s linear infinite' }}
      >
        <HiOutlineSparkles className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:rotate-[20deg]" />
        <span className="relative z-10">Launch Prediction</span>
        <HiOutlineArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

        {sparks.map((s) => (
          <motion.span
            key={s.id}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, boxShadow: '0 0 6px rgba(255,255,255,0.8)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -10] }}
            transition={{ duration: 0.7, delay: s.delay, ease: 'easeOut' }}
          />
        ))}

        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/25"
            style={{ left: r.x, top: r.y, width: 10, height: 10, transform: 'translate(-50%, -50%)', animation: 'stw-ripple 0.75s ease-out forwards' }}
          />
        ))}
      </NavLink>
    </motion.div>
  );
}

function CTAPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:px-14"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <h3 className="relative text-2xl font-bold tracking-[-0.01em] text-white sm:text-3xl">
        Ready to Experience StayWise AI?
      </h3>

      <CommandButton />
    </motion.div>
  );
}

function DashboardPreviewSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        size: randomBetween(1, 2.4),
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        duration: randomBetween(14, 28),
        delay: randomBetween(0, 12),
        opacity: randomBetween(0.06, 0.26),
      })),
    []
  );

  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: randomBetween(8, 92),
        y: randomBetween(8, 92),
        delay: randomBetween(0, 5),
      })),
    []
  );

  const links = useMemo(
    () => nodes.map((node, i) => ({ id: `${node.id}-link`, a: node, b: nodes[(i + 1) % nodes.length], delay: randomBetween(0, 6) })),
    [nodes]
  );

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-dash-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-dash-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-dash-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-dash-ray-sweep {
          0% { transform: translateX(-30%) rotate(6deg); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateX(130%) rotate(6deg); opacity: 0; }
        }
        @keyframes stw-dash-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes stw-node-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }
        @keyframes stw-ripple {
          from { width: 10px; height: 10px; opacity: 0.4; }
          to { width: 220px; height: 220px; margin-left: -105px; margin-top: -105px; opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-dash-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-dash-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-dash-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {links.map((link) => (
          <line
            key={link.id}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke="url(#stwDashNeural)"
            strokeWidth="0.08"
            style={{ animation: `stw-node-pulse ${5.5 + link.delay}s ease-in-out ${link.delay}s infinite` }}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.3"
            fill="#e879a8"
            style={{ animation: `stw-node-pulse ${4 + node.delay}s ease-in-out ${node.delay}s infinite` }}
          />
        ))}
        <defs>
          <linearGradient id="stwDashNeural" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-20%] top-1/4 h-20 w-[55%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          style={{ animation: 'stw-dash-ray-sweep 12s linear infinite' }}
        />
        <div
          className="absolute left-[-20%] top-2/3 h-14 w-[45%] bg-gradient-to-r from-transparent via-rose-300/[0.05] to-transparent"
          style={{ animation: 'stw-dash-ray-sweep 16s linear 4s infinite' }}
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
              animation: `stw-dash-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-400 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            Live Application
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            See StayWise AI{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              In Action
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Experience the prediction dashboard before even opening the
            application. Every interaction is designed to be fast, intuitive
            and visually engaging.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <DashboardMockup />

          <div className="mx-auto flex w-full max-w-md flex-col gap-3 lg:mx-0">
            {FEATURES.map((label, index) => (
              <FeatureItem key={label} label={label} index={index} />
            ))}
          </div>
        </div>

        <CTAPanel />
      </div>
    </section>
  );
}

export default DashboardPreviewSection;