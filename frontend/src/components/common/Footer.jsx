import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiGithub, FiMail, FiLinkedin } from 'react-icons/fi';
import {
  SiReact,
  SiFastapi,
  SiTailwindcss,
} from 'react-icons/si';
import { TbBrandPython } from 'react-icons/tb';

const QUICK_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Predict', path: '/predict' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'History', path: '/history' },
];

const TECHNOLOGIES = [
  { label: 'React', icon: SiReact },
  { label: 'FastAPI', icon: SiFastapi },
  { label: 'XGBoost', icon: TbBrandPython },
  { label: 'Tailwind CSS', icon: SiTailwindcss },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ayushpalse01012023-byte', icon: FiGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: FiLinkedin },
  { label: 'Email', href: 'mailto:ayushpalse01012023@gmail.com', icon: FiMail },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            className="lg:col-span-1"
          >
            <NavLink to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-500 shadow-md shadow-rose-500/30">
                <HiOutlineSparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                StayWise{' '}
                <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </NavLink>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Intelligent Airbnb price prediction powered by machine learning.
              Predict smarter, stay better.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.1}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className="group inline-flex items-center text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="relative">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-rose-400 to-indigo-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.2}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Technologies Used
            </h3>
            <ul className="mt-4 space-y-3">
              {TECHNOLOGIES.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <span className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white">
                    <Icon className="h-4 w-4 text-gray-500 transition-colors duration-200 group-hover:text-rose-400" />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.3}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Connect
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Questions, feedback, or collaboration ideas? Reach out or check
              out the source.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors duration-200 hover:border-rose-400/40 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {year} StayWise AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Designed &amp; Developed by{' '}
            <motion.a
              href="https://github.com/ayushpalse01012023-byte"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text font-semibold text-transparent transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            >
              Ayush Palse
            </motion.a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;