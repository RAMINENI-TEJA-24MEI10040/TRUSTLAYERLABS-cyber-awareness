import { IntelligenceResult } from '../types/ciw.types';

// Lightweight risk scoring fallback used by CIW orchestrator.
// Returns a normalized score between 0 and 1.
export default function scoreIntel(result: IntelligenceResult): number {
  // If the result already carries a score (0-100), normalize to 0-1
  if (typeof result.score === 'number') {
    return Math.max(0, Math.min(1, result.score / 100));
  }

  // Heuristic: presence of meta entries increases confidence
  const metaCount = Array.isArray(result.meta) ? result.meta.length : 0;
  const base = Math.min(0.5 + metaCount * 0.1, 0.95);
  return base;
}
