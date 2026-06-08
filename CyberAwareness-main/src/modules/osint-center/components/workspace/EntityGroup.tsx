import React, { useState } from 'react';
import useWorkspaceStore from '../../store/workspaceStore';

interface EntityGroupProps {
  id: string;
}

const EntityGroup: React.FC<EntityGroupProps> = ({ id }) => {
  const group = useWorkspaceStore((s) => s.panels[id] as any);
  const setPanel = useWorkspaceStore((s) => s.setPanel);
  const [name, setName] = useState(group?.name ?? 'Group');

  if (!group) return null;

  const toggleCollapse = () => setPanel(id, { ...(group), collapsed: !group.collapsed });
  const rename = () => setPanel(id, { ...(group), name });

  return (
    <div className="p-2 bg-[#021317] border border-cyan-800/30 rounded text-cyan-100 w-56">
      <div className="flex items-center justify-between mb-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-b border-cyan-700/20 text-sm" />
        <div className="flex items-center gap-2">
          <button onClick={rename} className="text-xs px-2 py-1 border rounded">Save</button>
          <button onClick={toggleCollapse} className="text-xs px-2 py-1 border rounded">{group.collapsed ? 'Expand' : 'Collapse'}</button>
        </div>
      </div>
      <div className="text-xs text-slate-400">Members: {Array.isArray(group.members) ? group.members.length : 0}</div>
    </div>
  );
};

export default EntityGroup;
