export default function HelplineCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-5 transition-colors duration-300">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-700 font-bold">1930</div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">National Cyber Crime Helpline</h4>
          <p className="text-sm text-gray-700 dark:text-slate-300">Call 1930 for urgent assistance and guidance on reporting cybercrime in India.</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-slate-300">
        <p className="mb-2">Official portal: <a className="text-cyan-600 dark:text-cyan-300 hover:underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a></p>
        <p>Use the portal to file complaints, attach evidence, and track your report.</p>
      </div>
    </div>
  );
}
