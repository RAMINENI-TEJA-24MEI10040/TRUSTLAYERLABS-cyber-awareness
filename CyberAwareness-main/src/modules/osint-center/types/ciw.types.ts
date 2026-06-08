export type UUID = string;

export type QuerySource =
  | 'url'
  | 'ip'
  | 'email'
  | 'username'
  | 'domain'
  | 'wallet'
  | 'reverse-image'
  | 'mobile';

export interface QueryRequest {
  id: UUID;
  source: QuerySource;
  payload: string; // value to lookup (e.g., ip, url, email)
  timestamp: string; // ISO
}

export interface SourceResultMeta {
  sourceName: string;
  fetchedAt: string; // ISO
  raw?: unknown;
}

export interface IntelligenceResult {
  id: UUID;
  queryId: UUID;
  source: QuerySource;
  title: string;
  summary?: string;
  score?: number; // normalized risk score 0-100
  meta: SourceResultMeta[];
}

export interface OrchestratorResponse {
  query: QueryRequest;
  results: IntelligenceResult[];
  aggregatedScore: number;
  warnings?: string[];
}

export interface CIWCase {
  id: UUID;
  title: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  queries: QueryRequest[];
  results: Record<string, IntelligenceResult[]>; // keyed by queryId
}

export interface EntityNode {
  id: UUID;
  label: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface EntityRelationship {
  id: UUID;
  source: UUID;
  target: UUID;
  relationship: string;
  metadata?: Record<string, unknown>;
}

export interface GraphDocument {
  nodes: EntityNode[];
  edges: EntityRelationship[];
}

export interface TimelineEvent {
  id: UUID;
  caseId?: UUID;
  title: string;
  description?: string;
  timestamp: string; // ISO
  severity?: 'info' | 'warning' | 'critical';
}

export interface EvidenceItem {
  id: UUID;
  caseId?: UUID;
  queryId?: UUID;
  title: string;
  source: string;
  summary?: string;
  raw?: unknown;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvestigationSummary {
  executiveSummary: string;
  keyFindings: string[];
  recommendedActions: string[];
  confidence?: number; // 0-100
}

export type CaseStatus = 'Open' | 'Active' | 'Pending' | 'Closed' | 'Archived';
export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface WorkspaceMetadata {
  id: UUID;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  caseId?: UUID;
  status: 'active' | 'archived';
  snapshotIds: UUID[];
  lastModifiedBy: string;
}

export interface InvestigationCaseType {
  id: UUID;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  updatedAt: string;
  workspaceIds: UUID[];
  tags: string[];
  notes: string;
  owner: string;
  assignedTo: string[];
}

export interface WorkspaceSnapshot {
  id: UUID;
  workspaceId: UUID;
  timestamp: string;
  author: string;
  description: string;
  graphState: {
    nodePositions: Record<string, { x: number; y: number }>;
    groups: Record<string, unknown>;
    selectedNodes: UUID[];
    tags: Record<string, string[]>;
  };
}
