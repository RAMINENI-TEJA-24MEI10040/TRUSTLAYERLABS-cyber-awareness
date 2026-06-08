import React, { useEffect, useState } from 'react';
import useWorkspaceStore from '../../store/workspaceStore';
import { evidenceStoreAdapter } from '../../services/evidenceStoreAdapter';

const ContextMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [nodeId, setNodeId] = useState<string | null>(null);
  const selectNode = useWorkspaceStore((s) => s.selectNode);
  const groupSelected = useWorkspaceStore((s) => s.groupSelectedNodes);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setVisible(true);
      setX(e.detail?.x ?? 0);
      setY(e.detail?.y ?? 0);
      setNodeId(e.detail?.nodeId ?? null);
    };
    window.addEventListener('ciw:node-context', handler as EventListener);
    window.addEventListener('ciw:canvas-context', handler as EventListener);
    const hide = () => setVisible(false);
    window.addEventListener('click', hide);
    return () => {
      window.removeEventListener('ciw:node-context', handler as EventListener);
      window.removeEventListener('ciw:canvas-context', handler as EventListener);
      window.removeEventListener('click', hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{ left: x, top: y }} className="fixed z-50 bg-[#021214] border border-cyan-800/40 rounded shadow p-2 text-sm text-slate-200">
      {nodeId ? (
        <div className="flex flex-col gap-1">
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { selectNode(nodeId); setVisible(false); }}>Investigate</button>
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { evidenceStoreAdapter.addEvidenceForEntity(nodeId); setVisible(false); }}>Add Evidence</button>
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { groupSelected('Group', '#0ff'); setVisible(false); }}>Add To Group</button>
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { 
            const pos = useWorkspaceStore.getState().nodePositions[nodeId];
            if (pos) {
              const setViewport = useWorkspaceStore.getState().setViewport;
              setViewport({ x: -pos.x + window.innerWidth / 2, y: -pos.y + window.innerHeight / 2, scale: 1 });
            }
            setVisible(false);
          }}>Focus</button>
          <button className="px-3 py-1 hover:bg-red-900 rounded" onClick={() => { 
            if (confirm('Delete node? This will hide it from the workspace.')) {
              const current = useWorkspaceStore.getState().removedNodes;
              useWorkspaceStore.setState({ removedNodes: [...current, nodeId] });
            }
            setVisible(false);
          }}>Delete</button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { groupSelected('Group', '#0ff'); setVisible(false); }}>New Group</button>
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { window.dispatchEvent(new CustomEvent('ciw:select-all-visible')); setVisible(false); }}>Select All</button>
          <button className="px-3 py-1 hover:bg-cyan-900 rounded" onClick={() => { window.dispatchEvent(new CustomEvent('ciw:reset-view')); setVisible(false); }}>Reset View</button>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
