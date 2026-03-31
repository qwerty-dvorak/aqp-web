'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface AccuracyPanelProps {
  exactResult: number;
  approxResult: number;
  error: number;
  isLoading: boolean;
}

function AccuracyMetricCard({
  value,
  isNegative = false,
  isPositive = false,
  delay = 0,
  isLoading,
}: {
  value: number;
  isNegative?: boolean;
  isPositive?: boolean;
  delay?: number;
  isLoading: boolean;
}) {
  const animatedValue = useCountUp(Math.abs(value), 800, !isLoading);

  const prefix = isNegative ? '-' : isPositive ? '+' : '';
  const textColor = isNegative
    ? 'text-red-500'
    : isPositive
    ? 'text-blue-500'
    : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="bg-bg-card rounded-card w-[100px] h-[113px] flex items-center justify-center border-2 border-orange-vivid"
    >
      <span className={`text-2xl font-bold tabular-nums ${textColor}`}>
        {isLoading ? '—' : `${prefix}${animatedValue}%`}
      </span>
    </motion.div>
  );
}

export function AccuracyPanel({
  exactResult,
  approxResult,
  error,
  isLoading,
}: AccuracyPanelProps) {
  return (
    <div className="bg-bg-panel rounded-panel p-4">
      <div className="mb-3 px-2">
        <h2 className="text-lg font-bold text-orange-vivid uppercase tracking-wider italic">
          Accuracy
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Error Percentages
        </p>
      </div>
      <div className="bg-orange-vivid rounded-inner p-4">
        <div className="flex gap-4 justify-center">
          <AccuracyMetricCard
            value={error}
            delay={0}
            isLoading={isLoading}
          />
          <AccuracyMetricCard
            value={error}
            isNegative
            delay={0.05}
            isLoading={isLoading}
          />
          <AccuracyMetricCard
            value={error}
            isPositive
            delay={0.1}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
