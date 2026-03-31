'use client';

import { motion } from 'framer-motion';

interface AccuracyAnalysisProps {
  error: number;
  isLoading: boolean;
}

function getErrorColor(error: number): string {
  const abs = Math.abs(error);
  if (abs < 5) return '#22c55e';   // green
  if (abs < 10) return '#eab308';  // yellow
  return '#ef4444';                 // red
}

function getErrorBgClass(error: number): string {
  const abs = Math.abs(error);
  if (abs < 5) return 'bg-green-500/10 border-green-500/30';
  if (abs < 10) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

export function AccuracyAnalysis({
  error,
  isLoading,
}: AccuracyAnalysisProps) {
  const errorAbs = Math.abs(error);
  const errorColor = getErrorColor(error);

  return (
    <div>
      <div className="mb-4 px-1">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Accuracy Analysis
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Statistical Accuracy Metrics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Error Rate — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-card p-5 flex flex-col gap-3 border ${getErrorBgClass(error)}`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
              Error Rate
            </span>
            <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">
              Deviation from Exact Result
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 py-2">
            <span
              className="text-5xl font-black tabular-nums leading-none"
              style={{ color: errorColor, fontFamily: "'Righteous', cursive" }}
            >
              {isLoading ? '—' : `±${errorAbs.toFixed(1)}%`}
            </span>
            {/* Error magnitude bar */}
            <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(errorAbs * 5, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: errorColor }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
