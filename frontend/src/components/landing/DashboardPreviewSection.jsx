import { useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function AnimatedCounter({ to, duration = 1.4, delay = 0, prefix = '', suffix = '', decimals = 0 }) {
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

function ConfidenceRing({ percentage = 94.6, size = 76, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwDashRing)"
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
          <linearGradient id="stwDashRing" x1="0%" y1="0%" x2="100%" y2="100%">
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

function MetricBar({ label, percentage, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-gray-500">
        <span>{label}</span>
        <span className="text-gray-400">{percentage}%</span>
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

function Sparkline() {
  const points = '0,26 15,20 30,24 45,14 60,18 75,8 90,12 105,3';
  return (
    <svg viewBox="0 0 110 32" className="h-8 w-full overflow-visible">
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#stwDashSpark)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="stwDashSpark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DashboardMockup() {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 130, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 130, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 8);
    rotateX.set(-relY * 8);
  };
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
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

      <div style={{ animation: 'stw-dash-float 6s ease-in-out infinite' }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ y: -6 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7"
        >
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
                <p className="text-[13px] font-semibold text-white">Prediction Result</p>
                <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400/80">
                  <HiOutlineCheckCircle className="h-3 w-3" />
                  Success
                </p>
              </div>
            </div>
            <HiOutlineChip className="h-4 w-4 text-gray-600" />
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Estimated Price</p>
              <p className="mt-1.5 text-4xl font-bold leading-none tracking-[-0.01em] text-white">
                <AnimatedCounter to={182} prefix="$" delay={0.4} duration={1.2} />
                <span className="text-sm font-medium text-gray-500">/night</span>
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                Manhattan
              </p>
            </div>
            <ConfidenceRing percentage={94.6} />
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineHome className="h-3.5 w-3.5 text-rose-400/70" />
                Property Type
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">Entire Apartment</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineCheck className="h-3.5 w-3.5 text-rose-400/70" />
                Room Type
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">Entire Home</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineCalendar className="h-3.5 w-3.5 text-rose-400/70" />
                Availability
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">245 Days</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <HiOutlineSignal className="h-3.5 w-3.5 text-rose-400/70" />
                Status
              </p>
              <p className="mt-1.5 text-sm font-semibold text-emerald-400">Success</p>
            </div>
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
              <Sparkline />
            </div>
          </div>
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

      <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative mt-8 inline-block">
        <NavLink
          to="/predict"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_8px_42px_rgba(190,60,110,0.42)]"
          style={{ animation: 'stw-shimmer 6s linear infinite' }}
        >
          <HiOutlineSparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
          Launch Prediction
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </NavLink>
      </motion.div>
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