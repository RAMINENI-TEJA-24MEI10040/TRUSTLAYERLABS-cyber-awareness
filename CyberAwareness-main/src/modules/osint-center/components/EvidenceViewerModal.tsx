import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import useEvidenceStore, { EvidenceItem } from '../store/evidenceStore';

interface Props {
  open: boolean;
  item?: EvidenceItem;
  onClose: () => void;
}

export default function EvidenceViewerModal({ open, item, onClose }: Props) {
  const updateNotes = useEvidenceStore((s) => s.updateNotes);
  const addTag = useEvidenceStore((s) => s.addTag);
  const removeTag = useEvidenceStore((s) => s.removeTag);

  const [notes, setNotes] = useState(item?.notes ?? '');
  const [newTag, setNewTag] = useState('');

  React.useEffect(() => {
    setNotes(item?.notes ?? '');
  }, [item]);

  if (!open || !item) return null;

  const handleSave = () => {
    updateNotes(item.id, notes);
    onClose();
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `evidence-${item.id}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-4xl w-full bg-gradient-to-br from-slate-900 to-black border border-cyan-800/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyan-200">Evidence Details</h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExport}>Export</Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-400 mb-2">Title</div>
            <div className="text-white font-semibold mb-4">{item.title}</div>

            <div className="text-sm text-slate-400 mb-2">Summary</div>
            <div className="text-slate-200 mb-4">{item.summary}</div>

            <div className="text-sm text-slate-400 mb-2">Tags</div>
            <div className="flex gap-2 flex-wrap mb-4">
              {item.tags.map((t) => (
                <div key={t} className="flex items-center gap-2 bg-cyan-900/20 px-2 py-1 rounded">
                  <div className="text-xs text-cyan-200">#{t}</div>
                  <button onClick={() => removeTag(item.id, t)} className="text-xs text-rose-400">x</button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="add tag" className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm" />
                <Button size="sm" variant="primary" onClick={() => { if (newTag.trim()) { addTag(item.id, newTag.trim()); setNewTag(''); } }}>Add</Button>
              </div>
            </div>

            <div className="text-sm text-slate-400 mb-2">Notes</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full min-h-[120px] bg-slate-800 border border-slate-700 p-2 rounded text-sm text-slate-200" />

            <div className="flex gap-2 mt-4">
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-400 mb-2">Raw JSON</div>
            <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 max-h-[480px] overflow-auto">{JSON.stringify(item.raw ?? item, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
