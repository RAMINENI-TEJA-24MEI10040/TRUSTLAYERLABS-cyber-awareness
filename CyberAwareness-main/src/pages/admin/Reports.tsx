import { useTranslation } from 'react-i18next';

const reports = [
  {
    titleKey: 'admin.fakeRbiLoanScam',
    level: "High",
  },
  {
    titleKey: 'admin.whatsappOtpFraud',
    level: "Critical",
  },
  {
    titleKey: 'admin.qrPaymentScam',
    level: "Medium",
  },
];

export default function Reports() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('admin.latestReports')}
      </h2>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.titleKey}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors duration-300 text-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {t(report.titleKey)}
              </h3>

              <span className="text-red-400 text-sm">
                {report.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}