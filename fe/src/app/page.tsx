'use client';

import { Header } from '@/components/Header';
import { QueryInputPanel } from '@/components/QueryInputPanel';
import { PerformancePanel } from '@/components/PerformancePanel';
import { AccuracyPanel } from '@/components/AccuracyPanel';
import { ComboToggle } from '@/components/ComboToggle';
import { ResultComparisonChart } from '@/components/ResultComparisonChart';
import { HistoryPanel } from '@/components/HistoryPanel';
import { useQueryRunner } from '@/hooks/useQueryRunner';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { QueryMode } from '@/lib/types';

export default function DashboardPage() {
  const { results, isLoading, run } = useQueryRunner();
  const { data: session } = useSession();
  const [accuracy, setAccuracy] = useState(65);
  const [mode, setMode] = useState<QueryMode>('both');
  const [historyRefresh, setHistoryRefresh] = useState(0);

  // State for populating query from history
  const [externalQuery, setExternalQuery] = useState('');
  const [externalDataset, setExternalDataset] = useState('');

  const handleRun = useCallback(
    async (query: string, selectedMode: QueryMode, acc: number, dataset: string) => {
      setMode(selectedMode);
      setAccuracy(acc);
      const result = await run(query, selectedMode, acc, dataset);

      // Save to history if signed in
      if (session?.user && result) {
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              dataset,
              accuracyLevel: acc,
              mode: selectedMode,
              exactTime: result.exactTime,
              approxTime: result.approxTime,
              speedup: result.speedup,
              error: result.error,
            }),
          });
          setHistoryRefresh((n) => n + 1);
        } catch {
          /* history save is best-effort */
        }
      }
    },
    [run, session?.user],
  );

  const handleHistorySelect = useCallback((query: string, dataset: string) => {
    setExternalQuery(query);
    setExternalDataset(dataset);
  }, []);

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
          externalQuery={externalQuery}
          externalDataset={externalDataset}
        />

        <ComboToggle
          accuracy={accuracy}
          onAccuracyChange={setAccuracy}
        />
      </div>

      {/* Bottom Row: Accuracy | Result Comparison | History */}
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

        <HistoryPanel
          onSelect={handleHistorySelect}
          refreshKey={historyRefresh}
        />
      </div>
    </main>
  );
}
