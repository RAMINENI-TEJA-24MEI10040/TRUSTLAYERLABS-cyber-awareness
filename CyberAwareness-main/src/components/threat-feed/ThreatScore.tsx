import React from 'react';

export type ThreatLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface ThreatScoreProps {
  level: ThreatLevel;
  score: number;
  title?: string;
  animated?: boolean;
}

const threatConfig = {
  SAFE: { value: 0, color: 'from-green-400 to-green-500', glow: 'shadow-lg shadow-green-500/50', bg: 'bg-green-900/20' },
  LOW: { value: 1, color: 'from-blue-400 to-blue-500', glow: 'shadow-lg shadow-blue-500/50', bg: 'bg-blue-900/20' },
  MEDIUM: { value: 2, color: 'from-yellow-400 to-yellow-500', glow: 'shadow-lg shadow-yellow-500/50', bg: 'bg-yellow-900/20' },
  HIGH: { value: 3, color: 'from-orange-400 to-orange-500', glow: 'shadow-lg shadow-orange-500/50', bg: 'bg-orange-900/20' },
  CRITICAL: { value: 4, color: 'from-red-500 to-red-600', glow: 'shadow-lg shadow-red-500/75', bg: 'bg-red-900/20' },
};

export const ThreatScore: React.FC<ThreatScoreProps> = ({
  level,
  score,
  title = 'Threat Level',
  animated = true,
}) => {
  const config = threatConfig[level];
  const percentage = (score / 100) * 100;

  return (
    <div className="w-full max-w-sm">
      <div className={`rounded-lg border border-gray-700 p-6 ${config.bg} backdrop-blur-sm`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
          <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-200">{score}/100</span>
        </div>

        {/* Circular Progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(75, 85, 99, 0.3)"
                strokeWidth="8"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 314} 314`}
                className={animated ? 'transition-all duration-1000 ease-out' : ''}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={config.color.split(' ')[0].replace('from-', '')} />
                  <stop offset="100%" stopColor={config.color.split(' ')[1].replace('to-', '')} />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">{level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="space-y-2">
          <div className={`w-full h-2 bg-gray-800 rounded-full overflow-hidden ${config.glow}`}>
            <div
              className={`h-full bg-gradient-to-r ${config.color} ${animated ? 'transition-all duration-1000' : ''}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Threat Scale */}
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>SAFE</span>
            <span>CRITICAL</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-md ${config.bg} border border-gray-700`}>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color} ${animated ? 'animate-pulse' : ''}`} />
          <span className="text-xs text-gray-300 capitalize">{level.toLowerCase()} threat detected</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatScore;