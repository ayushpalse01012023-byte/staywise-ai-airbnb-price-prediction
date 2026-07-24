import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiReactrouter,
  SiTailwindcss,
  SiFastapi,
  SiPython,
  SiGit,
  SiGithub,
  SiVite,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiVisualStudioCode,
} from 'react-icons/si';
import {
  HiOutlineSparkles,
  HiOutlineServerStack,
  HiOutlineCube,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
} from 'react-icons/hi2';

const CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'React', icon: SiReact },
      { name: 'React Router', icon: SiReactrouter },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Framer Motion', icon: HiOutlineSparkles },
      { name: 'React Icons', icon: HiOutlineCube },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Python', icon: SiPython },
      { name: 'Uvicorn', icon: HiOutlineServerStack },
      { name: 'REST API', icon: HiOutlineCircleStack },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    items: [
      { name: 'XGBoost', icon: HiOutlineCpuChip },
      { name: 'Scikit-Learn', icon: SiScikitlearn },
      { name: 'Pandas', icon: SiPandas },
      { name: 'NumPy', icon: SiNumpy },
      { name: 'Joblib', icon: HiOutlineCube },
    ],
  },
  {
    id: 'dev',
    title: 'Development',
    items: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'VS Code', icon: SiVisualstudiocode },
      { name: 'Vite', icon: SiVite },
    ],
  },
];

const PIPELINE_STAGES = [
  'Dataset',
  'Pandas',
  'Feature Engineering',
  'XGBoost',
  'FastAPI',
  'React',
  'Prediction',
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const chipVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function TechChip({ tech, index }) {
  const Icon = tech.icon;

  return (
    <motion.div
      variants={chipVariants}
      whileHover={{ y: -4, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 backdrop-blur-md transition-colors duration-400 hover:border-rose-400/25"
      style={{ animation: `stw-tech-chip-float ${5 + (index % 3)}s ease-in-out ${index * 0.25}s infinite` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 22px rgba(190,60,110,0.14)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

      <motion.span
        whileHover={{ rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]"
      >
        <Icon className="h-3.5 w-3.5 text-rose-300" />
      </motion.span>
      <span className="relative text-xs font-medium text-gray-300 transition-colors duration-400 group-hover:text-white">
        {tech.name}
      </span>
    </motion.div>
  );
}

function CategoryPanel({ category, panelIndex }) {
  return (
    <motion.div
      variants={categoryVariants}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.16)] sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl" />

      <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
        {category.title}
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mt-4 flex flex-wrap gap-2.5"
      >
        {category.items.map((tech, index) => (
          <TechChip key={tech.name} tech={tech} index={panelIndex * 5 + index} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function PipelineStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7 }}
      className="relative mb-16 overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] px-4 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-7"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

      <div className="relative flex flex-col gap-3 overflow-x-auto sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-3 sm:contents">
            <div className="flex shrink-0 items-center sm:flex-1">
              <span className="whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-gray-300">
                {stage}
              </span>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="relative mx-2 hidden h-px w-10 shrink-0 bg-white/[0.08] sm:block lg:w-full">
                  <motion.span
                    className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-300 to-indigo-300"
                    style={{ boxShadow: '0 0 8px rgba(244,63,150,0.7)' }}
                    animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                  />
                </div>
              )}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className="relative flex h-6 items-center justify-center sm:hidden">
                <div className="h-full w-px bg-white/[0.08]" />
                <motion.span
                  className="absolute top-0 h-1.5 w-1.5 rounded-full bg-gradient-to-b from-rose-300 to-indigo-300"
                  style={{ boxShadow: '0 0 8px rgba(244,63,150,0.7)' }}
                  animate={{ y: [0, 24, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TechStackSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        size: randomBetween(1, 2.4),
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        duration: randomBetween(14, 28),
        delay: randomBetween(0, 12),
        opacity: randomBetween(0.06, 0.26),
      })),
    []
  );

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-tech-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-tech-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-tech-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-tech-chip-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-tech-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-tech-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-tech-grid-drift 18s linear infinite',
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
              animation: `stw-tech-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Built With{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Modern Technologies
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            StayWise AI combines modern frontend development, machine
            learning, backend APIs, and data science tools into one
            production-ready application.
          </motion.p>
        </div>

        <div className="mt-16">
          <PipelineStrip />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6"
          >
            {CATEGORIES.map((category, index) => (
              <CategoryPanel key={category.id} category={category} panelIndex={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TechStackSection;