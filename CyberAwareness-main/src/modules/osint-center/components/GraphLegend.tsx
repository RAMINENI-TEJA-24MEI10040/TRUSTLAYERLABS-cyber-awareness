import React from 'react';

const nodeTypes = [
  { label: 'IP', color: '#0ff' },
  { label: 'Domain', color: '#7cffec' },
  { label: 'Email', color: '#4ade80' },
  { label: 'Username', color: '#60a5fa' },
  { label: 'Wallet', color: '#f472b6' },
  { label: 'Mobile', color: '#38bdf8' },
  { label: 'Evidence', color: '#c084fc' },
];

const relationshipTypes = [
  { label: 'owns', color: '#0ff' },
  { label: 'linked_to', color: '#7cffec' },
  { label: 'contacted', color: '#fef08a' },
  { label: 'associated_with', color: '#a78bfa' },
  { label: 'observed_in', color: '#f97316' },
];

export default function GraphLegend() {
  return (
    <div className="space-y-4 text-slate-100">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-cyan-300 mb-2">Node types</div>
        <div className="grid grid-cols-2 gap-2">
          {nodeTypes.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs bg-slate-900/80 border border-cyan-800/40 rounded px-2 py-2">
              <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-cyan-300 mb-2">Relationships</div>
        <div className="grid grid-cols-1 gap-2">
          {relationshipTypes.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs bg-slate-900/80 border border-cyan-800/40 rounded px-2 py-2">
              <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
