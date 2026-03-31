'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Clock, RotateCcw } from 'lucide-react';

interface HistoryEntry {
  id: number;
  query: string;
  dataset: string;
  accuracy_level: number;
  mode: string;
  exact_time_ms: number;
  approx_time_ms: number;
  speedup: number;
  error_pct: number;
  created_at: string;
}

interface HistoryPanelProps {
  onSelect: (query: string, dataset: string) => void;
  refreshKey: number;
}

export function HistoryPanel({ onSelect, refreshKey }: HistoryPanelProps) {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const fetchHistory = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data.history ?? []);
    } catch {
      /* ignore fetch errors */
    }
  }, [session?.user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshKey]);

  if (!session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-bg-panel rounded-panel p-5"
      >
        <div className="mb-3 px-2">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Query History
          </h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">
            Past Runs
          </p>
        </div>
        <div className="bg-neutral-800/60 rounded-inner p-5 min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-text-muted text-center">
            Sign in with Google to save &amp; view query history
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-bg-panel rounded-panel p-5"
    >
      <div className="mb-3 px-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Query History
          </h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">
            Past Runs
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          title="Refresh"
        >
          <RotateCcw className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      <div className="bg-neutral-800/60 rounded-inner p-3 min-h-[200px] max-h-[280px] overflow-y-auto space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">
            No queries yet — run one above!
          </p>
        ) : (
          history.map((h, i) => (
            <motion.button
              key={h.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              onClick={() => onSelect(h.query, h.dataset)}
              className="w-full text-left bg-neutral-700/50 hover:bg-neutral-700 rounded-lg p-3 transition-colors group"
            >
              <p className="text-xs text-white font-medium truncate group-hover:text-purple-300 transition-colors">
                {h.query}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-muted">
                <span className="bg-purple-vivid/30 text-purple-300 px-1.5 py-0.5 rounded font-medium">
                  {h.dataset}
                </span>
                {h.speedup != null && (
                  <span>{h.speedup}x faster</span>
                )}
                {h.error_pct != null && (
                  <span>{h.error_pct}% error</span>
                )}
                <span className="ml-auto flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTimeAgo(h.created_at)}
                </span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
