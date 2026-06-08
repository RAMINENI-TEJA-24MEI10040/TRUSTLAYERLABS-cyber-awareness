import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { scanUrl } from '../../../services/virustotal';

export default function UrlIntelNew() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await scanUrl(url.trim());
      const detectionCount = (res.malicious || 0) + (res.suspicious || 0);
      setResult({ url, detectionCount, reputation: res.reputation || 0, threatClassification: [], scanStatus: 'completed' });
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
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-cyan-100 placeholder-cyan-400"
          />
          <Button type="button" onClick={() => handleSubmit()}>
            Scan
          </Button>
        </div>

        {loading && <div className="text-cyan-300">Loading...</div>}
        {error && <div className="text-rose-400">Error: {error}</div>}

        {!loading && !error && !result && (
          <div className="text-cyan-400">No results. Enter a URL and click Scan.</div>
        )}

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">URL</div>
              <div className="break-words text-white">{result.url}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Detection Count</div>
              <div className="text-white">{result.detectionCount}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Reputation</div>
              <div className="text-white">{result.reputation}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Threat Classification</div>
              <div className="text-white">{(result.threatClassification || []).join(', ') || 'N/A'}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Scan Status</div>
              <div className="text-white">{result.scanStatus}</div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
