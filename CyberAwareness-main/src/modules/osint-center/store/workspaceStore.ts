import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TagName = 'Threat Actor' | 'Victim' | 'Infrastructure' | 'Wallet' | 'Domain' | 'Evidence' | 'Suspicious' | string;

interface PanelState {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  open: boolean;
  name?: string;
  members?: string[];
  collapsed?: boolean;
  color?: string;
}

interface GroupState {
  id: string;
  name: string;
  members: string[];
  collapsed: boolean;
  color?: string;
}

export interface WorkspaceState {
  panels: Record<string, PanelState>;
  groups: Record<string, GroupState>;
  tags: Record<string, TagName[]>; // entityId -> tags
  zoom: number;
  nodePositions: Record<string, { x: number; y: number }>;
  selectedNodes: string[];
  selectionHistory: string[][];
  visibleIds: string[];
  bookmarks: string[];
  removedNodes: string[];
  viewport: { x: number; y: number; scale: number };
  setPanel: (id: string, partial: Partial<PanelState>) => void;
  setZoom: (z: number) => void;
  setViewport: (v: { x: number; y: number; scale: number }) => void;
  setVisibleIds: (ids: string[]) => void;
  toggleBookmark: (id: string) => void;
  selectNode: (id: string, additive?: boolean) => void;
  deselectNode: (id: string) => void;
  toggleNode: (id: string) => void;
  selectEntity: (id: string, additive?: boolean) => void;
  deselectEntity: (id: string) => void;
  toggleEntity: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  toggleTag: (entityId: string, tag: TagName) => void;
  createGroup: (group: GroupState) => void;
  addToGroup: (groupId: string, entityId: string) => void;
  removeFromGroup: (groupId: string, entityId: string) => void;
  groupSelectedNodes: (groupName?: string, color?: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  updateGroupColor: (groupId: string, color: string) => void;
  deleteGroup: (groupId: string) => void;
  setGroupMembers: (groupId: string, members: string[]) => void;
  saveNodePosition: (entityId: string, pos: { x: number; y: number }) => void;
}

const useWorkspaceStore = create<WorkspaceState>()(
  persist((set, get) => ({
  panels: {},
  groups: {},
  tags: {},
  zoom: 1,
  nodePositions: {},
  selectedNodes: [],
  selectionHistory: [],
  visibleIds: [],
  bookmarks: [],
  removedNodes: [],
  viewport: { x: 0, y: 0, scale: 1 },
  setPanel: (id, partial) => set((s) => ({ panels: { ...s.panels, [id]: { ...(s.panels[id] ?? { id, x: 80, y: 80, w: 420, h: 300, open: true }), ...partial } } })),
  setZoom: (z) => set({ zoom: z }),
  setViewport: (v) => set({ viewport: v }),
  setVisibleIds: (ids) => set({ visibleIds: ids }),
  toggleBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),

  selectNode: (id, additive = false) => set((s) => {
    const next = additive ? Array.from(new Set([...s.selectedNodes, id])) : [id];
    return { selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: next };
  }),

  deselectNode: (id) => set((s) => ({ selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: s.selectedNodes.filter((n) => n !== id) })),

  toggleNode: (id) => set((s) => {
    const exists = s.selectedNodes.includes(id);
    const next = exists ? s.selectedNodes.filter((n) => n !== id) : [...s.selectedNodes, id];
    return { selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: next };
  }),

  selectEntity: (id, additive = false) => set((s) => {
    const next = additive ? Array.from(new Set([...s.selectedNodes, id])) : [id];
    return { selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: next };
  }),

  deselectEntity: (id) => set((s) => ({ selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: s.selectedNodes.filter((n) => n !== id) })),

  toggleEntity: (id) => set((s) => {
    const exists = s.selectedNodes.includes(id);
    const next = exists ? s.selectedNodes.filter((n) => n !== id) : [...s.selectedNodes, id];
    return { selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: next };
  }),

  selectMultiple: (ids) => set((s) => ({ selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: Array.from(new Set(ids)) })),

  clearSelection: () => set((s) => ({ selectionHistory: [...s.selectionHistory, s.selectedNodes], selectedNodes: [] })),

  toggleTag: (entityId, tag) => set((s) => ({ tags: { ...s.tags, [entityId]: s.tags[entityId]?.includes(tag) ? s.tags[entityId].filter((t) => t !== tag) : [...(s.tags[entityId] ?? []), tag] } })),

  createGroup: (group) => set((s) => ({ groups: { ...s.groups, [group.id]: group } })),
  addToGroup: (groupId, entityId) => set((s) => ({ groups: { ...s.groups, [groupId]: { ...(s.groups[groupId] ?? { id: groupId, name: groupId, members: [], collapsed: false }), members: Array.from(new Set([...(s.groups[groupId]?.members ?? []), entityId])) } } })),
  removeFromGroup: (groupId, entityId) => set((s) => ({ groups: { ...s.groups, [groupId]: { ...(s.groups[groupId] ?? { id: groupId, name: groupId, members: [], collapsed: false }), members: (s.groups[groupId]?.members ?? []).filter((m) => m !== entityId) } } })),

  groupSelectedNodes: (groupName = `group-${Date.now()}`, color = '#0ff') => set((s) => {
    const id = `${groupName}-${Math.random().toString(36).slice(2, 8)}`;
    const group: GroupState = { id, name: groupName, members: [...s.selectedNodes], collapsed: false, color };
    return { groups: { ...s.groups, [id]: group } };
  }),

  renameGroup: (groupId: string, name: string) => set((s) => ({ groups: { ...s.groups, [groupId]: { ...(s.groups[groupId] ?? { id: groupId, name, members: [], collapsed: false }), name } } })),

  updateGroupColor: (groupId: string, color: string) => set((s) => ({ groups: { ...s.groups, [groupId]: { ...(s.groups[groupId] ?? { id: groupId, name: groupId, members: [], collapsed: false }), color } } })),

  deleteGroup: (groupId: string) => set((s) => {
    const next = { ...s.groups };
    delete next[groupId];
    return { groups: next };
  }),

  setGroupMembers: (groupId: string, members: string[]) => set((s) => ({ groups: { ...s.groups, [groupId]: { ...(s.groups[groupId] ?? { id: groupId, name: groupId, members: [], collapsed: false }), members } } })),

  saveNodePosition: (entityId, pos) => set((s) => ({ nodePositions: { ...s.nodePositions, [entityId]: pos } })),
}), { name: 'ciw-workspace-v1' })
);

export default useWorkspaceStore;
