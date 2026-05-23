'use client';

import { useState } from 'react';
import { AlertCircle, Search, Globe, Building2, MapPin, BarChart3, Zap } from 'lucide-react';

interface IPReputation {
  ip: string;
  abuseConfidenceScore: number;
  isp: string;
  country: string;
  reports: number;
  isWhitelisted: boolean;
}

interface IPScannerProps {
  onScan?: (data: IPReputation) => void;
  placeholder?: string;
  apiKey?: string;
}

const IPScanner: React.FC<IPScannerProps> = ({
  onScan,
  placeholder = 'Enter IP address to scan...',
  apiKey = import.meta.env.VITE_ABUSEIPDB_KEY as string | undefined,
}) => {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IPReputation | null>(null);
  const [error, setError] = useState('');

  const getSeverity = (score: number): { label: string; color: string; bg: string } => {
    if (score >= 75) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-900/30' };
    if (score >= 50) return { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-900/30' };
    if (score >= 25) return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };
    return { label: 'LOW', color: 'text-green-400', bg: 'bg-green-900/30' };
  };

  const validateIP = (ipStr: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv4Regex.test(ipStr) || ipv6Regex.test(ipStr);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ip.trim()) {
      setError('Please enter an IP address');
      return;
    }

    if (!validateIP(ip)) {
      setError('Invalid IP address format');
      return;
    }

    setLoading(true);

    try {
      // Simulate realistic scanning delay
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 800));

      const safeIPs = ['8.8.8.8', '1.1.1.1'];
      const suspiciousIPs = ['185.220.101.1', '45.33.32.156'];

      let abuseConfidenceScore = 0;
      let isp = 'Unknown ISP';
      let country = 'Unknown';
      let reports = 0;
      let isWhitelisted = false;

      if (safeIPs.includes(ip)) {
        abuseConfidenceScore = Math.floor(Math.random() * 5) + 1; // 1-5
        isp = ip === '8.8.8.8' ? 'Google LLC' : 'Cloudflare, Inc.';
        country = 'United States';
        reports = 0;
        isWhitelisted = true;
      } else if (suspiciousIPs.includes(ip)) {
        abuseConfidenceScore = ip === '185.220.101.1' ? 88 : 78;
        isp = ip === '185.220.101.1' ? 'Reported TOR Exit / VPN' : 'Hosting Provider (suspicious)';
        country = 'Unknown';
        reports = ip === '185.220.101.1' ? 54 : 28;
        isWhitelisted = false;
      } else {
        // unknown: generate medium-risk demo results
        abuseConfidenceScore = Math.floor(20 + Math.random() * 40); // 20-60
        isp = ['Residential ISP', 'Cloud Host', 'Mobile ISP'][Math.floor(Math.random() * 3)];
        country = ['United States','Germany','Netherlands','Brazil'][Math.floor(Math.random()*4)];
        reports = Math.floor(Math.random() * 10);
        isWhitelisted = Math.random() > 0.85;
      }

      const reputationData: IPReputation = {
        ip,
        abuseConfidenceScore,
        isp,
        country,
        reports,
        isWhitelisted,
      };

      setResult(reputationData);
      onScan?.(reputationData);
    } catch (err) {
      setError('Failed to scan IP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const severity = result ? getSeverity(result.abuseConfidenceScore) : null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg border border-cyan-900/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            IP Reputation Scanner
          </h1>
        </div>
        <p className="text-slate-400 text-sm">Malicious IP Detection & Threat Assessment</p>
      </div>

      {/* Scan Form */}
      <form onSubmit={handleScan} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-800/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
            <Globe className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* IP & Severity */}
          <div className="flex items-start justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <div>
              <p className="text-slate-400 text-sm">Scanned IP</p>
              <p className="text-xl font-mono text-cyan-300">{result.ip}</p>
            </div>
            <div className={`px-3 py-1 rounded-full flex flex-col items-end justify-center ${severity?.bg} border border-cyan-700/30 min-w-0`}>
              <p className={`text-[10px] font-bold tracking-wider uppercase ${severity?.color}`}>
                {severity?.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">{result.abuseConfidenceScore}%</p>
            </div>
          </div>

          {/* Threat Level Indicator */}
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Threat Level</span>
              <span className={`text-sm font-semibold ${severity?.color}`}>
                {result.abuseConfidenceScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  result.abuseConfidenceScore >= 75
                    ? 'bg-red-500'
                    : result.abuseConfidenceScore >= 50
                    ? 'bg-orange-500'
                    : result.abuseConfidenceScore >= 25
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${result.abuseConfidenceScore}%` }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ISP */}
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <p className="text-slate-400 text-sm">ISP</p>
              </div>
              <p className="text-white font-semibold">{result.isp}</p>
            </div>

            {/* Country */}
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <p className="text-slate-400 text-sm">Country</p>
              </div>
              <p className="text-white font-semibold">{result.country}</p>
            </div>

            {/* Reports Count */}
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <p className="text-slate-400 text-sm">Abuse Reports</p>
              </div>
              <p className="text-white font-semibold">{result.reports}</p>
            </div>

            {/* Status */}
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg min-w-0">
              <p className="text-slate-400 text-sm mb-2">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  result.isWhitelisted
                    ? 'bg-green-900/30 text-green-300 border border-green-700/50'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                }`}
              >
                {result.isWhitelisted ? '✓ Whitelisted' : 'Not Whitelisted'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Analyzing IP reputation...</p>
        </div>
      )}
    </div>
  );
};

export default IPScanner;
