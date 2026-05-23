import { useState } from 'react';
import { Link } from 'react-router-dom';

const examples = [
  {
    id: 'refund-collect',
    title: 'Unexpected refund collect request',
    verdict: 'Scam',
    message: 'A buyer says they will refund you and sends a UPI collect request for ₹2,500. The screen asks for your PIN to confirm.',
    reason: 'Refunds should not require the receiver to enter a UPI PIN. This is a fake payment request disguised as a refund.',
  },
  {
    id: 'verified-order',
    title: 'Confirmed order payment',
    verdict: 'Safe',
    message: 'You ordered groceries from a trusted shop and receive a payment request from the merchant VPA for the agreed amount.',
    reason: 'This is a normal payment flow with a verified merchant payee and expected amount.',
  },
  {
    id: 'otp-pin-ask',
    title: 'UPI PIN asked to receive cashback',
    verdict: 'Scam',
    message: 'A message says you will get cashback after entering your UPI PIN into a link or app screen.',
    reason: 'Cashback or refunds never require your UPI PIN. Sharing the PIN lets fraudsters withdraw money.',
  },
  {
    id: 'customer-support',
    title: 'Bank customer support call',
    verdict: 'Caution',
    message: 'A caller claims to be bank support and asks you to install a remote tool and open your UPI app.',
    reason: 'Do not allow screen sharing or remote access for UPI. Banks will not ask for this to verify transactions.',
  },
];

export default function UPIDemo() {
  const [activeId, setActiveId] = useState(examples[0].id);
  const active = examples.find((example) => example.id === activeId) ?? examples[0];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/upi" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            ← Back to UPI Module
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">UPI Fraud Demo</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Practice UPI Scam Detection</h1>
          <p className="text-gray-700 dark:text-slate-400 leading-relaxed">Select an example to see whether the UPI request is safe or suspicious, and learn the red flags to watch for.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => setActiveId(example.id)}
                className={`w-full text-left rounded-3xl border p-5 transition-colors duration-300 ${activeId === example.id ? 'border-cyan-400 bg-cyan-50 text-gray-900 dark:border-cyan-400 dark:bg-slate-900 dark:text-white' : 'border-gray-200 bg-white text-gray-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-white hover:border-cyan-500/30'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{example.title}</h2>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed dark:text-slate-400">{example.message}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${example.verdict === 'Safe' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : example.verdict === 'Scam' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'}`}>
                    {example.verdict}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Selected Scenario</h2>
                <p className="text-sm text-gray-700 dark:text-slate-400">{active.title}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active.verdict === 'Safe' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : active.verdict === 'Scam' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'}`}>
                {active.verdict}
              </span>
            </div>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-2">Description</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{active.message}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-2">Why this matters</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{active.reason}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/80 p-5 transition-colors duration-300">
                <h3 className="text-sm uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-2">Tip</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">Always verify the payee name, UPI ID, and transaction context. If you are unsure, cancel and confirm directly with the sender.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
