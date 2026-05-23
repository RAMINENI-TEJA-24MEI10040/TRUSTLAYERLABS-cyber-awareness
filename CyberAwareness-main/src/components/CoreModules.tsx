import {
  Shield,
  Scale,
  Siren,
  GraduationCap,
  Brain,
  QrCode,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const modules = [
  {
    icon: Shield,
    color: 'cyan',
    titleKey: 'coreModules.cyberAwareness',
    descKey: 'coreModules.cyberAwarenessDesc',
    tagKey: 'coreModules.cyberAwarenessTag',
    href: '/awareness',
  },

  {
    icon: Scale,
    color: 'blue',
    titleKey: 'coreModules.indianCyberLaw',
    descKey: 'coreModules.indianCyberLawDesc',
    tagKey: 'coreModules.indianCyberLawTag',
    href: '/laws',
  },

  {
    icon: GraduationCap,
    color: 'teal',
    titleKey: 'coreModules.cyberQuiz',
    descKey: 'coreModules.cyberQuizDesc',
    tagKey: 'coreModules.cyberQuizTag',
    href: '/quiz',
  },

  {
    icon: Siren,
    color: 'red',
    titleKey: 'coreModules.phishingSimulator',
    descKey: 'coreModules.phishingSimulatorDesc',
    tagKey: 'coreModules.phishingSimulatorTag',
    href: '/phishing',
  },

  {
    icon: QrCode,
    color: 'cyan',
    titleKey: 'coreModules.qrScamProtection',
    descKey: 'coreModules.qrScamProtectionDesc',
    tagKey: 'coreModules.qrScamProtectionTag',
    href: '/qr',
  },
  {
    icon: CreditCard,
    color: 'orange',
    titleKey: 'coreModules.upiFraudLab',
    descKey: 'coreModules.upiFraudLabDesc',
    tagKey: 'coreModules.upiFraudLabTag',
    href: '/upi',
  },
  {
    icon: Brain,
    color: 'blue',
    titleKey: 'coreModules.deepfakeLab',
    descKey: 'coreModules.deepfakeLabDesc',
    tagKey: 'coreModules.deepfakeLabTag',
    href: '/deepfake',
  },
  {
    icon: Siren,
    color: 'red',
    titleKey: 'coreModules.reportIncident',
    descKey: 'coreModules.reportIncidentDesc',
    tagKey: 'coreModules.reportIncidentTag',
    href: '/reporting',
  },
];

const colorMap: Record<
  string,
  {
    icon: string;
    glow: string;
    border: string;
    tag: string;
    badge: string;
  }
> = {
  cyan: {
    icon: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
    border: 'group-hover:border-cyan-500/40',
    tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badge: 'bg-cyan-500/10',
  },

  blue: {
    icon: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/10',
    border: 'group-hover:border-blue-500/40',
    tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    badge: 'bg-blue-500/10',
  },

  red: {
    icon: 'text-red-400',
    glow: 'group-hover:shadow-red-500/10',
    border: 'group-hover:border-red-500/40',
    tag: 'bg-red-500/10 text-red-400 border-red-500/20',
    badge: 'bg-red-500/10',
  },

  teal: {
    icon: 'text-teal-400',
    glow: 'group-hover:shadow-teal-500/10',
    border: 'group-hover:border-teal-500/40',
    tag: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    badge: 'bg-teal-500/10',
  },

  orange: {
    icon: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/10',
    border: 'group-hover:border-orange-500/40',
    tag: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    badge: 'bg-orange-500/10',
  },
};

export default function CoreModules() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section
      id="modules"
      className="relative py-20 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            {t('coreModules.sectionLabel')}
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5">
            {t('coreModules.title')}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            {t('coreModules.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {modules.map((mod) => {
            const c = colorMap[mod.color];
            const Icon = mod.icon;

            const cardClass = `
                  group relative cursor-pointer
                  bg-white dark:bg-slate-900
                  border border-gray-200 dark:border-gray-800
                  rounded-3xl p-7
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                  ${c?.glow || ''}
                  ${c?.border || ''}
                `;

            const content = (
              <>
                {/* Glow overlay */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/[0.03] to-blue-500/[0.03]" />

                {/* Top */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span
                    className={`
                      text-xs font-semibold
                      px-3 py-1 rounded-full border
                      ${c?.tag || ''}
                    `}
                  >
                    {t(mod.tagKey)}
                  </span>

                  <ArrowRight
                    className={`
                      w-5 h-5 transition-all duration-300
                      opacity-0 group-hover:opacity-100
                      translate-x-[-6px] group-hover:translate-x-0
                      ${c?.icon || ''}
                    `}
                  />
                </div>

                {/* Icon */}
                <div
                  className={`
                    relative z-10
                    w-14 h-14 rounded-2xl
                    ${c?.badge || ''}
                    flex items-center justify-center
                    mb-6
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon
                    className={`w-7 h-7 ${c?.icon || ''}`}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t(mod.titleKey)}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {t(mod.descKey)}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className={`
                    relative z-10 mt-7
                    flex items-center gap-2
                    text-sm font-semibold
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    ${c?.icon || ''}
                  `}
                >
                  {t('coreModules.exploreModule')}
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-cyan-500/20 transition-colors duration-300 pointer-events-none" />
              </>
            );

            if (mod.href === '/reporting') {
              return (
                <Link key={mod.titleKey} to={mod.href} className={cardClass}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={mod.titleKey} onClick={() => navigate(mod.href)} className={cardClass}>
                {content}
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}