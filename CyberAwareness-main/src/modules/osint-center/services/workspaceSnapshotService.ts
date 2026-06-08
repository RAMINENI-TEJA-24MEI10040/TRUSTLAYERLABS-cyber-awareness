import useWorkspaceStore from '../store/workspaceStore.ts';

export interface WorkspaceSnapshotState {
  nodePositions: Record<string, { x: number; y: number }>;
  groups: Record<
    string,
    {
      id: string;
      name: string;
      members: string[];
      collapsed: boolean;
      color?: string;
    }
  >;
  selectedNodes: string[];
  tags: Record<string, string[]>;
}

export interface WorkspaceSnapshot {
  id: string;
  workspaceId: string;
  timestamp: string;
  author: string;
  description: string;
  graphState: WorkspaceSnapshotState;
}

export interface SnapshotDiff {
  nodePositionChanges: number;
  groupChanges: number;
  selectionChanges: boolean;
  tagChanges: number;
}

const SNAPSHOT_STORAGE_KEY = 'ciw-workspace-snap-v1';

function getSnapshotStorage(): Map<string, WorkspaceSnapshot> {
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function saveSnapshotStorage(map: Map<string, WorkspaceSnapshot>): void {
  const obj = Object.fromEntries(map);
  localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(obj));
}

function generateSnapshotId(): string {
  return `snap-${crypto.randomUUID()}`;
}

function getCurrentUser(): string {
  return localStorage.getItem('ciw-user') || 'system';
}

export async function createSnapshot(
  workspaceId: string,
  description = ''
): Promise<WorkspaceSnapshot> {
  const state = useWorkspaceStore.getState();

  const snapshot: WorkspaceSnapshot = {
    id: generateSnapshotId(),
    workspaceId,
    timestamp: new Date().toISOString(),
    author: getCurrentUser(),
    description,
    graphState: {
      nodePositions: state.nodePositions,
      groups: state.groups,
      selectedNodes: state.selectedNodes,
      tags: state.tags,
    },
  };

  const storage = getSnapshotStorage();
  storage.set(snapshot.id, snapshot);
  saveSnapshotStorage(storage);

  return snapshot;
}

export async function restoreSnapshot(snapshotId: string): Promise<void> {
  const storage = getSnapshotStorage();
  const snapshot = storage.get(snapshotId);

  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  useWorkspaceStore.setState({
    nodePositions: snapshot.graphState.nodePositions ?? {},
    groups: snapshot.graphState.groups ?? {},
    selectedNodes: snapshot.graphState.selectedNodes ?? [],
    tags: snapshot.graphState.tags ?? {},
  });
}

export async function deleteSnapshot(snapshotId: string): Promise<void> {
  const storage = getSnapshotStorage();
  storage.delete(snapshotId);
  saveSnapshotStorage(storage);
}

export async function listSnapshots(workspaceId: string): Promise<WorkspaceSnapshot[]> {
  const storage = getSnapshotStorage();
  return Array.from(storage.values())
    .filter((snap) => snap.workspaceId === workspaceId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function compareSnapshots(snap1Id: string, snap2Id: string): Promise<SnapshotDiff> {
  const storage = getSnapshotStorage();
  const snap1 = storage.get(snap1Id);
  const snap2 = storage.get(snap2Id);

  if (!snap1 || !snap2) {
    throw new Error('One or both snapshots not found');
  }

  const state1 = snap1.graphState;
  const state2 = snap2.graphState;

  let nodePositionChanges = 0;
  const pos1Keys = new Set(Object.keys(state1.nodePositions || {}));
  const pos2Keys = new Set(Object.keys(state2.nodePositions || {}));

  pos1Keys.forEach((key) => {
    if (!pos2Keys.has(key)) nodePositionChanges++;
    else {
      const p1 = state1.nodePositions?.[key];
      const p2 = state2.nodePositions?.[key];
      if (p1?.x !== p2?.x || p1?.y !== p2?.y) nodePositionChanges++;
    }
  });
  pos2Keys.forEach((key) => {
    if (!pos1Keys.has(key)) nodePositionChanges++;
  });

  let groupChanges = 0;
  const groups1 = Object.keys((state1.groups as Record<string, unknown>) || {});
  const groups2 = Object.keys((state2.groups as Record<string, unknown>) || {});
  groupChanges += Math.abs(groups1.length - groups2.length);

  let tagChanges = 0;
  const tags1 = Object.keys(state1.tags || {});
  const tags2 = Object.keys(state2.tags || {});
  tagChanges += Math.abs(tags1.length - tags2.length);

  const selectionChanges =
    JSON.stringify(state1.selectedNodes) !== JSON.stringify(state2.selectedNodes);

  return {
    nodePositionChanges,
    groupChanges,
    selectionChanges,
    tagChanges,
  };
}

export async function getSnapshot(snapshotId: string): Promise<WorkspaceSnapshot | null> {
  const storage = getSnapshotStorage();
  return storage.get(snapshotId) || null;
}
