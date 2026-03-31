'use client';

import { Header } from '@/components/Header';
import { QueryInputPanel } from '@/components/QueryInputPanel';
import { ComboToggle } from '@/components/ComboToggle';
import { HistoryPanel } from '@/components/HistoryPanel';
import { OutputAnalysis } from '@/components/OutputAnalysis';
import { AccuracyAnalysis } from '@/components/AccuracyAnalysisPanel';
import { TimeAccuracyCurve } from '@/components/TimeAccuracyCurve';
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

      {/* Row 1: Input Query | Combo Toggle */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 items-start">
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

      {/* Row 2: Output Analysis — 3 metric cards */}
      <div className="mt-8">
        <OutputAnalysis
          exactTime={results?.exactTime ?? 420}
          approxTime={results?.approxTime ?? 38}
          speedup={results?.speedup ?? 11.0}
          exactResult={results?.exactResult ?? 1842301}
          approxResult={results?.approxResult ?? 1840000}
          error={results?.error ?? 2.3}
          isLoading={isLoading}
        />
      </div>

      {/* Row 3: Accuracy Analysis — Error Rate full width */}
      <div className="mt-8">
        <AccuracyAnalysis
          error={results?.error ?? 2.3}
          isLoading={isLoading}
        />
      </div>

      {/* Row 4: Time vs Accuracy Curve — full width */}
      <div className="mt-8">
        <TimeAccuracyCurve samplingRate={50} />
      </div>

      {/* Row 5: Query History */}
      <div className="mt-8">
        <HistoryPanel
          onSelect={handleHistorySelect}
          refreshKey={historyRefresh}
        />
      </div>
    </main>
  );
}
