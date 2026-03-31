'use client';

import { motion } from 'framer-motion';

interface OutputAnalysisProps {
  exactTime: number;
  approxTime: number;
  speedup: number;
  exactResult: number;
  approxResult: number;
  error: number;
  isLoading: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}

function approximateNumber(n: number): string {
  if (n >= 1_000_000) {
    const approx = Math.round(n / 10000) * 10000;
    return '~' + approx.toLocaleString();
  }
  if (n >= 1_000) {
    const approx = Math.round(n / 1000) * 1000;
    return '~' + approx.toLocaleString();
  }
  return '~' + String(n);
}

export function OutputAnalysis({
  exactTime,
  approxTime,
  speedup,
  exactResult,
  approxResult,
  isLoading,
}: OutputAnalysisProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <div>
      <div className="mb-4 px-1">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Output Analysis
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Query Performance Metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Execution Time */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-panel rounded-card p-5 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
              Execution Time
            </span>
            <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">
              Query Runtime
            </span>
          </div>
          <div className="bg-black/40 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-purple-light uppercase tracking-wider">Exact:</span>
              <span
                className="text-2xl font-black text-white tabular-nums leading-none"
                style={{ fontFamily: "'Righteous', cursive" }}
              >
                {isLoading ? '—' : `${exactTime}ms`}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-orange-vivid uppercase tracking-wider">Approx:</span>
              <span
                className="text-2xl font-black text-white tabular-nums leading-none"
                style={{ fontFamily: "'Righteous', cursive" }}
              >
                {isLoading ? '—' : `${approxTime}ms`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Row Count */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-panel rounded-card p-5 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
              Rows Returned
            </span>
            <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">
              Dataset Scale
            </span>
          </div>
          <div className="bg-black/40 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-purple-light uppercase tracking-wider">Exact:</span>
              <span
                className="text-2xl font-black text-white tabular-nums leading-none"
                style={{ fontFamily: "'Righteous', cursive" }}
              >
                {isLoading ? '—' : formatNumber(exactResult)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-orange-vivid uppercase tracking-wider">Approx:</span>
              <span
                className="text-2xl font-black text-white tabular-nums leading-none"
                style={{ fontFamily: "'Righteous', cursive" }}
              >
                {isLoading ? '—' : approximateNumber(approxResult)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Speedup Factor */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-panel rounded-card p-5 flex flex-col gap-3 border border-purple-vivid/30"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-purple-light uppercase tracking-widest font-medium">
              Speedup
            </span>
            <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">
              Approx vs Exact
            </span>
          </div>
          <div className="bg-purple-vivid/10 rounded-xl p-4 flex items-center justify-center">
            <span
              className="text-5xl font-black text-purple-light tabular-nums leading-none"
              style={{ fontFamily: "'Righteous', cursive" }}
            >
              {isLoading ? '—' : `${speedup.toFixed(1)}×`}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
