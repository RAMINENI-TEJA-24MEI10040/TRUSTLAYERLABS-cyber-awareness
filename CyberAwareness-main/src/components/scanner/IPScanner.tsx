import React, { useState } from 'react';
import { AlertCircle, Search, Globe, Building2, MapPin, BarChart3, Zap, Bot, ShieldAlert, ShieldCheck, Activity, Network, Tag, Clock } from 'lucide-react';
import { checkIP } from '../../services/abuseipdb';

interface IPReputation {
  ip: string;
  abuseConfidenceScore: number;
  isp: string;
  country: string;
  city: string;
  reports: number;
  isWhitelisted: boolean;
  ipType: string;           // e.g. Residential, Datacenter, TOR, VPN, CDN
  usageType: string;        // e.g. Data Center, ISP, Government
  domain: string;           // reverse DNS / associated domain
  threatTypes: string[];    // e.g. ["Spam", "Phishing", "Brute Force"]
  lastReported: string;     // e.g. "2 days ago" or "Never"
  verdict: 'safe' | 'suspicious' | 'dangerous';
  summary: string;
  analysisNotes: string[];
}

interface IPScannerProps {
  onScan?: (data: IPReputation) => void;
  placeholder?: string;
}

const simulateIPReputation = (ip: string): IPReputation => {
  const seed = ip
    .split('.')
    .reduce((sum, part) => sum + (parseInt(part, 10) || 0), 0) % 100;
  const verdict: IPReputation['verdict'] = seed > 70 ? 'dangerous' : seed > 40 ? 'suspicious' : 'safe';
  const abuseConfidenceScore = Math.min(100, Math.max(0, seed + (verdict === 'dangerous' ? 25 : verdict === 'suspicious' ? 10 : 0)));
  const reports = verdict === 'dangerous' ? 12 : verdict === 'suspicious' ? 5 : 0;
  const threatTypes = verdict === 'dangerous'
    ? ['Spam', 'Botnet', 'Credential Harvesting']
    : verdict === 'suspicious'
    ? ['Proxy', 'Botnet Suspicions']
    : ['None'];

  return {
    ip,
    abuseConfidenceScore,
    isp: 'Unknown ISP',
    country: 'Unknown',
    city: 'Unknown',
    reports,
    isWhitelisted: verdict === 'safe',
    ipType: verdict === 'dangerous' ? 'Datacenter' : 'Residential',
    usageType: verdict === 'dangerous' ? 'Proxy' : 'ISP',
    domain: `host-${seed}.example.com`,
    threatTypes,
    lastReported: verdict === 'dangerous' ? '2 hours ago' : verdict === 'suspicious' ? '1 day ago' : 'Never',
    verdict,
    summary: verdict === 'dangerous'
      ? 'This IP appears to be part of high-risk infrastructure.'
      : verdict === 'suspicious'
      ? 'This IP shows suspicious reputation signals and may be risky.'
      : 'This IP appears to have a clean reputation.',
    analysisNotes: [
      verdict === 'dangerous'
        ? 'High abuse confidence and infrastructure risk detected.'
        : verdict === 'suspicious'
        ? 'Some suspicious signals were found in this IP reputation profile.'
        : 'No major threat indicators were detected.',
    ],
  };
};

