import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UPIReport() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/upi" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            {t('upi.report.backBtn', '← Back to UPI Module')}
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">{t('upi.report.moduleTitle', 'Report UPI Fraud')}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">{t('upi.report.title', 'Report UPI Fraud Quickly')}</h1>
          <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{t('upi.report.desc', 'If you suspect UPI fraud, preserve evidence and notify authorities right away. Fast action improves your chances of recovery.')}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('upi.report.step1Title', 'Step 1: Preserve evidence')}</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>🔸 {t('upi.report.step1.0', 'Screenshot the UPI approval screen, collect request, and chat messages.')}</li>
              <li>🔸 {t('upi.report.step1.1', 'Save the sender’s phone number, UPI ID, and transaction details.')}</li>
              <li>🔸 {t('upi.report.step1.2', 'Note the date, time, bank, and amount involved in the incident.')}</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('upi.report.step2Title', 'Step 2: Contact your bank')}</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
              <li>🔸 {t('upi.report.step2.0', 'Call your bank’s fraud helpline and explain the suspicious UPI transaction.')}</li>
              <li>🔸 {t('upi.report.step2.1', 'Request a temporary block or reset of your UPI PIN if needed.')}</li>
              <li>🔸 {t('upi.report.step2.2', 'Ask the bank to trace the fraudulent UPI ID and freeze the transaction trail.')}</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('upi.report.step3Title', 'Step 3: File an official complaint')}</h2>
          <ol className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-slate-400 list-decimal list-inside">
            <li>{t('upi.report.step3.0', 'Go to cybercrime.gov.in and file a complaint under UPI/payment fraud.')}</li>
            <li>{t('upi.report.step3.1', 'Include UPI transaction IDs, messages, phone numbers, and screenshots.')}</li>
            <li>{t('upi.report.step3.2', 'Keep copies of complaint receipts and reference numbers.')}</li>
          </ol>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('upi.report.contactsTitle', 'Quick contacts')}</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-slate-400">
            <p>📞 {t('upi.report.contacts.helpline', 'National Cyber Crime Helpline:')} <strong className="text-gray-900 dark:text-white">1930</strong></p>
            <p>🌐 {t('upi.report.contacts.portal', 'Cybercrime portal:')} <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-300 hover:underline">cybercrime.gov.in</a></p>
            <p>🏦 {t('upi.report.contacts.regulator', 'UPI regulator:')} <strong className="text-gray-900 dark:text-white">NPCI</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
