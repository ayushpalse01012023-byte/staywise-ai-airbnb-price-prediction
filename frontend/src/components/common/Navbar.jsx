import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineClock, HiOutlineSparkles } from 'react-icons/hi2';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const NAV_LINKS = [
  { label: 'Home', path: '/', icon: HiOutlineHome },
  { label: 'Predict', path: '/predict', icon: HiOutlineSparkles },
  { label: 'Dashboard', path: '/dashboard', icon: HiOutlineChartBar },
  { label: 'History', path: '/history', icon: HiOutlineClock },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-black/60 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'border-b border-transparent bg-black/20 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <motion.div
            whileHover={{ rotate: 12, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-500 shadow-md shadow-rose-500/30"
          >
            <HiOutlineSparkles className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-lg font-semibold tracking-tight text-white">
            StayWise <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <motion.div className="hidden md:block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <NavLink
              to="/predict"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-shadow duration-300 hover:shadow-rose-500/40"
            >
              <HiOutlineSparkles className="h-4 w-4" />
              Get Prediction
            </NavLink>
          </motion.div>

          <button
            type="button"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineX className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineMenu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ label, path, icon: Icon }, index) => (
                <motion.div
                  key={path}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                >
                  <NavLink
                    to={path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.25 }}
                className="mt-2"
              >
                <NavLink
                  to="/predict"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25"
                >
                  <HiOutlineSparkles className="h-4 w-4" />
                  Get Prediction
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;