import { useTranslation } from 'react-i18next';

export default function ThreatFeed() {
  const { t } = useTranslation();

  const threats = [
    t('admin.fakeKycUpdate'),
    t('admin.qrRefundScams'),
    t('admin.deepfakeCelebrityScams'),
    t('admin.fakeJobOfferPhishing'),
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('admin.liveThreatFeed')}
      </h2>

      <div className="space-y-4">
        {threats.map((threat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors duration-300 text-gray-900 dark:text-white"
          >
            {threat}
          </div>
        ))}
      </div>
    </div>
  );
}