import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  source?: string;
  resolved?: boolean;
}

interface LiveAlertsProps {
  alerts?: Alert[];
  maxDisplay?: number;
  onAlertClick?: (alert: Alert) => void;
  autoRefresh?: number;
}

type SeverityKey = Alert['severity'];
const severityConfig: Record<SeverityKey, { bg: string; border: string; glow: string; icon: string; label: string }> = {
  critical: { bg: 'bg-red-900/30', border: 'border-red-500', glow: 'shadow-red-500/50', icon: '🔴', label: 'Critical' },
  high: { bg: 'bg-orange-900/30', border: 'border-orange-500', glow: 'shadow-orange-500/30', icon: '🟠', label: 'High' },
  medium: { bg: 'bg-yellow-900/30', border: 'border-yellow-500', glow: 'shadow-yellow-500/20', icon: '🟡', label: 'Medium' },
  low: { bg: 'bg-blue-900/30', border: 'border-blue-500', glow: 'shadow-blue-500/20', icon: '🔵', label: 'Low' },
};

const LiveAlerts: React.FC<LiveAlertsProps> = ({ 
  alerts = [], 
  maxDisplay = 8,
  onAlertClick,
  autoRefresh = 0 
}) => {
  const [displayAlerts, setDisplayAlerts] = useState<Alert[]>(alerts);

  useEffect(() => {
    setDisplayAlerts(alerts.slice(0, maxDisplay));
  }, [alerts, maxDisplay]);

  useEffect(() => {
    if (autoRefresh <= 0) return;
    const interval = setInterval(() => {
      setDisplayAlerts(prev => [...prev]);
    }, autoRefresh);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-slate-700/50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-lg md:text-xl font-bold text-slate-100">Live Alerts</h2>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
            {displayAlerts.length}
          </span>
        </div>
      </div>

      {/* Alerts Container */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        {displayAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400">
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const config = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                onClick={() => onAlertClick?.(alert)}
                className={`group cursor-pointer p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${config.bg} ${config.border} border-l-4 
                  ${alert.severity === 'critical' ? 'animate-pulse shadow-lg ' + config.glow : 'hover:shadow-lg'}
                  ${alert.resolved ? 'opacity-60' : 'opacity-100'}`}
              >
                <div className="flex gap-2 items-start">
                  {/* Severity Icon */}
                  <div className="pt-0.5 flex-shrink-0 text-lg">{config.icon}</div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-100 truncate text-sm md:text-base">
                        {alert.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.border} border`}>
                        {config.label}
                      </span>
                      {alert.resolved && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-900/30 border border-green-500 text-green-300">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-400 line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      {alert.source && (
                        <span className="truncate">📍 {alert.source}</span>
                      )}
                      <span className="ml-auto flex-shrink-0">{formatTime(alert.timestamp)}</span>
                    </div>
                  </div>

                  {/* Action Indicator */}
                  {alert.severity === 'critical' && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                      →
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {displayAlerts.length > 0 && alerts.length > maxDisplay && (
        <div className="mt-3 pt-3 border-t border-slate-700/30 text-center text-xs text-slate-400">
          +{alerts.length - maxDisplay} more alerts
        </div>
      )}
    </div>
  );
};

export default LiveAlerts;
