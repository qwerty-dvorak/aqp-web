'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface VisualComparisonsProps {
  rows: { category: string; exact: number; approx: number }[];
  isLoading: boolean;
  samplingRate: number;
  onSamplingRateChange: (rate: number) => void;
}

const MOCK_DATA = [
  { category: 'Region A', exact: 4200, approx: 4150 },
  { category: 'Region B', exact: 3100, approx: 3050 },
  { category: 'Region C', exact: 5800, approx: 5720 },
  { category: 'Region D', exact: 2400, approx: 2380 },
];

export function VisualComparisons({
  rows,
  isLoading,
  samplingRate,
  onSamplingRateChange,
}: VisualComparisonsProps) {
  const data = rows.length > 0 ? rows : MOCK_DATA;
  const maxValue = useMemo(
    () => Math.max(...data.flatMap((d) => [d.exact, d.approx])),
    [data],
  );

  // Dynamic values based on sampling rate
  const estimatedTime = useMemo(() => {
    // Lower sample = faster
    return Math.round(10 + (samplingRate / 100) * 410);
  }, [samplingRate]);

  return (
    <div>
      <div className="mb-4 px-1">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Visual Comparisons
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Exact vs Approximate Breakdown
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-bg-panel rounded-card p-5"
        >
          <div className="mb-4">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
              Result Comparison by Group
            </span>
            <p className="text-[9px] text-text-muted/60 uppercase tracking-wider mt-0.5">
              Exact vs Approx per Category
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-purple-vivid" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Exact</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-vivid" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Approx</span>
            </div>
          </div>

          <div className="space-y-4">
            {data.map((item, i) => {
              const exactPct = (item.exact / maxValue) * 100;
              const approxPct = (item.approx / maxValue) * 100;
              return (
                <div key={item.category} className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">{item.category}</span>
                  <div className="flex gap-1.5">
                    {/* Exact bar */}
                    <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${exactPct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                        className="h-full bg-purple-vivid rounded-md flex items-center justify-end pr-2"
                      >
                        <span className="text-[9px] text-white font-medium tabular-nums">
                          {item.exact.toLocaleString()}
                        </span>
                      </motion.div>
                    </div>
                    {/* Approx bar */}
                    <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${approxPct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-orange-vivid rounded-md flex items-center justify-end pr-2"
                      >
                        <span className="text-[9px] text-white font-medium tabular-nums">
                          {item.approx.toLocaleString()}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sampling Rate Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-bg-panel rounded-card p-5 flex flex-col"
        >
          <div className="mb-3">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
              Sampling Rate
            </span>
            <p className="text-[9px] text-text-muted/60 uppercase tracking-wider mt-0.5">
              Control Approx Aggressiveness
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-black/40 rounded-xl p-6">
            {/* Large percentage display */}
            <span
              className="text-6xl font-black text-purple-light tabular-nums"
              style={{ fontFamily: "'Righteous', cursive" }}
            >
              {samplingRate}%
            </span>

            {/* Custom slider */}
            <div className="w-full px-2">
              <input
                type="range"
                min={1}
                max={100}
                value={samplingRate}
                onChange={(e) => onSamplingRateChange(Number(e.target.value))}
                className="sampling-slider w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-orange-vivid uppercase tracking-wider font-medium">
                  Faster
                </span>
                <span className="text-[10px] text-purple-light uppercase tracking-wider font-medium">
                  More Accurate
                </span>
              </div>
            </div>

            {/* Dynamic text */}
            <div className="text-center">
              <p className="text-xs text-text-muted">
                Scanning <span className="text-white font-medium">{samplingRate}%</span> of dataset
                {' · '}
                Est. <span className="text-white font-medium">{estimatedTime}ms</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
