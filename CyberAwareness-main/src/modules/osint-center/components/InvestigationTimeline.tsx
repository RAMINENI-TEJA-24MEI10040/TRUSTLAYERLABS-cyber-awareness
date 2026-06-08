import React, { useMemo, useState } from 'react';
import useTimelineStore, { TimelineEvent } from '../store/timelineStore';
import useCIWStore from '../store/ciwStore';
import TimelineEventCard from './TimelineEventCard';
import TimelineFilter from './TimelineFilter';
import Button from '../../../components/ui/Button';

export default function InvestigationTimeline() {
  const activeCaseId = useCIWStore((s) => s.activeCaseId);
  const events = useTimelineStore((s) => s.events);
  const exportEvents = useTimelineStore((s) => s.exportEvents);

  const [filter, setFilter] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    let list = events;
    if (activeCaseId) list = list.filter((e) => e.caseId === activeCaseId);
    if (filter) list = list.filter((e) => e.eventType === filter);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, activeCaseId, filter]);

  const handleExport = () => {
    const payload = exportEvents(activeCaseId);
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(payload);
    a.download = `timeline-${activeCaseId ?? 'all'}-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="p-4 bg-gradient-to-br from-slate-900/50 via-slate-900 to-black border border-cyan-900/20 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyan-200">Investigation Timeline</h3>
        <div className="flex gap-2">
          <TimelineFilter value={filter} onChange={setFilter} />
          <Button variant="secondary" onClick={handleExport}>Export</Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-slate-400">No timeline events yet for this case.</div>}
        {filtered.map((ev: TimelineEvent) => (
          <TimelineEventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
