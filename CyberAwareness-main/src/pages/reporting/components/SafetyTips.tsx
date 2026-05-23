export default function SafetyTips() {
  const tips = [
    'Keep a clear timeline of events and preserve originals where possible.',
    'Do not share OTPs, PINs, or passwords with anyone claiming to help.',
    'Report to your bank first if a transaction is involved, then file a portal complaint.',
    'If threatened, contact local police and provide cyber cell contact details.',
    'Follow up on your complaint using the tracking ID provided by the portal.',
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/70 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Safety tips after reporting</h3>
      <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-2">
        {tips.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400/80" />
            <div>{t}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
