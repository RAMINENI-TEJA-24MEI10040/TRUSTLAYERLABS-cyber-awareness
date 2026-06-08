import type { CrimeCategory } from '../../../../CyberAwareness-main/src/data/legalProfiles/types';
import type { CyberJusticeExtractedFacts } from '../types/conversation.types';

export type CaseFieldTarget =
  | 'incident.narrative'
  | 'incident.occurredAt'
  | 'incident.platform'
  | 'financialLoss.amount'
  | 'financialLoss.transactionId'
  | 'financialLoss.bankName'
  | 'financialLoss.recoveryStatus'
  | 'suspect.name'
  | 'suspect.phoneNumbers'
  | 'suspect.emails'
  | 'suspect.upiIds'
  | 'suspect.urls'
  | 'suspect.walletAddresses'
  | 'evidence.references';

export interface DynamicQuestionInput {
  crimeCategory: CrimeCategory | null;
  extractedFacts: CyberJusticeExtractedFacts;
  missingFields: CaseFieldTarget[];
  answeredQuestionIds: string[];
}

export interface NextBestQuestion {
  id: string;
  prompt: string;
  targetField: CaseFieldTarget;
  reason: string;
  priority: number;
  required: boolean;
  quickReplies?: string[];
}

interface QuestionRule extends NextBestQuestion {
  crimeCategories: CrimeCategory[];
}

const rules: QuestionRule[] = [
  {
    id: 'upi-utr',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM'],
    targetField: 'financialLoss.transactionId',
    prompt: 'What is the UTR, RRN, or transaction reference number for the payment?',
    reason: 'Transaction references help banks and police trace the fraudulent transfer.',
    priority: 100,
    required: true,
  },
  {
    id: 'upi-amount',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM', 'INVESTMENT_SCAM', 'CRYPTO_FRAUD'],
    targetField: 'financialLoss.amount',
    prompt: 'How much money was lost in this incident?',
    reason: 'The loss amount is needed for the complaint and financial loss annexure.',
    priority: 95,
    required: true,
  },
  {
    id: 'phishing-url',
    crimeCategories: ['PHISHING', 'IDENTITY_THEFT', 'DATA_BREACH'],
    targetField: 'suspect.urls',
    prompt: 'What suspicious link or website did you receive or open?',
    reason: 'The URL is a primary identifier for phishing investigation.',
    priority: 100,
    required: true,
  },
  {
    id: 'phishing-email',
    crimeCategories: ['PHISHING', 'JOB_SCAM', 'IDENTITY_THEFT'],
    targetField: 'suspect.emails',
    prompt: 'Do you have the sender email address or reply-to email?',
    reason: 'Email identifiers help preserve the impersonation trail.',
    priority: 85,
    required: false,
  },
  {
    id: 'sextortion-platform',
    crimeCategories: ['SEXTORTION', 'CYBER_STALKING', 'DEEPFAKE_IMPERSONATION'],
    targetField: 'incident.platform',
    prompt: 'Which platform did the threats, messages, or impersonation happen on?',
    reason: 'Platform context helps request takedown, account tracing, and evidence preservation.',
    priority: 100,
    required: true,
    quickReplies: ['WhatsApp', 'Instagram', 'Facebook', 'Telegram', 'Email'],
  },
  {
    id: 'suspect-phone',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'SIM_SWAP', 'JOB_SCAM', 'OTHER'],
    targetField: 'suspect.phoneNumbers',
    prompt: 'What phone number did the suspect use, if any?',
    reason: 'Phone numbers are actionable identifiers for investigation.',
    priority: 80,
    required: false,
  },
  {
    id: 'bank-name',
    crimeCategories: ['UPI_FRAUD', 'OTP_FRAUD', 'INVESTMENT_SCAM', 'QR_SCAM'],
    targetField: 'financialLoss.bankName',
    prompt: 'Which bank account or bank app was used for the transaction?',
    reason: 'Bank details support the financial loss annexure and recovery workflow.',
    priority: 75,
    required: false,
  },
  {
    id: 'evidence-refs',
    crimeCategories: [
      'UPI_FRAUD',
      'OTP_FRAUD',
      'PHISHING',
      'INVESTMENT_SCAM',
      'CRYPTO_FRAUD',
      'DEEPFAKE_IMPERSONATION',
      'IDENTITY_THEFT',
      'QR_SCAM',
      'SIM_SWAP',
      'JOB_SCAM',
      'SEXTORTION',
      'CYBER_STALKING',
      'DATA_BREACH',
      'HACKING_UNAUTHORIZED_ACCESS',
      'OTHER',
    ],
    targetField: 'evidence.references',
    prompt: 'What evidence do you have, such as screenshots, chats, emails, recordings, or bank statements?',
    reason: 'Evidence references help build the complaint packet annexures.',
    priority: 70,
    required: false,
  },
];

export function getMissingFieldsForCase(input: {
  crimeCategory: CrimeCategory | null;
  facts: CyberJusticeExtractedFacts;
}): CaseFieldTarget[] {
  const missing: CaseFieldTarget[] = [];
  const { crimeCategory, facts } = input;
  const entities = facts.extractedEntities;

  if (!facts.incident?.narrative) missing.push('incident.narrative');
  if (!facts.incident?.platform && ['SEXTORTION', 'CYBER_STALKING', 'DEEPFAKE_IMPERSONATION'].includes(crimeCategory ?? '')) {
    missing.push('incident.platform');
  }
  if (!facts.financialLoss?.amount && ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM', 'INVESTMENT_SCAM', 'CRYPTO_FRAUD'].includes(crimeCategory ?? '')) {
    missing.push('financialLoss.amount');
  }
  if (!facts.financialLoss?.transactionId && !(entities?.utrIds?.length ?? 0)) missing.push('financialLoss.transactionId');
  if (!facts.financialLoss?.bankName && ['UPI_FRAUD', 'OTP_FRAUD', 'QR_SCAM'].includes(crimeCategory ?? '')) missing.push('financialLoss.bankName');
  if (!(entities?.urls?.length ?? 0) && ['PHISHING', 'IDENTITY_THEFT', 'DATA_BREACH'].includes(crimeCategory ?? '')) missing.push('suspect.urls');
  if (!(entities?.emails?.length ?? 0) && ['PHISHING', 'JOB_SCAM', 'IDENTITY_THEFT'].includes(crimeCategory ?? '')) missing.push('suspect.emails');
  if (!(entities?.phoneNumbers?.length ?? 0)) missing.push('suspect.phoneNumbers');
  if (!facts.evidence?.references.length) missing.push('evidence.references');

  return Array.from(new Set(missing));
}

export function getNextBestQuestion(input: DynamicQuestionInput): NextBestQuestion | null {
  if (!input.crimeCategory) {
    return {
      id: 'general-narrative',
      prompt: 'Please describe what happened in your own words, including contact method, money loss, and any evidence you have.',
      targetField: 'incident.narrative',
      reason: 'The narrative is needed before classification-specific questions can be selected.',
      priority: 100,
      required: true,
    };
  }

  const candidates = rules
    .filter((rule) => rule.crimeCategories.includes(input.crimeCategory as CrimeCategory))
    .filter((rule) => input.missingFields.includes(rule.targetField))
    .filter((rule) => !input.answeredQuestionIds.includes(rule.id))
    .sort((a, b) => b.priority - a.priority);

  return candidates[0] ?? null;
}
