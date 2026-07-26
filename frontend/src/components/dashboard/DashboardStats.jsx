import { useMemo, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import {
  HiOutlineChartBarSquare,
  HiOutlineCpuChip,
  HiOutlineBoltSlash,
  HiOutlineUsers,
} from 'react-icons/hi2';

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

const STATS = [
  {
    id: 'total',
    icon: HiOutlineChartBarSquare,
    label: 'Total Predictions',
    value: 128,
    decimals: 0,
    subtext: 'All-time model runs',
  },
  {
    id: 'accuracy',
    icon: HiOutlineCpuChip,
    label: 'Model Accuracy',
    value: 94.6,
    decimals: 1,
    suffix: '%',
    subtext: 'Average confidence',
  },
  {
    id: 'speed',
    icon: HiOutlineBoltSlash,
    label: 'Avg. Prediction Time',
    value: 0.18,
    decimals: 2,
    suffix: 's',
    subtext: 'Fast inference',
  },
  {
    id: 'users',
    icon: HiOutlineUsers,
    label: 'Active Users',
    value: 42,
    decimals: 0,
    subtext: 'Currently exploring',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.18)] sm:p-7"
      style={{ animation: `stw-dashstats-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 30px rgba(190,60,110,0.14)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        whileHover={{ rotate: 12, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/10 to-indigo-500/10" />
        <Icon className="relative h-5 w-5 text-rose-300" />
      </motion.div>

      <p className="relative mt-5 text-xs font-medium uppercase tracking-[0.1em] text-gray-500">
        {stat.label}
      </p>

      <p className="relative mt-1.5 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-3xl font-bold leading-tight tracking-[-0.01em] text-transparent sm:text-4xl">
        <AnimatedCounter to={stat.value} decimals={stat.decimals} suffix={stat.suffix} delay={0.3 + index * 0.1} duration={1.6} />
      </p>

      <p className="relative mt-2 text-xs font-medium text-gray-500">{stat.subtext}</p>
    </motion.div>
  );
}

function DashboardStats() {
  const particles = useParticles(28);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <style>{`
        @keyframes stw-dashstats-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-dashstats-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-dashstats-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-dashstats-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[24rem] w-[24rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-dashstats-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[24rem] w-[24rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-dashstats-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-dashstats-grid-drift 18s linear infinite',
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
              animation: `stw-dashstats-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6"
        >
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default DashboardStats;