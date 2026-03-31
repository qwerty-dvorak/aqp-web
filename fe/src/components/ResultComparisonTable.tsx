'use client';

import { motion } from 'framer-motion';
import { Table2 } from 'lucide-react';
import { TableRow } from '@/lib/types';

interface ResultComparisonTableProps {
  rows: TableRow[];
  isLoading: boolean;
}

export function ResultComparisonTable({
  rows,
  isLoading,
}: ResultComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-bg-card border border-bg-border rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
    >
      <div className="flex items-center gap-2">
        <Table2 className="w-4 h-4 text-purple-light" />
        <h2 className="text-sm font-semibold text-text-primary">
          Result Comparison
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-bg-border rounded animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-muted text-sm py-8">
          Run a query to see results
        </div>
      ) : (
        <div className="overflow-auto max-h-[240px] scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left py-2 px-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
                  Category
                </th>
                <th className="text-right py-2 px-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
                  Exact
                </th>
                <th className="text-right py-2 px-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
                  Approx
                </th>
                <th className="text-right py-2 px-2 text-[11px] uppercase tracking-wider text-text-muted font-medium">
                  Error %
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`border-b border-bg-border/50 ${
                    row.error > 5 ? 'bg-red-950/40' : ''
                  }`}
                >
                  <td className="py-2 px-2 text-text-primary font-medium">
                    {row.category}
                  </td>
                  <td className="py-2 px-2 text-right text-text-muted tabular-nums">
                    {row.exact.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right text-purple-light tabular-nums">
                    {row.approx.toLocaleString()}
                  </td>
                  <td
                    className={`py-2 px-2 text-right tabular-nums font-medium ${
                      row.error < 5
                        ? 'text-green-400'
                        : row.error <= 10
                        ? 'text-yellow-400'
                        : 'text-alert'
                    }`}
                  >
                    {row.error}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
