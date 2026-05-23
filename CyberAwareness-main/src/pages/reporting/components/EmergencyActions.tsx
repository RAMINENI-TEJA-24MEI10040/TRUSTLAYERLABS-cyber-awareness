export default function EmergencyActions() {
  const actions = [
    'If money is at risk, contact your bank immediately and request a transaction block.',
    'Change passwords for email, banking, and any linked services immediately.',
    'Disable UPI approvals and revoke app permissions if suspicious activity is detected.',
    'Preserve devices: do not factory-reset phones until evidence is collected.',
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/70 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">What to do immediately</h3>
      <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-2">
        {actions.map((a) => (
          <li key={a} className="before:content-['•'] before:text-cyan-400 before:mr-2">{a}</li>
        ))}
      </ul>
    </section>
  );
}
