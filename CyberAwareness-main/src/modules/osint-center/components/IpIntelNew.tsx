import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import create from 'zustand';

import abuseipdb from '../../../services/abuseipdb';

function riskFromScore(score?: number) {
  if (score === undefined || score === null) return 'Unknown';
  if (score > 70) return 'High';
  if (score > 30) return 'Medium';
  return 'Low';
}

export default function IpIntelNew() {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!ip) return;
    setLoading(true);
    setError(null);
    try {
      const data = await abuseipdb.checkIP(ip.trim());
      setResult({
        ip: data.ipAddress,
        country: data.countryCode,
        isp: data.isp,
        abuseScore: data.abuseConfidenceScore,
        reportsCount: 0,
        lastReportedAt: data.lastReportedAt,
      });
    } catch (err: any) {
      setError(err?.message || String(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address"
            className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-cyan-100 placeholder-cyan-400"
          />
          <Button type="button" onClick={() => handleSubmit()}>
            Scan
          </Button>
        </div>

        {loading && <div className="text-cyan-300">Loading...</div>}
        {error && <div className="text-rose-400">Error: {error}</div>}

        {!loading && !error && !result && (
          <div className="text-cyan-400">No results. Enter an IP and click Scan.</div>
        )}

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">IP</div>
              <div className="font-mono text-white">{result.ip}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Country</div>
              <div className="text-white">{result.country || 'Unknown'}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">ISP</div>
              <div className="text-white">{result.isp || 'Unknown'}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Abuse Score</div>
              <div className="text-white">{result.abuseScore ?? 'N/A'}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Reports Count</div>
              <div className="text-white">{result.reportsCount ?? 'N/A'}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Risk Level</div>
              <div className="text-white">{riskFromScore(result.abuseScore)}</div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
