import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineChevronDown,
} from 'react-icons/hi2';
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineDatabase,
  HiOutlineCube,
} from 'react-icons/hi';

const INFO_ITEMS = [
  { label: 'Accuracy', value: '94.6%', icon: HiOutlineChartBar },
  { label: 'FastAPI', value: 'Backend', icon: HiOutlineLightningBolt },
  { label: 'Machine Learning', value: 'XGBoost', icon: HiOutlineCube },
  { label: 'Airbnb Dataset', value: '50K+ Listings', icon: HiOutlineDatabase },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-indigo-950/40" />

      {/* Animated floating blobs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left column */}
        <div className="text-center lg:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md"
          >
            <HiOutlineSparkles className="h-3.5 w-3.5 text-rose-400" />
            Powered by Machine Learning
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Predict Airbnb Prices{' '}
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              with AI
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
          >
            StayWise AI uses a trained XGBoost regression model to estimate
            fair Airbnb pricing from location, room type, availability and
            review data — instantly, accurately, and beautifully visualized.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <NavLink
                to="/predict"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-shadow duration-300 hover:shadow-rose-500/40 sm:w-auto"
              >
                Get Prediction
                <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              
                href="#features"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10 sm:w-auto"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right column - glass info card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          whileHover={{ y: -6 }}
          className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/10 via-transparent to-indigo-500/10" />

          <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-indigo-500">
              <HiOutlineSparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Model Overview</p>
              <p className="text-xs text-gray-400">Live prediction engine</p>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-4">
            {INFO_ITEMS.map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 hover:border-rose-400/30 hover:bg-white/10"
              >
                <Icon className="h-5 w-5 text-rose-400" />
                <p className="mt-3 text-lg font-semibold text-white">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;