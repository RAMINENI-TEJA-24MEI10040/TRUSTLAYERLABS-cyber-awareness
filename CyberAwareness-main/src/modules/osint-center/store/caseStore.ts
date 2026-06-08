import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CaseStatus = 'Open' | 'Active' | 'Pending' | 'Closed' | 'Archived';
export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface InvestigationCase {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  updatedAt: string;
  workspaceIds: string[];
  tags: string[];
  notes: string;
  owner: string;
  assignedTo: string[];
}

export interface CaseStoreState {
  cases: InvestigationCase[];
  activeCaseId: string | null;

  createCase: (title: string, description?: string, priority?: CasePriority) => string;
  updateCase: (id: string, partial: Partial<InvestigationCase>) => void;
  deleteCase: (id: string) => void;
  closeCase: (id: string) => void;
  archiveCase: (id: string) => void;
  updateStatus: (id: string, status: CaseStatus) => void;
  updatePriority: (id: string, priority: CasePriority) => void;
  addNotes: (id: string, note: string) => void;
  linkWorkspace: (caseId: string, workspaceId: string) => void;
  unlinkWorkspace: (caseId: string, workspaceId: string) => void;
  switchCase: (id: string) => void;
  searchCases: (query: string) => InvestigationCase[];
  filterCases: (status?: CaseStatus, priority?: CasePriority) => InvestigationCase[];
  addTag: (caseId: string, tag: string) => void;
  removeTag: (caseId: string, tag: string) => void;
  assignTo: (caseId: string, userId: string) => void;
  unassign: (caseId: string, userId: string) => void;
  getActiveCase: () => InvestigationCase | undefined;
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

export const useCaseStore = create<CaseStoreState>()(
  persist(
    (set, get) => ({
      cases: [],
      activeCaseId: null,

      createCase: (title: string, description = '', priority: CasePriority = 'Medium') => {
        const id = generateId();
        const now = getCurrentTimestamp();
        const user = getCurrentUser();

        const newCase: InvestigationCase = {
          id,
          title,
          description,
          status: 'Open',
          priority,
          createdAt: now,
          updatedAt: now,
          workspaceIds: [],
          tags: [],
          notes: '',
          owner: user,
          assignedTo: [user],
        };

        set((state) => ({
          cases: [...state.cases, newCase],
          activeCaseId: id,
        }));

        return id;
      },

      updateCase: (id: string, partial: Partial<InvestigationCase>) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...partial,
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      deleteCase: (id: string) =>
        set((state) => {
          const newCases = state.cases.filter((c) => c.id !== id);
          const newActiveId = state.activeCaseId === id ? newCases[0]?.id ?? null : state.activeCaseId;
          return {
            cases: newCases,
            activeCaseId: newActiveId,
          };
        }),

      closeCase: (id: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: 'Closed',
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      archiveCase: (id: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: 'Archived',
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      updateStatus: (id: string, status: CaseStatus) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      updatePriority: (id: string, priority: CasePriority) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  priority,
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      addNotes: (id: string, note: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  notes: c.notes ? `${c.notes}\n---\n${note}` : note,
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      linkWorkspace: (caseId: string, workspaceId: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  workspaceIds: Array.from(new Set([...c.workspaceIds, workspaceId])),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      unlinkWorkspace: (caseId: string, workspaceId: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  workspaceIds: c.workspaceIds.filter((id) => id !== workspaceId),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      switchCase: (id: string) => {
        const c = get().cases.find((cs) => cs.id === id);
        if (c) {
          set({ activeCaseId: id });
        }
      },

      searchCases: (query: string) => {
        const lower = query.toLowerCase();
        return get().cases.filter(
          (c) =>
            c.title.toLowerCase().includes(lower) ||
            c.description.toLowerCase().includes(lower) ||
            c.notes.toLowerCase().includes(lower) ||
            c.tags.some((t) => t.toLowerCase().includes(lower))
        );
      },

      filterCases: (status?: CaseStatus, priority?: CasePriority) => {
        let filtered = get().cases;
        if (status) filtered = filtered.filter((c) => c.status === status);
        if (priority) filtered = filtered.filter((c) => c.priority === priority);
        return filtered;
      },

      addTag: (caseId: string, tag: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  tags: Array.from(new Set([...c.tags, tag])),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      removeTag: (caseId: string, tag: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  tags: c.tags.filter((t) => t !== tag),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      assignTo: (caseId: string, userId: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  assignedTo: Array.from(new Set([...c.assignedTo, userId])),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      unassign: (caseId: string, userId: string) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  assignedTo: c.assignedTo.filter((id) => id !== userId),
                  updatedAt: getCurrentTimestamp(),
                }
              : c
          ),
        })),

      getActiveCase: () => {
        const state = get();
        return state.cases.find((c) => c.id === state.activeCaseId);
      },
    }),
    {
      name: 'ciw-cases-v1',
    }
  )
);

export default useCaseStore;
