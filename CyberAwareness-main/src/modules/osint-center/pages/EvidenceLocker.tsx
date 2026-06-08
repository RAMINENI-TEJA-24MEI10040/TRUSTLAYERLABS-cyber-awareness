import React, { useState } from 'react';
import useEvidenceStore from '../store/evidenceStore';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceViewerModal from '../components/EvidenceViewerModal';
import Button from '../../../components/ui/Button';
import useCIWStore from '../store/ciwStore';

const EvidenceLockerPage: React.FC = () => {
  const items = useEvidenceStore((s) => s.items);
  const exportAll = useEvidenceStore((s) => s.exportAll);
  const deleteEvidence = useEvidenceStore((s) => s.deleteEvidence);
  const clearAll = useEvidenceStore((s) => s.clearAll);

  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [viewerOpen, setViewerOpen] = useState(false);
  const ciwCases = useCIWStore((s) => s.cases);

  // pagination for large evidence sets
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  const handleView = (itemId: string) => {
    setSelected(itemId);
    setViewerOpen(true);
  };

  const handleExportAll = () => {
    const payload = exportAll();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(payload);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `evidence-all-${new Date().toISOString()}.json`;
    a.click();
  };

  const itemObj = items.find((i) => i.id === selected);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cyan-200">Evidence Locker</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportAll}>Export All</Button>
          <Button variant="ghost" onClick={() => clearAll()}>Clear</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pageItems.map((it) => (
          <div key={it.id}>
            <EvidenceCard item={it} onView={() => handleView(it.id)} onDelete={() => deleteEvidence(it.id)} onExport={(itm) => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(itm, null, 2));
              const a = document.createElement('a');
              a.href = dataStr;
              a.download = `evidence-${itm.id}.json`;
              a.click();
            }} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400">Page {page} / {totalPages}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 text-xs rounded border">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 text-xs rounded border">Next</button>
        </div>
      </div>

      <EvidenceViewerModal open={viewerOpen} item={itemObj} onClose={() => setViewerOpen(false)} />

      {/* show linked cases for context */}
      <div className="mt-8 p-4 bg-slate-900/20 border border-cyan-800/10 rounded">
        <h3 className="text-sm text-slate-400 mb-2">Investigation Cases</h3>
        <ul className="text-sm text-slate-200">
          {ciwCases.map((c) => (
            <li key={c.id} className="mb-1">{c.title} — {c.queries.length} queries</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
