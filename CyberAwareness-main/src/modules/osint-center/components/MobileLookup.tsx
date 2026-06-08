import React from 'react';
import { IntelligenceResult } from '../types/ciw.types';

interface MobileLookupProps {
  result: IntelligenceResult;
}

export default function MobileLookup({ result }: MobileLookupProps) {
  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-cyan-600/20 shadow-sm">
      <div className="text-sm text-cyan-300 mb-2">{result.title}</div>
      <div className="text-white mb-3">{result.summary ?? 'No summary available'}</div>
      <div className="text-xs uppercase tracking-[0.12em] text-cyan-400 mb-3">Score: {result.score ?? 'N/A'}</div>
      <div className="space-y-2 text-sm text-slate-200">
        {result.meta.map((meta) => (
          <div key={`${meta.sourceName}-${meta.fetchedAt}`}>
            <div className="font-semibold text-cyan-200">{meta.sourceName}</div>
            <pre className="whitespace-pre-wrap break-words text-xs text-slate-300 bg-slate-950/70 p-2 rounded-md">
              {JSON.stringify(meta.raw ?? meta, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
