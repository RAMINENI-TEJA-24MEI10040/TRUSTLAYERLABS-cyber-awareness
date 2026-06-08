import type { ExtractedEntities } from '../../../../CyberAwareness-main/src/sentinel-legal';
import type { CyberJusticeCase } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/cyberJustice.types';

export type CyberJusticeConversationStage =
  | 'GREETING'
  | 'INCIDENT_NARRATIVE'
  | 'INCIDENT_DETAILS'
  | 'FINANCIAL_LOSS'
  | 'SUSPECT_DETAILS'
  | 'EVIDENCE_REFERENCES'
  | 'TIMELINE_CONFIRMATION'
  | 'REVIEW_READY';

export type CyberJusticeConversationIntent =
  | 'PROVIDE_NARRATIVE'
  | 'ADD_INCIDENT_DETAIL'
  | 'ADD_FINANCIAL_LOSS'
  | 'ADD_SUSPECT_DETAIL'
  | 'ADD_EVIDENCE_REFERENCE'
  | 'CONFIRM_DETAIL'
  | 'CORRECT_DETAIL'
  | 'SKIP_DETAIL'
  | 'ASK_HELP'
  | 'UNKNOWN';

export interface CyberJusticeConversationMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  createdAt: string;
  stage: CyberJusticeConversationStage;
  intent?: CyberJusticeConversationIntent;
  confidenceScore?: number;
  extractedFacts?: CyberJusticeExtractedFacts;
  pendingQuestionId?: string;
}

export interface CyberJusticeExtractedFacts {
  confidenceScore: number;
  incident?: Partial<CyberJusticeCase['incident']>;
  victim?: Partial<CyberJusticeCase['victim']>;
  suspect?: Partial<CyberJusticeCase['suspect']>;
  financialLoss?: Partial<NonNullable<CyberJusticeCase['financialLoss']>>;
  evidence?: CyberJusticeConversationEvidenceFacts;
  extractedEntities?: Partial<ExtractedEntities>;
}

export interface CyberJusticeConversationEvidenceFacts {
  references: CyberJusticeEvidenceReference[];
  extractedEntities?: Partial<ExtractedEntities>;
}

export interface CyberJusticeEvidenceReference {
  id: string;
  type:
    | 'SCREENSHOT'
    | 'PDF'
    | 'AUDIO'
    | 'VIDEO'
    | 'CHAT'
    | 'EMAIL'
    | 'BANK_STATEMENT'
    | 'UNKNOWN';
  description: string;
  mentionedAt: string;
  sourceMessageId: string;
  linkedEvidenceId?: string;
  confidenceScore: number;
}

export interface CyberJusticePendingQuestion {
  id: string;
  prompt: string;
  stage: CyberJusticeConversationStage;
  targetField?: string;
  required: boolean;
  answered: boolean;
  confidenceScore: number;
  quickReplies?: string[];
}

export interface CyberJusticeConversationState {
  id: string;
  stage: CyberJusticeConversationStage;
  messages: CyberJusticeConversationMessage[];
  pendingQuestions: CyberJusticePendingQuestion[];
  extractedFacts: CyberJusticeExtractedFacts;
  pendingCasePatch: Partial<CyberJusticeCase> | null;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}
