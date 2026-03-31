'use client';

import { motion } from 'framer-motion';
import { Recommendation } from '@/lib/types';

interface RecommendationPanelProps {
  recommendation: Recommendation | null;
  speedup: number;
  accuracy: number;
  isLoading: boolean;
}

export function RecommendationPanel({
  recommendation,
  speedup,
  accuracy,
  isLoading,
}: RecommendationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-bg-panel rounded-panel p-5"
    >
      <div className="mb-3 px-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Recommendations
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          For Better Accuracy
        </p>
      </div>

      <div className="bg-pink-200/80 rounded-inner p-5 min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <div className="h-5 w-3/4 bg-pink-300/50 rounded-sm animate-pulse" />
            <div className="h-5 w-2/3 bg-pink-300/50 rounded-sm animate-pulse" />
            <div className="h-5 w-1/2 bg-pink-300/50 rounded-sm animate-pulse" />
          </div>
        ) : !recommendation ? (
          <div className="flex flex-col gap-3">
            <RecommendationRow label="SPEED" value="—" delay={0} />
            <RecommendationRow label="ACCURACY" value="—" delay={0.05} />
            <RecommendationRow label="COMBO" value="—" delay={0.1} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <RecommendationRow
              label="SPEED"
              value={`${speedup.toFixed(0)}%`}
              delay={0}
            />
            <RecommendationRow
              label="ACCURACY"
              value={`${accuracy.toFixed(0)}%`}
              delay={0.05}
            />
            <RecommendationRow
              label="COMBO"
              value={`${Math.round((speedup + accuracy) / 2)}%`}
              delay={0.1}
            />
            {recommendation.warning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-xs text-red-700 bg-red-100 rounded-lg p-3 font-medium"
              >
                {recommendation.warning}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RecommendationRow({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="text-base font-bold text-black tracking-wide"
    >
      {label} &nbsp;–&nbsp; {value}
    </motion.div>
  );
}
