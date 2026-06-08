import type { CrimeCategory } from '../../../../CyberAwareness-main/src/data/legalProfiles/types';
import type { CyberJusticeCase } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/cyberJustice.types';
import type { EvidenceType, EvidenceVaultItem } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/evidenceVault.types';

export type EvidenceRecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface MissingEvidenceRecommendation {
  id: string;
  evidenceType: EvidenceType;
  title: string;
  description: string;
  reason: string;
  priority: EvidenceRecommendationPriority;
  required: boolean;
  satisfiedBy: EvidenceType[];
}

export interface EvidenceSatisfiedItem {
  ruleId: string;
  evidenceType: EvidenceType;
  evidenceIds: string[];
  title: string;
}

export interface EvidenceRecommendationResult {
  crimeCategory: CrimeCategory | null;
  missingEvidence: MissingEvidenceRecommendation[];
  satisfiedEvidence: EvidenceSatisfiedItem[];
  completenessScore: number;
}

interface EvidenceRecommendationRule {
  id: string;
  crimeCategories: CrimeCategory[];
  acceptedEvidenceTypes: EvidenceType[];
  title: string;
  description: string;
  reason: string;
  priority: EvidenceRecommendationPriority;
  required: boolean;
  condition?: (caseData: CyberJusticeCase) => boolean;
}

const rules: EvidenceRecommendationRule[] = [
  {
    id: 'upi-transaction-screenshot',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM'],
    acceptedEvidenceTypes: ['SCREENSHOT'],
    title: 'Transaction screenshot',
    description: 'Upload a screenshot showing the fraudulent UPI transaction, amount, UPI ID, or reference number.',
    reason: 'This proves the transfer details and supports bank escalation.',
    priority: 'CRITICAL',
    required: true,
  },
  {
    id: 'upi-bank-statement',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM', 'INVESTMENT_SCAM'],
    acceptedEvidenceTypes: ['BANK_STATEMENT', 'PDF'],
    title: 'Bank statement',
    description: 'Upload a statement or passbook entry showing the debit.',
    reason: 'This validates the claimed financial loss.',
    priority: 'HIGH',
    required: true,
  },
  {
    id: 'phishing-page-record',
    crimeCategories: ['PHISHING', 'IDENTITY_THEFT', 'DATA_BREACH'],
    acceptedEvidenceTypes: ['SCREENSHOT', 'PDF', 'EMAIL'],
    title: 'Phishing page or message record',
    description: 'Upload the suspicious page, email, or message that led to the incident.',
    reason: 'This preserves the deception path and malicious URL before it disappears.',
    priority: 'CRITICAL',
    required: true,
  },
  {
    id: 'sextortion-threat-record',
    crimeCategories: ['SEXTORTION', 'CYBER_STALKING'],
    acceptedEvidenceTypes: ['CHAT', 'SCREENSHOT', 'VIDEO', 'AUDIO'],
    title: 'Threat messages or recordings',
    description: 'Upload chats, screenshots, audio, or video showing threats or coercion.',
    reason: 'Threat content is central to intimidation and extortion claims.',
    priority: 'CRITICAL',
    required: true,
  },
  {
    id: 'profile-impersonation-proof',
    crimeCategories: ['DEEPFAKE_IMPERSONATION', 'IDENTITY_THEFT', 'JOB_SCAM'],
    acceptedEvidenceTypes: ['SCREENSHOT', 'PDF'],
    title: 'Profile or impersonation proof',
    description: 'Upload screenshots of fake profiles, job posts, or impersonation pages.',
    reason: 'This connects the accused identity or fake profile to the harm.',
    priority: 'HIGH',
    required: true,
  },
  {
    id: 'crypto-wallet-transaction',
    crimeCategories: ['CRYPTO_FRAUD', 'INVESTMENT_SCAM'],
    acceptedEvidenceTypes: ['SCREENSHOT', 'PDF', 'BANK_STATEMENT'],
    title: 'Wallet or investment transaction record',
    description: 'Upload wallet transfer proof, investment dashboard screenshots, or payment records.',
    reason: 'This links wallet IDs and payment trail to the complaint.',
    priority: 'HIGH',
    required: true,
  },
  {
    id: 'communication-history',
    crimeCategories: [
      'UPI_FRAUD',
      'OTP_FRAUD',
      'PHISHING',
      'INVESTMENT_SCAM',
      'CRYPTO_FRAUD',
      'JOB_SCAM',
      'SIM_SWAP',
      'OTHER',
    ],
    acceptedEvidenceTypes: ['CHAT', 'EMAIL', 'SCREENSHOT'],
    title: 'Communication history',
    description: 'Upload chats, emails, or screenshots showing how the suspect contacted you.',
    reason: 'Communication records explain the deception and suspect identifiers.',
    priority: 'MEDIUM',
    required: false,
  },
];

const priorityRank: Record<EvidenceRecommendationPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function getEvidenceRecommendations(input: {
  crimeCategory: CrimeCategory | null;
  caseData: CyberJusticeCase;
  uploadedEvidence: EvidenceVaultItem[];
}): EvidenceRecommendationResult {
  const activeRules = rules.filter((rule) => {
    if (!input.crimeCategory) return rule.id === 'communication-history';
    return rule.crimeCategories.includes(input.crimeCategory) && (!rule.condition || rule.condition(input.caseData));
  });
  const missingEvidence: MissingEvidenceRecommendation[] = [];
  const satisfiedEvidence: EvidenceSatisfiedItem[] = [];

  activeRules.forEach((rule) => {
    const matches = input.uploadedEvidence.filter((item) => rule.acceptedEvidenceTypes.includes(item.type));
    if (matches.length) {
      satisfiedEvidence.push({
        ruleId: rule.id,
        evidenceType: matches[0].type,
        evidenceIds: matches.map((item) => item.id),
        title: rule.title,
      });
      return;
    }

    missingEvidence.push({
      id: rule.id,
      evidenceType: rule.acceptedEvidenceTypes[0],
      title: rule.title,
      description: rule.description,
      reason: rule.reason,
      priority: rule.priority,
      required: rule.required,
      satisfiedBy: rule.acceptedEvidenceTypes,
    });
  });

  const requiredRules = activeRules.filter((rule) => rule.required);
  const satisfiedRequired = requiredRules.filter((rule) => satisfiedEvidence.some((item) => item.ruleId === rule.id));

  return {
    crimeCategory: input.crimeCategory,
    missingEvidence: missingEvidence.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]),
    satisfiedEvidence,
    completenessScore: requiredRules.length ? Math.round((satisfiedRequired.length / requiredRules.length) * 100) : 100,
  };
}
