import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkspaceMetadata {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  caseId?: string;
  status: 'active' | 'archived';
  snapshotIds: string[];
  lastModifiedBy: string;
}

export interface WorkspaceManagerState {
  workspaces: WorkspaceMetadata[];
  activeWorkspaceId: string | null;

  createWorkspace: (name: string, description?: string) => string;
  renameWorkspace: (id: string, name: string) => void;
  updateWorkspaceDescription: (id: string, description: string) => void;
  addWorkspaceTags: (id: string, tags: string[]) => void;
  removeWorkspaceTags: (id: string, tags: string[]) => void;
  switchWorkspace: (id: string) => void;
  deleteWorkspace: (id: string) => void;
  archiveWorkspace: (id: string) => void;
  duplicateWorkspace: (id: string, newName?: string) => string;
  linkCase: (workspaceId: string, caseId: string) => void;
  unlinkCase: (workspaceId: string) => void;
  addSnapshot: (workspaceId: string, snapshotId: string) => void;
  removeSnapshot: (workspaceId: string, snapshotId: string) => void;
  getActiveWorkspace: () => WorkspaceMetadata | undefined;
  getWorkspacesByStatus: (status: 'active' | 'archived') => WorkspaceMetadata[];
  searchWorkspaces: (query: string) => WorkspaceMetadata[];
}

function generateId(): string {
  return crypto.randomUUID();
}

function getCurrentUser(): string {
  return localStorage.getItem('ciw-user') || 'system';
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export const useWorkspaceManagerStore = create<WorkspaceManagerState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,

      createWorkspace: (name: string, description = '') => {
        const id = generateId();
        const now = getCurrentTimestamp();
        const user = getCurrentUser();

        const newWorkspace: WorkspaceMetadata = {
          id,
          name,
          description,
          tags: [],
          createdAt: now,
          updatedAt: now,
          owner: user,
          status: 'active',
          snapshotIds: [],
          lastModifiedBy: user,
        };

        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          activeWorkspaceId: id,
        }));

        return id;
      },

      renameWorkspace: (id: string, name: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  name,
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      updateWorkspaceDescription: (id: string, description: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  description,
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      addWorkspaceTags: (id: string, newTags: string[]) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  tags: Array.from(new Set([...ws.tags, ...newTags])),
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      removeWorkspaceTags: (id: string, tagsToRemove: string[]) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  tags: ws.tags.filter((t) => !tagsToRemove.includes(t)),
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      switchWorkspace: (id: string) => {
        const ws = get().workspaces.find((w) => w.id === id);
        if (ws) {
          set({ activeWorkspaceId: id });
        }
      },

      deleteWorkspace: (id: string) =>
        set((state) => {
          const newWorkspaces = state.workspaces.filter((ws) => ws.id !== id);
          const newActiveId =
            state.activeWorkspaceId === id ? newWorkspaces[0]?.id ?? null : state.activeWorkspaceId;
          return {
            workspaces: newWorkspaces,
            activeWorkspaceId: newActiveId,
          };
        }),

      archiveWorkspace: (id: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  status: 'archived',
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      duplicateWorkspace: (id: string, newName?: string) => {
        const existing = get().workspaces.find((w) => w.id === id);
        if (!existing) return '';

        const duplicated = useWorkspaceManagerStore.getState().createWorkspace(
          newName || `${existing.name} (Copy)`,
          existing.description
        );

        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === duplicated
              ? {
                  ...ws,
                  tags: [...existing.tags],
                }
              : ws
          ),
        }));

        return duplicated;
      },

      linkCase: (workspaceId: string, caseId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  caseId,
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      unlinkCase: (workspaceId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  caseId: undefined,
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      addSnapshot: (workspaceId: string, snapshotId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  snapshotIds: Array.from(new Set([...ws.snapshotIds, snapshotId])),
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      removeSnapshot: (workspaceId: string, snapshotId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  snapshotIds: ws.snapshotIds.filter((id) => id !== snapshotId),
                  updatedAt: getCurrentTimestamp(),
                  lastModifiedBy: getCurrentUser(),
                }
              : ws
          ),
        })),

      getActiveWorkspace: () => {
        const state = get();
        return state.workspaces.find((ws) => ws.id === state.activeWorkspaceId);
      },

      getWorkspacesByStatus: (status: 'active' | 'archived') => {
        return get().workspaces.filter((ws) => ws.status === status);
      },

      searchWorkspaces: (query: string) => {
        const lower = query.toLowerCase();
        return get().workspaces.filter(
          (ws) =>
            ws.name.toLowerCase().includes(lower) ||
            ws.description.toLowerCase().includes(lower) ||
            ws.tags.some((t) => t.toLowerCase().includes(lower))
        );
      },
    }),
    {
      name: 'ciw-workspaces-v1',
    }
  )
);

export default useWorkspaceManagerStore;
