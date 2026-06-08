import React from 'react';
import ciwStore from '../store/ciwStore';

const ActiveCasesConsole: React.FC = () => {
  const { cases, setActiveCase } = ciwStore.getState();

  return (
    <div className="p-3 bg-black/60 border border-cyan-800/20 rounded-sm text-cyan-200 font-mono">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-cyan-300 text-sm">Active Cases</h4>
      </div>
      <div className="space-y-2 max-h-60 overflow-auto text-xs">
        {cases.map(c => (
          <div key={c.id} className="flex items-center justify-between px-2 py-1 bg-black/30 border-b border-cyan-900/10">
            <div>
              <div className="text-cyan-100">{c.title}</div>
              <div className="text-slate-400 text-[11px]">{c.id}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-xs px-2 py-0.5 border border-cyan-800 rounded" onClick={() => setActiveCase?.(c.id)}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveCasesConsole;
