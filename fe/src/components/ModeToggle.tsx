'use client';

import { QueryMode } from '@/lib/types';

interface ModeToggleProps {
  mode: QueryMode;
  onChange: (mode: QueryMode) => void;
}

const modes: { value: QueryMode; label: string }[] = [
  { value: 'exact', label: 'Exact' },
  { value: 'approx', label: 'Approx' },
  { value: 'both', label: 'Both' },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-purple-vivid/50">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            mode === m.value
              ? 'bg-purple-vivid text-white shadow-lg shadow-purple-vivid/25'
              : 'text-purple-light hover:bg-purple-vivid/10'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
