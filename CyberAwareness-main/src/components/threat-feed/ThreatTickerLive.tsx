import React, { useState, useEffect } from 'react';

interface ThreatAlert {
  id: string;
  type: 'phishing' | 'malware' | 'ransomware' | 'exploit';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  timestamp: string;
}

interface ThreatTickerLiveProps {
  alerts?: ThreatAlert[];
  speed?: number;
}

const ThreatTickerLive: React.FC<ThreatTickerLiveProps> = ({
  alerts = [
    { id: '1', type: 'phishing', severity: 'high', title: 'Phishing Campaign Detected: credential.banking.com', timestamp: '2m ago' },
    { id: '2', type: 'malware', severity: 'critical', title: 'Malware C2 Server Blocked: 192.168.1.100', timestamp: '5m ago' },
    { id: '3', type: 'ransomware', severity: 'critical', title: 'Ransomware Signature Match: LockBit Variant', timestamp: '8m ago' },
    { id: '4', type: 'phishing', severity: 'medium', title: 'Phishing Email Quarantined: Office365 Spoofing', timestamp: '12m ago' },
    { id: '5', type: 'exploit', severity: 'high', title: 'Exploitation Attempt: CVE-2024-1234 Detected', timestamp: '15m ago' },
  ],
  speed = 40,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-900/20 border-red-500/50 shadow-red-500/50';
      case 'high':
        return 'text-orange-400 bg-orange-900/20 border-orange-500/50 shadow-orange-500/50';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50 shadow-yellow-500/50';
      default:
        return 'text-green-400 bg-green-900/20 border-green-500/50 shadow-green-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return '🎣';
      case 'malware':
        return '⚠️';
      case 'ransomware':
        return '🔒';
      case 'exploit':
        return '💥';
      default:
        return '🔴';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-b border-cyan-900/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-cyan-900/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">LIVE THREAT FEED</span>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-3 py-1 text-xs bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-300 rounded border border-cyan-700/50 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Ticker Container */}
      <div
        className="overflow-hidden py-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .ticker-scroll {
            animation: scroll-left ${speed}s linear infinite;
          }
          .ticker-scroll.paused {
            animation-play-state: paused;
          }
          .glow-threat {
            text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
          }
        `}</style>

        <div className={`ticker-scroll ${isPaused ? 'paused' : ''} flex gap-4 px-4 whitespace-nowrap`}>
          {/* Duplicate alerts for seamless loop */}
          {[...alerts, ...alerts].map((alert, idx) => (
            <div
              key={`${alert.id}-${idx}`}
              className={`flex items-center gap-3 px-4 py-2 rounded border backdrop-blur-sm flex-shrink-0 transition-all ${getSeverityColor(
                alert.severity
              )} border shadow-lg glow-threat`}
            >
              <span className="text-lg">{getTypeIcon(alert.type)}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{alert.title}</span>
                <span className="text-xs opacity-75">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-t border-cyan-900/20 text-xs text-cyan-300">
        <span>{alerts.length} Active Threats</span>
        <span className="text-green-400">● System Protected</span>
      </div>
    </div>
  );
};

export default ThreatTickerLive;