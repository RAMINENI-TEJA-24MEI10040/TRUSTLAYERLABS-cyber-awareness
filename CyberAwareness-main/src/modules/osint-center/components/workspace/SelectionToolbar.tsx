import React from 'react';
import useWorkspaceStore from '../../store/workspaceStore';

const SelectionToolbar: React.FC = () => {
  const selected = useWorkspaceStore((s) => s.selectedNodes);
  const clearSelection = useWorkspaceStore((s) => s.clearSelection);
  const groupSelected = useWorkspaceStore((s) => s.groupSelectedNodes);
  const toggleTag = useWorkspaceStore((s) => s.toggleTag);
  const selectMultiple = useWorkspaceStore((s) => s.selectMultiple);
  const allVisible = useWorkspaceStore((s) => s.visibleIds);
  const selectedNodesSet = new Set(selected);

  if (!selected.length) return null;

  const onSelectAllVisible = () => {
    if (allVisible?.length) selectMultiple(allVisible);
  };
  const onInvert = () => {
    if (allVisible?.length) {
      const inverted = allVisible.filter((id) => !selectedNodesSet.has(id));
      selectMultiple(inverted);
    }
  };

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#031317]/80 border border-cyan-800/40 rounded-md p-2 flex gap-2 backdrop-blur">
      <div className="text-cyan-200 text-sm font-semibold">Selected: <span className="text-white">{selected.length}</span></div>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => groupSelected('Group', '#0ff')}>Group</button>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => toggleTag(selected[0], 'Suspicious')}>Tag</button>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => { navigator.clipboard.writeText(JSON.stringify(selected)); }}>Export</button>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => onSelectAllVisible()}>Select All</button>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => onInvert()}>Invert</button>
      <button className="px-3 py-1 bg-cyan-700/40 rounded" onClick={() => clearSelection()}>Clear</button>
    </div>
  );
};

export default SelectionToolbar;
