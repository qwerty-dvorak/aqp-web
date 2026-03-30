'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, ChevronDown } from 'lucide-react';
import { QueryMode } from '@/lib/types';

const CLICKBENCH_TABLES = [
  { value: 'hits', label: 'hits', description: 'Web analytics — 99M rows' },
  { value: 'hits_100m', label: 'hits_100m', description: 'Extended analytics — 100M rows' },
  { value: 'hits_10m', label: 'hits_10m', description: 'Sampled analytics — 10M rows' },
  { value: 'visits', label: 'visits', description: 'Session-level visits data' },
  { value: 'default.hits', label: 'default.hits', description: 'Default schema hits table' },
];

interface QueryInputPanelProps {
  onRun: (query: string, mode: QueryMode, accuracy: number, dataset: string) => void;
  isLoading: boolean;
  accuracy: number;
  mode: QueryMode;
}

const modes: { value: QueryMode; label: string }[] = [
  { value: 'exact', label: 'EXACT' },
  { value: 'approx', label: 'APPROX' },
  { value: 'both', label: 'COMBO' },
];

export function QueryInputPanel({ onRun, isLoading, accuracy, mode: initialMode }: QueryInputPanelProps) {
  const [query, setQuery] = useState('');
  const [dataset, setDataset] = useState('hits');
  const [mode, setMode] = useState<QueryMode>(initialMode);

  // Load from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('aproql-last-query');
    const savedDataset = localStorage.getItem('aproql-last-dataset');
    if (savedQuery) setQuery(savedQuery);
    if (savedDataset) setDataset(savedDataset);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('aproql-last-query', query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem('aproql-last-dataset', dataset);
  }, [dataset]);

  const handleRun = useCallback(() => {
    if (query.trim()) {
      onRun(query, mode, accuracy, dataset);
    }
  }, [query, mode, accuracy, dataset, onRun]);

  // Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  return (
    <div className="bg-bg-panel rounded-panel p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Input Query
        </h2>
        <div className="relative">
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="appearance-none bg-purple-vivid text-white text-xs font-medium px-3 py-1.5 pr-7 rounded-md cursor-pointer focus:outline-none"
          >
            {CLICKBENCH_TABLES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
        </div>
      </div>

      {/* Query textarea */}
      <div className="bg-white rounded-xl p-1">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Please Enter Your Query...`}
          className="w-full h-[120px] bg-white text-black placeholder:text-gray-400 font-mono text-sm resize-none focus:outline-none p-3 rounded-lg"
        />
      </div>

      {/* Mode buttons + Run */}
      <div className="flex items-center gap-3">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              mode === m.value
                ? 'bg-purple-vivid text-white shadow-lg shadow-purple-vivid/30'
                : 'bg-purple-vivid/60 text-white/80 hover:bg-purple-vivid/80'
            }`}
          >
            {m.label}
          </button>
        ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRun}
          disabled={isLoading || !query.trim()}
          className="px-8 py-2.5 bg-orange-vivid hover:bg-orange-bright disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-orange-vivid/30 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          {isLoading ? 'RUNNING...' : 'RUN'}
        </motion.button>
      </div>
    </div>
  );
}
