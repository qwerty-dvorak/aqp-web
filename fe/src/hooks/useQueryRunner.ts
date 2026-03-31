'use client';

import { useState, useCallback } from 'react';
import { QueryMode, QueryResult } from '@/lib/types';

export function useQueryRunner() {
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async (query: string, mode: QueryMode, accuracyLevel: number, dataset: string): Promise<QueryResult | null> => {
      if (!query.trim()) return null;

      setIsLoading(true);
      setResults(null);

      try {
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, mode, accuracyLevel, dataset }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: QueryResult = await response.json();
        setResults(data);
        return data;
      } catch (error) {
        console.error('Query execution failed:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { results, isLoading, run };
}
