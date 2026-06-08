import React from 'react';
import { saveWorkspace, exportWorkspace, importWorkspace } from '../../services/workspacePersistence';
import useWorkspaceStore from '../../store/workspaceStore';

const WorkspaceToolbar: React.FC = () => {
  const setZoom = useWorkspaceStore((s) => s.setZoom);
  const clearSelection = useWorkspaceStore((s) => s.clearSelection);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await importWorkspace(f);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-[#021318] border-b border-cyan-800/20">
      <button onClick={() => saveWorkspace()} className="px-2 py-1 bg-cyan-600 rounded text-black text-sm">Save Workspace</button>
      <button onClick={() => exportWorkspace()} className="px-2 py-1 bg-transparent border border-cyan-700 rounded text-sm">Export</button>
      <label className="px-2 py-1 bg-transparent border border-cyan-700 rounded text-sm cursor-pointer">
        Import
        <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
      </label>
      <button onClick={() => setZoom(1)} className="px-2 py-1 border rounded text-sm">Fit View</button>
      <button onClick={() => clearSelection()} className="px-2 py-1 border rounded text-sm">Clear Selection</button>
    </div>
  );
};

export default WorkspaceToolbar;
