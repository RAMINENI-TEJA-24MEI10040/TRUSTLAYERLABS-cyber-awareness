import useWorkspaceStore from '../store/workspaceStore';

const STORAGE_KEY = 'ciw-workspace-v1';

export interface WorkspacePersistencePayload {
  panels: Record<string, unknown>;
  groups: Record<string, unknown>;
  tags: Record<string, string[]>;
  zoom: number;
  nodePositions: Record<string, { x: number; y: number }>;
  selectedNodes: string[];
  selectionHistory: string[][];
  visibleIds: string[];
  bookmarks: string[];
  removedNodes: string[];
  viewport: { x: number; y: number; scale: number };
}

function isWorkspacePersistencePayload(value: unknown): value is WorkspacePersistencePayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.zoom === 'number' &&
    Array.isArray(payload.selectedNodes) &&
    Array.isArray(payload.selectionHistory) &&
    Array.isArray(payload.visibleIds) &&
    Array.isArray(payload.bookmarks) &&
    Array.isArray(payload.removedNodes) &&
    typeof payload.viewport === 'object' &&
    payload.viewport !== null &&
    typeof (payload.viewport as Record<string, unknown>).x === 'number' &&
    typeof (payload.viewport as Record<string, unknown>).y === 'number' &&
    typeof (payload.viewport as Record<string, unknown>).scale === 'number'
  );
}

export function saveWorkspace() {
  const state = useWorkspaceStore.getState();
  const payload: WorkspacePersistencePayload = {
    panels: state.panels,
    groups: state.groups,
    tags: state.tags,
    zoom: state.zoom,
    nodePositions: state.nodePositions,
    selectedNodes: state.selectedNodes,
    selectionHistory: state.selectionHistory,
    visibleIds: state.visibleIds,
    bookmarks: state.bookmarks,
    removedNodes: state.removedNodes,
    viewport: state.viewport,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadWorkspace(): WorkspacePersistencePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isWorkspacePersistencePayload(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function exportWorkspace() {
  const data = loadWorkspace() || null;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ciw-workspace-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importWorkspace(file: File) {
  const text = await file.text();
  try {
    const obj = JSON.parse(text);
    if (isWorkspacePersistencePayload(obj)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      useWorkspaceStore.setState({
        panels: obj.panels as any,
        groups: obj.groups as any,
        tags: obj.tags,
        zoom: obj.zoom,
        nodePositions: obj.nodePositions,
        selectedNodes: obj.selectedNodes,
        selectionHistory: obj.selectionHistory,
        visibleIds: obj.visibleIds,
        bookmarks: obj.bookmarks,
        removedNodes: obj.removedNodes,
        viewport: obj.viewport,
      });
      return true;
    }

    const legacy = obj as Record<string, unknown>;
    if (Array.isArray(legacy.selectedEntities)) {
      const selectedNodes = legacy.selectedEntities.filter((v) => typeof v === 'string') as string[];
      const payload: WorkspacePersistencePayload = {
        panels: typeof legacy.panels === 'object' && legacy.panels !== null ? (legacy.panels as Record<string, unknown>) : {},
        groups: typeof legacy.groups === 'object' && legacy.groups !== null ? (legacy.groups as Record<string, unknown>) : {},
        tags: typeof legacy.tags === 'object' && legacy.tags !== null ? (legacy.tags as Record<string, string[]>) : {},
        zoom: typeof legacy.zoom === 'number' ? legacy.zoom : 1,
        nodePositions:
          typeof legacy.nodePositions === 'object' && legacy.nodePositions !== null
            ? (legacy.nodePositions as Record<string, { x: number; y: number }>)
            : {},
        selectedNodes,
        selectionHistory: Array.isArray(legacy.selectionHistory) ? (legacy.selectionHistory as string[][]) : [],
        visibleIds: Array.isArray(legacy.visibleIds) ? (legacy.visibleIds as string[]) : [],
        bookmarks: Array.isArray(legacy.bookmarks) ? (legacy.bookmarks as string[]) : [],
        removedNodes: Array.isArray(legacy.removedNodes) ? (legacy.removedNodes as string[]) : [],
        viewport:
          typeof legacy.viewport === 'object' && legacy.viewport !== null
            ? ((legacy.viewport as { x: number; y: number; scale: number }) ?? { x: 0, y: 0, scale: 1 })
            : { x: 0, y: 0, scale: 1 },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      useWorkspaceStore.setState(payload as any);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
