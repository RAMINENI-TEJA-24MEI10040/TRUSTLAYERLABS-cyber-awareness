import React from 'react';
import useCIWStore from '../store/ciwStore';

const CIWSummaryPanel: React.FC = () => {
  const cases = useCIWStore((s) => s.cases);
  const activeCaseId = useCIWStore((s) => s.activeCaseId);
  const lastResponse = useCIWStore((s) => s.lastResponse);

  const active = cases.find((c) => c.id === activeCaseId);

  const totalQueries = active ? active.queries.length : 0;
  const totalResults = active
    ? Object.values(active.results).reduce((sum, arr) => sum + (arr?.length ?? 0), 0)
    : 0;

  const riskScore = (() => {
    if (!active) return 0;
    const all = Object.values(active.results).flat();
    if (all.length === 0) return 0;
    const sum = all.reduce((s, r) => s + (r.score ?? 0), 0);
    return Math.round(sum / all.length);
  })();

  const lastActivity = active?.updatedAt ?? lastResponse?.query.timestamp ?? null;

  return (
    <div>
      <div className="mb-3">
        <div className="text-xs text-cyan-300">Active Case</div>
        <div className="text-cyan-100 font-semibold text-lg">{active?.title ?? 'No active case'}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-[rgba(10,20,30,0.5)] p-3 rounded-md">
          <div className="text-cyan-300 text-xs">Queries</div>
          <div className="text-cyan-100 font-semibold">{totalQueries}</div>
        </div>
        <div className="bg-[rgba(10,20,30,0.5)] p-3 rounded-md">
          <div className="text-cyan-300 text-xs">Results</div>
          <div className="text-cyan-100 font-semibold">{totalResults}</div>
        </div>
        <div className="bg-[rgba(10,20,30,0.5)] p-3 rounded-md">
          <div className="text-cyan-300 text-xs">Risk Score</div>
          <div className="text-cyan-100 font-semibold">{riskScore}%</div>
        </div>
        <div className="bg-[rgba(10,20,30,0.5)] p-3 rounded-md">
          <div className="text-cyan-300 text-xs">Last Activity</div>
          <div className="text-cyan-100 font-semibold">{lastActivity ? new Date(lastActivity).toLocaleString() : '—'}</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-cyan-200/60">Quick actions: export case, add note, handoff to Cyber Justice AI.</div>
    </div>
  );
};

export default CIWSummaryPanel;
