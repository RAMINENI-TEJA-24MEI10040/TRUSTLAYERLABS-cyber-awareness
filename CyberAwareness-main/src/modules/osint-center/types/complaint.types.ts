import type { LegalCorrelation } from './legal.types';
import type { InvestigationSummary } from './ciw.types';
import type { TimelineEvent, EvidenceItem } from './ciw.types';

export type ComplaintPacket = {
  id: string;
  caseId?: string;
  incidentSummary: InvestigationSummary | null;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  legalCorrelation?: LegalCorrelation | null;
  recommendedActions: string[];
  generatedAt: string;
};
