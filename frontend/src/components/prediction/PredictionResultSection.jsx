import { useMemo, useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineCpuChip,
  HiOutlineBoltSlash,
  HiOutlineLightBulb,
  HiOutlineChartBarSquare,
} from 'react-icons/hi2';

const USD_TO_INR = 87;

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

function AnimatedCounter({ to, duration = 1.8, delay = 0, prefix = '', suffix = '', decimals = 0, locale = false }) {
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
    const formatted = locale
      ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : value.toFixed(decimals);
    spanRef.current.textContent = `${prefix}${formatted}${suffix}`;
  });

  return (
    <span ref={spanRef} className="tabular-nums">
      {prefix}
      {locale ? (0).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : (0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ConfidenceRing({ percentage = 94.6, size = 128, stroke = 9 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 34px rgba(190,60,110,0.28)' }}
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwResultRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="stwResultRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.6} duration={1.6} suffix="%" />
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

function InfoCard({ icon: Icon, label, value, accent = 'text-rose-300' }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.18)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl" />

      <motion.div
        whileHover={{ rotate: 10, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
      >
        <Icon className={`h-5 w-5 ${accent}`} />
      </motion.div>

      <p className="relative mt-5 text-xs font-medium uppercase tracking-[0.1em] text-gray-500">{label}</p>
      <p className="relative mt-1.5 text-xl font-semibold tracking-[-0.01em] text-white">{value}</p>
    </motion.div>
  );
}

function TextCard({ icon: Icon, heading, text, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(129,140,248,0.14)] sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/10 to-rose-500/10 blur-2xl" />

      <div className="relative flex items-center gap-2.5">
        <motion.span
          whileHover={{ rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]"
        >
          <Icon className="h-4 w-4 text-rose-300" />
        </motion.span>
        <p className="text-sm font-semibold text-white">{heading}</p>
      </div>

      <p className="relative mt-4 text-sm leading-[1.75] text-gray-400">{text}</p>
    </motion.div>
  );
}

function PredictionResultSection({
  predictedPrice = 109.84,
  confidence = 94.6,
  predictionTime = 0.18,
  modelName = 'XGBoost Regressor',
  recommendation = 'This listing appears competitively priced based on location, availability and historical Airbnb trends.',
  insight = 'Our AI analyzed multiple listing features including location, room type, host activity and historical reviews to estimate this nightly price.',
}) {
  const particles = useParticles(30);
  const inrPrice = predictedPrice * USD_TO_INR;

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-result-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-result-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-result-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-result-breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-result-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-result-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-result-grid-drift 18s linear infinite',
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
              animation: `stw-result-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 160px 50px rgba(0,0,0,0.5)' }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Prediction Complete
          </div>

          <h2 className="mt-6 text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl">
            AI{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Prediction Result
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-2xl"
        >
          <motion.div
            className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-rose-500/15 via-fuchsia-500/10 to-indigo-500/15 blur-[60px]"
            style={{ animation: 'stw-result-breathe 4.5s ease-in-out infinite' }}
          />

          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.07] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/[0.06] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-indigo-400/[0.1] blur-2xl" />

            <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Estimated Airbnb Nightly Price
            </p>

            <p
              className="relative mt-4 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-6xl font-bold leading-none tracking-[-0.02em] text-transparent drop-shadow-[0_0_40px_rgba(190,90,150,0.3)] sm:text-7xl"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              <AnimatedCounter to={inrPrice} prefix="₹" delay={0.5} duration={1.8} locale />
            </p>

            <p className="relative mt-3 text-sm font-medium text-gray-500">
              ≈ <AnimatedCounter to={predictedPrice} prefix="$" decimals={2} delay={0.7} duration={1.8} /> USD
            </p>

            <p className="relative mt-5 text-sm text-gray-400">
              Predicted using real-time model inference on your submitted property details.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-12 flex justify-center"
        >
          <ConfidenceRing percentage={confidence} />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          <InfoCard icon={HiOutlineBoltSlash} label="Prediction Time" value={`${predictionTime.toFixed(2)} seconds`} accent="text-rose-300" />
          <InfoCard icon={HiOutlineCpuChip} label="Model Used" value={modelName} accent="text-indigo-300" />
          <InfoCard icon={HiOutlineChartBarSquare} label="Confidence Score" value={`${confidence.toFixed(1)}%`} accent="text-fuchsia-300" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2"
        >
          <TextCard icon={HiOutlineLightBulb} heading="Recommendation" text={recommendation} />
          <TextCard icon={HiOutlineSparkles} heading="AI Insight" text={insight} />
        </motion.div>
      </div>
    </section>
  );
}

export default PredictionResultSection;