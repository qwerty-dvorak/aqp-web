'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface PerformancePanelProps {
  exactTime: number;
  approxTime: number;
  speedup: number;
  isLoading: boolean;
}

function PerformanceMetricCard({
  label,
  value,
  suffix = 'ms',
  delay = 0,
  isLoading,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  isLoading: boolean;
}) {
  const animatedValue = useCountUp(value, 800, !isLoading);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-bg-card rounded-card px-5 py-4 flex items-center justify-between"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {isLoading ? '—' : animatedValue}
        </span>
        <span className="text-sm text-text-muted">{suffix}</span>
      </div>
      <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
        {label}
      </span>
    </motion.div>
  );
}

export function PerformancePanel({
  exactTime,
  approxTime,
  speedup,
  isLoading,
}: PerformancePanelProps) {
  return (
    <div className="bg-bg-panel rounded-panel p-4">
      <div className="mb-3 px-2">
        <h2 className="text-lg font-bold text-purple-vivid uppercase tracking-wider">
          Performance
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Info
        </p>
      </div>
      <div className="bg-purple-vivid rounded-inner p-4 flex flex-col gap-3">
        <PerformanceMetricCard
          label="Speed"
          value={exactTime}
          suffix="ms"
          delay={0}
          isLoading={isLoading}
        />
        <PerformanceMetricCard
          label="Accuracy"
          value={approxTime}
          suffix="ms"
          delay={0.05}
          isLoading={isLoading}
        />
        <PerformanceMetricCard
          label="Combo"
          value={speedup > 0 ? Math.round(speedup * approxTime) : 0}
          suffix="ms"
          delay={0.1}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
