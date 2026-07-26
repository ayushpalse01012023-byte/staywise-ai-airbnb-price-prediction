import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineInbox,
} from 'react-icons/hi2';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const HISTORY_ROWS = [
  {
    id: 1,
    property: 'Cozy Loft',
    neighbourhood: 'Williamsburg',
    roomType: 'Entire home/apt',
    price: 214,
    date: 'Today',
    status: 'Successful',
  },
  {
    id: 2,
    property: 'Sunny Studio',
    neighbourhood: 'Harlem',
    roomType: 'Private room',
    price: 96,
    date: 'Yesterday',
    status: 'Successful',
  },
  {
    id: 3,
    property: 'Modern Flat',
    neighbourhood: 'Astoria',
    roomType: 'Entire home/apt',
    price: 142,
    date: '25 Jul',
    status: 'Successful',
  },
  {
    id: 4,
    property: 'Garden Suite',
    neighbourhood: 'Chelsea',
    roomType: 'Private room',
    price: 176,
    date: '24 Jul',
    status: 'Successful',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
      <HiOutlineCheckCircle className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function RoomTypePill({ roomType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-400">
      {roomType}
    </span>
  );
}

function DesktopRow({ row, index }) {
  return (
    <motion.tr
      variants={rowVariants}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
      className="group border-b border-white/[0.05] transition-colors duration-300 last:border-b-0"
    >
      <td className="relative px-5 py-4">
        <div
          className="pointer-events-none absolute inset-y-1 left-0 w-0.5 rounded-full bg-gradient-to-b from-rose-400/0 via-rose-400/0 to-indigo-400/0 opacity-0 transition-opacity duration-300 group-hover:from-rose-400/60 group-hover:via-fuchsia-400/60 group-hover:to-indigo-400/60 group-hover:opacity-100"
        />
        <span className="text-sm font-semibold text-white">{row.property}</span>
      </td>
      <td className="px-5 py-4">
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <HiOutlineLocationMarker className="h-3.5 w-3.5 shrink-0 text-gray-600" />
          {row.neighbourhood}
        </span>
      </td>
      <td className="px-5 py-4">
        <RoomTypePill roomType={row.roomType} />
      </td>
      <td className="px-5 py-4">
        <span className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-sm font-bold text-transparent">
          ${row.price}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-gray-500">{row.date}</span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={row.status} />
      </td>
    </motion.tr>
  );
}

function MobileRowCard({ row, index }) {
  return (
    <motion.div
      variants={rowVariants}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.18), 0 0 20px rgba(190,60,110,0.1)' }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{row.property}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <HiOutlineLocationMarker className="h-3.5 w-3.5 shrink-0 text-gray-600" />
            {row.neighbourhood}
          </p>
        </div>
        <span className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-lg font-bold text-transparent">
          ${row.price}
        </span>
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <RoomTypePill roomType={row.roomType} />
        <span className="text-xs text-gray-500">{row.date}</span>
      </div>

      <div className="relative mt-3">
        <StatusBadge status={row.status} />
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] px-8 py-16 text-center"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]"
      >
        <HiOutlineInbox className="h-6 w-6 text-gray-500" />
      </motion.div>
      <p className="relative mt-5 text-base font-semibold text-white">No predictions found</p>
      <p className="relative mx-auto mt-2 max-w-xs text-sm leading-[1.7] text-gray-500">
        Try adjusting your filters or create a new prediction to see it here.
      </p>
    </motion.div>
  );
}

function PredictionHistoryTable() {
  const [rows] = useState(HISTORY_ROWS);
  const hasRows = rows.length > 0;

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <style>{`
        @keyframes stw-history-table-blob-drift {
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
          style={{ animation: 'stw-history-table-blob-drift 30s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[22rem] w-[22rem] rounded-full bg-indigo-900/10 blur-[130px]"
          style={{ animation: 'stw-history-table-blob-drift 34s ease-in-out infinite reverse' }}
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
            Prediction{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              History
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Review, compare, and revisit your previous AI price predictions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-md">
            <span className="text-gray-500">Total History</span>
            <span className="font-semibold text-white">128 records</span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-400 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <HiOutlineArrowDownTray className="h-3.5 w-3.5" />
              Export CSV
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/[0.06] px-4 py-2.5 text-xs font-semibold text-rose-300 backdrop-blur-md transition-all duration-400 hover:border-rose-400/35 hover:bg-rose-500/[0.1]"
            >
              <HiOutlineTrash className="h-3.5 w-3.5" />
              Clear History
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {hasRows ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7 }}
              className="relative mt-6 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

              <div className="relative hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Property</th>
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Neighbourhood</th>
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Room Type</th>
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Predicted Price</th>
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Date</th>
                      <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                    {rows.map((row, index) => (
                      <DesktopRow key={row.id} row={row} index={index} />
                    ))}
                  </motion.tbody>
                </table>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="relative flex flex-col gap-4 p-5 md:hidden"
              >
                {rows.map((row, index) => (
                  <MobileRowCard key={row.id} row={row} index={index} />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <div key="empty" className="mt-6">
              <EmptyState />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default PredictionHistoryTable;