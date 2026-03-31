import { Recommendation } from './types';

export function recommend(
  speedup: number,
  accuracy: number,
  error: number
): Recommendation {
  let mode: 'approx' | 'exact';
  let message: string;
  let confidence: 'High' | 'Medium' | 'Low';
  let warning: string | undefined;

  if (error > 10) {
    mode = 'exact';
    message = 'Use exact mode — approximation error is too high for reliable results.';
    confidence = 'High';
    warning = `Error rate of ${error}% exceeds the 10% safety threshold. Results may be unreliable.`;
  } else if (error <= 5 && speedup >= 3) {
    mode = 'approx';
    message = `Approximate mode recommended — ${speedup}× faster with only ${error}% error.`;
    confidence = 'High';
  } else if (error <= 5 && speedup < 3) {
    mode = 'approx';
    message = `Approximate mode is viable — minimal error of ${error}%, though speedup is moderate.`;
    confidence = 'Medium';
  } else if (error > 5 && error <= 10 && speedup >= 5) {
    mode = 'approx';
    message = `Consider approximate mode — significant ${speedup}× speedup, but error is ${error}%.`;
    confidence = 'Low';
    warning = `Error rate of ${error}% is elevated. Verify results for critical use cases.`;
  } else {
    mode = 'exact';
    message = `Exact mode recommended — error of ${error}% with limited speedup of ${speedup}×.`;
    confidence = 'Medium';
  }

  return { mode, message, confidence, warning };
}
