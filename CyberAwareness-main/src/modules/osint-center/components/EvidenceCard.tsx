import React from 'react';
import { Trash2, Eye, Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import type { EvidenceItem } from '../store/evidenceStore';

interface Props {
  item: EvidenceItem;
  onView?: (item: EvidenceItem) => void;
  onDelete?: (id: string) => void;
  onExport?: (item: EvidenceItem) => void;
}

export default function EvidenceCard({ item, onView, onDelete, onExport }: Props) {
  return (
    <div className="p-4 bg-gradient-to-br from-slate-900/80 via-slate-900 to-black border border-cyan-800/20 rounded-2xl shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-cyan-200">{item.title}</h3>
          <div className="text-sm text-slate-400 mt-1">{item.summary ?? <span className="text-slate-600">No summary</span>}</div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {item.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-cyan-900/20 text-cyan-200 rounded">#{t}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView?.(item)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onExport?.(item)}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete?.(item.id)}>
              <Trash2 className="w-4 h-4 text-rose-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
