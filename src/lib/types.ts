export type QueryMode = 'exact' | 'approx' | 'both';

export interface TableRow {
  category: string;
  exact: number;
  approx: number;
  error: number;
}

export interface Recommendation {
  mode: 'approx' | 'exact';
  message: string;
  confidence: 'High' | 'Medium' | 'Low';
  warning?: string;
}

export interface QueryResult {
  exactTime: number;
  approxTime: number;
  speedup: number;
  exactResult: number;
  approxResult: number;
  error: number;
  tableRows: TableRow[];
  recommendation: Recommendation;
}
