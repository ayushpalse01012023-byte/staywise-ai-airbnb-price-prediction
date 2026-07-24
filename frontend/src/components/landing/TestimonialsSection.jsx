import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheckBadge, HiOutlineStar } from 'react-icons/hi2';

const TESTIMONIALS = [
  {
    id: 'host',
    name: 'Amara Fields',
    role: 'Host',
    quote: 'This gives surprisingly accurate Airbnb price estimates.',
    initials: 'AF',
  },
  {
    id: 'analyst',
    name: 'Daniel Cho',
    role: 'Data Analyst',
    quote: 'The interface feels like a premium AI product.',
    initials: 'DC',
  },
  {
    id: 'developer',
    name: 'Priya Nair',
    role: 'Developer',
    quote: 'Fast, responsive and beautifully engineered.',
    initials: 'PN',
  },
  {
    id: 'traveler',
    name: 'Lucas Bennett',
    role: 'Traveler',
    quote: 'Love how intuitive the dashboard feels.',
    initials: 'LB',
  },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function StarRow() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.4 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="relative"
        >
          <HiOutlineStar
            className="h-4 w-4 fill-rose-300 text-rose-300"
            style={{ filter: 'drop-shadow(0 0 4px rgba(244,63,150,0.5))' }}
          />
        </motion.span>
      ))}
    </div>
  );
}

function Avatar({ initials, index }) {
  return (
    <motion.div
      whileHover={{ rotate: 6, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15 }}
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br from-rose-500/25 via-fuchsia-500/20 to-indigo-500/25 text-sm font-semibold text-white"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent" />
      <span className="relative">{initials}</span>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 16px rgba(190,60,110,0.25)',
          animation: `stw-avatar-breathe ${4 + (index % 3)}s ease-in-out infinite`,
        }}
      />
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_22px_65px_rgba(190,60,110,0.2)] sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(244,63,150,0.35), rgba(129,140,248,0.35))',
          padding: 1,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-3">
        <Avatar initials={testimonial.initials} index={index} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-white">{testimonial.name}</p>
            <HiOutlineCheckBadge
              className="h-4 w-4 shrink-0 text-indigo-300"
              style={{ filter: 'drop-shadow(0 0 3px rgba(129,140,248,0.5))' }}
            />
          </div>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>

      <div className="relative mt-4">
        <StarRow />
      </div>

      <p className="relative mt-4 text-sm leading-[1.75] text-gray-300 sm:text-[15px]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </motion.div>
  );
}

function TestimonialsSection() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
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
        @keyframes stw-testi-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-testi-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-testi-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-avatar-breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-testi-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-testi-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-testi-grid-drift 18s linear infinite',
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
              animation: `stw-testi-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
            Trusted by{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              AI Enthusiasts
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            See what people think about the StayWise AI experience.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;