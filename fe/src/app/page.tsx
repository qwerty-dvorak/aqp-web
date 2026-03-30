'use client';

import { Header } from '@/components/Header';
import { QueryInputPanel } from '@/components/QueryInputPanel';
import { PerformancePanel } from '@/components/PerformancePanel';
import { AccuracyPanel } from '@/components/AccuracyPanel';
import { ComboToggle } from '@/components/ComboToggle';
import { ResultComparisonChart } from '@/components/ResultComparisonChart';
import { RecommendationPanel } from '@/components/RecommendationPanel';
import { useQueryRunner } from '@/hooks/useQueryRunner';
import { useState } from 'react';
import { QueryMode } from '@/lib/types';

export default function DashboardPage() {
  const { results, isLoading, run } = useQueryRunner();
  const [accuracy, setAccuracy] = useState(65);
  const [mode, setMode] = useState<QueryMode>('both');

  const handleRun = (query: string, selectedMode: QueryMode, acc: number, dataset: string) => {
    setMode(selectedMode);
    setAccuracy(acc);
    run(query, selectedMode, acc, dataset);
  };

  return (
    <main className="w-full min-h-screen p-6 md:p-10">
      <Header />

      {/* Top Row: Performance | Input Query | Combo Toggle */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[400px_1fr_420px] gap-5 items-start">
        <PerformancePanel
          exactTime={results?.exactTime ?? 0}
          approxTime={results?.approxTime ?? 0}
          speedup={results?.speedup ?? 0}
          isLoading={isLoading}
        />

        <QueryInputPanel
          onRun={handleRun}
          isLoading={isLoading}
          accuracy={accuracy}
          mode={mode}
        />

        <ComboToggle
          accuracy={accuracy}
          onAccuracyChange={setAccuracy}
        />
      </div>

      {/* Bottom Row: Accuracy | Result Comparison | Recommendations */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[400px_1fr_420px] gap-5 items-start">
        <AccuracyPanel
          exactResult={results?.exactResult ?? 0}
          approxResult={results?.approxResult ?? 0}
          error={results?.error ?? 0}
          isLoading={isLoading}
        />

        <ResultComparisonChart
          rows={results?.tableRows ?? []}
          isLoading={isLoading}
        />

        <RecommendationPanel
          recommendation={results?.recommendation ?? null}
          speedup={results?.speedup ?? 0}
          accuracy={results?.error !== undefined ? 100 - results.error : 0}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
