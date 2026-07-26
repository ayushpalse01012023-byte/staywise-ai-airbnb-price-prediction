import { useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  HiOutlineClock,
  HiOutlineSignal,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineChartBarSquare,
} from 'react-icons/hi2';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const SUMMARY_CHIPS = [
  { label: 'Total Predictions', value: '128', icon: HiOutlineChartBarSquare },
  { label: 'Last Prediction', value: 'Today', icon: HiOutlineClock },
  { label: 'Average Price', value: '$142/night', icon: HiOutlineCurrencyDollar },
  { label: 'Success Rate', value: '100%', icon: HiOutlineCheckCircle },
];

const HISTORY_ROWS = [
  { id: 1, property: 'Cozy Loft', area: 'Williamsburg', price: 214 },
  { id: 2, property: 'Sunny Studio', area: 'Harlem', price: 96 },
  { id: 3, property: 'Modern Flat', area: 'Astoria', price: 142 },
  { id: 4, property: 'Garden Suite', area: 'Chelsea', price: 176 },
];

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

function SummaryChip({ chip, index }) {
  const Icon = chip.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
      whileHover={{ y: -3, scale: 1.03 }}
      className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300 backdrop-blur-md transition-colors duration-300 hover:border-rose-400/25 hover:text-white"
      style={{ animation: `stw-historyhero-pill-float ${5 + index}s ease-in-out ${index * 0.4}s infinite` }}
    >
      <Icon className="h-3.5 w-3.5 text-rose-400" />
      <span className="font-semibold text-white">{chip.value}</span>
      <span className="text-gray-500">{chip.label}</span>
    </motion.div>
  );
}

function HistoryPreviewMockup() {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareXSpring = useSpring(glareX, { stiffness: 100, damping: 20 });
  const glareYSpring = useSpring(glareY, { stiffness: 100, damping: 20 });

  const glareBackground = useTransform(
    [glareXSpring, glareYSpring],
    ([x, y]) => `radial-gradient(300px circle at ${x}% ${y}%, rgba(255,255,255,0.07), transparent 70%)`
  );

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 7);
    rotateX.set(-relY * 7);
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{ perspective: 1300 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 via-fuchsia-500/5 to-indigo-500/10 blur-2xl" />

      <div style={{ animation: 'stw-historyhero-float 6s ease-in-out infinite' }}>
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
                <p className="text-[13px] font-semibold text-white">Prediction Timeline</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400/80">AI Synced</p>
              </div>
            </div>
            <HiOutlineSignal className="h-4 w-4 text-gray-600" />
          </div>

          <div className="relative mt-5 flex items-center gap-2">
            <div className="relative h-2 w-2 rounded-full bg-rose-400" style={{ boxShadow: '0 0 8px rgba(251,113,133,0.8)' }} />
            <div className="h-px flex-1 bg-gradient-to-r from-rose-400/40 via-fuchsia-400/30 to-indigo-400/10" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">Recent Activity</span>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-3 gap-2 border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-500">
              <span>Property</span>
              <span>Area</span>
              <span className="text-right">Price</span>
            </div>
            <div>
              {HISTORY_ROWS.map((row, index) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className={`grid grid-cols-3 gap-2 px-4 py-3 text-xs transition-colors duration-300 ${
                    index !== HISTORY_ROWS.length - 1 ? 'border-b border-white/[0.04]' : ''
                  }`}
                >
                  <span className="truncate font-medium text-white">{row.property}</span>
                  <span className="flex items-center gap-1 truncate text-gray-400">
                    <HiOutlineLocationMarker className="h-3 w-3 shrink-0 text-gray-600" />
                    {row.area}
                  </span>
                  <span className="text-right font-semibold text-white">${row.price}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] font-medium text-gray-500">Total Entries</p>
              <p className="mt-1.5 text-sm font-semibold text-white">128</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] font-medium text-gray-500">Data Sync</p>
              <p className="mt-1.5 text-sm font-semibold text-white">Live</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function HistoryHero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  const particles = useParticles(40);

  useEffect(() => {
    const handleMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    const node = sectionRef.current;
    node?.addEventListener('mousemove', handleMove);
    return () => node?.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(190,60,110,0.09), transparent 72%)`
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#050506] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <style>{`
        @keyframes stw-historyhero-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-historyhero-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-historyhero-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-historyhero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes stw-historyhero-pill-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 -top-16 h-[30rem] w-[30rem] rounded-full bg-rose-900/20 blur-[130px]"
          style={{ animation: 'stw-historyhero-blob-drift 26s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-indigo-900/20 blur-[130px]"
          style={{ animation: 'stw-historyhero-blob-drift 30s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-historyhero-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, black 30%, transparent 85%)',
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
              animation: `stw-historyhero-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glowBackground }} />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            Prediction History
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-4xl font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          >
            Every Prediction
            <br />
            Saved Forever
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-3 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-2xl font-bold leading-[1.2] tracking-[-0.01em] text-transparent sm:text-3xl"
            style={{ animation: 'stw-shimmer 6s linear infinite' }}
          >
            AI Prediction Timeline
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mx-auto mt-6 max-w-lg text-base leading-[1.75] text-gray-400 sm:text-lg lg:mx-0"
          >
            Browse your previous Airbnb price predictions, compare results,
            review historical AI insights, and revisit every prediction made
            through StayWise AI.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {SUMMARY_CHIPS.map((chip, index) => (
              <SummaryChip key={chip.label} chip={chip} index={index} />
            ))}
          </div>
        </div>

        <HistoryPreviewMockup />
      </div>
    </section>
  );
}

export default HistoryHero;