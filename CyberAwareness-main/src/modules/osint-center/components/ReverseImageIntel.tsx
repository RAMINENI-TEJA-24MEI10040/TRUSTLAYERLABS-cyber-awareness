import React from 'react';
import { IntelligenceResult } from '../types/ciw.types';

interface ReverseImageIntelProps {
  result: IntelligenceResult;
}

export default function ReverseImageIntel({ result }: ReverseImageIntelProps) {
  const architecture = result.meta.find((meta) => meta.sourceName === 'reverse-image-architecture')?.raw;

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/20 shadow-sm">
      <div className="text-cyan-300 font-semibold mb-2">{result.title}</div>
      <div className="text-white mb-3">{result.summary ?? 'Reverse image intelligence is ready to initialize.'}</div>
      <div className="text-xs uppercase tracking-[0.12em] text-cyan-400 mb-3">Score: {result.score ?? 'N/A'}</div>
      {architecture ? (
        <div className="space-y-3">
          <div className="font-semibold text-cyan-200">Integration architecture</div>
          <pre className="text-xs text-slate-300 bg-slate-950 rounded-md p-2 overflow-x-auto">{JSON.stringify(architecture, null, 2)}</pre>
        </div>
      ) : (
        <div className="text-slate-300">No reverse image architecture metadata available.</div>
      )}
    </div>
  );
}
