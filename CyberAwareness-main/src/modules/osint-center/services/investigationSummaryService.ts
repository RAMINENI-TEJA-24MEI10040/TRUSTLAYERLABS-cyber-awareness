import type { CIWCase, IntelligenceResult, EvidenceItem, TimelineEvent, InvestigationSummary } from '../types/ciw.types';

type GenerateInput = {
  activeCase: CIWCase;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  intelligence: IntelligenceResult[];
};

// Attempt to integrate with Cyber Justice AI if available.
// If not available, perform a deterministic aggregation-based summary.
export async function generateInvestigationSummary(input: GenerateInput): Promise<InvestigationSummary> {
  // Try dynamic import of a Cyber Justice AI client if present in the repo
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const aiClient = require('../../cyber-justice-ai/services/aiClient');
    if (aiClient && typeof aiClient.summarize === 'function') {
      // The aiClient.summarize API is expected to accept a structured payload and return the InvestigationSummary shape
      const result = await aiClient.summarize({
        case: input.activeCase,
        evidence: input.evidence,
        timeline: input.timeline,
        intelligence: input.intelligence,
      });
      return result as InvestigationSummary;
    }
  } catch (e) {
    // ignore and fallback to local summarization
  }

  // Local fallback summarization (deterministic, not mock data)
  const execSummary = buildExecutiveSummary(input);
  const keyFindings = buildKeyFindings(input);
  const riskScore = estimateRiskScore(input);
  const recommendedActions = buildRecommendedActions(riskScore, keyFindings);
  const confidence = computeConfidence(input);

  return {
    executiveSummary: execSummary,
    keyFindings,
    riskScore,
    riskSummary: `Computed risk score based on ${input.intelligence.length} intelligence items and ${input.evidence.length} evidence items.`,
    recommendedActions,
    confidence,
  };
}

function buildExecutiveSummary(input: GenerateInput): string {
  const parts: string[] = [];
  parts.push(`Case "${input.activeCase.title}" (${input.activeCase.id}) contains ${input.evidence.length} evidence items and ${input.intelligence.length} intelligence results.`);

  const topSources = Array.from(new Set(input.intelligence.map(i => i.source))).slice(0, 3);
  if (topSources.length) parts.push(`Primary intelligence sources: ${topSources.join(', ')}.`);

  const earliest = input.timeline.length ? new Date(Math.min(...input.timeline.map(t => new Date(t.timestamp).getTime()))) : null;
  const latest = input.timeline.length ? new Date(Math.max(...input.timeline.map(t => new Date(t.timestamp).getTime()))) : null;
  if (earliest && latest) parts.push(`Activity observed between ${earliest.toISOString()} and ${latest.toISOString()}.`);

  return parts.join(' ');
}

function buildKeyFindings(input: GenerateInput): string[] {
  const findings: string[] = [];

  // Unique high-risk indicators
  const highRisk = input.intelligence.filter(i => i.riskScore !== undefined && i.riskScore >= 75);
  highRisk.slice(0, 5).forEach(i => {
    findings.push(`${i.source} evidence: ${i.type} => ${i.summary ?? i.raw ?? 'indicator present'}`);
  });

  // Frequent entity mentions
  const entities = new Map<string, number>();
  input.intelligence.forEach(i => {
    if (i.entities) {
      i.entities.forEach(e => entities.set(e, (entities.get(e) ?? 0) + 1));
    }
  });
  const topEntities = Array.from(entities.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  if (topEntities.length) findings.push(`Frequent entities: ${topEntities.join(', ')}`);

  // Evidence counts
  if (input.evidence.length) {
    findings.push(`${input.evidence.length} evidence items attached to the case.`);
  }

  return findings.length ? findings : ['No salient findings extracted.'];
}

function estimateRiskScore(input: GenerateInput): number {
  // Simple heuristic: base on intelligence risk scores + evidence weight + recent activity
  const intelScores = input.intelligence.map(i => i.riskScore ?? 0);
  const intelAvg = intelScores.length ? intelScores.reduce((a, b) => a + b, 0) / intelScores.length : 0;
  const evidenceWeight = Math.min(20, input.evidence.length * 2);

  const recentEventFactor = input.timeline.some(t => Date.now() - new Date(t.timestamp).getTime() < 1000 * 60 * 60 * 24 * 7) ? 10 : 0;

  const score = Math.round(Math.min(100, intelAvg * 0.8 + evidenceWeight + recentEventFactor));
  return score;
}

function buildRecommendedActions(riskScore: number, findings: string[]): string[] {
  const actions: string[] = [];
  if (riskScore >= 80) {
    actions.push('Initiate containment: isolate affected assets and rotate credentials.');
    actions.push('Open full incident response and notify stakeholders.');
  } else if (riskScore >= 50) {
    actions.push('Perform targeted investigations on high-risk indicators and enrich with additional OSINT sources.');
    actions.push('Consider temporary mitigations and monitoring of related assets.');
  } else {
    actions.push('Monitor the entities and schedule a follow-up investigation if activity increases.');
  }

  if (findings.length) actions.push('Document key findings into a formal report for legal and compliance review.');
  return actions;
}

function computeConfidence(input: GenerateInput): number {
  // Confidence increases with number of independent intelligence sources and evidence
  const srcCount = new Set(input.intelligence.map(i => i.source)).size;
  const evidenceCount = input.evidence.length;
  const timelineCount = input.timeline.length;
  const raw = Math.min(0.95, 0.15 + Math.log(1 + srcCount) * 0.12 + Math.log(1 + evidenceCount) * 0.09 + Math.log(1 + timelineCount) * 0.06);
  return Number(raw.toFixed(2));
}
