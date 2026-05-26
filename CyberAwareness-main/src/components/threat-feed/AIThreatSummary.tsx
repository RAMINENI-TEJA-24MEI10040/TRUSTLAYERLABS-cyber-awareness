import React from 'react';
import { Zap } from 'lucide-react';

interface AIThreatSummaryProps {
  summary: string;
  isLoading?: boolean;
  timestamp?: string;
  threatLevel?: 'critical' | 'high' | 'medium' | 'low';
}

const AIThreatSummary: React.FC<AIThreatSummaryProps> = ({
  summary,
  isLoading = false,
  timestamp,
  threatLevel = 'medium',
}) => {
  const threatColors = {
    critical: 'from-red-600 to-red-700 border-red-500',
    high: 'from-orange-600 to-orange-700 border-orange-500',
    medium: 'from-yellow-600 to-yellow-700 border-yellow-500',
    low: 'from-blue-600 to-blue-700 border-blue-500',
  };

  return (
    <>
    <style>{`
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.1); }
        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(59, 130, 246, 0.2); }
      }
      .glow-border { animation: glow 2s ease-in-out infinite; }
    `}</style>

    <div className="w-full max-w-2xl">
      <div
        className={`relative rounded-lg border-2 ${
          isLoading ? 'border-blue-500 glow-border' : threatColors[threatLevel]
        } bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl transition-all duration-300`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`rounded-full p-2 ${
            isLoading ? 'bg-blue-900/50' : `bg-gradient-to-br ${threatColors[threatLevel]}/30`
          }`}>
            <Zap
              className={`h-5 w-5 ${
                isLoading
                  ? 'animate-pulse text-blue-400'
                  : threatLevel === 'critical'
                  ? 'text-red-400'
                  : threatLevel === 'high'
                  ? 'text-orange-400'
                  : threatLevel === 'medium'
                  ? 'text-yellow-400'
                  : 'text-blue-400'
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100">AI Threat Summary</h3>
            {timestamp && (
              <p className="text-xs text-gray-500">{timestamp}</p>
            )}
          </div>
          {isLoading && (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-900/30 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-xs text-blue-300">Analyzing</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mb-4 h-px bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"></div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-700"></div>
            </div>
          ) : (
            <p className="leading-relaxed text-gray-300">{summary}</p>
          )}
        </div>

        {/* Footer accent */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {threatLevel && <span className="inline-block">Threat Level: <span className="font-semibold capitalize text-gray-400">{threatLevel}</span></span>}
          </div>
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-slate-700 to-transparent"></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AIThreatSummary;
