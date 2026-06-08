import React, { useMemo } from 'react';
import useCIWStore from '../store/ciwStore';
import timelineStore from '../store/timelineStore';

const InvestigationStatsWidget: React.FC = () => {
  const cases = useCIWStore((state) => state.cases);
  const lastResults = useCIWStore((state) => state.lastResults);
  const activeCaseId = useCIWStore((state) => state.activeCaseId);
  const timelineEvents = useMemo(() => {
    return timelineStore.getState().events?.filter((e) => e.caseId === activeCaseId) || [];
  }, [activeCaseId]);
  
  const total = cases.length;
  const evidenceCount = lastResults?.length || 0;
  const timelineCount = timelineEvents.length;

  return (
    <div className="p-3 bg-black/60 border border-cyan-800/20 rounded-sm text-cyan-200 font-mono">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-cyan-300 text-sm">Investigation Stats</h4>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 bg-black/30 rounded">Cases<br/><span className="text-cyan-200 text-lg">{total}</span></div>
        <div className="p-2 bg-black/30 rounded">Evidence<br/><span className="text-cyan-200 text-lg">{evidenceCount}</span></div>
        <div className="p-2 bg-black/30 rounded">Active<br/><span className="text-cyan-200 text-lg">{activeCaseId ? 'Yes' : 'No'}</span></div>
        <div className="p-2 bg-black/30 rounded">Timeline<br/><span className="text-cyan-200 text-lg">{timelineCount}</span></div>
      </div>
    </div>
  );
};

export default InvestigationStatsWidget;
