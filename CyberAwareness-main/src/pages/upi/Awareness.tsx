import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AwarenessCard from '../../components/awareness/AwarenessCard';

export default function UPIAwareness() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/upi" className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-cyan-400 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
            {t('upi.awareness.backBtn', '← Back to UPI Module')}
          </Link>
          <span className="text-gray-500 dark:text-slate-500">/</span>
          <span className="text-xs text-gray-600 dark:text-slate-400">{t('upi.awareness.title', 'UPI Fraud Awareness')}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-7">
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-7 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/15 flex items-center justify-center text-3xl">💸</div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('upi.awareness.title', 'UPI Fraud Awareness')}</h1>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{t('upi.awareness.description', 'Protect your UPI account by learning key scam patterns, approval traps, and safe payment rules.')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <AwarenessCard title={t('upi.awareness.card1.title', '⚠️ Common UPI Scam Types')} color="red" items={[
            t('upi.awareness.scams.0', 'Fake collect requests disguised as refunds, prizes, or order payments.'),
            t('upi.awareness.scams.1', 'Screen sharing or remote support calls asking you to open UPI apps.'),
            t('upi.awareness.scams.2', 'Impersonation of customer care numbers or bank officials.'),
            t('upi.awareness.scams.3', 'Requests to enter UPI PIN to \'receive\' money or validate a refund.'),
            t('upi.awareness.scams.4', 'Fake QR codes and payment links sent by strangers or buyers.'),
          ]} />

          <AwarenessCard title={t('upi.awareness.card2.title', '✅ How to Stay Safe')} color="green" items={[
            t('upi.awareness.safe.0', 'Never share your UPI PIN, OTP, or account details with anyone.'),
            t('upi.awareness.safe.1', 'Use your own bank/UPI app to initiate payments — not a link from a stranger.'),
            t('upi.awareness.safe.2', 'Verify the recipient VPA, amount, and purpose before approving.'),
            t('upi.awareness.safe.3', 'Decline unexpected collect requests and confirm refunds from the sender.'),
            t('upi.awareness.safe.4', 'Set daily UPI limits and enable app notifications for every transaction.'),
          ]} />

          <AwarenessCard title={t('upi.awareness.card3.title', '🇮🇳 Indian Reporting Tips')} color="cyan" items={[
            t('upi.awareness.reporting.0', 'Report fraud at cybercrime.gov.in and retain transaction receipts.'),
            t('upi.awareness.reporting.1', 'Call 1930 for cybercrime support and bank help lines quickly.'),
            t('upi.awareness.reporting.2', 'Share UPI IDs, transaction IDs, timings, and sender details with authorities.'),
            t('upi.awareness.reporting.3', 'NPCI regulates UPI — report suspicious merchant behavior to your bank.'),
          ]} />
        </div>
      </div>
    </div>
  );
}
