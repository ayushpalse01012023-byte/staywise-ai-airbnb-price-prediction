import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineChartBarSquare,
  HiOutlineCurrencyDollar,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { HiOutlineLocationMarker } from 'react-icons/hi';

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

const STATS = [
  {
    id: 'total',
    icon: HiOutlineChartBarSquare,
    title: 'Total Predictions',
    value: '128',
    subtitle: 'Predictions generated',
  },
  {
    id: 'average',
    icon: HiOutlineCurrencyDollar,
    title: 'Average Predicted Price',
    value: '$142',
    subtitle: 'Average nightly estimate',
  },
  {
    id: 'highest',
    icon: HiOutlineArrowTrendingUp,
    title: 'Highest Prediction',
    value: '$289',
    subtitle: 'Maximum estimated price',
  },
  {
    id: 'area',
    icon: HiOutlineLocationMarker,
    title: 'Most Frequent Area',
    value: 'Williamsburg',
    subtitle: 'Top predicted neighbourhood',
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
      style={{ animation: `stw-histstats-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
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
        {stat.title}
      </p>

      <p className="relative mt-1.5 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-3xl font-bold leading-tight tracking-[-0.01em] text-transparent sm:text-4xl">
        {stat.value}
      </p>

      <p className="relative mt-2 text-xs font-medium text-gray-500">{stat.subtitle}</p>
    </motion.div>
  );
}

function InsightBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -4 }}
      className="group relative mt-8 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(190,60,110,0.18)] sm:px-10 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-rose-500/[0.06] via-fuchsia-500/[0.04] to-indigo-500/[0.06]" />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <motion.div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ boxShadow: '0 0 22px rgba(190,60,110,0.25)' }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <HiOutlineSparkles className="relative h-6 w-6 text-rose-300" />
        </motion.div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            AI Insight
          </div>
          <h3 className="mt-2.5 text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">
            AI History Insights
          </h3>
          <p className="mt-2 text-sm leading-[1.7] text-gray-400">
            Your prediction history indicates consistent usage across
            multiple neighbourhoods. Continue exploring different property
            types to improve your market understanding.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HistoryStats() {
  const particles = useParticles(28);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <style>{`
        @keyframes stw-histstats-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-histstats-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-histstats-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-histstats-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[24rem] w-[24rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-histstats-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[24rem] w-[24rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-histstats-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-histstats-grid-drift 18s linear infinite',
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
              animation: `stw-histstats-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Prediction History{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Analytics
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Quick insights into your previous Airbnb AI predictions.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6"
        >
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </motion.div>

        <InsightBanner />
      </div>
    </section>
  );
}

export default HistoryStats;