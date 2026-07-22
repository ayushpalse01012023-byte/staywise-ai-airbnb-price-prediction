import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineArrowRight, HiOutlineSignal } from 'react-icons/hi2';
import { HiOutlineLocationMarker, HiOutlineLightningBolt, HiOutlineChip } from 'react-icons/hi';

/* ============================================================== */
/* Static content                                                   */
/* ============================================================== */

const HISTORY_SEED = { location: 'Downtown Loft', price: 184, confidence: 96.8 };

/* ============================================================== */
/* Utilities                                                        */
/* ============================================================== */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Sparse, calm particle field — atmosphere, not noise
function useParticles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: randomBetween(1, 2.6),
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        duration: randomBetween(10, 22),
        delay: randomBetween(0, 10),
        opacity: randomBetween(0.08, 0.35),
      })),
    [count]
  );
}

// Fewer nodes, dimmer lines — depth cue rather than a focal element
function useNeuralNodes(count) {
  return useMemo(() => {
    const nodes = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: randomBetween(8, 92),
      y: randomBetween(8, 92),
      delay: randomBetween(0, 5),
    }));
    const links = [];
    nodes.forEach((node, i) => {
      const next = nodes[(i + 1) % nodes.length];
      links.push({ id: `${node.id}-${next.id}`, a: node, b: next, delay: randomBetween(0, 6) });
    });
    return { nodes, links };
  }, [count]);
}

/* ============================================================== */
/* Building blocks                                                  */
/* ============================================================== */

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
    <span className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function MagneticButton({ children, className = '', as: Component = 'button', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.3 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
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
            className="pointer-events-none absolute rounded-full bg-white/25"
            style={{ left: r.x, top: r.y, width: 10, height: 10, transform: 'translate(-50%, -50%)', animation: 'stw-ripple 0.7s ease-out forwards' }}
          />
        ))}
      </Component>
    </motion.div>
  );
}

