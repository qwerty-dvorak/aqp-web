'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
  decimals?: number;
  colorClass?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  highlight = false,
  decimals = 0,
  colorClass,
}: MetricCardProps) {
  const animatedValue = useCountUp(value, 800, true, decimals);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-bg-card border border-bg-border rounded-xl p-4 flex flex-col gap-1"
    >
      <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-2xl font-bold tabular-nums ${
            colorClass
              ? colorClass
              : highlight
              ? 'text-purple-light'
              : 'text-text-primary'
          }`}
        >
          {animatedValue}
        </span>
        <span className="text-xs text-text-muted">{unit}</span>
      </div>
    </motion.div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex flex-col gap-2">
      <div className="h-3 w-20 bg-bg-border rounded animate-pulse" />
      <div className="h-7 w-24 bg-bg-border rounded animate-pulse" />
    </div>
  );
}
