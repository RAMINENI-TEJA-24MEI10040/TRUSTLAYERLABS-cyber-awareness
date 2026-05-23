import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'UPI Fraud Awareness',
    description: 'Learn common UPI scams, collect request tricks, and safe transaction habits.',
    href: '/upi/awareness',
  },
  {
    title: 'Case Study',
    description: 'Follow a real-world UPI scam timeline and learn how the victim could have stayed safe.',
    href: '/upi/case-study',
  },
  {
    title: 'Interactive Demo',
    description: 'Practice spotting scammy UPI requests, suspicious payees, and unsafe payment prompts.',
    href: '/upi/demo',
  },
  {
    title: 'Report UPI Fraud',
    description: 'Get step-by-step guidance for preserving evidence and reporting payment fraud fast.',
    href: '/upi/report',
  },
];

export default function UPIHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            ← Back to Home
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">UPI Fraud Module</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <section className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-8 shadow-xl shadow-cyan-500/5 transition-colors duration-300">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">UPI Fraud Lab</p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Understand UPI scams, protect your PIN, and pay safely.</h1>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-base sm:text-lg max-w-2xl">This module helps you spot fake collect requests, screen-share traps, and phishing payment prompts — without using any real payment APIs.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/upi/awareness" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Start Awareness</Link>
                <Link to="/upi/demo" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-500/30 dark:hover:text-cyan-300 transition-colors">Try Demo</Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-900 p-6 transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-sm uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-3">Why this matters</h2>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">UPI fraud is one of the fastest-growing payment scams in India. This lab helps you identify the red flags before you approve a transaction.</p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4">
                  <p className="text-sm text-gray-700 dark:text-slate-300">Fake collect requests often appear like refunds, prizes, or customer support.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4">
                  <p className="text-sm text-gray-700 dark:text-slate-300">If an app asks for your UPI PIN to receive money, treat it as a high-risk scam.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4">
                  <p className="text-sm text-gray-700 dark:text-slate-300">Always verify the recipient, the amount, and the expected flow before approving payments.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400">Module sections</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore the UPI Fraud learning path</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-slate-400 max-w-xl">Go deeper into scam awareness, real case learning, interactive UPI checks, and reporting best practices.</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {sections.map((section) => (
              <Link key={section.title} to={section.href} className="group rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Open</span>
                </div>
                <p className="mt-4 text-gray-700 dark:text-slate-400 leading-relaxed">{section.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-3">Fast facts</p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>Never share your UPI PIN or OTP with anyone.</li>
              <li>Validate the payee VPA and amount before approving collect requests.</li>
              <li>Use official bank apps or UPI apps, not links sent by strangers.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-3">What to watch</p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>Unexpected refund or prize requests that ask for payment approval.</li>
              <li>Screen sharing or remote-control calls that ask you to open UPI apps.</li>
              <li>Impersonation of banks, merchants, or government officials.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-700 dark:text-slate-400 mb-3">Report quickly</p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>Call 1930 for cybercrime assistance.</li>
              <li>File at cybercrime.gov.in with UPI transaction details.</li>
              <li>Keep screenshots, UPI IDs, and bank reference numbers.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
