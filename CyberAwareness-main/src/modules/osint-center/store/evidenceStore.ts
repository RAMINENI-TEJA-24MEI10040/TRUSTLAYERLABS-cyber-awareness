import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IntelligenceResult } from '../types/ciw.types';

export type EvidenceItem = {
  id: string;
  caseId?: string;
  queryId?: string;
  title: string;
  source: string;
  summary?: string;
  raw?: unknown;
  tags: string[];
  notes?: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
};

interface EvidenceStore {
  items: EvidenceItem[];
  addEvidence: (item: Omit<EvidenceItem, 'id' | 'createdAt' | 'updatedAt'>) => EvidenceItem;
  addFromResult: (caseId: string | undefined, queryId: string | undefined, result: IntelligenceResult, tags?: string[]) => EvidenceItem;
  updateNotes: (id: string, notes: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  deleteEvidence: (id: string) => void;
  exportAll: () => string; // JSON string
  clearAll: () => void;
}

export const useEvidenceStore = create<EvidenceStore>()(
  persist(
    (set, get) => ({
      items: [],
      addEvidence: (item) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newItem: EvidenceItem = { id, createdAt: now, updatedAt: now, ...item };
        set((s) => ({ items: [newItem, ...s.items] }));
        return newItem;
      },
      addFromResult: (caseId, queryId, result, tags = []) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newItem: EvidenceItem = {
          id,
          caseId,
          queryId,
          title: result.title ?? `${result.source} evidence`,
          source: result.source,
          summary: result.summary ?? undefined,
          raw: result.meta ?? result,
          tags,
          notes: undefined,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ items: [newItem, ...s.items] }));
        try {
          // emit timeline event (use require to avoid circular deps)
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const timeline = require('./timelineStore').default;
          timeline.getState().addEvent({ caseId, eventType: 'evidence_saved', title: 'Evidence Saved', description: `Saved evidence ${newItem.id}`, severity: 'info' });
        } catch (e) {
          // ignore
        }
        return newItem;
      },
      updateNotes: (id, notes) => set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, notes, updatedAt: new Date().toISOString() } : it)) })),
      addTag: (id, tag) => set((s) => ({ items: s.items.map((it) => (it.id === id && !it.tags.includes(tag) ? { ...it, tags: [...it.tags, tag], updatedAt: new Date().toISOString() } : it)) })),
      removeTag: (id, tag) => set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, tags: it.tags.filter((t) => t !== tag), updatedAt: new Date().toISOString() } : it)) })),
      deleteEvidence: (id) => {
        set((s) => ({ items: s.items.filter((it) => it.id !== id) }));
        try {
          // timeline event for deletion
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const timeline = require('./timelineStore').default;
          timeline.getState().addEvent({ caseId: undefined, eventType: 'evidence_deleted', title: 'Evidence Deleted', description: `Deleted evidence ${id}`, severity: 'info' });
        } catch (e) {
          // ignore
        }
      },
      exportAll: () => {
        try {
          const payload = JSON.stringify(get().items, null, 2);
          return payload;
        } catch (e) {
          return '[]';
        }
      },
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'ciw-evidence-store-v1',
      storage: localStorage as any,
    }
  )
);

export default useEvidenceStore;
