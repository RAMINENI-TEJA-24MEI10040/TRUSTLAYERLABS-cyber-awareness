import { GraphDocument, IntelligenceResult } from '../types/ciw.types';

export interface ExportPayload {
  caseId: string;
  queryId: string;
  results: IntelligenceResult[];
  graph?: GraphDocument;
}

// Simple adapter that delegates to existing reporters if present.
// For now, produce a lightweight JSON export.
export default async function exportIntelReport(payload: ExportPayload): Promise<{ ok: boolean; file?: string; payload?: ExportPayload }> {
  try {
    const filename = `ciw-report-${payload.caseId}-${payload.queryId}.json`;
    const data = JSON.stringify(payload, null, 2);

    // In-browser environment we cannot write files to disk; caller may handle download.
    // Return the payload for downstream handling (UI or PDF generator).
    return { ok: true, file: filename, payload };
  } catch (err) {
    return { ok: false };
  }
}
