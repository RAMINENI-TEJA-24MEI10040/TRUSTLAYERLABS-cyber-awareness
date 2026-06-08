import React, { useState, useMemo } from 'react';
import { useWorkspaceManagerStore } from '../store/workspaceManagerStore';
import { Plus, Archive, Copy, Trash2, Edit2, Search } from 'lucide-react';

interface CreateModalState {
  open: boolean;
  name: string;
  description: string;
}

export function WorkspaceDashboard(): JSX.Element {
  const {
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
    archiveWorkspace,
    duplicateWorkspace,
  } = useWorkspaceManagerStore();

  const [createModal, setCreateModal] = useState<CreateModalState>({
    open: false,
    name: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredWorkspaces = useMemo(() => {
    let ws = workspaces.filter((w) => (showArchived ? w.status === 'archived' : w.status === 'active'));
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      ws = ws.filter(
        (w) =>
          w.name.toLowerCase().includes(lower) ||
          w.description.toLowerCase().includes(lower) ||
          w.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    return ws.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [workspaces, searchQuery, showArchived]);

  const recentWorkspaces = useMemo(
    () => workspaces.filter((w) => w.status === 'active').slice(0, 5),
    [workspaces]
  );

  const handleCreateWorkspace = (): void => {
    if (!createModal.name.trim()) return;
    createWorkspace(createModal.name, createModal.description);
    setCreateModal({ open: false, name: '', description: '' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Investigation Workspaces</h1>
          <p className="text-gray-400 mt-1">Manage your cyber investigation workspaces</p>
        </div>
        <button
          onClick={() => setCreateModal({ ...createModal, open: true })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 transition"
        >
          <Plus size={18} />
          New Workspace
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search workspaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-cyan-500/20 text-white rounded focus:outline-none focus:border-cyan-500/40"
        />
      </div>

      {/* Recent Workspaces */}
      {!showArchived && recentWorkspaces.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">Recent</h2>
          <div className="grid gap-3">
            {recentWorkspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => switchWorkspace(ws.id)}
                className={`p-4 rounded border cursor-pointer transition ${
                  activeWorkspaceId === ws.id
                    ? 'bg-cyan-500/10 border-cyan-500/60'
                    : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{ws.name}</h3>
                    <p className="text-sm text-gray-400">{ws.description}</p>
                    <div className="flex gap-2 mt-2">
                      {ws.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(ws.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Workspaces */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-300">
            {showArchived ? 'Archived' : 'Active'} Workspaces
          </h2>
          {workspaces.some((w) => w.status === 'archived') && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
          )}
        </div>

        {filteredWorkspaces.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No workspaces match your search' : 'No workspaces yet'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWorkspaces.map((ws) => (
              <div
                key={ws.id}
                className={`p-4 rounded border transition ${
                  activeWorkspaceId === ws.id
                    ? 'bg-cyan-500/10 border-cyan-500/60'
                    : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => switchWorkspace(ws.id)}>
                    {editingId === ws.id ? (
                      <input
                        autoFocus
                        value={ws.name}
                        onChange={(e) => renameWorkspace(ws.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="w-full px-2 py-1 bg-gray-800 border border-cyan-500/40 text-white rounded text-sm"
                      />
                    ) : (
                      <h3 className="font-semibold text-white hover:text-cyan-300">{ws.name}</h3>
                    )}
                    <p className="text-sm text-gray-400">{ws.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {ws.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingId(ws.id)}
                      className="p-2 hover:bg-gray-800 rounded transition text-gray-400 hover:text-cyan-300"
                      title="Rename"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => duplicateWorkspace(ws.id)}
                      className="p-2 hover:bg-gray-800 rounded transition text-gray-400 hover:text-cyan-300"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    {!showArchived && (
                      <button
                        onClick={() => archiveWorkspace(ws.id)}
                        className="p-2 hover:bg-gray-800 rounded transition text-gray-400 hover:text-cyan-300"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteWorkspace(ws.id)}
                      className="p-2 hover:bg-gray-800 rounded transition text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 flex gap-4">
                  <span>Created: {new Date(ws.createdAt).toLocaleDateString()}</span>
                  <span>Modified: {new Date(ws.updatedAt).toLocaleDateString()}</span>
                  <span>Snapshots: {ws.snapshotIds.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-500/40 rounded p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">New Workspace</h2>

            <input
              type="text"
              placeholder="Workspace name"
              value={createModal.name}
              onChange={(e) => setCreateModal({ ...createModal, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-cyan-500/40"
            />

            <textarea
              placeholder="Description (optional)"
              value={createModal.description}
              onChange={(e) => setCreateModal({ ...createModal, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-cyan-500/40 resize-none h-20"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCreateModal({ ...createModal, open: false })}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={!createModal.name.trim()}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 disabled:opacity-50 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDashboard;
