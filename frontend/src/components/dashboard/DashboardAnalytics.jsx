import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineChartBarSquare,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
  HiOutlineSignal,
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

const VOLUME_POINTS = [
  { x: 0, y: 62 }, { x: 65, y: 48 }, { x: 130, y: 54 }, { x: 195, y: 34 },
  { x: 260, y: 40 }, { x: 325, y: 22 }, { x: 390, y: 28 }, { x: 455, y: 14 },
  { x: 520, y: 20 }, { x: 585, y: 8 },
];

const PRICE_POINTS = [
  { x: 0, y: 90 }, { x: 65, y: 84 }, { x: 130, y: 88 }, { x: 195, y: 76 },
  { x: 260, y: 80 }, { x: 325, y: 70 }, { x: 390, y: 74 }, { x: 455, y: 64 },
  { x: 520, y: 68 }, { x: 585, y: 58 },
];

const CONFIDENCE_POINTS = [
  { x: 0, y: 112 }, { x: 65, y: 108 }, { x: 130, y: 110 }, { x: 195, y: 104 },
  { x: 260, y: 106 }, { x: 325, y: 100 }, { x: 390, y: 102 }, { x: 455, y: 96 },
  { x: 520, y: 98 }, { x: 585, y: 92 },
];

function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

const LEGEND = [
  { id: 'volume', label: 'Prediction Volume', color: '#fb7185' },
  { id: 'price', label: 'Average Price', color: '#a78bfa' },
  { id: 'confidence', label: 'Confidence Trend', color: '#818cf8' },
];

function AnalyticsChart() {
  const volumePath = useMemo(() => smoothPath(VOLUME_POINTS), []);
  const pricePath = useMemo(() => smoothPath(PRICE_POINTS), []);
  const confidencePath = useMemo(() => smoothPath(CONFIDENCE_POINTS), []);
  const areaPath = useMemo(
    () => `${volumePath} L 585 140 L 0 140 Z`,
    [volumePath]
  );

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

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <HiOutlineChartBarSquare className="h-4 w-4 text-rose-300" />
            Prediction Trends
          </p>
          <p className="mt-1 text-xs text-gray-500">Last 10 prediction cycles</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {LEGEND.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
        <svg viewBox="0 0 585 150" className="h-56 w-full overflow-visible sm:h-72">
          {[35, 70, 105, 140].map((y) => (
            <line key={y} x1="0" y1={y} x2="585" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          ))}

          <defs>
            <linearGradient id="stwAnalyticsArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stwAnalyticsVolume" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaPath}
            fill="url(#stwAnalyticsArea)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          <motion.path
            d={confidencePath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d={pricePath}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d={volumePath}
            fill="none"
            stroke="url(#stwAnalyticsVolume)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(251,113,133,0.5))' }}
          />

          <motion.circle
            cx={VOLUME_POINTS[VOLUME_POINTS.length - 1].x}
            cy={VOLUME_POINTS[VOLUME_POINTS.length - 1].y}
            r="3"
            fill="#fda4af"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(251,113,133,0.8))' }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

const INSIGHTS = [
  {
    id: 'area',
    icon: HiOutlineMapPin,
    title: 'Most Predicted Area',
    value: 'Williamsburg',
    subtitle: 'Highest listing volume this period',
  },
  {
    id: 'price',
    icon: HiOutlineCurrencyDollar,
    title: 'Highest Average Price',
    value: '$214 / night',
    subtitle: 'Top-earning neighbourhood segment',
  },
  {
    id: 'roomtype',
    icon: HiOutlineHomeModern,
    title: 'Top Room Type',
    value: 'Entire home/apt',
    subtitle: 'Most frequently predicted category',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function InsightCard({ insight, index }) {
  const Icon = insight.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.18)]"
      style={{ animation: `stw-analytics-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 28px rgba(190,60,110,0.14)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
        >
          <Icon className="h-5 w-5 text-rose-300" />
        </motion.div>
        <HiOutlineSignal className="h-4 w-4 text-gray-600" />
      </div>

      <p className="relative mt-5 text-xs font-medium uppercase tracking-[0.1em] text-gray-500">
        {insight.title}
      </p>
      <p className="relative mt-1.5 text-xl font-semibold tracking-[-0.01em] text-white">
        {insight.value}
      </p>
      <p className="relative mt-2 text-xs leading-[1.6] text-gray-500">{insight.subtitle}</p>
    </motion.div>
  );
}

function DashboardAnalytics() {
  const particles = useParticles(28);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <style>{`
        @keyframes stw-analytics-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-analytics-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-analytics-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-analytics-float {
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
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-analytics-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-analytics-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-analytics-grid-drift 18s linear infinite',
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
              animation: `stw-analytics-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Analytics{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Overview
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Track model behavior, prediction activity, and listing insights
            in real time.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-7">
          <AnalyticsChart />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:flex lg:grid-cols-1"
          >
            {INSIGHTS.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAnalytics;