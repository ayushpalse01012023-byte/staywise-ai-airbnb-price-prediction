import { useMemo, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineArrowLongDown,
} from 'react-icons/hi2';
import {
  HiOutlineLightningBolt,
  HiOutlineHome,
  HiOutlineChip,
  HiOutlineDesktopComputer,
  HiOutlineChartSquareBar,
} from 'react-icons/hi';

const STATS = [
  { id: 'accuracy', icon: HiOutlineSparkles, kind: 'counter', to: 94.6, decimals: 1, suffix: '%', label: 'Prediction Accuracy' },
  { id: 'speed', icon: HiOutlineLightningBolt, kind: 'counter', to: 0.18, decimals: 2, suffix: ' sec', label: 'Inference Speed' },
  { id: 'listings', icon: HiOutlineHome, kind: 'counter', to: 50000, decimals: 0, suffix: '+', label: 'Airbnb Listings' },
  { id: 'model', icon: HiOutlineChip, kind: 'static', value: 'XGBoost', label: 'Regression Model' },
  { id: 'stack', icon: HiOutlineDesktopComputer, kind: 'static', value: 'React + FastAPI', label: 'Production Stack' },
  { id: 'features', icon: HiOutlineChartSquareBar, kind: 'counter', to: 12, decimals: 0, suffix: ' Features', label: 'Prediction Inputs' },
];

const PIPELINE = ['Machine Learning', 'Data Processing', 'Prediction', 'Visualization', 'Results'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedCounter({ to, duration = 1.6, delay = 0, suffix = '', decimals = 0 }) {
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
    spanRef.current.textContent = `${value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  return (
    <span ref={spanRef} className="tabular-nums">
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
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:border-rose-400/25 hover:shadow-[0_22px_65px_rgba(190,60,110,0.2)] sm:p-8"
      style={{ animation: `stw-stat-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.28), 0 0 34px rgba(190,60,110,0.15)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl"
        style={{ animation: 'stw-stat-breathe 5s ease-in-out infinite' }}
      />

      <motion.div
        whileHover={{ rotate: 12, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] transition-colors duration-500 group-hover:border-rose-400/30"
        style={{ animation: `stw-stat-icon-float ${5 + (index % 2)}s ease-in-out ${index * 0.25}s infinite` }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/10 to-indigo-500/10" />
        <Icon className="relative h-6 w-6 text-rose-300" />
      </motion.div>

      <p className="relative mt-6 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-3xl font-bold leading-tight tracking-[-0.01em] text-transparent sm:text-4xl">
        {stat.kind === 'counter' ? (
          <AnimatedCounter to={stat.to} suffix={stat.suffix} decimals={stat.decimals} delay={0.3 + index * 0.08} duration={1.6} />
        ) : (
          stat.value
        )}
      </p>

      <p className="relative mt-2 text-sm font-medium tracking-wide text-gray-500 sm:text-[15px]">{stat.label}</p>
    </motion.div>
  );
}

function PipelineStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto mt-20 max-w-3xl rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative flex flex-col items-center gap-0">
        {PIPELINE.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              {step}
            </motion.div>
            {index < PIPELINE.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
                className="relative flex h-10 items-center justify-center"
              >
                <div className="h-full w-px bg-gradient-to-b from-rose-400/40 via-fuchsia-400/40 to-indigo-400/40" />
                <motion.div
                  className="absolute top-0 h-2 w-2 rounded-full bg-gradient-to-b from-rose-300 to-indigo-300"
                  style={{ boxShadow: '0 0 8px rgba(244,63,150,0.6)' }}
                  animate={{ y: [0, 36, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                />
                <HiOutlineArrowLongDown className="absolute bottom-0 h-4 w-4 text-indigo-300/60" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

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
        @keyframes stw-stat-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-stat-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-stat-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-stat-icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes stw-stat-breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes stw-stat-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-stat-ray-sweep {
          0% { transform: translateX(-30%) rotate(6deg); opacity: 0; }
          50% { opacity: 0.35; }
          100% { transform: translateX(130%) rotate(6deg); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-stat-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-stat-blob-drift 32s ease-in-out infinite reverse' }}
        />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-900/10 blur-[110px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-stat-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-20%] top-1/4 h-20 w-[55%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          style={{ animation: 'stw-stat-ray-sweep 11s linear infinite' }}
        />
        <div
          className="absolute left-[-20%] top-2/3 h-14 w-[45%] bg-gradient-to-r from-transparent via-rose-300/[0.06] to-transparent"
          style={{ animation: 'stw-stat-ray-sweep 15s linear 4s infinite' }}
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
              animation: `stw-stat-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Project Metrics
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            Performance Built for{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Production
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Every prediction is powered by an optimized XGBoost regression
            model served through FastAPI with production-grade performance
            and beautiful visualization.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </motion.div>

        <PipelineStrip />
      </div>
    </section>
  );
}

export default StatsSection;