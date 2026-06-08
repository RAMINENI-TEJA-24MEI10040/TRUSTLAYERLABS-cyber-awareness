import type { CIWCase, InvestigationSummary, IntelligenceResult, EvidenceItem, TimelineEvent } from '../types/ciw.types';
import type { LegalCorrelation, LegalReference } from '../types/legal.types';

type Input = {
  caseInfo: CIWCase;
  summary?: InvestigationSummary | null;
  intelligence: IntelligenceResult[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
};

export async function generateLegalCorrelation(input: Input): Promise<LegalCorrelation> {
  // Try Cyber Justice AI if available for higher-quality mapping
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const aiClient = require('../../cyber-justice-ai/services/aiClient');
    if (aiClient && typeof aiClient.mapToLaw === 'function') {
      const res = await aiClient.mapToLaw({
        case: input.caseInfo,
        summary: input.summary,
        intelligence: input.intelligence,
        evidence: input.evidence,
        timeline: input.timeline,
        targetJurisdiction: 'India',
      });
      // Expecting res to conform to LegalCorrelation
      return res as LegalCorrelation;
    }
  } catch (e) {
    // fallback
  }

  // Deterministic heuristic mapping for India (IPC + IT Act common sections)
  const ipcCandidates: LegalReference[] = [];
  const itActCandidates: LegalReference[] = [];
  const reasoning: string[] = [];

  // Heuristics: fraud indicators -> IPC 420, cheating -> IPC 415/418, extortion -> IPC 384/385
  const summaries = [input.summary?.executiveSummary ?? '', ...((input.intelligence ?? []).map(i => i.summary ?? i.raw ?? ''))];
  const joined = summaries.join(' ').toLowerCase();

  if (joined.includes('scam') || joined.includes('fraud') || joined.includes('phish')) {
    ipcCandidates.push({ code: 'IPC 420', title: 'Cheating and dishonesty', description: 'Cheating and dishonestly inducing delivery of property.' , jurisdiction: 'India' });
    reasoning.push('Indicators of fraud/phishing found in intelligence summaries.');
  }
  if (joined.includes('extort') || joined.includes('ransom') || joined.includes('blackmail')) {
    ipcCandidates.push({ code: 'IPC 384', title: 'Extortion', description: 'Extortion-related offences.' , jurisdiction: 'India' });
    reasoning.push('Extortion/ransom indicators present.');
  }
  if (joined.includes('unauthorized access') || joined.includes('unauthorised') || joined.includes('hacking') || joined.includes('breach')) {
    itActCandidates.push({ code: 'IT Act 66', title: 'Computer-related Offences', description: 'Hacking and related offenses.' });
    reasoning.push('Unauthorized access or hacking indicators present in intelligence.');
  }
  if (joined.includes('data breach') || joined.includes('personal data') || joined.includes('leak')) {
    itActCandidates.push({ code: 'IT Act 72A', title: 'Breach of Confidentiality', description: 'Punishment for disclosure of information in breach of lawful contract.' });
    reasoning.push('Data breach or disclosure indicators present.');
  }

  // Wallet / financial indicators -> IPC 406/409 (criminal breach of trust)
  if (joined.includes('wallet') || joined.includes('crypto') || joined.includes('transfer')) {
    ipcCandidates.push({ code: 'IPC 406', title: 'Criminal breach of trust', description: 'Criminal breach of trust related to property.' });
    reasoning.push('Financial transfer / crypto indicators suggest possible breach of trust.');
  }

  // Build confidence heuristic
  const srcCount = new Set(input.intelligence.map(i => i.source)).size;
  const evidenceCount = input.evidence.length;
  const baseConfidence = Math.min(0.95, 0.2 + Math.log(1 + srcCount) * 0.12 + Math.log(1 + evidenceCount) * 0.08);

  const out: LegalCorrelation = {
    id: `lc-${Date.now()}`,
    caseId: input.caseInfo?.id,
    confidence: Number(baseConfidence.toFixed(2)),
    ipcSections: ipcCandidates,
    itActSections: itActCandidates,
    reasoning,
    generatedAt: new Date().toISOString(),
  };

  return out;
}

export default { generateLegalCorrelation };
