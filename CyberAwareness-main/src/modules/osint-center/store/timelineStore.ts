import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Severity = 'low' | 'medium' | 'high' | 'critical' | 'info';

export interface TimelineEvent {
  id: string;
  caseId?: string;
  timestamp: string; // ISO
  eventType: string;
  title: string;
  description?: string;
  severity: Severity;
}

interface TimelineStore {
  events: TimelineEvent[];
  addEvent: (evt: Omit<TimelineEvent, 'id' | 'timestamp'>) => TimelineEvent;
  deleteEvent: (id: string) => void;
  clearForCase: (caseId?: string) => void;
  exportEvents: (caseId?: string) => string;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (evt) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newEvt: TimelineEvent = { id, timestamp: now, ...evt };
        set((s) => ({ events: [newEvt, ...s.events] }));
        return newEvt;
      },
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      clearForCase: (caseId) => set((s) => ({ events: caseId ? s.events.filter((e) => e.caseId !== caseId) : [] })),
      exportEvents: (caseId) => {
        try {
          const payload = caseId ? get().events.filter((e) => e.caseId === caseId) : get().events;
          return JSON.stringify(payload, null, 2);
        } catch (e) {
          return '[]';
        }
      },
    }),
    { name: 'ciw-timeline-v1', storage: localStorage as any }
  )
);

export default useTimelineStore;
