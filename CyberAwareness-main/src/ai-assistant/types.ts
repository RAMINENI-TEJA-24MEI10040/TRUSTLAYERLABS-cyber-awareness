export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp?: number;
}

export interface SearchHit {
  id: string;
  text: string;
  source?: string;
  score?: number;
}

export interface RagResult {
  hits: SearchHit[];
  prompt: string;
}

export {};
