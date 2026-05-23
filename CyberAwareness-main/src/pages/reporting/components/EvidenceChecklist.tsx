export default function EvidenceChecklist() {
  const items = [
    'Screenshots of chats, messages, and URLs',
    'Bank transaction receipts and UPI collect records',
    'Emails with headers or exported EML files',
    'Call logs and phone numbers',
    'SIM/phone number details and change history',
    'Any downloaded files or attachments',
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/70 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Evidence collection checklist</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-slate-300 space-y-2">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
