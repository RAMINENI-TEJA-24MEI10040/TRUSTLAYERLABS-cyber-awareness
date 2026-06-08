import type { LawMappingEngineResult } from '../../../../CyberAwareness-main/src/sentinel-legal';
import type { CrimeCategory } from '../../../../CyberAwareness-main/src/data/legalProfiles/types';
import type { EvidenceType } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/evidenceVault.types';

export interface LawEvidenceNeed {
  id: string;
  label: string;
  description: string;
  evidenceTypes: EvidenceType[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LawExplanationItem {
  id: string;
  act: string;
  section: string;
  title: string;
  whyApplied: string;
  whatItMeans: string;
  evidenceNeeded: LawEvidenceNeed[];
}

export interface LawExplanationResult {
  crimeCategory: CrimeCategory | null;
  explanations: LawExplanationItem[];
}

type ResolvedLaw = LawMappingEngineResult['lawMapping']['bnsSections'][number];

const evidenceNeeds: Record<string, LawEvidenceNeed> = {
  financial: {
    id: 'financial-proof',
    label: 'Transaction and bank proof',
    description: 'Transaction screenshot, bank statement, UTR/RRN, or payment reference.',
    evidenceTypes: ['SCREENSHOT', 'BANK_STATEMENT', 'PDF'],
    priority: 'CRITICAL',
  },
  communication: {
    id: 'communication-proof',
    label: 'Suspect communication',
    description: 'Chats, emails, screenshots, calls, or recordings showing deception, threats, or demands.',
    evidenceTypes: ['CHAT', 'EMAIL', 'SCREENSHOT', 'AUDIO', 'VIDEO'],
    priority: 'HIGH',
  },
  identity: {
    id: 'identity-proof',
    label: 'Impersonation or account proof',
    description: 'Fake profile, forged document, account compromise, or impersonation screenshots.',
    evidenceTypes: ['SCREENSHOT', 'PDF', 'EMAIL'],
    priority: 'HIGH',
  },
  platform: {
    id: 'platform-proof',
    label: 'Platform record',
    description: 'Platform profile URL, account handle, report/takedown reference, or message export.',
    evidenceTypes: ['SCREENSHOT', 'CHAT', 'PDF'],
    priority: 'MEDIUM',
  },
};

function needsForLaw(law: ResolvedLaw, crimeCategory: CrimeCategory | null): LawEvidenceNeed[] {
  const tags = new Set(law.tags);
  const needs: LawEvidenceNeed[] = [];
  if (tags.has('financial-fraud') || tags.has('upi') || tags.has('crypto') || crimeCategory === 'UPI_FRAUD') needs.push(evidenceNeeds.financial);
  if (tags.has('phishing') || tags.has('otp') || tags.has('personation') || tags.has('extortion')) needs.push(evidenceNeeds.communication);
  if (tags.has('identity-theft') || tags.has('forgery') || tags.has('deepfake')) needs.push(evidenceNeeds.identity);
  if (tags.has('cyber-stalking') || tags.has('harassment') || crimeCategory === 'SEXTORTION') needs.push(evidenceNeeds.platform);
  return needs.length ? needs : [evidenceNeeds.communication];
}

export function explainMappedLaws(mappedLaws: LawMappingEngineResult | null, crimeCategory: CrimeCategory | null): LawExplanationResult {
  if (!mappedLaws) return { crimeCategory, explanations: [] };

  const laws: ResolvedLaw[] = [
    ...mappedLaws.lawMapping.bnsSections,
    ...mappedLaws.lawMapping.itActSections,
    ...mappedLaws.lawMapping.ipcSections,
  ];

  return {
    crimeCategory,
    explanations: laws.map((law) => ({
      id: `${law.act}-${law.section}`,
      act: law.act,
      section: law.section,
      title: law.title,
      whyApplied: law.relevanceReason || law.relevanceTemplate || `Mapped for ${mappedLaws.crimeCategory.replace(/_/g, ' ')}.`,
      whatItMeans: law.description,
      evidenceNeeded: needsForLaw(law, crimeCategory),
    })),
  };
}
