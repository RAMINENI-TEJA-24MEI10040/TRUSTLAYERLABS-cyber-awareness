import { Link } from 'react-router-dom';

export default function UPICaseStudy() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/upi" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            ← Back to UPI Module
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">UPI Scam Case Study</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Real UPI Scam: Refund Collect Request</h1>
          <p className="text-gray-700 dark:text-slate-400 leading-relaxed">A user receives a message from a buyer on a marketplace platform. The buyer claims they will send a refund and shares a UPI payment link. The user clicks and approves the request without verifying the payee or the prompt.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What happened</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>🔸 The buyer sent a UPI collect request claiming to refund excess payment.</li>
              <li>🔸 The request asked the user to approve the amount through their UPI app.</li>
              <li>🔸 The UPI approval screen required the UPI PIN, which the user entered.</li>
              <li>🔸 Money was debited from the user's account instead of being received.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why it was a scam</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>🔸 Real refunds do not require UPI PIN approval from the receiver.</li>
              <li>🔸 The collect request was disguised as incoming money but actually authorized a payment.</li>
              <li>🔸 The sender was an unknown contact, not a verified buyer or service provider.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 space-y-5 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lessons Learned</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/80 p-4 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Always verify payee details</h3>
              <p className="text-gray-700 text-sm leading-relaxed dark:text-slate-400">Check the VPA, name, and purpose before approving any collect request.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/80 p-4 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Never enter PIN to receive money</h3>
              <p className="text-gray-700 text-sm leading-relaxed dark:text-slate-400">Entering a UPI PIN means you are authorizing money to leave your account.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/80 p-4 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Use trusted channels</h3>
              <p className="text-gray-700 text-sm leading-relaxed dark:text-slate-400">Initiate refunds or payments from official apps instead of clicking links from strangers.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/80 p-4 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Report suspicious requests</h3>
              <p className="text-gray-700 text-sm leading-relaxed dark:text-slate-400">Report fraud quickly and keep evidence like screenshots, UPI IDs, and transaction times.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
