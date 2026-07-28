import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  HiOutlineChartPie,
  HiOutlineTableCells,
  HiOutlineArrowTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationTriangle,
  HiOutlineInbox,
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

const DONUT_COLORS = ['#fb7185', '#e879f9', '#818cf8', '#f472b6', '#a78bfa'];

function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function BackgroundLayer({ particles }) {
  return (
    <>
      <style>{`
        @keyframes stw-analytics-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-analytics-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-analytics-blob-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes stw-analytics-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes stw-shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        @keyframes stw-analytics-skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-analytics-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-analytics-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-analytics-grid-drift 18s linear infinite',
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
              animation: `stw-analytics-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

function SectionCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
        <Icon className="h-4.5 w-4.5 text-rose-300" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* SECTION 1 — Room Type Distribution  */
/* ---------------------------------- */

function RoomTypeDonut({ roomTypeDistribution }) {
  const chartData = useMemo(() => {
    const entries = Object.entries(roomTypeDistribution || {});
    const total = entries.reduce((sum, [, value]) => sum + Number(value || 0), 0);
    return entries.map(([name, value], index) => ({
      name,
      value: Number(value) || 0,
      percentage: total > 0 ? ((Number(value) || 0) / total) * 100 : 0,
      color: DONUT_COLORS[index % DONUT_COLORS.length],
    }));
  }, [roomTypeDistribution]);

  const hasData = chartData.length > 0;

  return (
    <SectionCard>
      <SectionHeader
        icon={HiOutlineChartPie}
        title="Room Type Distribution"
        subtitle="Share of predictions by room category"
      />

      {hasData ? (
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative h-56 w-56 shrink-0 sm:h-64 sm:w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={3}
                  cornerRadius={8}
                  isAnimationActive
                  animationDuration={1000}
                  animationEasing="ease-out"
                  stroke="rgba(5,5,6,0.9)"
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,12,0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                    backdropFilter: 'blur(8px)',
                  }}
                  formatter={(value, name, props) => [
                    `${props?.payload?.percentage?.toFixed(1) ?? 0}%`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-2xl font-bold text-transparent">
                {chartData.reduce((sum, item) => sum + item.value, 0)}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-500">
                Total
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                className="flex items-center justify-between gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-gray-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                  {item.name}
                </span>
                <span className="text-xs font-semibold text-white">{item.percentage.toFixed(1)}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyMini message="No room type data available yet." />
      )}
    </SectionCard>
  );
}

/* ---------------------------------- */
/* SECTION 2 — Recent Predictions      */
/* ---------------------------------- */

function RecentPredictionsTable({ recentPredictions }) {
  const rows = useMemo(() => {
    const list = Array.isArray(recentPredictions) ? [...recentPredictions] : [];
    return list
      .sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
      .slice(0, 5);
  }, [recentPredictions]);

  const hasRows = rows.length > 0;

  return (
    <SectionCard>
      <SectionHeader
        icon={HiOutlineTableCells}
        title="Recent Predictions"
        subtitle="Latest 5 model predictions"
      />

      {hasRows ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">
                  Neighbourhood
                </th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">
                  Room Type
                </th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">
                  Predicted Price
                </th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <motion.tbody
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {rows.map((row, index) => (
                <motion.tr
                  key={row.id ?? index}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                  className="border-b border-white/[0.05] transition-colors duration-300 last:border-b-0"
                >
                  <td className="px-4 py-3.5 text-sm text-gray-300">{row.neighbourhood}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-400">
                      {row.room_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-sm font-bold text-transparent">
                      {formatPrice(row.predicted_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{formatDate(row.created_at || row.date)}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      ) : (
        <EmptyMini message="No recent predictions to show yet." />
      )}
    </SectionCard>
  );
}

/* ---------------------------------- */
/* SECTION 3 — Price Insights          */
/* ---------------------------------- */

function PriceBar({ label, value, maxValue, color, delay }) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-400">{label}</span>
        <span className="font-semibold text-white">{formatPrice(value)}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.03]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function PriceInsights({ highestPrice, averagePrice, lowestPrice }) {
  const highest = Number(highestPrice) || 0;
  const average = Number(averagePrice) || 0;
  const lowest = Number(lowestPrice) || 0;
  const maxValue = highest > 0 ? highest : Math.max(average, lowest, 1);

  return (
    <SectionCard>
      <SectionHeader
        icon={HiOutlineArrowTrendingUp}
        title="Price Insights"
        subtitle="Highest, average, and lowest predicted price"
      />

      <div className="mt-7 flex flex-col gap-6">
        <PriceBar label="Highest Price" value={highest} maxValue={maxValue} color="linear-gradient(90deg,#fb7185,#f472b6)" delay={0.1} />
        <PriceBar label="Average Price" value={average} maxValue={maxValue} color="linear-gradient(90deg,#e879f9,#a78bfa)" delay={0.25} />
        <PriceBar label="Lowest Price" value={lowest} maxValue={maxValue} color="linear-gradient(90deg,#818cf8,#6366f1)" delay={0.4} />
      </div>

      <div className="mt-7 flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <HiOutlineCurrencyDollar className="h-4 w-4 shrink-0 text-rose-300" />
        <p className="text-xs leading-[1.6] text-gray-500">
          Bars are scaled relative to the highest predicted price in this period.
        </p>
      </div>
    </SectionCard>
  );
}

/* ---------------------------------- */
/* Shared empty / loading / error      */
/* ---------------------------------- */

function EmptyMini({ message }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
      <HiOutlineInbox className="h-6 w-6 text-gray-600" />
      <p className="mt-3 text-xs text-gray-500">{message}</p>
    </div>
  );
}

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.05] ${className}`}
      style={{ animation: 'stw-analytics-skeleton-pulse 1.8s ease-in-out infinite' }}
    />
  );
}

function SkeletonSectionCard({ children }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <>
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-7">
        <SkeletonSectionCard>
          <SkeletonBlock className="h-5 w-48" />
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <SkeletonBlock className="h-56 w-56 rounded-full sm:h-64 sm:w-64" />
            <div className="flex w-full flex-col gap-3 sm:w-48">
              <SkeletonBlock className="h-9 w-full" />
              <SkeletonBlock className="h-9 w-full" />
              <SkeletonBlock className="h-9 w-full" />
            </div>
          </div>
        </SkeletonSectionCard>

        <SkeletonSectionCard>
          <SkeletonBlock className="h-5 w-40" />
          <div className="mt-7 flex flex-col gap-6">
            <SkeletonBlock className="h-8 w-full" />
            <SkeletonBlock className="h-8 w-full" />
            <SkeletonBlock className="h-8 w-full" />
          </div>
        </SkeletonSectionCard>
      </div>

      <div className="mt-6 lg:mt-7">
        <SkeletonSectionCard>
          <SkeletonBlock className="h-5 w-44" />
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <SkeletonBlock key={index} className="h-10 w-full" />
            ))}
          </div>
        </SkeletonSectionCard>
      </div>
    </>
  );
}

function ErrorState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mt-14 overflow-hidden rounded-[28px] border border-rose-500/20 bg-rose-500/[0.04] px-8 py-16 text-center backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/[0.08]">
        <HiOutlineExclamationTriangle className="h-6 w-6 text-rose-300" />
      </div>
      <p className="relative mt-5 text-base font-semibold text-white">Couldn't load analytics</p>
      <p className="relative mx-auto mt-2 max-w-xs text-sm leading-[1.7] text-gray-500">
        {message || 'Something went wrong while fetching your analytics. Please try again.'}
      </p>
    </motion.div>
  );
}

/* ---------------------------------- */
/* Main component                      */
/* ---------------------------------- */

function DashboardAnalytics({ data, loading, error }) {
  const particles = useParticles(28);

  return (
    <section className="relative overflow-hidden bg-[#050506] py-20 sm:py-24">
      <BackgroundLayer particles={particles} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            Analytics{' '}
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              Overview
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Track model behavior, prediction activity, and listing insights
            in real time.
          </motion.p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-7">
              <RoomTypeDonut roomTypeDistribution={data?.room_type_distribution} />
              <PriceInsights
                highestPrice={data?.highest_price}
                averagePrice={data?.average_price}
                lowestPrice={data?.lowest_price}
              />
            </div>

            <div className="mt-6 lg:mt-7">
              <RecentPredictionsTable recentPredictions={data?.recent_predictions} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default DashboardAnalytics;