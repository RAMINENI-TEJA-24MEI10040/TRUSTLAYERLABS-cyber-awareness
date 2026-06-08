import React, { useState } from 'react';
import useWorkspaceStore from '../../store/workspaceStore';

interface Props { groupId: string; onClose: () => void }

const GroupModal: React.FC<Props> = ({ groupId, onClose }) => {
  const group = useWorkspaceStore((s) => s.groups[groupId]);
  const renameGroup = useWorkspaceStore((s) => s.renameGroup);
  const updateGroupColor = useWorkspaceStore((s) => s.updateGroupColor);
  const deleteGroup = useWorkspaceStore((s) => s.deleteGroup);
  const setGroupMembers = useWorkspaceStore((s) => s.setGroupMembers);

  const [name, setName] = useState(group?.name ?? 'Group');
  const [color, setColor] = useState(group?.color ?? '#0ff');
  const [members, setMembers] = useState<string[]>((group?.members) ?? []);

  if (!group) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 rounded p-4 w-96 border border-cyan-800/40">
        <h3 className="text-cyan-100 font-semibold mb-2">Edit Group</h3>
        <label className="text-xs text-slate-300">Name</label>
        <input className="w-full mb-2 p-2 rounded bg-slate-800 text-white" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="text-xs text-slate-300">Color</label>
        <input type="color" className="w-full mb-2 h-8" value={color} onChange={(e) => setColor(e.target.value)} />
        <label className="text-xs text-slate-300">Members (comma separated ids)</label>
        <textarea className="w-full mb-2 p-2 rounded bg-slate-800 text-white" value={members.join(',')} onChange={(e) => setMembers(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 rounded bg-gray-700" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-emerald-700" onClick={() => { renameGroup(groupId, name); updateGroupColor(groupId, color); setGroupMembers(groupId, members); onClose(); }}>Save</button>
          <button className="px-3 py-1 rounded bg-red-700" onClick={() => { if (confirm('Delete group?')) { deleteGroup(groupId); onClose(); } }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
