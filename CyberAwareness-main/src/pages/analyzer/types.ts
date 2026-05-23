export interface AnalysisResult {
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
  category: string;
  confidence: number;
  indicators: string[];
  suspiciousUrls: string[];
  recommendation: string;
  explanation: string;
}