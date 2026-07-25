import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineBoltSlash, HiOutlineCpuChip, HiOutlineClock, HiOutlineSignal } from 'react-icons/hi2';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const FEATURE_PILLS = [
  { label: 'FastAPI Backend', icon: HiOutlineBoltSlash },
  { label: 'XGBoost Regression', icon: HiOutlineCpuChip },
  { label: 'Under 0.2s Prediction', icon: HiOutlineClock },
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
        duration: randomBetween(12, 24),
        delay: randomBetween(0, 10),
        opacity: randomBetween(0.08, 0.3),
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

function ConfidenceRing({ percentage = 94.6, size = 74, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 22px rgba(190,60,110,0.22)' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwPredRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="stwPredRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.6} duration={1.4} suffix="%" />
        </span>
        <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.15em] text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

function LiveGraph() {
  const [series, setSeries] = useState(() => Array.from({ length: 9 }, (_, i) => ({ x: i * 13, y: randomBetween(6, 26) })));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const shifted = prev.slice(1).map((point, i) => ({ x: i * 13, y: point.y }));
        const lastY = shifted[shifted.length - 1]?.y ?? 16;
        const nextY = Math.min(28, Math.max(4, lastY + randomBetween(-6, 6)));
        shifted.push({ x: shifted.length * 13, y: nextY });
        return shifted;
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const points = series.map((p) => `${p.x},${30 - p.y}`).join(' ');
  const last = series[series.length - 1];

  return (
    <svg viewBox="0 0 104 30" className="h-14 w-full overflow-visible">
      {[7, 14, 21].map((y) => (
        <line key={y} x1="0" y1={y} x2="104" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      ))}
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#stwPredLine)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
      <motion.circle
        cx={last.x}
        cy={30 - last.y}
        r="2"
        fill="#fda4af"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(251,113,133,0.8))' }}
      />
      <defs>
        <linearGradient id="stwPredLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PredictionIllustration() {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareXSpring = useSpring(glareX, { stiffness: 100, damping: 20 });
  const glareYSpring = useSpring(glareY, { stiffness: 100, damping: 20 });

  const glareBackground = useTransform(
    [glareXSpring, glareYSpring],
    ([x, y]) => `radial-gradient(300px circle at ${x}% ${y}%, rgba(255,255,255,0.08), transparent 70%)`
  );

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 8);
    rotateX.set(-relY * 8);
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
      className="relative mx-auto w-full max-w-md"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 via-fuchsia-500/5 to-indigo-500/10 blur-2xl" />

      <div style={{ animation: 'stw-pred-float 6s ease-in-out infinite' }}>
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
                <p className="text-[13px] font-semibold text-white">Prediction Engine</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400/80">Online</p>
              </div>
            </div>
            <HiOutlineSignal className="h-4 w-4 text-gray-600" />
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Estimated Price</p>
              <p className="mt-1.5 text-4xl font-bold leading-none tracking-[-0.01em] text-white">
                <AnimatedCounter to={214} prefix="$" delay={0.6} duration={1.3} />
                <span className="text-sm font-medium text-gray-500">/night</span>
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                Brooklyn Heights
              </p>
            </div>
            <ConfidenceRing percentage={94.6} />
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <HiOutlineSignal className="h-3 w-3 text-rose-400/70" />
                Live Model Activity
              </span>
              <span className="text-emerald-400/80">Streaming</span>
            </div>
            <div className="mt-2">
              <LiveGraph />
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] font-medium text-gray-500">Model</p>
              <p className="mt-1.5 text-sm font-semibold text-white">XGBoost</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] font-medium text-gray-500">Runtime</p>
              <p className="mt-1.5 text-sm font-semibold text-white">
                <AnimatedCounter to={0.18} decimals={2} delay={0.4} duration={1} suffix="s" />
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeaturePill({ pill, index }) {
  const Icon = pill.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
      whileHover={{ y: -3, scale: 1.03 }}
      className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md transition-colors duration-300 hover:border-rose-400/25 hover:text-white"
      style={{ animation: `stw-pred-pill-float ${5 + index}s ease-in-out ${index * 0.4}s infinite` }}
    >
      <Icon className="h-3.5 w-3.5 text-rose-400" />
      {pill.label}
    </motion.div>
  );
}

function PredictionHero() {
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
        @keyframes stw-pred-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-pred-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-pred-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-pred-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes stw-pred-pill-float {
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
          style={{ animation: 'stw-pred-blob-drift 26s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-indigo-900/20 blur-[130px]"
          style={{ animation: 'stw-pred-blob-drift 30s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-pred-grid-drift 18s linear infinite',
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
              animation: `stw-pred-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            <HiOutlineSparkles className="h-3.5 w-3.5 text-rose-400" />
            AI Price Prediction
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-4xl font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          >
            Predict Airbnb Prices
            <br />
            with{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              StayWise AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-6 max-w-lg text-base leading-[1.75] text-gray-400 sm:text-lg lg:mx-0"
          >
            Fill in the property details below and our XGBoost model will
            instantly estimate the expected Airbnb listing price.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {FEATURE_PILLS.map((pill, index) => (
              <FeaturePill key={pill.label} pill={pill} index={index} />
            ))}
          </div>
        </div>

        <PredictionIllustration />
      </div>
    </section>
  );
}

export default PredictionHero;