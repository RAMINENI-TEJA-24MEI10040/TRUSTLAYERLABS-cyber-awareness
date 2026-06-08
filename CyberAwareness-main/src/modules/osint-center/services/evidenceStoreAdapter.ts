/**
 * Evidence Store Adapter
 * Bridges CIW with EvidenceStore if available, with graceful fallback.
 */

interface EvidenceStore {
  addEvidenceForEntity?: (entityId: string, metadata?: Record<string, unknown>) => void;
  addEvidence?: (evidence: Record<string, unknown>) => void;
  createEvidence?: (evidence: Record<string, unknown>) => void;
}

export const evidenceStoreAdapter = {
  addEvidenceForEntity: (entityId: string, metadata?: Record<string, unknown>) => {
    const store = (window as unknown as { evidenceStore?: EvidenceStore }).evidenceStore;
    if (!store) {
      console.warn('[CIW] evidenceStore not available');
      return;
    }

    if (typeof store.addEvidenceForEntity === 'function') {
      return store.addEvidenceForEntity(entityId, metadata);
    }

    if (typeof store.addEvidence === 'function') {
      return store.addEvidence({
        entityId,
        timestamp: new Date().toISOString(),
        source: 'ciw',
        ...metadata,
      });
    }

    if (typeof store.createEvidence === 'function') {
      return store.createEvidence({
        title: `Evidence: ${entityId}`,
        source: 'ciw',
        data: { entityId, ...metadata },
      });
    }

    console.warn('[CIW] evidenceStore API not recognized');
  },

  hasEvidenceStore: () => !!(window as unknown as { evidenceStore?: EvidenceStore }).evidenceStore,
};
