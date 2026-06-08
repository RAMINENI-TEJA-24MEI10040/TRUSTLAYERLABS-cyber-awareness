import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  classifyIncident,
  createEmptyEntities,
  extractEntities,
  formatComplaintForDisplay,
  generatePdf,
  mapLawsForIncident,
} from '../../../../CyberAwareness-main/src/sentinel-legal';
import type { CrimeCategory } from '../../../../CyberAwareness-main/src/data/legalProfiles/types';
import { buildOfficialComplaintPacket, formatPacketForPreview } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/adapters/complaintPacketAdapter';
import { getEvidenceRecommendations, type EvidenceRecommendationResult } from '../engines/evidenceRecommendationEngine';
import { explainMappedLaws, type LawExplanationResult } from '../engines/lawExplanationLayer';
import { generateComplaintPacketPdf } from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/pdf/complaintPacketPdf';
import { getMissingFieldsForCase, getNextBestQuestion } from '../engines/questionEngine';
import { generateTimelineSuggestions, type TimelineSuggestion } from '../engines/timelineSuggestionEngine';
import type {
  CyberJusticeCase,
  CyberJusticeConversationMessage,
  CyberJusticeEvidenceItem,
  CyberJusticeFinancialLoss,
  CyberJusticeSuspect,
  CyberJusticeVictim,
  CyberJusticeWizardStep,
} from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/cyberJustice.types';
import type {
  EvidenceExtractedMetadata,
  EvidenceVaultDraft,
  EvidenceVaultFilters,
  EvidenceVaultItem,
} from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/evidenceVault.types';
import type {
  CyberJusticeTimelineEvent,
  TimelineBuilderFilters,
  TimelineEventDraft,
  TimelineEventSource,
} from '../../../../CyberAwareness-main/src/modules/cyber-justice-ai/types/timeline.types';
import type {
  CyberJusticeConversationState,
  CyberJusticeExtractedFacts,
  CyberJusticePendingQuestion,
} from '../types/conversation.types';

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const wizardSteps: CyberJusticeWizardStep[] = ['NARRATIVE', 'ANALYSIS', 'EVIDENCE', 'TIMELINE', 'REVIEW'];

const defaultEvidenceFilters: EvidenceVaultFilters = {
  type: 'ALL',
  query: '',
  verified: 'ALL',
  processingStatus: 'ALL',
};

const defaultTimelineFilters: TimelineBuilderFilters = {
  source: 'ALL',
  sortOrder: 'ASC',
};

function metadataFromText(sourceText: string, source: EvidenceExtractedMetadata['source']): EvidenceExtractedMetadata {
  const extraction = extractEntities(sourceText);
  return {
    source,
    sourceTextLength: extraction.sourceTextLength,
    extractedAt: now(),
    confidence: 'DETERMINISTIC',
    upiIds: extraction.entities.upiIds,
    phoneNumbers: extraction.entities.phoneNumbers,
    emails: extraction.entities.emails,
    urls: extraction.entities.urls,
    ifscCodes: extraction.entities.ifscCodes,
    utrIds: extraction.entities.utrIds,
    walletAddresses: extraction.entities.walletAddresses,
  };
}

function mergeUnique<T>(...groups: T[][]): T[] {
  return Array.from(new Set(groups.flat().filter(Boolean)));
}

function mergeEvidenceEntities(caseFile: CyberJusticeCase, newMetadata?: EvidenceExtractedMetadata) {
  const fromVault = [...caseFile.evidence.vaultItems.map((item) => item.extractedMetadata), ...(newMetadata ? [newMetadata] : [])];
  return {
    upiIds: mergeUnique(caseFile.evidence.extractedEntities.upiIds, ...fromVault.map((item) => item.upiIds)),
    phoneNumbers: mergeUnique(caseFile.evidence.extractedEntities.phoneNumbers, ...fromVault.map((item) => item.phoneNumbers)),
    utrIds: mergeUnique(caseFile.evidence.extractedEntities.utrIds, ...fromVault.map((item) => item.utrIds)),
    ifscCodes: mergeUnique(caseFile.evidence.extractedEntities.ifscCodes, ...fromVault.map((item) => item.ifscCodes)),
    urls: mergeUnique(caseFile.evidence.extractedEntities.urls, ...fromVault.map((item) => item.urls)),
    emails: mergeUnique(caseFile.evidence.extractedEntities.emails, ...fromVault.map((item) => item.emails)),
    walletAddresses: mergeUnique(
      caseFile.evidence.extractedEntities.walletAddresses,
      ...fromVault.map((item) => item.walletAddresses),
    ),
  };
}

