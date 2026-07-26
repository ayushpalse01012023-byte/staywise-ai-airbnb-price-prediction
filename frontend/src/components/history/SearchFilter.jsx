import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineArrowPath,
  HiOutlineSparkles,
  HiOutlineChartBarSquare,
} from 'react-icons/hi2';

const ROOM_TYPE_OPTIONS = ['All Room Types', 'Entire home/apt', 'Private room', 'Shared room'];
const PRICE_RANGE_OPTIONS = ['All Prices', 'Below $100', '$100 - $200', 'Above $200'];
const DATE_OPTIONS = ['Today', 'Last 7 Days', 'Last Month', 'All Time'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function FilterSelect({ options, defaultValue }) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`group relative flex w-full items-center gap-2.5 rounded-2xl border bg-white/[0.02] px-4 py-3.5 backdrop-blur-md transition-colors duration-400 sm:w-auto ${
        focused ? 'border-rose-400/40' : 'border-white/[0.08] hover:border-white/[0.14]'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400"
        style={{
          opacity: focused ? 1 : 0,
          boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 22px rgba(129,140,248,0.18)',
        }}
      />
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full min-w-[9rem] cursor-pointer appearance-none bg-transparent text-sm font-medium text-white outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0a0a0c] text-white">
            {opt}
          </option>
        ))}
      </select>
      <HiOutlineChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 peer-focus:rotate-180" />
    </div>
  );
}

function SearchFilter() {
  const [focused, setFocused] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <style>{`
        @keyframes stw-searchfilter-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/3 top-0 h-[22rem] w-[22rem] rounded-full bg-rose-900/10 blur-[130px]"
          style={{ animation: 'stw-searchfilter-blob-drift 30s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[22rem] w-[22rem] rounded-full bg-indigo-900/10 blur-[130px]"
          style={{ animation: 'stw-searchfilter-blob-drift 34s ease-in-out infinite reverse' }}
        />
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
            Search &{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Filter Predictions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Quickly find previous Airbnb price predictions using smart filters.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-12 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              variants={itemVariants}
              className={`group relative flex flex-1 items-center gap-3 rounded-2xl border bg-white/[0.02] px-4 py-3.5 backdrop-blur-md transition-colors duration-400 lg:max-w-sm ${
                focused ? 'border-rose-400/40' : 'border-white/[0.08] hover:border-white/[0.14]'
              }`}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400"
                style={{
                  opacity: focused ? 1 : 0,
                  boxShadow: '0 0 0 1px rgba(244,63,150,0.25), 0 0 22px rgba(129,140,248,0.18)',
                }}
              />
              <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-rose-400/80" />
              <input
                type="text"
                placeholder="Search property, neighbourhood..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-gray-600"
              />
            </motion.div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap">
              <motion.div variants={itemVariants}>
                <FilterSelect options={ROOM_TYPE_OPTIONS} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FilterSelect options={PRICE_RANGE_OPTIONS} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FilterSelect options={DATE_OPTIONS} />
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-400 hover:border-white/25 hover:bg-white/[0.06] sm:w-auto"
                >
                  <HiOutlineArrowPath className="h-4 w-4" />
                  Reset Filters
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mt-6 overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] px-6 py-5 backdrop-blur-2xl sm:px-7"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <HiOutlineSparkles className="h-4 w-4 text-rose-300" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white">AI Smart Search</p>
                <p className="mt-0.5 max-w-md text-xs leading-[1.6] text-gray-500">
                  Use keywords, room types, price ranges, and dates to quickly
                  locate previous AI predictions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-300">
              <HiOutlineChartBarSquare className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-gray-500">Prediction History</span>
              <span className="font-semibold text-white">128 Records</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SearchFilter;