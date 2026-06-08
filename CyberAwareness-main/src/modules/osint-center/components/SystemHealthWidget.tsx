import React from 'react';
import ciwStore from '../store/ciwStore';

const SystemHealthWidget: React.FC = () => {
  const cases = ciwStore.getState().cases.length;
  const active = !!ciwStore.getState().activeCaseId;

  return (
    <div className="p-3 bg-black/60 border border-cyan-800/20 rounded-sm text-cyan-200 font-mono text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-cyan-300">System Health</div>
        <div className="text-xs text-slate-400">Realtime</div>
      </div>
      <div className="space-y-1">
        <div>Open Cases: <span className="text-cyan-100">{cases}</span></div>
        <div>Active Case: <span className={`ml-1 ${active ? 'text-green-300' : 'text-slate-500'}`}>{active ? 'Yes' : 'No'}</span></div>
        <div>Last Sync: <span className="text-slate-400">{new Date().toLocaleString()}</span></div>
      </div>
    </div>
  );
};

export default SystemHealthWidget;
