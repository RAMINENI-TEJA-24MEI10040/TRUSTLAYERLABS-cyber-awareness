import { Link } from 'react-router-dom';
import AwarenessCard from '../../components/awareness/AwarenessCard';

export default function UPIAwareness() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/upi" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            ← Back to UPI Module
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">UPI Fraud Awareness</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-7">
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/15 flex items-center justify-center text-3xl">💸</div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">UPI Fraud Awareness</h1>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">Protect your UPI account by learning key scam patterns, approval traps, and safe payment rules.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <AwarenessCard title="⚠️ Common UPI Scam Types" color="red" items={[
            "Fake collect requests disguised as refunds, prizes, or order payments.",
            "Screen sharing or remote support calls asking you to open UPI apps.",
            "Impersonation of customer care numbers or bank officials.",
            "Requests to enter UPI PIN to 'receive' money or validate a refund.",
            "Fake QR codes and payment links sent by strangers or buyers.",
          ]} />

          <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
            "Never share your UPI PIN, OTP, or account details with anyone.",
            "Use your own bank/UPI app to initiate payments — not a link from a stranger.",
            "Verify the recipient VPA, amount, and purpose before approving.",
            "Decline unexpected collect requests and confirm refunds from the sender.",
            "Set daily UPI limits and enable app notifications for every transaction.",
          ]} />

          <AwarenessCard title="🇮🇳 Indian Reporting Tips" color="cyan" items={[
            "Report fraud at cybercrime.gov.in and retain transaction receipts.",
            "Call 1930 for cybercrime support and bank help lines quickly.",
            "Share UPI IDs, transaction IDs, timings, and sender details with authorities.",
            "NPCI regulates UPI — report suspicious merchant behavior to your bank.",
          ]} />
        </div>
      </div>
    </div>
  );
}
