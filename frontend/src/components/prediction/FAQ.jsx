import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineQuestionMarkCircle, HiOutlineSparkles, HiOutlineArrowRight, HiOutlineChartBarSquare } from 'react-icons/hi2';

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

const FAQ_ITEMS = [
  {
    id: 'how',
    question: 'How does StayWise AI predict Airbnb prices?',
    answer:
      'StayWise AI uses a trained XGBoost machine learning model that analyzes multiple listing features including neighbourhood, room type, host activity, availability, reviews, latitude, longitude, and historical patterns to estimate an Airbnb nightly price.',
  },
  {
    id: 'model',
    question: 'Which AI model powers the predictions?',
    answer:
      'The application uses an optimized XGBoost Regressor trained on Airbnb listing data. XGBoost is known for its excellent accuracy, speed, and performance on structured datasets.',
  },
  {
    id: 'accuracy',
    question: 'How accurate are the predictions?',
    answer:
      'Predictions are generated using a trained machine learning model and should be considered intelligent estimates rather than guaranteed market prices. Actual prices may vary depending on demand, seasonality, local events, and market conditions.',
  },
  {
    id: 'live',
    question: 'Does StayWise AI use live Airbnb prices?',
    answer:
      'No. The model predicts prices based on historical Airbnb listing data and learned relationships between listing features. It does not fetch live Airbnb pricing.',
  },
  {
    id: 'privacy',
    question: 'Is my data stored?',
    answer:
      'No. Your prediction request is processed in real time by the FastAPI backend. The information is used only to generate the prediction and is not permanently stored.',
  },
  {
    id: 'stack',
    question: 'What technologies power this application?',
    answer:
      'StayWise AI is built using React, Tailwind CSS, Framer Motion, FastAPI, Python, Axios, and an XGBoost machine learning model to provide a fast and modern AI prediction experience.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(190,60,110,0.16)]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px rgba(244,63,150,0.2), 0 0 26px rgba(190,60,110,0.12)' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7 sm:py-6"
      >
        <span className="text-sm font-semibold text-white sm:text-base">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            isOpen ? 'border-rose-400/40 bg-rose-500/10' : 'border-white/[0.08] bg-white/[0.03]'
          }`}
        >
          <HiOutlineChevronDown className={`h-4 w-4 transition-colors duration-300 ${isOpen ? 'text-rose-300' : 'text-gray-500'}`} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-[1.75] text-gray-400 sm:px-7 sm:pb-7">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ() {
  const particles = useParticles(28);
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative overflow-hidden bg-[#050506] py-24 sm:py-28">
      <style>{`
        @keyframes stw-faq-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 90px 90px; }
        }
        @keyframes stw-faq-particle-drift {
          0% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
          50% { transform: translate3d(3px,-8px,0); opacity: calc(var(--stw-op) + 0.08); }
          100% { transform: translate3d(0,0,0); opacity: var(--stw-op); }
        }
        @keyframes stw-faq-blob-drift {
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
          className="absolute left-1/4 top-0 h-[26rem] w-[26rem] rounded-full bg-rose-900/15 blur-[130px]"
          style={{ animation: 'stw-faq-blob-drift 28s ease-in-out infinite' }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-indigo-900/15 blur-[130px]"
          style={{ animation: 'stw-faq-blob-drift 32s ease-in-out infinite reverse' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'stw-faq-grid-drift 18s linear infinite',
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
              animation: `stw-faq-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
          >
            <HiOutlineQuestionMarkCircle className="h-3.5 w-3.5 text-rose-400" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl"
          >
            Everything You Need to Know
            <br />
            <span
              className="bg-gradient-to-r from-rose-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'stw-shimmer 6s linear infinite' }}
            >
              StayWise AI FAQ
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg"
          >
            Find answers to the most common questions about our AI-powered
            Airbnb price prediction system, machine learning model, accuracy,
            privacy, and prediction process.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 space-y-4"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-8 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:px-12 sm:py-14"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

          <h3 className="relative text-2xl font-bold tracking-[-0.01em] text-white sm:text-3xl">
            Still have questions?
          </h3>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-[1.75] text-gray-400 sm:text-base">
            Explore the project or experiment with different Airbnb property
            configurations to see how our AI responds in real time.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-full sm:w-auto">
              <NavLink
                to="/predict"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-[length:200%_auto] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(190,60,110,0.25)] transition-shadow duration-500 hover:shadow-[0_10px_46px_rgba(190,60,110,0.42)] sm:w-auto"
                style={{ animation: 'stw-shimmer 6s linear infinite' }}
              >
                <HiOutlineSparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
                Try Another Prediction
                <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-full sm:w-auto">
              <NavLink
                to="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06] sm:w-auto"
              >
                <HiOutlineChartBarSquare className="h-4 w-4" />
                View Dashboard
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;