import type { InvestigationSummary } from '../types/ciw.types';
import type { LegalCorrelation } from '../types/legal.types';
import type { ComplaintPacket } from '../types/complaint.types';

export type GeneratedReport = {
  title: string;
  generatedAt: string;
  sections: Array<{ title: string; content: any }>;
};

export function generateInvestigationReport(params: { caseTitle: string; summary: InvestigationSummary | null; evidenceCount: number; timelineCount: number; intelligenceCount: number; }): GeneratedReport {
  const { caseTitle, summary, evidenceCount, timelineCount, intelligenceCount } = params;
  const sections = [] as GeneratedReport['sections'];

  sections.push({ title: 'Executive Summary', content: summary ? summary.executiveSummary : 'No executive summary available.' });
  sections.push({ title: 'Evidence Overview', content: { evidenceCount } });
  sections.push({ title: 'Timeline Overview', content: { timelineCount } });
  sections.push({ title: 'Intelligence Findings', content: { intelligenceCount, keyFindings: summary?.keyFindings ?? [] } });
  sections.push({ title: 'Recommended Actions', content: summary?.recommendedActions ?? [] });

  return { title: `Investigation Report - ${caseTitle}`, generatedAt: new Date().toISOString(), sections };
}

export function generateLegalReport(params: { caseTitle: string; legal: LegalCorrelation | null; }): GeneratedReport {
  const sections = [] as GeneratedReport['sections'];
  sections.push({ title: 'Legal Correlation Summary', content: legal ? { confidence: legal.confidence, reasoning: legal.reasoning } : 'No legal correlation available.' });
  sections.push({ title: 'Suggested IPC Sections', content: legal?.ipcSections ?? [] });
  sections.push({ title: 'Suggested IT Act Sections', content: legal?.itActSections ?? [] });
  return { title: `Legal Report - ${params.caseTitle}`, generatedAt: new Date().toISOString(), sections };
}

export function generateComplaintReport(params: { caseTitle: string; packet: ComplaintPacket | null; }): GeneratedReport {
  const sections = [] as GeneratedReport['sections'];
  sections.push({ title: 'Incident Summary', content: packet?.incidentSummary ?? 'No incident summary' });
  sections.push({ title: 'Timeline of Events', content: packet?.timeline ?? [] });
  sections.push({ title: 'Evidence List', content: packet?.evidence ?? [] });
  sections.push({ title: 'Legal Suggestions', content: packet?.legalCorrelation ?? null });
  sections.push({ title: 'Recommended Next Actions', content: packet?.recommendedActions ?? [] });
  return { title: `Complaint Packet Report - ${params.caseTitle}`, generatedAt: new Date().toISOString(), sections };
}

export default { generateInvestigationReport, generateLegalReport, generateComplaintReport };
