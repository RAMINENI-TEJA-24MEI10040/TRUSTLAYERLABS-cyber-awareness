import type { ComplaintPacket } from '../types/complaint.types';
import type { CIWCase, InvestigationSummary, TimelineEvent, EvidenceItem } from '../types/ciw.types';
import type { LegalCorrelation } from '../types/legal.types';

type Input = {
  caseInfo: CIWCase;
  summary?: InvestigationSummary | null;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  legalCorrelation?: LegalCorrelation | null;
};

export async function generateComplaintPacket(input: Input): Promise<ComplaintPacket> {
  // Prefer Cyber Justice AI
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const aiClient = require('../../cyber-justice-ai/services/aiClient');
    if (aiClient && typeof aiClient.generateComplaint === 'function') {
      const res = await aiClient.generateComplaint({
        case: input.caseInfo,
        summary: input.summary,
        timeline: input.timeline,
        evidence: input.evidence,
        legalCorrelation: input.legalCorrelation,
        jurisdiction: 'India',
      });
      return res as ComplaintPacket;
    }
  } catch (e) {
    // fallback
  }

  // Deterministic complaint packet
  const packet: ComplaintPacket = {
    id: `cp-${Date.now()}`,
    caseId: input.caseInfo?.id,
    incidentSummary: input.summary ?? null,
    timeline: input.timeline || [],
    evidence: input.evidence || [],
    legalCorrelation: input.legalCorrelation ?? null,
    recommendedActions: input.summary?.recommendedActions ?? input.legalCorrelation?.reasoning ?? [],
    generatedAt: new Date().toISOString(),
  };

  return packet;
}

export default { generateComplaintPacket };