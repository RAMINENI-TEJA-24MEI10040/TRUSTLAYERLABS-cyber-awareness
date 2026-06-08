import React from 'react';
import { TimelineEvent } from '../store/timelineStore';

const severityMap: Record<string, string> = {
  low: 'text-green-300 bg-green-900/20 border-green-700/20',
  medium: 'text-yellow-300 bg-yellow-900/20 border-yellow-700/20',
  high: 'text-orange-300 bg-orange-900/20 border-orange-700/20',
  critical: 'text-rose-300 bg-rose-900/20 border-rose-700/20',
  info: 'text-cyan-200 bg-cyan-900/10 border-cyan-700/10',
};

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventCard({ event }: Props) {
  const sevClass = severityMap[event.severity] ?? severityMap.info;
  return (
    <div className={`p-4 rounded-xl border ${sevClass} shadow-lg bg-gradient-to-br from-slate-900/60 to-black`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-400">{new Date(event.timestamp).toLocaleString()}</div>
          <h4 className="text-cyan-200 font-semibold mt-1">{event.title}</h4>
          <div className="text-sm text-slate-300 mt-1">{event.description}</div>
        </div>
        <div className="ml-4 text-xs uppercase font-bold">{event.eventType}</div>
      </div>
    </div>
  );
}
