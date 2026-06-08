import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import hibpService from '../../../services/hibp';

export default function EmailIntelNew() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await hibpService.checkEmailBreach(email.trim());
      const items = (res.breaches || []).map((b) => ({ name: b.Name, breachDate: b.BreachDate }));
      const riskLevel = items.length === 0 ? 'Low' : items.length < 3 ? 'Medium' : 'High';
      setResult({ email: res.email, breachCount: res.breachCount || items.length, breaches: items, riskLevel });
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-cyan-100 placeholder-cyan-400"
          />
          <Button type="button" onClick={() => handleSubmit()}>
            Check
          </Button>
        </div>

        {loading && <div className="text-cyan-300">Loading...</div>}
        {error && <div className="text-rose-400">Error: {error}</div>}

        {!loading && !error && !result && (
          <div className="text-cyan-400">No results. Enter an email and click Check.</div>
        )}

        {result && (
          <div className="mt-2 space-y-4">
            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Breach Count</div>
              <div className="text-white">{result.breachCount}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Breach Names & Dates</div>
              <ul className="list-disc pl-5 text-white">
                {result.breaches.length === 0 && <li className="text-cyan-400">No breaches found</li>}
                {result.breaches.map((b: any) => (
                  <li key={b.name}>
                    <span className="font-semibold">{b.name}</span>
                    {b.breachDate ? <span className="text-cyan-300"> — {b.breachDate}</span> : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-900 rounded-md border border-cyan-500/10">
              <div className="text-sm text-cyan-300">Risk Level</div>
              <div className="text-white">{result.riskLevel}</div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
