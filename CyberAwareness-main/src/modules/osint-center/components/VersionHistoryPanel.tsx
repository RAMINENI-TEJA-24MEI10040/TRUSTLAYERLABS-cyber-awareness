import React, { useState, useEffect } from 'react';
import { listSnapshots, restoreSnapshot, deleteSnapshot, compareSnapshots } from '../services/workspaceSnapshotService';
import { useWorkspaceManagerStore } from '../store/workspaceManagerStore';
import { Trash2, RotateCcw, Clock } from 'lucide-react';

interface SnapshotDisplay {
  id: string;
  timestamp: string;
  author: string;
  description: string;
}

export function VersionHistoryPanel(): JSX.Element {
  const { activeWorkspaceId, removeSnapshot } = useWorkspaceManagerStore();
  const [snapshots, setSnapshots] = useState<SnapshotDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<{ snap1: string; snap2: string } | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, [activeWorkspaceId]);

  const loadSnapshots = async (): Promise<void> => {
    if (!activeWorkspaceId) return;
    setIsLoading(true);
    try {
      const loaded = await listSnapshots(activeWorkspaceId);
      setSnapshots(loaded);
      if (loaded.length > 0 && !selectedSnapshotId) {
        setSelectedSnapshotId(loaded[0].id);
      }
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (snapshotId: string): Promise<void> => {
    if (!activeWorkspaceId) return;
    setRestoring(snapshotId);
    try {
      await restoreSnapshot(snapshotId);
      setRestoring(null);
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
      setRestoring(null);
    }
  };

  const handleDelete = async (snapshotId: string): Promise<void> => {
    if (!activeWorkspaceId) return;
    if (!confirm('Delete this snapshot? This cannot be undone.')) return;

    try {
      await deleteSnapshot(snapshotId);
      removeSnapshot(activeWorkspaceId, snapshotId);
      await loadSnapshots();
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
    }
  };

  const handleCompare = async (snap1Id: string, snap2Id: string): Promise<void> => {
    setCompareMode({ snap1: snap1Id, snap2: snap2Id });
    try {
      const diff = await compareSnapshots(snap1Id, snap2Id);
      console.log('Snapshot diff:', diff);
    } catch (error) {
      console.error('Failed to compare snapshots:', error);
      setCompareMode(null);
    }
  };

  if (!activeWorkspaceId) {
    return (
      <div className="p-6 text-center text-gray-400">
        Select a workspace to view version history
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Version History</h1>
          <p className="text-gray-400 mt-1">Workspace snapshots and recovery points</p>
        </div>
        <button
          onClick={loadSnapshots}
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 disabled:opacity-50 transition"
        >
          Refresh
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading snapshots...</div>
        ) : snapshots.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No snapshots yet. Auto-save will create snapshots every 60 seconds.
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Timeline */}
            <div className="space-y-4">
              {snapshots.map((snap, idx) => (
                <div key={snap.id} className="flex gap-4">
                  {/* Timeline Dot & Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedSnapshotId === snap.id
                          ? 'bg-cyan-400 ring-2 ring-cyan-400/30'
                          : 'bg-gray-600 hover:bg-cyan-400'
                      } transition cursor-pointer`}
                      onClick={() => setSelectedSnapshotId(snap.id)}
                    />
                    {idx < snapshots.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-700 mt-2" />
                    )}
                  </div>

                  {/* Snapshot Card */}
                  <div
                    className={`flex-1 p-4 rounded border transition cursor-pointer ${
                      selectedSnapshotId === snap.id
                        ? 'bg-cyan-500/10 border-cyan-500/60'
                        : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSnapshotId(snap.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-cyan-400" />
                        <span className="font-semibold text-white">
                          {new Date(snap.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(snap.id);
                          }}
                          disabled={restoring === snap.id}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded border border-green-500/30 text-xs disabled:opacity-50 transition"
                        >
                          <RotateCcw size={14} />
                          {restoring === snap.id ? 'Restoring...' : 'Restore'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(snap.id);
                          }}
                          className="p-1.5 hover:bg-gray-800 rounded transition text-gray-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">{snap.description}</p>
                      <p className="text-xs text-gray-500">Author: {snap.author}</p>
                    </div>

                    {/* Compare Option */}
                    {selectedSnapshotId && selectedSnapshotId !== snap.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompare(selectedSnapshotId, snap.id);
                        }}
                        className="mt-3 text-xs px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded transition"
                      >
                        Compare with Selected
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compare Results */}
      {compareMode && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-cyan-300">Comparison Results</h3>
            <button
              onClick={() => setCompareMode(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="text-sm text-gray-300">
            <p>Comparing snapshots to identify changes...</p>
          </div>
        </div>
      )}

      {/* Snapshot Stats */}
      {snapshots.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-gray-900/50 border border-gray-700/50 rounded">
            <div className="font-bold text-cyan-300">{snapshots.length}</div>
            <div className="text-gray-400">Total Snapshots</div>
          </div>
          <div className="p-3 bg-gray-900/50 border border-gray-700/50 rounded">
            <div className="font-bold text-cyan-300">
              {snapshots[0]?.author || 'Unknown'}
            </div>
            <div className="text-gray-400">Latest Author</div>
          </div>
          <div className="p-3 bg-gray-900/50 border border-gray-700/50 rounded">
            <div className="font-bold text-cyan-300">
              {new Date(snapshots[0]?.timestamp).toLocaleDateString() || 'N/A'}
            </div>
            <div className="text-gray-400">Latest Snapshot</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VersionHistoryPanel;
