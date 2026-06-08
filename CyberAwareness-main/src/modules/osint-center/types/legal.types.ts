export type LegalReference = {
  code: string; // e.g., 'IPC 420'
  title: string; // short title
  description?: string; // brief explanation
  jurisdiction?: 'India' | string;
};

export type LegalCorrelation = {
  id: string;
  caseId?: string;
  confidence: number; // 0..1
  ipcSections: LegalReference[];
  itActSections: LegalReference[];
  reasoning: string[]; // bullet points mapping evidence/findings -> law
  generatedAt: string; // ISO
};
