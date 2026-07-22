import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi2';
import {
  HiOutlineLocationMarker,
  HiOutlineLightningBolt,
  HiOutlineCube,
} from 'react-icons/hi';

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const AI_WORD = 'Artificial Intelligence';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  top: Math.random() * 100,
  left: Math.random() * 100,
  duration: Math.random() * 8 + 8,
  delay: Math.random() * 5,
}));

const TREND_POINTS = '0,38 15,30 30,33 45,20 60,24 75,12 90,16 105,4';

const DASHBOARD_BADGES = [
  { label: 'XGBoost', icon: HiOutlineCube, className: 'top-2 -right-4 sm:-right-6' },
  { label: 'Live', icon: HiOutlineLightningBolt, className: 'bottom-16 -left-4 sm:-left-6' },
];

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                               */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ from = 0, to, duration = 1.4, delay = 0, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(from);
  const startRef = useRef(null);
  const startedRef = useRef(false);

  useAnimationFrame((time) => {
    if (!startedRef.current) {
      if (time < delay * 1000) return;
      startedRef.current = true;
      startRef.current = time;
    }
    const elapsed = (time - startRef.current) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setValue(from + (to - from) * eased);
  });

  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ConfidenceRing({ percentage = 96.8, size = 76, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.6} duration={1.3} />%
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, delay = 0, color = 'from-rose-400 to-indigo-400' }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] text-gray-400">
        <span>{label}</span>
        <span className="text-gray-300">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function MagneticButton({ children, className = '', as: Component = 'button', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    const rx = e.clientX - rect.left;
    const ry = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id, x: rx, y: ry }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Component
        onClick={(e) => {
          handleClick(e);
          props.onClick?.(e);
        }}
        {...props}
        className={`relative isolate flex items-center justify-center overflow-hidden ${className}`}
      >
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30"
            style={{
              left: r.x,
              top: r.y,
              width: 12,
              height: 12,
              transform: 'translate(-50%, -50%)',
              animation: 'stw-ripple 0.6s ease-out forwards',
            }}
          />
        ))}
      </Component>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero Section                                                        */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const cardRotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const cardRotateY = useSpring(0, { stiffness: 150, damping: 20 });

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

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    cardRotateY.set(relX * 10);
    cardRotateX.set(-relY * 10);
  };

  const handleCardMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const glowBackground = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(500px circle at ${x}px ${y}px, rgba(244,63,94,0.12), transparent 70%)`
  );

  const headlineLetters = AI_WORD.split('');

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-black pt-16"
    >
      <style>{`
        @keyframes stw-ripple {
          from { width: 12px; height: 12px; opacity: 0.5; }
          to { width: 220px; height: 220px; margin-left: -104px; margin-top: -104px; opacity: 0; }
        }
        @keyframes stw-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 60px 60px; }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>

      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-40 -top-20 h-[32rem] w-[32rem] rounded-full bg-rose-500/25 blur-[100px]"
          animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[-8rem] top-10 h-[36rem] w-[36rem] rounded-full bg-indigo-500/25 blur-[110px]"
          animate={{ x: [0, -50, 30, 0], y: [0, 50, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/20 blur-[100px]"
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[90px]"
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle animated grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'stw-grid-drift 10s linear infinite',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 40%, transparent 90%)',
        }}
      />

      {/* Floating glass orbs */}
      <motion.div
        className="pointer-events-none absolute left-[8%] top-[20%] h-16 w-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] top-[15%] h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-[20%] bottom-[15%] h-24 w-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white/50"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            }}
            animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -14, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Mouse-follow glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: glowBackground }}
      />

      {/* Noise texture */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="stwNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stwNoise)" />
      </svg>

      {/* Center spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      {/* Content */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left column */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md"
          >
            <HiOutlineSparkles className="h-3.5 w-3.5 text-rose-400" />
            Powered by Machine Learning
          </motion.div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="block"
            >
              Predict Airbnb Prices
            </motion.span>
            <span className="mt-1 flex flex-wrap justify-center gap-x-[0.2em] lg:justify-start">
              {headlineLetters.map((letter, i) => (
                <motion.span
                  key={`${letter}-${i}`}
                  initial={{ opacity: 0, y: 24, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.03 }}
                  className="relative inline-block bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(244,63,94,0.35)]"
                  style={{
                    animation: 'stw-shimmer 5s linear infinite',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
          >
            StayWise AI blends a trained XGBoost regression model with real
            Airbnb listing data — location, room type, availability, and
            review history — to generate instant, accurate price predictions.
            Every result is served through a FastAPI backend and visualized
            with beautiful, real-time analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MagneticButton
              as={NavLink}
              to="/predict"
              className="group gap-2 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-shadow duration-300 hover:shadow-rose-500/50"
            >
              <HiOutlineSparkles className="h-4 w-4" />
              Predict Your Airbnb Price
              <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#features"
              className="gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10"
            >
              Explore Features
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right column - futuristic AI dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ perspective: 1000 }}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/10 via-transparent to-indigo-500/10"
              style={{
                backgroundSize: '200% 200%',
                animation: 'stw-shimmer 6s linear infinite',
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Live Prediction
                </span>
              </div>
              <HiOutlineLocationMarker className="h-4 w-4 text-gray-500" />
            </div>

            {/* Price */}
            <div className="relative mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400">Estimated Price</p>
                <p className="mt-1 text-4xl font-bold text-white">
                  <AnimatedCounter to={184} prefix="$" delay={0.6} duration={1.2} />
                  <span className="text-base font-medium text-gray-400">/night</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Downtown &middot; Entire home/apt
                </p>
              </div>
              <ConfidenceRing percentage={96.8} />
            </div>

            {/* Progress bars */}
            <div className="relative mt-7 space-y-4">
              <ProgressBar label="Model Confidence" percentage={97} delay={0.8} />
              <ProgressBar
                label="Data Match Quality"
                percentage={89}
                delay={0.95}
                color="from-indigo-400 to-blue-400"
              />
            </div>

            {/* Mini trend chart */}
            <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Price Trend (last 8 predictions)</span>
                <span className="text-emerald-400">+4.2%</span>
              </div>
              <svg viewBox="0 0 110 44" className="mt-2 h-10 w-full overflow-visible">
                <motion.polyline
                  points={TREND_POINTS}
                  fill="none"
                  stroke="url(#trendGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: 1.1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Footer stats */}
            <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
              <div>
                <p className="text-sm font-semibold text-white">XGBoost</p>
                <p className="text-[11px] text-gray-500">Model</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12</p>
                <p className="text-[11px] text-gray-500">Features</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  <AnimatedCounter to={0.18} decimals={2} delay={1.2} duration={1} suffix="s" />
                </p>
                <p className="text-[11px] text-gray-500">Runtime</p>
              </div>
            </div>
          </motion.div>

          {/* Floating badges */}
          {DASHBOARD_BADGES.map(({ label, icon: Icon, className }, i) => (
            <motion.div
              key={label}
              className={`absolute z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-black/40 backdrop-blur-xl sm:flex ${className}`}
              animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon className="h-3.5 w-3.5 text-rose-400" />
              {label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-indigo-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[11px] uppercase tracking-widest text-gray-500">
          Scroll to Explore
        </span>
      </motion.div>
    </section>
  );
}

export default HeroSection;