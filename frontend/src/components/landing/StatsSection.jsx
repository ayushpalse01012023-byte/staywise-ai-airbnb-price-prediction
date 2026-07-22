import { useMemo, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import {
  HiOutlineChartBar,
  HiOutlineHomeModern,
  HiOutlineBoltSlash,
  HiOutlineCpuChip,
} from 'react-icons/hi2';
import { HiOutlineLightningBolt, HiOutlineDesktopComputer } from 'react-icons/hi';

/* ============================================================== */
/* Constants                                                        */
/* ============================================================== */

const STATS = [
  {
    id: 'accuracy',
    icon: HiOutlineChartBar,
    kind: 'counter',
    to: 94.6,
    decimals: 1,
    suffix: '%',
    label: 'Model Accuracy',
  },
  {
    id: 'listings',
    icon: HiOutlineHomeModern,
    kind: 'counter',
    to: 50,
    decimals: 0,
    suffix: 'K+',
    label: 'Airbnb Listings',
  },
  {
    id: 'speed',
    icon: HiOutlineBoltSlash,
    kind: 'counter',
    to: 0.2,
    decimals: 1,
    prefix: '<',
    suffix: 's',
    label: 'Prediction Time',
  },
  {
    id: 'model',
    icon: HiOutlineCpuChip,
    kind: 'static',
    value: 'XGBoost',
    label: 'ML Algorithm',
  },
  {
    id: 'backend',
    icon: HiOutlineLightningBolt,
    kind: 'static',
    value: 'FastAPI',
    label: 'Backend API',
  },
  {
    id: 'frontend',
    icon: HiOutlineDesktopComputer,
    kind: 'static',
    value: 'React + Tailwind',
    label: 'Modern Frontend',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================================================== */
/* Small building blocks                                            */
/* ============================================================== */

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

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.03, rotate: index % 2 === 0 ? 0.6 : -0.6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.18)] sm:p-7"
    >
      {/* gradient border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: '0 0 0 1px rgba(190,90,150,0.25), 0 0 30px rgba(190,60,110,0.12)' }} />

      {/* inner top-light reflection, consistent with Hero card */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

      {/* ambient glow that intensifies on hover */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-160" />

      <motion.div
        whileHover={{ rotate: 12, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
      >
        <Icon className="h-5 w-5 text-rose-300" />
      </motion.div>

      <p className="relative mt-5 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-3xl font-bold leading-tight tracking-[-0.01em] text-transparent sm:text-4xl">
        {stat.kind === 'counter' ? (
          <AnimatedCounter
            to={stat.to}
            prefix={stat.prefix}
            suffix={stat.suffix}
            decimals={stat.decimals}
            delay={0.3 + index * 0.08}
            duration={1.6}
          />
        ) : (
          stat.value
        )}
      </p>

      <p className="relative mt-1.5 text-xs font-medium tracking-wide text-gray-500 sm:text-sm">
        {stat.label}
      </p>
    </motion.div>
  );
}

/* ============================================================== */
/* Stats Section                                                    */
/* ============================================================== */

function StatsSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 14 + 14,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.2 + 0.06,
      })),
    []
  );

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-stats-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-stats-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
      `}</style>

      {/* Background — continuation of Hero, kept dimmer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]" />
        <div className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-stats-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

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
              animation: `stw-stats-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            Powered by Data
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            Numbers That Speak{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              For Our AI
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            StayWise AI combines a trained machine learning model with real
            Airbnb market data to deliver predictions that are fast, accurate,
            and genuinely useful.
          </motion.p>
        </div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-6"
        >
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;