import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineCpuChip,
  HiOutlineBoltSlash,
} from 'react-icons/hi2';
import {
  HiOutlineLocationMarker,
  HiOutlineLightningBolt,
  HiOutlineChip,
} from 'react-icons/hi';
import { SiReact, SiFastapi, SiPython } from 'react-icons/si';
import { TbBrandPython } from 'react-icons/tb';

const AI_LINE_ONE = 'Predict Airbnb Prices';
const AI_LINE_TWO = ['with', 'Artificial', 'Intelligence'];

const TECH_CHIPS = [
  { label: 'React', icon: SiReact },
  { label: 'FastAPI', icon: SiFastapi },
  { label: 'XGBoost', icon: TbBrandPython },
  { label: 'Python', icon: SiPython },
  { label: 'Machine Learning', icon: HiOutlineCpuChip },
];

const HISTORY_SEED = [
  { id: 1, location: 'Downtown Loft', price: 184, confidence: 96.8 },
  { id: 2, location: 'Beachside Villa', price: 312, confidence: 94.1 },
  { id: 3, location: 'Studio Midtown', price: 96, confidence: 91.4 },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function useParticles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: randomBetween(1, 4),
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        duration: randomBetween(6, 20),
        delay: randomBetween(0, 8),
        blur: Math.random() > 0.7,
        opacity: randomBetween(0.2, 0.8),
      })),
    [count]
  );
}

function useNeuralNodes(count) {
  return useMemo(() => {
    const nodes = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: randomBetween(5, 95),
      y: randomBetween(5, 95),
      r: randomBetween(1.5, 3),
      delay: randomBetween(0, 4),
    }));
    const links = [];
    nodes.forEach((node, i) => {
      const next = nodes[(i + 1) % nodes.length];
      const skip = nodes[(i + 3) % nodes.length];
      links.push({ id: `${node.id}-${next.id}`, a: node, b: next, delay: randomBetween(0, 5) });
      if (i % 2 === 0) {
        links.push({ id: `${node.id}-${skip.id}`, a: node, b: skip, delay: randomBetween(0, 5) });
      }
    });
    return { nodes, links };
  }, [count]);
}

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

function ConfidenceRing({ percentage = 96.8, size = 88, stroke = 7 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#stwRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="stwRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-white">
          <AnimatedCounter to={percentage} decimals={1} delay={0.5} duration={1.3} />%
        </span>
        <span className="text-[9px] uppercase tracking-widest text-gray-500">Confidence</span>
      </div>
    </div>
  );
}

function MetricBar({ label, percentage, delay = 0, color = 'from-rose-400 to-indigo-400' }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] text-gray-400">
        <span>{label}</span>
        <span className="text-gray-300">{percentage}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function Sparkline({ points }) {
  return (
    <svg viewBox="0 0 110 40" className="h-10 w-full overflow-visible">
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#stwSpark)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="stwSpark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NeuralHeatmap() {
  const cells = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  return (
    <div className="grid grid-cols-8 gap-1">
      {cells.map((i) => (
        <span
          key={i}
          className="stw-heat-cell block h-2 w-2 rounded-sm bg-gradient-to-br from-rose-400 to-indigo-400"
          style={{ animationDelay: `${(i % 8) * 0.15 + Math.floor(i / 8) * 0.1}s` }}
        />
      ))}
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
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
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
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
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
            className="pointer-events-none absolute rounded-full bg-white/30"
            style={{ left: r.x, top: r.y, width: 12, height: 12, transform: 'translate(-50%, -50%)', animation: 'stw-ripple 0.65s ease-out forwards' }}
          />
        ))}
      </Component>
    </motion.div>
  );
}

