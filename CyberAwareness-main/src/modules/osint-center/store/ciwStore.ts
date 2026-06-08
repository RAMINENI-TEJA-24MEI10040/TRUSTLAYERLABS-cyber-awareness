import { create } from 'zustand';
import { QueryRequest, CIWCase, OrchestratorResponse, IntelligenceResult } from '../types/ciw.types';
import ciwOrchestrator from '../services/ciwOrchestrator';

import { GraphDocument } from '../types/ciw.types';

interface CIWState {
  cases: CIWCase[];
  activeCaseId?: string | null;
  isLoading: boolean;
  isError?: string | null;
  queryHistory: QueryRequest[];
  lastResponse?: OrchestratorResponse;
  // Optional runtime fields used by UI
  graph?: GraphDocument;
  lastSummary?: unknown;
  lastLegalCorrelation?: unknown;

  // Actions
  runQuery: (query: QueryRequest) => Promise<OrchestratorResponse>;
  createCase: (title: string) => CIWCase;
  addResultToCase: (caseId: string, queryId: string, results: IntelligenceResult[]) => void;
  clearError: () => void;
  setActiveCase?: (id: string | null) => void;
}

const TIMEOUT_MS = 15000;

function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS) {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

export const useCIWStore = create<CIWState>((set, get) => ({
  cases: [],
  activeCaseId: null,
  isLoading: false,
  isError: null,
  queryHistory: [],
  lastResponse: undefined,
  // runtime UI fields
  graph: undefined,
  lastSummary: undefined,
  lastLegalCorrelation: undefined,
  createCase: (title: string) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newCase: CIWCase = { id, title, createdAt: now, queries: [], results: {} };
    set((state) => ({ cases: [...state.cases, newCase], activeCaseId: id }));
    try {
      // emit timeline event
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const timeline = require('./timelineStore').default;
      timeline.getState().addEvent({ caseId: id, eventType: 'case_created', title: 'Case Created', description: `Case '${title}' created`, severity: 'info' });
    } catch (e) {
      // ignore
    }
    return newCase;
  },
  addResultToCase: (caseId: string, queryId: string, results: IntelligenceResult[]) => {
    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseId ? { ...c, results: { ...c.results, [queryId]: results }, updatedAt: new Date().toISOString() } : c)),
    }));
  },
  clearError: () => set({ isError: null }),
  setActiveCase: (id: string | null) => set({ activeCaseId: id }),
  runQuery: async (query: QueryRequest) => {
    // basic validation
    if (!query.payload || !query.payload.trim()) {
      set({ isError: 'Invalid query payload' });
      throw new Error('Invalid query payload');
    }

    // diagnostic
    // eslint-disable-next-line no-console
    console.debug('[CIW] runQuery start', query);

    set({ isLoading: true, isError: null });
    try {
      const response = await withTimeout(ciwOrchestrator.orchestrate(query), TIMEOUT_MS);

      // diagnostic
      // eslint-disable-next-line no-console
      console.debug('[CIW] orchestrator response', { queryId: query.id, resultsCount: response?.results?.length ?? 0, warnings: response?.warnings });

      set((state) => ({ queryHistory: [...state.queryHistory, query], lastResponse: response }));

      const targetCaseId = get().activeCaseId ?? get().createCase('Untitled Case').id;

      // attach query and results to case
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === targetCaseId
            ? {
                ...c,
                queries: [...c.queries, query],
                results: { ...c.results, [query.id]: response.results },
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      }));

      // diagnostic
      // eslint-disable-next-line no-console
      console.debug('[CIW] case updated', { targetCaseId, addedResults: (response.results || []).map((r) => r.id) });

      try {
        // emit timeline event for query executed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const timeline = require('./timelineStore').default;
        timeline.getState().addEvent({ caseId: targetCaseId, eventType: 'query_executed', title: 'Intelligence Query Executed', description: `Query ${query.id} executed against ${query.source}`, severity: 'info' });
      } catch (e) {
        // ignore
      }

      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error from orchestrator';
      set({ isError: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCIWStore;
