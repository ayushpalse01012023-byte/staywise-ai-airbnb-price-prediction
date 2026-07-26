import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBoltSlash,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineRocketLaunch,
  HiOutlineBolt as HiOutlineLightning,
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

const FEATURES = [
  {
    id: 'fastapi',
    icon: HiOutlineBoltSlash,
    title: 'FastAPI Backend',
    description: 'High-performance REST API serving predictions in real time.',
  },
  {
    id: 'xgboost',
    icon: HiOutlineCpuChip,
    title: 'XGBoost AI Model',
    description: 'Gradient boosting model trained on Airbnb listing data.',
  },
  {
    id: 'realtime',
    icon: HiOutlineSparkles,
    title: 'Real-Time Prediction',
    description: 'Predict prices instantly without refreshing the page.',
  },
  {
    id: 'explainable',
    icon: HiOutlineAdjustmentsHorizontal,
    title: 'Explainable Features',
    description: 'Uses neighbourhood, room type, reviews, availability and host information.',
  },
  {
    id: 'production',
    icon: HiOutlineRocketLaunch,
    title: 'Production Ready',
    description: 'Modern React frontend connected to a scalable FastAPI backend.',
  },
  {
    id: 'fast',
    icon: HiOutlineLightning,
    title: 'Lightning Fast',
    description: 'Optimized inference pipeline with smooth user experience.',
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

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02, rotate: index % 2 === 0 ? 0.4 : -0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.18)] sm:p-7"
      style={{ animation: `stw-feat-highlight-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 30px rgba(190,60,110,0.14)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        whileHover={{ rotate: 12, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/15 to-indigo-500/15" />
        <Icon className="relative h-5 w-5 bg-gradient-to-br from-rose-300 to-indigo-300 bg-clip-text text-rose-300" />
      </motion.div>

      <h3 className="relative mt-5 text-base font-semibold tracking-[-0.01em] text-white sm:text-lg">
        {feature.title}
      </h3>

      <p className="relative mt-2.5 text-sm leading-[1.7] text-gray-400">
        {feature.description}
      </p>
    </motion.div>
  );
}

function FeatureHighlights() {
  const particles = useParticles(30);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-feat-highlight-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-feat-highlight-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-feat-highlight-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-feat-highlight-float {
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
          style={{ animation: 'stw-feat-highlight-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-feat-highlight-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-feat-highlight-grid-drift 18s linear infinite',
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
              animation: `stw-feat-highlight-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Powered by{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Modern AI Technology
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            StayWise AI combines machine learning, modern web technologies,
            and real-time inference to deliver fast, reliable Airbnb price
            predictions.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureHighlights;