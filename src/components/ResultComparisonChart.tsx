'use client';

import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { TableRow } from '@/lib/types';

interface ResultComparisonChartProps {
  rows: TableRow[];
  isLoading: boolean;
}

export function ResultComparisonChart({
  rows,
  isLoading,
}: ResultComparisonChartProps) {
  // Transform table rows into chart data
  const chartData = rows.length > 0
    ? rows.map((row, i) => ({
        name: `${(i + 1) * 10}`,
        speed: row.exact,
        accuracy: row.approx,
        combo: Math.round((row.exact + row.approx) / 2),
        performance: Math.round(row.exact * (1 - row.error / 100)),
      }))
    : // Default demo data
      [
        { name: '100', speed: 95, accuracy: 90, combo: 88, performance: 85 },
        { name: '90', speed: 88, accuracy: 85, combo: 80, performance: 78 },
        { name: '80', speed: 82, accuracy: 78, combo: 73, performance: 70 },
        { name: '70', speed: 75, accuracy: 70, combo: 65, performance: 60 },
        { name: '60', speed: 68, accuracy: 62, combo: 58, performance: 52 },
        { name: '50', speed: 60, accuracy: 55, combo: 50, performance: 45 },
        { name: '40', speed: 52, accuracy: 48, combo: 42, performance: 38 },
        { name: '30', speed: 45, accuracy: 40, combo: 35, performance: 30 },
        { name: '20', speed: 38, accuracy: 32, combo: 28, performance: 22 },
        { name: '10', speed: 30, accuracy: 25, combo: 20, performance: 15 },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-bg-panel rounded-panel p-5"
    >
      <div className="mb-3 px-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Result Comparison
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Comparison Between Baseline and Approx
        </p>
      </div>

      <div className="bg-black rounded-inner p-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-3 h-3 rounded-full bg-purple-vivid"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#AAAAAA', fontSize: 10 }}
                  axisLine={{ stroke: '#2a2a2a' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#AAAAAA', fontSize: 10 }}
                  axisLine={{ stroke: '#2a2a2a' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1516',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                  labelStyle={{ color: '#AAAAAA' }}
                />
                <Legend
                  iconType="plainline"
                  wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#EDC161"
                  strokeWidth={2}
                  dot={false}
                  name="Speed"
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#5D45DB"
                  strokeWidth={2}
                  dot={false}
                  name="Accuracy"
                />
                <Line
                  type="monotone"
                  dataKey="combo"
                  stroke="#6CB9AD"
                  strokeWidth={2}
                  dot={false}
                  name="Combo"
                />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#FF696D"
                  strokeWidth={2}
                  dot={false}
                  name="Performance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
