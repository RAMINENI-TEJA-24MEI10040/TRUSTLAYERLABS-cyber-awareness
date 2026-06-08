import React from 'react';

interface Props {
  value?: string;
  onChange: (val?: string) => void;
}

const OPTIONS = ['all', 'case_created', 'query_executed', 'evidence_saved', 'evidence_deleted', 'report_exported'];

export default function TimelineFilter({ value, onChange }: Props) {
  return (
    <select value={value ?? 'all'} onChange={(e) => onChange(e.target.value === 'all' ? undefined : e.target.value)} className="bg-slate-800 border border-slate-700 text-cyan-200 rounded px-3 py-2">
      {OPTIONS.map((o) => (
        <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>
      ))}
    </select>
  );
}