function mergeEntities(base = createEmptyEntities(), patch: Partial<ReturnType<typeof createEmptyEntities>> = {}) {
  return {
    upiIds: mergeUnique(base.upiIds, patch.upiIds ?? []),
    phoneNumbers: mergeUnique(base.phoneNumbers, patch.phoneNumbers ?? []),
    utrIds: mergeUnique(base.utrIds, patch.utrIds ?? []),
    ifscCodes: mergeUnique(base.ifscCodes, patch.ifscCodes ?? []),
    urls: mergeUnique(base.urls, patch.urls ?? []),
    emails: mergeUnique(base.emails, patch.emails ?? []),
    walletAddresses: mergeUnique(base.walletAddresses, patch.walletAddresses ?? []),
  };
}

function isDateLikeAmount(raw: string, sentence: string) {
  return /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/.test(sentence)
    || /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/.test(sentence)
    || /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i.test(sentence)
    || (/^\d{4}$/.test(raw) && /\b(19|20)\d{2}\b/.test(raw));
}

function extractFinancialLossFromText(text: string) {
  const result = {
    amount: undefined as number | undefined,
    demandedAmount: undefined as number | undefined,
    currency: 'INR',
    paymentMade: false,
    noPayment: false,
  };

  const demandRegex = /\b(demand(?:ed|ing)?|asked(?: me)? for|request(?:ed)?|threat|blackmail|extortion|coerce(?:d)?|ransom|pay up)\b/i;
  const paymentRegex = /\b(paid|payment|transferred|sent|debited|credited|approved|charge(?:d)?|collected|payment was made|amount was debited)\b/i;
  const noPaymentRegex = /\b(did not (?:make )?any payment|no payment|didn't pay|not paid|never paid|no money was paid|no amount was paid)\b/i;

  const sentences = text.split(/(?<=[.?!])\s+/);
  for (const sentence of sentences) {
    const currencyAmounts = Array.from(sentence.matchAll(/(?:inr|rs\.?|₹)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/gi))
      .map((match) => ({ raw: match[0], value: Number(match[1].replace(/,/g, '')) }))
      .filter((amount) => !isNaN(amount.value) && !isDateLikeAmount(amount.raw, sentence));

    const hasDemandContext = demandRegex.test(sentence);
    const hasPaymentContext = paymentRegex.test(sentence);
    const hasNoPaymentContext = noPaymentRegex.test(sentence.toLowerCase());

    if (hasNoPaymentContext) {
      result.noPayment = true;
    }

    if (currencyAmounts.length) {
      if (hasDemandContext && result.demandedAmount === undefined) {
        result.demandedAmount = currencyAmounts[0].value;
      }
      if (hasPaymentContext && result.amount === undefined) {
        result.amount = currencyAmounts[0].value;
        result.paymentMade = true;
      }
      if (!hasDemandContext && !hasPaymentContext && currencyAmounts.length === 1 && /(?:inr|rs\.?|₹)/i.test(currencyAmounts[0].raw)) {
        if (result.amount === undefined) {
          result.amount = currencyAmounts[0].value;
        }
      }
    }
  }

  if (result.demandedAmount !== undefined && result.amount === undefined) {
    result.amount = result.noPayment ? 0 : 0;
  }

  return result;
}

function conversationFactsFromCase(caseFile: CyberJusticeCase): CyberJusticeExtractedFacts {
  return {
    confidenceScore: caseFile.laws.classification?.confidence ?? 0,
    incident: caseFile.incident,
    victim: caseFile.victim,
    suspect: caseFile.suspect,
    financialLoss: caseFile.financialLoss ?? undefined,
    evidence: {
      references: caseFile.evidence.vaultItems.map((item) => ({
        id: `ref-${item.id}`,
        type: item.type,
        description: item.description || item.name,
        mentionedAt: item.createdAt,
        sourceMessageId: item.id,
        linkedEvidenceId: item.id,
        confidenceScore: item.verified ? 0.9 : 0.72,
      })),
      extractedEntities: caseFile.evidence.extractedEntities,
    },
    extractedEntities: caseFile.evidence.extractedEntities,
  };
}

function initialConversation(caseFile: CyberJusticeCase): CyberJusticeConversationState {
  const timestamp = now();
  return {
    id: uid('conversation'),
    stage: 'GREETING',
    messages: [
      {
        id: 'phase4-assistant-greeting',
        role: 'assistant',
        content:
          'Tell me what happened naturally. I will extract facts, ask focused questions, recommend evidence, suggest timeline events, and explain the laws.',
        createdAt: timestamp,
        stage: 'GREETING',
        confidenceScore: 1,
      },
    ],
    pendingQuestions: [],
    extractedFacts: conversationFactsFromCase(caseFile),
    pendingCasePatch: null,
    confidenceScore: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function extractConversationFacts(text: string, caseFile: CyberJusticeCase, messageId: string): CyberJusticeExtractedFacts {
  const extraction = extractEntities(text);
  const amountMatch = text.match(/(?:inr|rs\.?|₹)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i);
  const lower = text.toLowerCase();
  const evidenceReferences = ['screenshot', 'pdf', 'audio', 'video', 'chat', 'email', 'bank statement', 'statement']
    .filter((keyword) => lower.includes(keyword))
    .map((keyword) => ({
      id: uid('evidence-ref'),
      type: keyword.includes('screenshot')
        ? ('SCREENSHOT' as const)
        : keyword.includes('pdf')
          ? ('PDF' as const)
          : keyword.includes('audio')
            ? ('AUDIO' as const)
            : keyword.includes('video')
              ? ('VIDEO' as const)
              : keyword.includes('chat')
                ? ('CHAT' as const)
                : keyword.includes('email')
                  ? ('EMAIL' as const)
                  : keyword.includes('statement')
                    ? ('BANK_STATEMENT' as const)
                    : ('UNKNOWN' as const),
      description: `User mentioned ${keyword}`,
      mentionedAt: now(),
      sourceMessageId: messageId,
      confidenceScore: 0.68,
    }));

  return {
    confidenceScore: 0.74,
    incident: {
      narrative: caseFile.incident.narrative ? `${caseFile.incident.narrative}\n\n${text}` : text,
      platform: ['whatsapp', 'instagram', 'telegram', 'facebook', 'email'].find((platform) => lower.includes(platform)),
    },
    suspect: {
      phoneNumbers: mergeUnique(caseFile.suspect.phoneNumbers, extraction.entities.phoneNumbers),
      emails: mergeUnique(caseFile.suspect.emails, extraction.entities.emails),
      upiIds: mergeUnique(caseFile.suspect.upiIds, extraction.entities.upiIds),
      urls: mergeUnique(caseFile.suspect.urls, extraction.entities.urls),
      walletAddresses: mergeUnique(caseFile.suspect.walletAddresses, extraction.entities.walletAddresses),
      socialProfiles: caseFile.suspect.socialProfiles,
    },
    financialLoss: {
      amount: amount !== undefined ? amount : caseFile.financialLoss?.amount,
      demandedAmount: demandedAmount ?? caseFile.financialLoss?.demandedAmount,
      currency: caseFile.financialLoss?.currency ?? currency,
      paymentMade: paymentMade || caseFile.financialLoss?.paymentMade,
      transactionId: extraction.entities.utrIds[0] ?? caseFile.financialLoss?.transactionId,
      bankName: caseFile.financialLoss?.bankName,
      recoveryStatus: caseFile.financialLoss?.recoveryStatus,
    },
    evidence: {
      references: evidenceReferences,
      extractedEntities: extraction.entities,
    },
    extractedEntities: extraction.entities,
  };
}

function questionFromCase(caseFile: CyberJusticeCase, conversation: CyberJusticeConversationState): CyberJusticePendingQuestion | null {
  const facts = conversationFactsFromCase(caseFile);
  const answered = conversation.pendingQuestions.filter((question) => question.answered).map((question) => question.id);
  const missingFields = getMissingFieldsForCase({ crimeCategory: caseFile.incident.category, facts });
  const next = getNextBestQuestion({
    crimeCategory: caseFile.incident.category,
    extractedFacts: facts,
    missingFields,
    answeredQuestionIds: answered,
  });
  if (!next) return null;
  return {
    id: next.id,
    prompt: next.prompt,
    stage: 'INCIDENT_DETAILS',
    targetField: next.targetField,
    required: next.required,
    answered: false,
    confidenceScore: Math.min(1, next.priority / 100),
    quickReplies: next.quickReplies,
  };
}

function buildPhase4State(caseFile: CyberJusticeCase, conversation: CyberJusticeConversationState) {
  return {
    evidenceRecommendations: getEvidenceRecommendations({
      crimeCategory: caseFile.incident.category,
      caseData: caseFile,
      uploadedEvidence: caseFile.evidence.vaultItems,
    }),
    timelineSuggestions: generateTimelineSuggestions({
      conversation,
      evidence: caseFile.evidence.vaultItems,
      extractedEntities: caseFile.evidence.extractedEntities,
    }),
    lawExplanations: explainMappedLaws(caseFile.laws.mapping, caseFile.incident.category),
  };
}

function initialCase(): CyberJusticeCase {
  const timestamp = now();

  return {
    id: uid('case'),
    status: 'DRAFT',
    createdAt: timestamp,
    updatedAt: timestamp,
    victim: {
      consentToGenerateComplaint: false,
    },
    incident: {
      narrative: '',
      category: null,
      userSelectedCategory: null,
    },
    suspect: {
      phoneNumbers: [],
      emails: [],
      upiIds: [],
      urls: [],
      walletAddresses: [],
      socialProfiles: [],
    },
    evidence: {
      extractedEntities: createEmptyEntities(),
      items: [],
      vaultItems: [],
      selectedEvidenceId: null,
      filters: defaultEvidenceFilters,
    },
    timeline: {
      events: [],
      selectedEventId: null,
      filters: defaultTimelineFilters,
    },
    financialLoss: null,
    classification: null,
    laws: {
      classification: null,
      mapping: null,
    },
    complaint: {
      generated: null,
      previewText: '',
      pdf: null,
      packet: null,
    },
  };
}

const greeting: CyberJusticeConversationMessage = {
  id: 'assistant-greeting',
  role: 'assistant',
  stage: 'GREETING',
  createdAt: now(),
  content:
    'Tell me what happened in simple words. I will help classify the cybercrime, identify useful evidence, build a timeline, and prepare a complaint draft.',
};

interface ConversationStore {
  caseFile: CyberJusticeCase;
  messages: CyberJusticeConversationMessage[];
  conversation: CyberJusticeConversationState;
  evidenceRecommendations: EvidenceRecommendationResult;
  timelineSuggestions: TimelineSuggestion[];
  lawExplanations: LawExplanationResult;
  activeStage: CyberJusticeConversationMessage['stage'];
  wizardStep: CyberJusticeWizardStep;
  isAnalyzing: boolean;
  isGeneratingComplaint: boolean;

  addMessage: (role: CyberJusticeConversationMessage['role'], content: string) => void;
  setNarrative: (narrative: string) => void;
  analyzeNarrative: () => void;
  overrideCategory: (category: CrimeCategory) => void;
  updateVictim: (victim: Partial<CyberJusticeVictim>) => void;
  updateSuspect: (suspect: Partial<CyberJusticeSuspect>) => void;
  updateFinancialLoss: (financialLoss: CyberJusticeFinancialLoss | null) => void;
  addEvidenceItem: (item: Omit<CyberJusticeEvidenceItem, 'id' | 'createdAt'>) => void;
  addEvidenceVaultItem: (item: EvidenceVaultDraft) => void;
  updateEvidenceVaultItem: (id: string, patch: Partial<EvidenceVaultItem>) => void;
  removeEvidenceVaultItem: (id: string) => void;
  selectEvidenceItem: (id: string | null) => void;
  setEvidenceFilters: (filters: Partial<EvidenceVaultFilters>) => void;
  markEvidenceVerified: (id: string, verified: boolean) => void;
  attachExtractedMetadata: (id: string, metadata: EvidenceExtractedMetadata) => void;
  addTimelineEvent: (event: TimelineEventDraft) => void;
  updateTimelineEvent: (id: string, patch: Partial<CyberJusticeTimelineEvent>) => void;
  removeTimelineEvent: (id: string) => void;
  selectTimelineEvent: (id: string | null) => void;
  setTimelineSourceFilter: (source: TimelineEventSource | 'ALL') => void;
  setTimelineSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  generateTimelineEventsFromConversation: () => void;
  generateTimelineEventsFromEntities: () => void;
  generateTimelineEventsFromEvidence: () => void;
  generateTimelineSuggestions: () => void;
  approveTimelineSuggestion: (id: string) => void;
  rejectTimelineSuggestion: (id: string) => void;
  editTimelineSuggestion: (id: string, patch: Partial<TimelineSuggestion>) => void;
  confirmTimelineEvent: (id: string) => void;
  sendConversationMessage: (content: string) => void;
  applyPendingCasePatch: () => void;
  rejectPendingCasePatch: () => void;
  refreshPhase4Intelligence: () => void;
  setWizardStep: (step: CyberJusticeWizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  generateComplaint: () => Promise<void>;
  resetCase: () => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => {
      const startingCase = initialCase();
      const startingConversation = initialConversation(startingCase);
      return {
        caseFile: startingCase,
        messages: [greeting],
        conversation: startingConversation,
        ...buildPhase4State(startingCase, startingConversation),
        activeStage: 'GREETING',
        wizardStep: 'NARRATIVE',
        isAnalyzing: false,
        isGeneratingComplaint: false,

      addMessage: (role, content) => {
        const message: CyberJusticeConversationMessage = {
          id: uid(role),
          role,
          content,
          stage: get().activeStage,
          createdAt: now(),
        };
        set((state) => ({ messages: [...state.messages, message] }));
      },

      setNarrative: (narrative) => {
        set((state) => ({
          activeStage: narrative.trim() ? 'NARRATIVE' : state.activeStage,
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            incident: {
              ...state.caseFile.incident,
              narrative,
            },
          },
        }));
      },

      analyzeNarrative: () => {
        const { caseFile } = get();
        const narrative = caseFile.incident.narrative.trim();
        if (!narrative) return;

        set({ isAnalyzing: true });

        const classification = classifyIncident({ narrative });
        const extracted = extractEntities(narrative);
        const mapping = mapLawsForIncident(classification.primaryCategory);

        set((state) => ({
          activeStage: 'ANALYSIS',
          wizardStep: 'ANALYSIS',
          isAnalyzing: false,
          caseFile: {
            ...state.caseFile,
            status: 'ANALYZED',
            updatedAt: now(),
            incident: {
              ...state.caseFile.incident,
              category: classification.primaryCategory,
              userSelectedCategory: null,
            },
            evidence: {
              ...state.caseFile.evidence,
              extractedEntities: extracted.entities,
            },
            classification,
            laws: {
              classification,
              mapping,
              plainLanguageSummary: `This appears closest to ${classification.primaryCategory.replace(/_/g, ' ').toLowerCase()}. The mapped law sections are ready for review.`,
            },
          },
          messages: [
            ...state.messages,
            {
              id: uid('assistant'),
              role: 'assistant',
              stage: 'ANALYSIS',
              createdAt: now(),
              content: `I classified this as ${classification.primaryCategory.replace(/_/g, ' ')} with ${(classification.confidence * 100).toFixed(1)}% confidence and extracted available identifiers.`,
            },
          ],
        }));
        get().refreshPhase4Intelligence();
      },

      overrideCategory: (category) => {
        const mapping = mapLawsForIncident(category);
        set((state) => {
          const classification = state.caseFile.laws.classification
            ? {
                ...state.caseFile.laws.classification,
                primaryCategory: category,
                classificationPath: 'manual' as const,
              }
            : null;

          return {
            activeStage: 'ANALYSIS',
            caseFile: {
              ...state.caseFile,
              updatedAt: now(),
              incident: {
                ...state.caseFile.incident,
                category,
                userSelectedCategory: category,
              },
              classification,
              laws: {
                ...state.caseFile.laws,
                mapping,
                classification,
              },
            },
          };
        });
        get().refreshPhase4Intelligence();
      },

      updateVictim: (victim) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            victim: {
              ...state.caseFile.victim,
              ...victim,
            },
          },
        }));
      },

      updateSuspect: (suspect) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            suspect: {
              ...state.caseFile.suspect,
              ...suspect,
            },
          },
        }));
      },

      updateFinancialLoss: (financialLoss) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            financialLoss,
          },
        }));
        get().refreshPhase4Intelligence();
      },

      addEvidenceItem: (item) => {
        set((state) => ({
          activeStage: 'EVIDENCE',
          caseFile: {
            ...state.caseFile,
            status: state.caseFile.status === 'DRAFT' ? 'EVIDENCE_REVIEW' : state.caseFile.status,
            updatedAt: now(),
            evidence: {
              ...state.caseFile.evidence,
              items: [
                ...state.caseFile.evidence.items,
                {
                  ...item,
                  id: uid('evidence'),
                  createdAt: now(),
                },
              ],
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      addEvidenceVaultItem: (draft) => {
        const timestamp = now();
        const metadata = metadataFromText(draft.sourceText, draft.metadataSource);
        const item: EvidenceVaultItem = {
          id: uid('evidence'),
          type: draft.type,
          name: draft.name,
          description: draft.description,
          timestamp: draft.timestamp || timestamp,
          extractedMetadata: metadata,
          createdAt: timestamp,
          updatedAt: timestamp,
          verified: draft.verified ?? false,
          requiredForComplaint: draft.requiredForComplaint ?? true,
          processingStatus: 'READY',
          tags: draft.tags ?? [],
          storage: draft.storage,
        };

        set((state) => ({
          activeStage: 'EVIDENCE',
          caseFile: {
            ...state.caseFile,
            status: 'EVIDENCE_REVIEW',
            updatedAt: timestamp,
            evidence: {
              ...state.caseFile.evidence,
              vaultItems: [...state.caseFile.evidence.vaultItems, item],
              extractedEntities: mergeEvidenceEntities(state.caseFile, metadata),
              selectedEvidenceId: item.id,
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      updateEvidenceVaultItem: (id, patch) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            evidence: {
              ...state.caseFile.evidence,
              vaultItems: state.caseFile.evidence.vaultItems.map((item) =>
                item.id === id ? { ...item, ...patch, updatedAt: now() } : item,
              ),
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      removeEvidenceVaultItem: (id) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            evidence: {
              ...state.caseFile.evidence,
              vaultItems: state.caseFile.evidence.vaultItems.filter((item) => item.id !== id),
              selectedEvidenceId: state.caseFile.evidence.selectedEvidenceId === id ? null : state.caseFile.evidence.selectedEvidenceId,
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      selectEvidenceItem: (id) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            evidence: {
              ...state.caseFile.evidence,
              selectedEvidenceId: id,
            },
          },
        }));
      },

      setEvidenceFilters: (filters) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            evidence: {
              ...state.caseFile.evidence,
              filters: {
                ...state.caseFile.evidence.filters,
                ...filters,
              },
            },
          },
        }));
      },

      markEvidenceVerified: (id, verified) => {
        get().updateEvidenceVaultItem(id, { verified });
      },

      attachExtractedMetadata: (id, metadata) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            evidence: {
              ...state.caseFile.evidence,
              vaultItems: state.caseFile.evidence.vaultItems.map((item) =>
                item.id === id ? { ...item, extractedMetadata: metadata, updatedAt: now() } : item,
              ),
              extractedEntities: mergeEvidenceEntities(state.caseFile, metadata),
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      addTimelineEvent: (draft) => {
        const timestamp = now();
        const event: CyberJusticeTimelineEvent = {
          id: uid('timeline'),
          title: draft.title,
          description: draft.description,
          timestamp: draft.timestamp || timestamp,
          source: draft.source,
          createdAt: timestamp,
          updatedAt: timestamp,
          verified: draft.verified ?? draft.source === 'MANUAL_ENTRY',
          confidence: draft.confidence ?? (draft.source === 'MANUAL_ENTRY' ? 'USER_CONFIRMED' : 'AUTO_INFERRED'),
          linkedEvidenceIds: draft.linkedEvidenceIds ?? [],
          linkedMessageIds: draft.linkedMessageIds ?? [],
          linkedEntityValues: draft.linkedEntityValues ?? [],
          originalSourceId: draft.originalSourceId,
        };

        set((state) => ({
          activeStage: 'TIMELINE',
          caseFile: {
            ...state.caseFile,
            updatedAt: timestamp,
            timeline: {
              ...state.caseFile.timeline,
              events: [...state.caseFile.timeline.events, event],
              selectedEventId: event.id,
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      updateTimelineEvent: (id, patch) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            timeline: {
              ...state.caseFile.timeline,
              events: state.caseFile.timeline.events.map((event) =>
                event.id === id ? { ...event, ...patch, updatedAt: now() } : event,
              ),
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      removeTimelineEvent: (id) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            updatedAt: now(),
            timeline: {
              ...state.caseFile.timeline,
              events: state.caseFile.timeline.events.filter((event) => event.id !== id),
              selectedEventId: state.caseFile.timeline.selectedEventId === id ? null : state.caseFile.timeline.selectedEventId,
            },
          },
        }));
        get().refreshPhase4Intelligence();
      },

      selectTimelineEvent: (id) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            timeline: {
              ...state.caseFile.timeline,
              selectedEventId: id,
            },
          },
        }));
      },

      setTimelineSourceFilter: (source) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            timeline: {
              ...state.caseFile.timeline,
              filters: {
                ...state.caseFile.timeline.filters,
                source,
              },
            },
          },
        }));
      },

      setTimelineSortOrder: (sortOrder) => {
        set((state) => ({
          caseFile: {
            ...state.caseFile,
            timeline: {
              ...state.caseFile.timeline,
              filters: {
                ...state.caseFile.timeline.filters,
                sortOrder,
              },
            },
          },
        }));
      },

      generateTimelineEventsFromConversation: () => {
        const { caseFile, messages, addTimelineEvent } = get();
        if (!caseFile.incident.narrative.trim()) return;

        const exists = caseFile.timeline.events.some((event) => event.source === 'CONVERSATION' && event.originalSourceId === caseFile.id);
        if (exists) return;

        const userMessageIds = messages.filter((message) => message.role === 'user').map((message) => message.id);
        addTimelineEvent({
          title: 'Incident narrative recorded',
          description: caseFile.incident.narrative,
          timestamp: caseFile.incident.occurredAt || caseFile.updatedAt,
          source: 'CONVERSATION',
          linkedMessageIds: userMessageIds,
          originalSourceId: caseFile.id,
        });
      },

      generateTimelineEventsFromEntities: () => {
        const { caseFile, addTimelineEvent } = get();
        const entities = caseFile.evidence.extractedEntities;
        const entityPairs: Array<[string, string[]]> = [
          ['UPI identifiers found', entities.upiIds],
          ['Phone numbers found', entities.phoneNumbers],
          ['Email addresses found', entities.emails],
          ['URLs found', entities.urls],
          ['IFSC codes found', entities.ifscCodes],
          ['UTR/RRN references found', entities.utrIds],
          ['Wallet IDs found', entities.walletAddresses],
        ];

        entityPairs.forEach(([title, values]) => {
          const clean = values.filter(Boolean);
          if (!clean.length) return;
          const sourceId = `entities-${title}`;
          const exists = caseFile.timeline.events.some((event) => event.source === 'EXTRACTED_ENTITY' && event.originalSourceId === sourceId);
          if (exists) return;

          addTimelineEvent({
            title,
            description: clean.join(', '),
            timestamp: caseFile.updatedAt,
            source: 'EXTRACTED_ENTITY',
            linkedEntityValues: clean,
            originalSourceId: sourceId,
          });
        });
      },

      generateTimelineEventsFromEvidence: () => {
        const { caseFile, addTimelineEvent } = get();
        caseFile.evidence.vaultItems.forEach((item) => {
          const exists = caseFile.timeline.events.some((event) => event.source === 'UPLOADED_EVIDENCE' && event.originalSourceId === item.id);
          if (exists) return;

          addTimelineEvent({
            title: `${item.type.replace(/_/g, ' ')} evidence added`,
            description: `${item.name}. ${item.description}`,
            timestamp: item.timestamp,
            source: 'UPLOADED_EVIDENCE',
            linkedEvidenceIds: [item.id],
            originalSourceId: item.id,
          });
        });
      },

      confirmTimelineEvent: (id) => {
        get().updateTimelineEvent(id, {
          verified: true,
          confidence: 'USER_CONFIRMED',
        });
      },

      generateTimelineSuggestions: () => {
        const { caseFile, conversation } = get();
        set({
          timelineSuggestions: generateTimelineSuggestions({
            conversation,
            evidence: caseFile.evidence.vaultItems,
            extractedEntities: caseFile.evidence.extractedEntities,
          }),
        });
      },

      approveTimelineSuggestion: (id) => {
        const suggestion = get().timelineSuggestions.find((item) => item.id === id);
        if (!suggestion) return;
        get().addTimelineEvent({
          title: suggestion.title,
          description: suggestion.description,
          timestamp: suggestion.timestamp ?? new Date().toISOString(),
          source: suggestion.source,
          verified: true,
          confidence: 'USER_CONFIRMED',
          linkedEvidenceIds: suggestion.linkedEvidenceIds,
          linkedMessageIds: suggestion.linkedMessageIds,
          linkedEntityValues: suggestion.linkedEntityValues,
          originalSourceId: suggestion.id,
        });
        set((state) => ({
          timelineSuggestions: state.timelineSuggestions.map((item) =>
            item.id === id ? { ...item, status: 'APPROVED' } : item,
          ),
        }));
      },

      rejectTimelineSuggestion: (id) => {
        set((state) => ({
          timelineSuggestions: state.timelineSuggestions.map((item) =>
            item.id === id ? { ...item, status: 'REJECTED' } : item,
          ),
        }));
      },

      editTimelineSuggestion: (id, patch) => {
        set((state) => ({
          timelineSuggestions: state.timelineSuggestions.map((item) =>
            item.id === id ? { ...item, ...patch, status: 'EDITED' } : item,
          ),
        }));
      },

      sendConversationMessage: (content) => {
        const text = content.trim();
        if (!text) return;
        const timestamp = now();
        const messageId = uid('conversation-user');
        const { caseFile, conversation } = get();
        const extractedFacts = extractConversationFacts(text, caseFile, messageId);
        const mergedFacts: CyberJusticeExtractedFacts = {
          ...conversation.extractedFacts,
          ...extractedFacts,
          extractedEntities: mergeEntities(
            caseFile.evidence.extractedEntities,
            extractedFacts.extractedEntities,
          ),
          evidence: {
            references: [
              ...(conversation.extractedFacts.evidence?.references ?? []),
              ...(extractedFacts.evidence?.references ?? []),
            ],
            extractedEntities: mergeEntities(
              caseFile.evidence.extractedEntities,
              extractedFacts.extractedEntities,
            ),
          },
        };
        const pendingCasePatch: Partial<CyberJusticeCase> = {
          incident: extractedFacts.incident,
          suspect: extractedFacts.suspect,
          financialLoss: extractedFacts.financialLoss,
          evidence: {
            ...caseFile.evidence,
            extractedEntities: mergeEntities(caseFile.evidence.extractedEntities, extractedFacts.extractedEntities),
          },
        };
        const nextConversation: CyberJusticeConversationState = {
          ...conversation,
          stage: 'INCIDENT_DETAILS',
          updatedAt: timestamp,
          confidenceScore: extractedFacts.confidenceScore,
          extractedFacts: mergedFacts,
          pendingCasePatch,
          messages: [
            ...conversation.messages,
            {
              id: messageId,
              role: 'user',
              content: text,
              createdAt: timestamp,
              stage: 'INCIDENT_NARRATIVE',
              intent: 'PROVIDE_NARRATIVE',
              confidenceScore: extractedFacts.confidenceScore,
              extractedFacts,
            },
          ],
        };
        const question = questionFromCase(caseFile, nextConversation);
        const assistantMessage = question
          ? {
              id: uid('conversation-assistant'),
              role: 'assistant' as const,
              content: question.prompt,
              createdAt: now(),
              stage: 'INCIDENT_DETAILS' as const,
              pendingQuestionId: question.id,
              confidenceScore: question.confidenceScore,
            }
          : {
              id: uid('conversation-assistant'),
              role: 'assistant' as const,
              content: 'I captured those details. Review the proposed updates, then confirm them when ready.',
              createdAt: now(),
              stage: 'REVIEW_READY' as const,
              confidenceScore: 0.72,
            };

        set({
          conversation: {
            ...nextConversation,
            pendingQuestions: question ? [...nextConversation.pendingQuestions, question] : nextConversation.pendingQuestions,
            messages: [...nextConversation.messages, assistantMessage],
          },
        });
      },

      applyPendingCasePatch: () => {
        const { caseFile, conversation } = get();
        if (!conversation.pendingCasePatch) return;
        const patch = conversation.pendingCasePatch;
        const patchedCase: CyberJusticeCase = {
          ...caseFile,
          updatedAt: now(),
          incident: {
            ...caseFile.incident,
            ...patch.incident,
          },
          suspect: {
            ...caseFile.suspect,
            ...patch.suspect,
          },
          financialLoss: patch.financialLoss
            ? {
                ...(caseFile.financialLoss ?? {}),
                ...patch.financialLoss,
              }
            : caseFile.financialLoss,
          evidence: patch.evidence
            ? {
                ...caseFile.evidence,
                extractedEntities: mergeEntities(caseFile.evidence.extractedEntities, patch.evidence.extractedEntities),
              }
            : caseFile.evidence,
        };
        const nextConversation: CyberJusticeConversationState = {
          ...conversation,
          stage: 'REVIEW_READY',
          pendingCasePatch: null,
          extractedFacts: conversationFactsFromCase(patchedCase),
          pendingQuestions: conversation.pendingQuestions.map((question) => ({ ...question, answered: true })),
          updatedAt: now(),
        };
        set({
          caseFile: patchedCase,
          conversation: nextConversation,
          ...buildPhase4State(patchedCase, nextConversation),
        });
      },

      rejectPendingCasePatch: () => {
        set((state) => ({
          conversation: {
            ...state.conversation,
            pendingCasePatch: null,
            updatedAt: now(),
          },
        }));
      },

      refreshPhase4Intelligence: () => {
        const { caseFile, conversation } = get();
        const refreshedConversation = {
          ...conversation,
          extractedFacts: conversationFactsFromCase(caseFile),
          updatedAt: now(),
        };
        set({
          conversation: refreshedConversation,
          ...buildPhase4State(caseFile, refreshedConversation),
        });
      },

      setWizardStep: (step) => {
        set({ wizardStep: step, activeStage: step });
      },

      nextStep: () => {
        const { wizardStep, analyzeNarrative } = get();
        if (wizardStep === 'NARRATIVE') {
          analyzeNarrative();
          return;
        }
        const index = wizardSteps.indexOf(wizardStep);
        const next = wizardSteps[Math.min(index + 1, wizardSteps.length - 1)];
        set({ wizardStep: next, activeStage: next });
      },

      prevStep: () => {
        const { wizardStep } = get();
        const index = wizardSteps.indexOf(wizardStep);
        const previous = wizardSteps[Math.max(index - 1, 0)];
        set({ wizardStep: previous, activeStage: previous });
      },

      generateComplaint: async () => {
        const { caseFile } = get();
        const packet = buildOfficialComplaintPacket(caseFile);
        if (!packet) return;

        set({ isGeneratingComplaint: true });
        const baselinePdf = await generatePdf(packet.complaint, {
          title: 'Cybercrime Complaint',
          subject: packet.complaint.subject,
        });
        const packetPdf = await generateComplaintPacketPdf(packet);
        const pdf = packetPdf.success ? packetPdf : baselinePdf;
        const packetWithPdf = {
          ...packet,
          pdf,
          exportSummary: {
            ...packet.exportSummary,
            pdfReady: pdf.success,
          },
        };

        set((state) => ({
          isGeneratingComplaint: false,
          caseFile: {
            ...state.caseFile,
            status: pdf.success ? 'EXPORTED' : 'COMPLAINT_READY',
            updatedAt: now(),
            complaint: {
              generated: packet.complaint,
              previewText: `${formatPacketForPreview(packetWithPdf)}\n\n---\n\nLegacy Complaint Preview\n${formatComplaintForDisplay(packet.complaint)}`,
              pdf,
              generatedAt: now(),
              packet: packetWithPdf,
            },
          },
        }));
      },

      resetCase: () => {
        const freshCase = initialCase();
        const freshConversation = initialConversation(freshCase);
        set({
          caseFile: freshCase,
          messages: [{ ...greeting, createdAt: now() }],
          conversation: freshConversation,
          ...buildPhase4State(freshCase, freshConversation),
          activeStage: 'GREETING',
          wizardStep: 'NARRATIVE',
          isAnalyzing: false,
          isGeneratingComplaint: false,
        });
      },
      };
    },
    {
      name: 'cyber-justice-conversation-storage',
      partialize: (state) => ({
        caseFile: state.caseFile,
        messages: state.messages,
        conversation: state.conversation,
        evidenceRecommendations: state.evidenceRecommendations,
        timelineSuggestions: state.timelineSuggestions,
        lawExplanations: state.lawExplanations,
        activeStage: state.activeStage,
        wizardStep: state.wizardStep,
      }),
    },
  ),
);