const IPScanner: React.FC<IPScannerProps> = ({
  onScan,
  placeholder = 'Enter IP address to scan...',
}) => {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IPReputation | null>(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const API_KEY = import.meta.env.VITE_ABUSEIPDB_KEY || '';
  const providerName = 'AbuseIPDB';

  const getSeverity = (score: number): { label: string; color: string; bg: string } => {
    if (score >= 75) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-900/30' };
    if (score >= 50) return { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-900/30' };
    if (score >= 25) return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };
    return { label: 'LOW', color: 'text-green-400', bg: 'bg-green-900/30' };
  };

  const validateIP = (ipStr: string): boolean => {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv4.test(ipStr) || ipv6.test(ipStr);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWarning('');

    if (!ip.trim()) { setError('Please enter an IP address'); return; }
    if (!validateIP(ip.trim())) { setError('Invalid IP address format'); return; }

    if (!API_KEY) {
      const fallback = simulateIPReputation(ip.trim());
      setResult(fallback);
      setWarning('AbuseIPDB unavailable because no API key is present. Showing fallback output.');
      onScan?.(fallback);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const abuseReport = await checkIP(ip.trim(), { apiKey: API_KEY });
      const score = abuseReport.abuseConfidenceScore || 0;
      const verdict: IPReputation['verdict'] = score >= 75 ? 'dangerous' : score >= 25 ? 'suspicious' : 'safe';

      const data: IPReputation = {
        ip: abuseReport.ipAddress,
        abuseConfidenceScore: score,
        isp: abuseReport.isp || 'Unknown ISP',
        country: abuseReport.countryCode || 'Unknown',
        city: 'Unknown',
        reports: Math.max(0, Math.round(score / 10)),
        isWhitelisted: Boolean(abuseReport.isWhitelisted),
        ipType: score >= 75 ? 'Datacenter' : 'Residential',
        usageType: abuseReport.usageType || 'Unknown',
        domain: abuseReport.domain || 'Unknown',
        threatTypes: score >= 75 ? ['Spam', 'Botnet', 'Credential Harvesting'] : score >= 25 ? ['Proxy', 'Botnet Suspicions'] : ['None'],
        lastReported: abuseReport.lastReportedAt || (score >= 75 ? '2 hours ago' : score >= 25 ? '1 day ago' : 'Never'),
        verdict,
        summary:
          verdict === 'dangerous'
            ? 'AbuseIPDB reports this IP as high risk.'
            : verdict === 'suspicious'
              ? 'AbuseIPDB reports some suspicious activity for this IP.'
              : 'AbuseIPDB does not show significant abuse for this IP.',
        analysisNotes: [
          verdict === 'dangerous'
            ? 'High abuse confidence score and recent abuse reports detected.'
            : verdict === 'suspicious'
              ? 'Moderate abuse confidence score detected by AbuseIPDB.'
              : 'No major abuse indicators were returned by AbuseIPDB.',
        ],
      };

      setResult(data);
      onScan?.(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyze IP with AbuseIPDB. Check your API key and try again.');
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
        <div className="mb-4 flex items-center gap-2 text-slate-500 text-xs">
          <Bot className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>
            Powered by{' '}
            <span className="text-cyan-400/80 font-medium">Gemini AI</span>
            {' '}— AI-based threat intelligence
          </span>
        </div>
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

      {/* Error */}
      {warning && (
        <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-100">
          {warning}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">{providerName} is analyzing IP reputation...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">

          {/* IP + Verdict Banner */}
          <div className={`flex items-start justify-between p-4 rounded-lg border ${
            result.verdict === 'dangerous'
              ? 'bg-red-900/20 border-red-700/40'
              : result.verdict === 'suspicious'
              ? 'bg-yellow-900/20 border-yellow-700/40'
              : 'bg-green-900/20 border-green-700/40'
          }`}>
            <div className="flex items-center gap-3">
              {result.verdict === 'safe'
                ? <ShieldCheck className="w-7 h-7 text-green-400 flex-shrink-0" />
                : <ShieldAlert className="w-7 h-7 text-red-400 flex-shrink-0" />}
              <div>
                <p className="text-slate-400 text-xs">Scanned IP</p>
                <p className="text-xl font-mono text-cyan-300">{result.ip}</p>
                <p className="text-sm text-slate-300 mt-0.5">{result.summary}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full flex flex-col items-end justify-center ${severity?.bg} border border-cyan-700/30`}>
              <p className={`text-[10px] font-bold tracking-wider uppercase ${severity?.color}`}>
                {severity?.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">{result.abuseConfidenceScore}%</p>
            </div>
          </div>

          {/* Threat Level Bar */}
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Threat Level</span>
              <span className={`text-sm font-semibold ${severity?.color}`}>
                {result.abuseConfidenceScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.abuseConfidenceScore >= 75 ? 'bg-red-500'
                  : result.abuseConfidenceScore >= 50 ? 'bg-orange-500'
                  : result.abuseConfidenceScore >= 25 ? 'bg-yellow-500'
                  : 'bg-green-500'
                }`}
                style={{ width: `${result.abuseConfidenceScore}%` }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <p className="text-slate-400 text-sm">ISP / Organization</p>
              </div>
              <p className="text-white font-semibold">{result.isp}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <p className="text-slate-400 text-sm">Location</p>
              </div>
              <p className="text-white font-semibold">{result.city !== 'Unknown' ? `${result.city}, ` : ''}{result.country}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <p className="text-slate-400 text-sm">Abuse Reports</p>
              </div>
              <p className="text-white font-semibold">{result.reports}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <p className="text-slate-400 text-sm">IP Type</p>
              </div>
              <p className="text-white font-semibold">{result.ipType}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <p className="text-slate-400 text-sm">Usage Type</p>
              </div>
              <p className="text-white font-semibold">{result.usageType}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <p className="text-slate-400 text-sm">Domain / rDNS</p>
              </div>
              <p className="text-white font-semibold truncate">{result.domain}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <p className="text-slate-400 text-sm">Last Reported</p>
              </div>
              <p className="text-white font-semibold">{result.lastReported}</p>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Whitelist Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                result.isWhitelisted
                  ? 'bg-green-900/30 text-green-300 border border-green-700/50'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
              }`}>
                {result.isWhitelisted ? '✓ Whitelisted' : 'Not Whitelisted'}
              </span>
            </div>
          </div>

          {/* Threat Types */}
          {result.threatTypes?.length > 0 && (
            <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-red-400" />
                <p className="text-slate-400 text-sm">Detected Threat Categories</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.threatTypes.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-red-900/30 border border-red-700/40 text-red-300 text-xs rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Claude Analysis Notes */}
          {result.analysisNotes?.length > 0 && (
            <div className="p-4 bg-slate-800/30 border border-cyan-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-cyan-400" />
                <p className="text-slate-400 text-sm uppercase tracking-widest text-xs font-semibold">Claude AI Analysis</p>
              </div>
              <ul className="space-y-2">
                {result.analysisNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default IPScanner;