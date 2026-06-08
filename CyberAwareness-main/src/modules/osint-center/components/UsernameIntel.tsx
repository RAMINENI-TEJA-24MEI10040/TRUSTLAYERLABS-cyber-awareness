import React from 'react';
import { IntelligenceResult } from '../types/ciw.types';

interface UsernameIntelProps {
  result: IntelligenceResult;
}

export default function UsernameIntel({ result }: UsernameIntelProps) {
  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/20 shadow-sm">
      <div className="text-cyan-300 font-semibold mb-2">{result.title}</div>
      <div className="text-white mb-3">{result.summary ?? 'Username intelligence summary unavailable.'}</div>
      <div className="text-xs uppercase tracking-[0.12em] text-cyan-400 mb-3">Score: {result.score ?? 'N/A'}</div>
      {result.meta.map((meta) => (
        <div key={`${meta.sourceName}-${meta.fetchedAt}`} className="mb-3">
          <div className="text-sm text-cyan-200">{meta.sourceName}</div>
          <pre className="text-xs text-slate-300 bg-slate-950 rounded-md p-2 overflow-x-auto">{JSON.stringify(meta.raw ?? meta, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
