import { useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineChartBarSquare,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2';

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

function NotFoundPage() {
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
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(190,60,110,0.1), transparent 72%)`
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050506] px-4 py-24 sm:px-6 lg:px-8"
    >
      <style>{`
        @keyframes stw-404-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-404-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-404-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-404-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        @keyframes stw-ripple {
          from { width: 10px; height: 10px; opacity: 0.4; }
          to { width: 220px; height: 220px; margin-left: -105px; margin-top: -105px; opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 -top-16 h-[30rem] w-[30rem] rounded-full bg-rose-900/20 blur-[130px]"
          style={{ animation: 'stw-404-blob-drift 26s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-indigo-900/20 blur-[130px]"
          style={{ animation: 'stw-404-blob-drift 30s ease-in-out infinite reverse' }}
        />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-900/10 blur-[110px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-404-grid-drift 18s linear infinite',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 30%, transparent 85%)',
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
              animation: `stw-404-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glowBackground }} />

      <div className="relative mx-auto w-full max-w-2xl">
        <div style={{ animation: 'stw-404-float 6s ease-in-out infinite' }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:px-14 sm:py-16"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-indigo-400/[0.1] blur-2xl" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/70 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
              </span>
              Page Not Found
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="relative mt-6 bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-7xl font-bold leading-none tracking-[-0.02em] text-transparent drop-shadow-[0_0_40px_rgba(190,90,150,0.3)] sm:text-8xl"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              404
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative mt-6 text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-white sm:text-3xl"
            >
              Oops! This Page Doesn&apos;t Exist
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative mx-auto mt-4 max-w-md text-sm leading-[1.75] text-gray-400 sm:text-base"
            >
              The page you&apos;re looking for may have been moved, deleted,
              or the URL is incorrect.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-full sm:w-auto">
                <Link
                  to="/"
                  className="group relative isolate flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_10px_46px_rgba(190,60,110,0.42)] sm:w-auto"
                  style={{ animation: 'stw-shimmer 6s linear infinite' }}
                >
                  <HiOutlineHome className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
                  Go Back Home
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-full sm:w-auto">
                <Link
                  to="/predict"
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06] sm:w-auto"
                >
                  <HiOutlineSparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
                  Start Prediction
                  <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              whileHover={{ y: -4 }}
              className="group relative mt-10 overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 text-left transition-shadow duration-500 hover:shadow-[0_16px_50px_rgba(190,60,110,0.14)] sm:p-7"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-indigo-500/10 blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start gap-3">
                <motion.span
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
                >
                  <HiOutlineQuestionMarkCircle className="h-5 w-5 text-rose-300" />
                </motion.span>
                <div>
                  <p className="text-sm font-semibold text-white">Need Help?</p>
                  <p className="mt-1.5 text-xs leading-[1.7] text-gray-400">
                    You can always return to the homepage, start a new Airbnb
                    price prediction, or explore your dashboard.
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex flex-wrap gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors duration-300 hover:border-rose-400/25 hover:text-white"
                >
                  <HiOutlineChartBarSquare className="h-3.5 w-3.5 text-rose-400" />
                  View Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;