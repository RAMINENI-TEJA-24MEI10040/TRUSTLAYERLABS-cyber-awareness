import React from 'react';
import { motion } from 'framer-motion';
import timelineStore from '../store/timelineStore';

const ThreatFeedPanel: React.FC = () => {
  const events = timelineStore.getState().events.slice().sort((a,b)=> new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0,8);

  return (
    <div className="p-3 bg-black/60 border border-cyan-800/20 rounded-sm text-cyan-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-mono text-sm text-cyan-300">Threat Feed</h4>
      </div>
      <div className="space-y-1 text-xs font-mono">
        {events.map(e => (
          <div key={e.id} className="flex justify-between items-start py-1 px-2 bg-black/30 border-b border-cyan-900/10">
            <div>
              <div className="text-[11px] text-slate-400">{new Date(e.timestamp).toLocaleString()}</div>
              <div className="text-sm text-cyan-100">{e.title}</div>
            </div>
            <div className={`text-xs px-2 py-0.5 rounded ${e.severity === 'high' ? 'bg-rose-700/40' : 'bg-cyan-900/20'}`}>{e.severity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatFeedPanel;
