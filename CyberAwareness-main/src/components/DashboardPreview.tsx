import { TrendingUp, Users, Building2, GraduationCap, ChevronRight, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DashboardPreview() {
  const { t } = useTranslation();

  const scamData = [
    { labelKey: 'dashboardPreview.bankingFraud', value: 84, color: 'bg-red-500' },
    { labelKey: 'dashboardPreview.fakeJobScams', value: 63, color: 'bg-orange-500' },
    { labelKey: 'dashboardPreview.cryptoFraud', value: 57, color: 'bg-yellow-500' },
    { labelKey: 'dashboardPreview.phishingAttacks', value: 71, color: 'bg-blue-500' },
    { labelKey: 'dashboardPreview.otpSimSwap', value: 49, color: 'bg-cyan-500' },
  ];

  const quickActions = [
    {
      icon: GraduationCap,
      audienceKey: 'dashboardPreview.students',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      actionsKeys: [
        'dashboardPreview.studentActions1',
        'dashboardPreview.studentActions2',
        'dashboardPreview.studentActions3',
      ],
    },
    {
      icon: Users,
      audienceKey: 'dashboardPreview.seniorCitizens',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      actionsKeys: [
        'dashboardPreview.seniorActions1',
        'dashboardPreview.seniorActions2',
        'dashboardPreview.seniorActions3',
      ],
    },
    {
      icon: Building2,
      audienceKey: 'dashboardPreview.smallBusinesses',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      actionsKeys: [
        'dashboardPreview.businessActions1',
        'dashboardPreview.businessActions2',
        'dashboardPreview.businessActions3',
      ],
    },
  ];
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-cyan-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">{t('dashboardPreview.sectionLabel')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('dashboardPreview.title')}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('dashboardPreview.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Threat Intelligence */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6 min-h-[220px] transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">{t('dashboardPreview.threatIntelligence')}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">{t('dashboardPreview.activeScamCategories')}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full">
                <Activity className="w-3 h-3" />
                {t('dashboardPreview.live')}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex flex-col gap-4">
              {scamData.map((item) => (
                <div key={item.labelKey} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">{t(item.labelKey)}</span>
                    <span className="text-slate-500 font-semibold tabular-nums">{item.value}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="w-4 h-4 text-red-400 flex-shrink-0" />
              {t('dashboardPreview.bankingFraud')} up <span className="text-red-400 font-semibold">+12%</span> from last month
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-col gap-5">
            {quickActions.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.audienceKey} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 flex gap-4 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-300 min-h-[110px]">
                  <div className={`w-11 h-11 rounded-xl ${group.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-5 h-5 ${group.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 dark:text-white font-bold mb-2">{t(group.audienceKey)}</h4>
                    <ul className="space-y-1.5">
                      {group.actionsKeys.map((actionKey) => (
                        <li key={actionKey} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                          <ChevronRight className={`w-3.5 h-3.5 ${group.color} flex-shrink-0`} />
                          {t(actionKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
