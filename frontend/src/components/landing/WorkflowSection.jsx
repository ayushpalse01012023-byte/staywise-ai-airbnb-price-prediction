import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineMapPin,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineChartBarSquare,
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

const STEPS = [
  {
    id: 'input',
    icon: HiOutlineMapPin,
    title: 'Enter Property Details',
    description: 'Provide location, room type, availability, reviews and listing information.',
  },
  {
    id: 'processing',
    icon: HiOutlineCircleStack,
    title: 'Data Processing',
    description: 'The backend validates, cleans and transforms every feature before prediction.',
  },
  {
    id: 'engineering',
    icon: HiOutlineCpuChip,
    title: 'Feature Engineering',
    description: 'The application prepares optimized inputs for the XGBoost regression model.',
  },
  {
    id: 'prediction',
    icon: HiOutlineSparkles,
    title: 'AI Prediction',
    description: 'The trained model predicts an estimated Airbnb price in milliseconds.',
  },
  {
    id: 'visualization',
    icon: HiOutlineChartBarSquare,
    title: 'Visualization',
    description: 'Prediction confidence and analytics are presented using beautiful UI components.',
  },
  {
    id: 'result',
    icon: HiOutlineCheckBadge,
    title: 'Final Result',
    description: 'Users instantly receive an estimated Airbnb price with modern visual presentation.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function useMagneticButton() {
  const ref = useRef(null);
  return ref;
}

function StepCard({ step, index, isLast }) {
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col items-center lg:flex-1">
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="group relative w-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:border-rose-400/25 hover:shadow-[0_22px_65px_rgba(190,60,110,0.2)]"
        style={{ animation: `stw-flow-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.28), 0 0 30px rgba(190,60,110,0.15)' }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-[11px] font-semibold text-gray-400">
            {index + 1}
          </span>
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-colors duration-500 group-hover:border-rose-400/30"
          >
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500/10 to-indigo-500/10" />
            <Icon className="relative h-5 w-5 text-rose-300" />
          </motion.div>
        </div>

        <h3 className="relative mt-5 text-base font-semibold tracking-[-0.01em] text-white sm:text-lg">
          {step.title}
        </h3>
        <p className="relative mt-2.5 text-sm leading-[1.65] text-gray-400">
          {step.description}
        </p>
      </motion.div>

      {!isLast && (
        <>
          <div className="relative hidden h-px w-full flex-1 items-center lg:flex">
            <div className="h-px w-full bg-gradient-to-r from-rose-400/30 via-fuchsia-400/30 to-indigo-400/30" />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-gradient-to-r from-rose-300 to-indigo-300"
              style={{ boxShadow: '0 0 8px rgba(244,63,150,0.6)' }}
              animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
            />
          </div>
          <div className="relative flex h-10 items-center justify-center lg:hidden">
            <div className="h-full w-px bg-gradient-to-b from-rose-400/30 via-fuchsia-400/30 to-indigo-400/30" />
            <motion.div
              className="absolute top-0 h-1.5 w-1.5 rounded-full bg-gradient-to-b from-rose-300 to-indigo-300"
              style={{ boxShadow: '0 0 8px rgba(244,63,150,0.6)' }}
              animate={{ y: [0, 40, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function CTAPanel() {
  const ref = useRef(null);

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
        Ready to Predict Your Property?
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-base leading-[1.7] text-gray-400">
        Generate accurate Airbnb price estimates instantly using StayWise AI.
      </p>

      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative mt-8 inline-block"
      >
        <NavLink
          to="/predict"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_8px_42px_rgba(190,60,110,0.42)]"
          style={{ animation: 'stw-shimmer 6s linear infinite' }}
        >
          <HiOutlineSparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
          Predict Now
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </NavLink>
      </motion.div>
    </motion.div>
  );
}

function WorkflowSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
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
        @keyframes stw-flow-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-flow-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-flow-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-flow-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-flow-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-flow-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-flow-grid-drift 18s linear infinite',
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
              animation: `stw-flow-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            From User Input to{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              AI Prediction
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            StayWise AI transforms Airbnb property information into intelligent
            price predictions through an optimized machine learning pipeline.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 flex flex-col items-stretch lg:flex-row lg:items-start"
        >
          {STEPS.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} isLast={index === STEPS.length - 1} />
          ))}
        </motion.div>

        <CTAPanel />
      </div>
    </section>
  );
}

export default WorkflowSection;