function HeroSection() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const parallaxX = useSpring(0, { stiffness: 40, damping: 20 });
  const parallaxY = useSpring(0, { stiffness: 40, damping: 20 });

  const cardRotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const cardRotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const particles = useParticles(140);
  const { nodes, links } = useNeuralNodes(18);

  const [history, setHistory] = useState(HISTORY_SEED);
  const [sparkPoints, setSparkPoints] = useState('0,30 15,24 30,28 45,16 60,20 75,8 90,14 105,4');
  const [metrics, setMetrics] = useState({ gpu: 82, cpu: 47, ram: 63, inference: 0.18 });

  useEffect(() => {
    const handleMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      parallaxX.set(relX * -20);
      parallaxY.set(relY * -20);
    };
    const node = sectionRef.current;
    node?.addEventListener('mousemove', handleMove);
    return () => node?.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY, parallaxX, parallaxY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) =>
        prev.map((item) => ({
          ...item,
          price: Math.max(60, Math.round(item.price + randomBetween(-6, 6))),
          confidence: Math.min(99.9, Math.max(88, +(item.confidence + randomBetween(-0.6, 0.6)).toFixed(1))),
        }))
      );
      setSparkPoints((prev) => {
        const vals = prev.split(' ').map((p) => p.split(',').map(Number));
        const shifted = vals.slice(1).map((v, i) => [i * 15, v[1]]);
        const lastY = shifted[shifted.length - 1]?.[1] ?? 20;
        const newY = Math.min(38, Math.max(2, lastY + randomBetween(-8, 8)));
        shifted.push([105, newY]);
        return shifted.map(([x, y]) => `${x},${y}`).join(' ');
      });
      setMetrics((prev) => ({
        gpu: Math.min(98, Math.max(40, Math.round(prev.gpu + randomBetween(-5, 5)))),
        cpu: Math.min(90, Math.max(20, Math.round(prev.cpu + randomBetween(-5, 5)))),
        ram: Math.min(95, Math.max(30, Math.round(prev.ram + randomBetween(-5, 5)))),
        inference: +Math.min(0.4, Math.max(0.08, prev.inference + randomBetween(-0.03, 0.03))).toFixed(2),
      }));
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    cardRotateY.set(relX * 14);
    cardRotateX.set(-relY * 14);
  };

  const handleCardMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const glowBackground = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, rgba(244,63,94,0.14), transparent 70%)`);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden bg-black pt-16">
      <style>{`
        @keyframes stw-ripple {
          from { width: 12px; height: 12px; opacity: 0.5; }
          to { width: 240px; height: 240px; margin-left: -112px; margin-top: -112px; opacity: 0; }
        }
        @keyframes stw-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 80px 80px; }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        @keyframes stw-outline-pulse {
          0%, 100% { -webkit-text-stroke: 1.5px rgba(255,255,255,0.7); color: transparent; }
          50% { -webkit-text-stroke: 1.5px rgba(244,63,94,0.9); color: transparent; }
        }
        @keyframes stw-particle-float {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(6px,-16px,0); opacity: calc(var(--stw-op) + 0.15); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-heat-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.9; transform: scale(1); }
        }
        .stw-heat-cell {
          animation: stw-heat-pulse 2.4s ease-in-out infinite;
        }
        @keyframes stw-ray-sweep {
          0% { transform: translateX(-30%) rotate(8deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(130%) rotate(8deg); opacity: 0; }
        }
        @keyframes stw-node-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <motion.div className="pointer-events-none absolute inset-0" style={{ x: parallaxX, y: parallaxY }}>
        <motion.div
          className="absolute -left-40 -top-24 h-[36rem] w-[36rem] rounded-full bg-rose-500/25 blur-[110px]"
          animate={{ x: [0, 70, -20, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[-10rem] top-0 h-[40rem] w-[40rem] rounded-full bg-indigo-500/25 blur-[120px]"
          animate={{ x: [0, -60, 30, 0], y: [0, 60, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/20 blur-[110px]"
          animate={{ x: [0, 50, -40, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]"
          animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(1200px circle at 20% 30%, rgba(244,63,94,0.08), transparent 60%), radial-gradient(1000px circle at 80% 70%, rgba(129,140,248,0.08), transparent 60%)' }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          animation: 'stw-grid-drift 12s linear infinite',
          maskImage: 'radial-gradient(ellipse 65% 65% at 50% 40%, black 40%, transparent 90%)',
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
              filter: p.blur ? 'blur(1px)' : 'none',
              boxShadow: p.size > 2.5 ? '0 0 6px rgba(255,255,255,0.6)' : 'none',
              '--stw-op': p.opacity,
              opacity: p.opacity,
              animation: `stw-particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
        {links.map((link) => (
          <line
            key={link.id}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke="url(#stwNeural)"
            strokeWidth="0.15"
            style={{ animation: `stw-node-pulse ${4 + link.delay}s ease-in-out ${link.delay}s infinite` }}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.r * 0.25}
            fill="#f472b6"
            style={{ animation: `stw-node-pulse ${3 + node.delay}s ease-in-out ${node.delay}s infinite` }}
          />
        ))}
        <defs>
          <linearGradient id="stwNeural" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full border border-white/10 opacity-30 backdrop-blur-sm" />
      <div className="pointer-events-none absolute right-1/5 bottom-1/4 h-56 w-56 rounded-full border border-white/10 opacity-20 backdrop-blur-sm" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-20%] top-1/4 h-24 w-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: 'stw-ray-sweep 9s linear infinite' }}
        />
        <div
          className="absolute left-[-20%] top-2/3 h-16 w-[50%] bg-gradient-to-r from-transparent via-rose-300/10 to-transparent"
          style={{ animation: 'stw-ray-sweep 13s linear 3s infinite' }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03] mix-blend-overlay">
        <filter id="stwNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stwNoise)" />
      </svg>

      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glowBackground }} />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
            </span>
            Powered by AI
          </motion.div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="block"
            >
              <span
                className="inline-block"
                style={{ animation: 'stw-outline-pulse 3s ease-in-out infinite' }}
              >
                Predict
              </span>{' '}
              <span className="text-white">Airbnb Prices</span>
            </motion.span>
            <span className="mt-1 flex flex-wrap items-baseline justify-center gap-x-3 lg:justify-start">
              {AI_LINE_TWO.map((word, i) => {
                if (word === 'with') {
                  return (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-white"
                    >
                      {word}
                    </motion.span>
                  );
                }
                if (word === 'Artificial') {
                  return (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-gradient-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(244,63,94,0.55)]"
                    >
                      {word}
                    </motion.span>
                  );
                }
                return (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-rose-300 bg-[length:200%_auto] bg-clip-text text-transparent"
                    style={{ animation: 'stw-shimmer 4s linear infinite' }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
          >
            StayWise AI blends a trained XGBoost regression model with real Airbnb
            listing data to deliver instant, accurate pricing predictions — served
            through FastAPI and visualized with live, ever-updating analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MagneticButton
              as={NavLink}
              to="/predict"
              className="group gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-shadow duration-300 hover:shadow-rose-500/50"
              style={{ animation: 'stw-shimmer 5s linear infinite' }}
            >
              <HiOutlineSparkles className="h-4 w-4" />
              Get Prediction
              <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#features"
              className="gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10 hover:backdrop-blur-xl"
            >
              Learn More
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {TECH_CHIPS.map(({ label, icon: Icon }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -4, 0] }}
                transition={{
                  opacity: { duration: 0.4, delay: 1 + i * 0.08 },
                  y: { duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
                }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md transition-colors duration-200 hover:border-rose-400/30 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5 text-rose-400" />
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ perspective: 1200 }}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/10 via-transparent to-indigo-500/10"
              style={{ backgroundSize: '200% 200%', animation: 'stw-shimmer 6s linear infinite' }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent" />

            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Prediction Engine</p>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400">Online</p>
                </div>
              </div>
              <HiOutlineChip className="h-4 w-4 text-gray-500" />
            </div>

            <div className="relative mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Live Price Prediction</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  <AnimatedCounter to={history[0].price} prefix="$" delay={0.6} duration={1.2} />
                  <span className="text-sm font-medium text-gray-400">/night</span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                  {history[0].location}
                </p>
              </div>
              <ConfidenceRing percentage={history[0].confidence} />
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              <MetricBar label="GPU" percentage={metrics.gpu} delay={0.7} />
              <MetricBar label="CPU" percentage={metrics.cpu} delay={0.8} color="from-indigo-400 to-blue-400" />
              <MetricBar label="RAM" percentage={metrics.ram} delay={0.9} color="from-fuchsia-400 to-rose-400" />
            </div>
            <p className="relative mt-3 flex items-center gap-1.5 text-[10px] text-gray-500">
              <HiOutlineLightningBolt className="h-3.5 w-3.5 text-rose-400" />
              Inference time: {metrics.inference.toFixed(2)}s
            </p>

            <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Live Activity</span>
                <span className="text-emerald-400">Streaming</span>
              </div>
              <div className="mt-2">
                <Sparkline points={sparkPoints} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
                <span>Neural Activity</span>
              </div>
              <div className="mt-2">
                <NeuralHeatmap />
              </div>
            </div>

            <div className="relative mt-5 space-y-2 border-t border-white/10 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Prediction History</p>
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span className="text-xs text-gray-300">{item.location}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-white">${item.price}</span>
                    <span className="text-emerald-400">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-center">
              <div>
                <p className="text-sm font-semibold text-white">XGBoost</p>
                <p className="text-[10px] text-gray-500">Model</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  <AnimatedCounter to={metrics.inference} decimals={2} delay={0.2} duration={0.8} suffix="s" />
                </p>
                <p className="text-[10px] text-gray-500">Runtime</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-4 top-6 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-black/40 backdrop-blur-xl sm:flex"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <HiOutlineBoltSlash className="h-3.5 w-3.5 text-rose-400" />
            Realtime
          </motion.div>
          <motion.div
            className="absolute -left-4 bottom-12 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-black/40 backdrop-blur-xl sm:flex"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <HiOutlineCpuChip className="h-3.5 w-3.5 text-indigo-400" />
            Neural Core
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <div className="relative flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1">
          <div className="absolute inset-0 rounded-full shadow-[0_0_14px_rgba(244,63,94,0.35)]" />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-indigo-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[11px] uppercase tracking-widest text-gray-500">Explore AI</span>
      </motion.div>
    </section>
  );
}

export default HeroSection;