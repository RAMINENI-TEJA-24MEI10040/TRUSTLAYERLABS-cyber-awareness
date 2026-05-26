import { useTranslation } from 'react-i18next';

export default function ThreatBanner() {
  const { t } = useTranslation();

  const alerts = [
    t('threatBanner.alert1'),
    t('threatBanner.alert2'),
    t('threatBanner.alert3'),
    t('threatBanner.alert4'),
    t('threatBanner.alert5'),
  ];

  const content = [...alerts, ...alerts];

  return (
    <div className="bg-red-50 dark:bg-red-950/50 border-y border-red-200 dark:border-red-900/40 py-3 overflow-hidden relative transition-colors duration-300">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-4 py-1 z-10 mr-4 whitespace-nowrap hidden sm:block rounded-full">
          {t('threatBanner.liveThreats')}
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {content.map((alert, i) => (
              <span key={i} className="text-red-700 dark:text-red-300 text-sm font-medium inline-flex items-center gap-2 flex-shrink-0">
                <span className="text-red-500 dark:text-red-400">⚠</span>
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
