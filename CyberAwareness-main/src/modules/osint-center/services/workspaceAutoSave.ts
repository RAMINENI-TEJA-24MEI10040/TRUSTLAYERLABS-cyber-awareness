import useWorkspaceStore from '../store/workspaceStore';
import useWorkspaceManagerStore from '../store/workspaceManagerStore';

import useCaseStore from '../store/caseStore';
import {
  createSnapshot,
  listSnapshots,
  deleteSnapshot,
} from './workspaceSnapshotService';

let autoSaveIntervalId: NodeJS.Timeout | null = null;

export function startAutoSave(intervalMs = 60000): () => void {
  if (autoSaveIntervalId) {
    clearInterval(autoSaveIntervalId);
  }

  autoSaveIntervalId = setInterval(async () => {
    try {
      await manualSave();
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }, intervalMs);

  return () => stopAutoSave();
}

export function stopAutoSave(): void {
  if (autoSaveIntervalId) {
    clearInterval(autoSaveIntervalId);
    autoSaveIntervalId = null;
  }
}

export async function manualSave(): Promise<void> {
  const workspaceManager = useWorkspaceManagerStore.getState();
  const activeWorkspaceId = workspaceManager.activeWorkspaceId;

  if (!activeWorkspaceId) {
    return;
  }

  // Update workspace metadata timestamp
  workspaceManager.updateWorkspaceDescription(
    activeWorkspaceId,
    workspaceManager.getActiveWorkspace()?.description || ''
  );

  // Create snapshot of current state (debounced in practice)
  try {
    const snapshot = await createSnapshot(
      activeWorkspaceId,
      `Auto-save at ${new Date().toLocaleTimeString()}`
    );
    workspaceManager.addSnapshot(activeWorkspaceId, snapshot.id);

    // Keep only last 10 snapshots per workspace
    const allSnapshots = await listSnapshots(activeWorkspaceId);
    if (allSnapshots.length > 10) {
      const toDelete = allSnapshots.slice(10);
      for (const snap of toDelete) {
        await deleteSnapshot(snap.id);
        workspaceManager.removeSnapshot(activeWorkspaceId, snap.id);
      }
    }
  } catch (error) {
    console.warn('Failed to create auto-save snapshot:', error);
  }

  // Ensure Zustand persist middleware writes are flushed
  // (This is automatic, but we can trigger it explicitly)
  try {
    // Force Zustand to persist state
    useWorkspaceStore.setState({});
    useCaseStore.setState({});
  } catch {
    // Ignore
  }
}

export async function manualSaveWorkspace(workspaceId: string): Promise<void> {
  const workspaceManager = useWorkspaceManagerStore.getState();

  // Update timestamp
  const ws = workspaceManager.workspaces.find((w) => w.id === workspaceId);
  if (ws) {
    workspaceManager.updateWorkspaceDescription(workspaceId, ws.description);
  }

  // Create snapshot
  try {
    const snapshot = await createSnapshot(workspaceId, 'Manual save');
    workspaceManager.addSnapshot(workspaceId, snapshot.id);
  } catch (error) {
    console.warn('Failed to create manual save snapshot:', error);
  }
}