function ConfidenceRing({ percentage = 96.8, size = 84, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 24px rgba(190,60,110,0.25)' }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwRingRefined)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          transition={{ duration: 1.6, delay: 0.7, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="stwRingRefined" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] font-semibold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.7} duration={1.4} />%
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

function MetricBar({ label, percentage, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-gray-500">
        <span>{label}</span>
        <span className="text-gray-400">{percentage}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-400/80 to-indigo-400/80"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function Sparkline({ points }) {
  return (
    <svg viewBox="0 0 110 36" className="h-9 w-full overflow-visible">
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#stwSparkRefined)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="stwSparkRefined" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ============================================================== */
/* Hero Section                                                     */
/* ============================================================== */

function HeroSection() {
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  const parallaxX = useSpring(0, { stiffness: 35, damping: 22 });
  const parallaxY = useSpring(0, { stiffness: 35, damping: 22 });

  const cardRotateX = useSpring(0, { stiffness: 140, damping: 22 });
  const cardRotateY = useSpring(0, { stiffness: 140, damping: 22 });

  const particles = useParticles(48);
  const { nodes, links } = useNeuralNodes(10);

  const [sparkPoints, setSparkPoints] = useState('0,26 15,20 30,24 45,14 60,18 75,8 90,12 105,3');
  const [price, setPrice] = useState(HISTORY_SEED.price);

  useEffect(() => {
    const handleMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      parallaxX.set(relX * -14);
      parallaxY.set(relY * -14);
    };
    const node = sectionRef.current;
    node?.addEventListener('mousemove', handleMove);
    return () => node?.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY, parallaxX, parallaxY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => Math.max(90, Math.round(prev + randomBetween(-5, 5))));
      setSparkPoints((prev) => {
        const vals = prev.split(' ').map((p) => p.split(',').map(Number));
        const shifted = vals.slice(1).map((v, i) => [i * 15, v[1]]);
        const lastY = shifted[shifted.length - 1]?.[1] ?? 16;
        const newY = Math.min(34, Math.max(2, lastY + randomBetween(-6, 6)));
        shifted.push([105, newY]);
        return shifted.map(([x, y]) => `${x},${y}`).join(' ');
      });
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    cardRotateY.set(relX * 8);
    cardRotateX.set(-relY * 8);
  };
  const handleCardMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(190,60,110,0.10), transparent 72%)`
  );

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden bg-[#050506] pt-16">
      <style>{`
        @keyframes stw-ripple {
          from { width: 10px; height: 10px; opacity: 0.45; }
          to { width: 220px; height: 220px; margin-left: -105px; margin-top: -105px; opacity: 0; }
        }
        @keyframes stw-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        @keyframes stw-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(4px,-10px,0); opacity: calc(var(--stw-op) + 0.1); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-node-pulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.4; }
        }
        @keyframes stw-signal-pulse {
          0% { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes stw-breathe {
          0%, 100% { opacity: 0.28; transform: scale(1); }
          50% { opacity: 0.42; transform: scale(1.03); }
        }
      `}</style>

      {/* Layer 1 — deep ambient color wash (burgundy / violet / soft blue, controlled) */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: parallaxX, y: parallaxY }}>
        <motion.div
          className="absolute -left-32 -top-16 h-[34rem] w-[34rem] rounded-full bg-rose-900/25 blur-[130px]"
          animate={{ x: [0, 40, -10, 0], y: [0, 30, -15, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[-8rem] top-6 h-[32rem] w-[32rem] rounded-full bg-indigo-900/25 blur-[130px]"
          animate={{ x: [0, -35, 15, 0], y: [0, 35, -10, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-900/15 blur-[120px]"
          animate={{ x: [0, 25, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-sky-900/10 blur-[110px]" style={{ animation: 'stw-breathe 12s ease-in-out infinite' }} />
      </motion.div>

      {/* Layer 2 — subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-grid-drift 16s linear infinite',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 30%, transparent 85%)',
        }}
      />

      {/* Layer 3 — neural network, dimmed to a whisper */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {links.map((link) => (
          <line
            key={link.id}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke="url(#stwNeuralRefined)"
            strokeWidth="0.1"
            style={{ animation: `stw-node-pulse ${5 + link.delay}s ease-in-out ${link.delay}s infinite` }}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.35"
            fill="#e879a8"
            style={{ animation: `stw-node-pulse ${4 + node.delay}s ease-in-out ${node.delay}s infinite` }}
          />
        ))}
        <defs>
          <linearGradient id="stwNeuralRefined" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 4 — sparse particles / star field */}
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
              animation: `stw-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Layer 5 — fine grain */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025] mix-blend-overlay">
        <filter id="stwNoiseRefined">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stwNoiseRefined)" />
      </svg>

      {/* Layer 6 — mouse-reactive spotlight, very soft */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glowBackground }} />

      {/* ---------------------------------------------------------- */}
      {/* Content                                                     */}
      {/* ---------------------------------------------------------- */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-20 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* LEFT */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            Powered by Machine Learning
          </motion.div>

          {/* Refined typographic hierarchy */}
          <div className="mt-8">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
            >
              Airbnb Pricing
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-1 text-lg font-medium tracking-wide text-gray-500 sm:text-xl"
            >
              Powered by
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45 }}
              className="mt-2 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent drop-shadow-[0_0_36px_rgba(190,90,150,0.25)] sm:text-6xl lg:text-7xl"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Artificial Intelligence
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
          >
            A trained XGBoost model reads location, room type, and booking
            history to return an instant, accurate price — served through
            FastAPI and visualized in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MagneticButton
              as={NavLink}
              to="/predict"
              className="group gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(190,60,110,0.4)]"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              <HiOutlineSparkles className="h-4 w-4" />
              Get Prediction
              <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#features"
              className="gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/[0.06]"
            >
              Learn More
            </MagneticButton>
          </motion.div>
        </div>

        {/* RIGHT — refined prediction card */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ perspective: 1300 }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Ambient glow cast behind the card */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 via-fuchsia-500/5 to-indigo-500/10 blur-2xl" />

          <motion.div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8"
          >
            {/* inner glow + top reflection for glass depth */}
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -top-1/2 left-0 h-full w-full rotate-12 bg-gradient-to-b from-white/[0.05] to-transparent" />

            <div className="relative flex items-center justify-between border-b border-white/[0.06] pb-5">
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
              <HiOutlineChip className="h-4 w-4 text-gray-600" />
            </div>

            <div className="relative mt-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Estimated Price</p>
                <p className="mt-1.5 text-[2.5rem] font-bold leading-none text-white">
                  <AnimatedCounter to={price} prefix="$" delay={0.9} duration={1.2} />
                  <span className="text-base font-medium text-gray-500">/night</span>
                </p>
                <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500 lg:justify-start">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                  {HISTORY_SEED.location}
                </p>
              </div>
              <ConfidenceRing percentage={HISTORY_SEED.confidence} />
            </div>

            <div className="relative mt-7 space-y-4">
              <MetricBar label="Model Confidence" percentage={97} delay={1.05} />
              <MetricBar label="Data Match Quality" percentage={89} delay={1.2} />
            </div>

            <div className="relative mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between text-[10px] font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <HiOutlineSignal className="h-3 w-3 text-rose-400/70" />
                  Live Activity
                </span>
                <span className="text-emerald-400/80">Streaming</span>
              </div>
              <div className="mt-2">
                <Sparkline points={sparkPoints} />
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5 text-center">
              <div>
                <p className="text-sm font-semibold text-white">XGBoost</p>
                <p className="mt-0.5 text-[10px] text-gray-600">Model</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12</p>
                <p className="mt-0.5 text-[10px] text-gray-600">Features</p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-sm font-semibold text-white">
                  <HiOutlineLightningBolt className="h-3 w-3 text-rose-400/70" />
                  <AnimatedCounter to={0.18} decimals={2} delay={0.3} duration={0.9} suffix="s" />
                </p>
                <p className="mt-0.5 text-[10px] text-gray-600">Runtime</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute h-full w-full rounded-full border border-rose-400/25" style={{ animation: 'stw-signal-pulse 2.6s ease-out infinite' }} />
          <span className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-indigo-400" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">Scroll to Explore</span>
      </motion.div>
    </section>
  );
}

export default HeroSection;