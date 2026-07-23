import { useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  HiOutlineCpuChip,
  HiOutlineBoltSlash,
  HiOutlineCircleStack,
  HiOutlineChartBarSquare,
  HiOutlineSquares2X2,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { SiReact, SiTailwindcss, SiFastapi, SiPython } from 'react-icons/si';
import { TbBrandPython } from 'react-icons/tb';

/* ============================================================== */
/* Constants                                                        */
/* ============================================================== */

const FEATURES = [
  {
    id: 'ai-prediction',
    icon: HiOutlineCpuChip,
    title: 'AI-Powered Prediction',
    description:
      'Uses an XGBoost regression model trained on Airbnb market data to estimate property prices with high accuracy.',
  },
  {
    id: 'instant-predictions',
    icon: HiOutlineBoltSlash,
    title: 'Instant Predictions',
    description:
      'FastAPI backend delivers predictions in under 0.2 seconds with low latency.',
  },
  {
    id: 'rich-dataset',
    icon: HiOutlineCircleStack,
    title: 'Rich Airbnb Dataset',
    description:
      'Built using over 50,000 Airbnb listings with location, room type, reviews, and availability data.',
  },
  {
    id: 'interactive-dashboard',
    icon: HiOutlineChartBarSquare,
    title: 'Interactive Dashboard',
    description:
      'Explore prediction history, confidence scores, and visual analytics through a modern dashboard.',
  },
  {
    id: 'full-stack',
    icon: HiOutlineSquares2X2,
    title: 'Full-Stack Architecture',
    description:
      'Built using React, Tailwind CSS, FastAPI, Python, and XGBoost following production-ready architecture.',
  },
  {
    id: 'clean-ux',
    icon: HiOutlineSparkles,
    title: 'Clean User Experience',
    description:
      'Modern responsive interface with beautiful animations, glassmorphism, and smooth interactions.',
  },
];

const TECH_BADGES = [
  { label: 'React', icon: SiReact },
  { label: 'Tailwind CSS', icon: SiTailwindcss },
  { label: 'FastAPI', icon: SiFastapi },
  { label: 'Python', icon: SiPython },
  { label: 'XGBoost', icon: TbBrandPython },
  { label: 'Framer Motion', icon: HiOutlineSparkles },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================================================== */
/* Feature Card — with cursor spotlight, breathing glow, float      */
/* ============================================================== */

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  const cardRef = useRef(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const springX = useSpring(spotX, { stiffness: 150, damping: 20 });
  const springY = useSpring(spotY, { stiffness: 150, damping: 20 });

  const spotlightBg = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(280px circle at ${x}% ${y}%, rgba(244,63,150,0.14), transparent 70%)`
  );

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:border-rose-400/25 hover:shadow-[0_24px_70px_rgba(190,60,110,0.22)] sm:p-8"
      style={{ animation: `stw-feat-float ${6 + (index % 3)}s ease-in-out ${index * 0.3}s infinite` }}
    >
      {/* cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />

      {/* animated gradient border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.3), 0 0 36px rgba(190,60,110,0.16)' }}
      />

      {/* slow breathing ambient glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-rose-500/12 to-indigo-500/12 blur-2xl"
        style={{ animation: 'stw-feat-breathe 5s ease-in-out infinite' }}
      />

      {/* top glass reflection */}
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      {/* background shimmer sweep on hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          style={{ animation: 'stw-feat-shimmer-sweep 2.4s ease-in-out infinite' }}
        />
      </div>

      <motion.div
        whileHover={{ rotate: 14, scale: 1.12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] transition-colors duration-500 group-hover:border-rose-400/30"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/10 to-indigo-500/10 transition-opacity duration-500 group-hover:opacity-150" />
        <Icon className="relative h-6 w-6 text-rose-300 transition-colors duration-500 group-hover:text-rose-200" />
      </motion.div>

      <h3 className="relative mt-6 text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">
        {feature.title}
      </h3>

      <p className="relative mt-3 text-sm leading-[1.7] text-gray-400 sm:text-[15px]">
        {feature.description}
      </p>
    </motion.div>
  );
}

/* ============================================================== */
/* Tech strip badge                                                 */
/* ============================================================== */

function TechBadge({ label, icon: Icon, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.05 }}
      className="group relative flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300 backdrop-blur-md transition-all duration-500 hover:border-rose-400/30 hover:text-white"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(circle, rgba(244,63,150,0.18), transparent 70%)' }} />
      <Icon className="relative h-3.5 w-3.5 text-rose-400" />
      <span className="relative">{label}</span>
    </motion.span>
  );
}

/* ============================================================== */
/* Features Section                                                 */
/* ============================================================== */

function FeaturesSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
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

  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 84 + 8,
        y: Math.random() * 84 + 8,
        delay: Math.random() * 5,
      })),
    []
  );

  const links = useMemo(
    () => nodes.map((node, i) => ({ id: `${node.id}-link`, a: node, b: nodes[(i + 1) % nodes.length], delay: Math.random() * 6 })),
    [nodes]
  );

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-feat-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-feat-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-feat-node-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }
        @keyframes stw-feat-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-feat-breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes stw-feat-shimmer-sweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(340%); }
        }
        @keyframes stw-feat-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
      `}</style>

      {/* Background — large blurred blobs, very slow drift */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute right-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-feat-blob-drift 26s ease-in-out infinite' }}
        />
        <div
          className="absolute left-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-feat-blob-drift 30s ease-in-out infinite reverse' }}
        />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-900/10 blur-[110px]" />
      </div>

      {/* Subtle moving grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-feat-grid-drift 20s linear infinite',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

      {/* Thin neural-network connecting lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {links.map((link) => (
          <line
            key={link.id}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke="url(#stwFeatNeural)"
            strokeWidth="0.08"
            style={{ animation: `stw-feat-node-pulse ${5.5 + link.delay}s ease-in-out ${link.delay}s infinite` }}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.3"
            fill="#e879a8"
            style={{ animation: `stw-feat-node-pulse ${4 + node.delay}s ease-in-out ${node.delay}s infinite` }}
          />
        ))}
        <defs>
          <linearGradient id="stwFeatNeural" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tiny glowing particles / floating dots */}
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
              animation: `stw-feat-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Noise texture */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02] mix-blend-overlay">
        <filter id="stwFeatNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stwFeatNoise)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
          >
            <HiOutlineSparkles className="h-3.5 w-3.5 text-rose-400" />
            Why Choose StayWise AI
          </motion.div>

          <div className="mt-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
            >
              Everything You Need for
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-1 text-3xl font-bold leading-[1.2] tracking-[-0.01em] sm:text-4xl lg:text-5xl"
            >
              <span
                className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{ animation: 'stw-shimmer 6s linear infinite' }}
              >
                Intelligent
              </span>{' '}
              <span className="text-white">Airbnb Prediction</span>
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.65, delay: 0.36 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            StayWise AI combines machine learning, FastAPI, and modern web
            technologies to produce highly accurate Airbnb price predictions.
          </motion.p>
        </div>

        {/* Feature grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Technology strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {TECH_BADGES.map((badge, index) => (
            <TechBadge key={badge.label} label={badge.label} icon={badge.icon} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;