import {
  Shield,
  AlertTriangle,
  Users,
  MessageSquare,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Analytics from "./Analytics";
import Reports from "./Reports";
import ThreatFeed from "./ThreatFeed";

export default function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      titleKey: "admin.awarenessSessions",
      value: "12,450",
      icon: Users,
    },
    {
      titleKey: "admin.scamReports",
      value: "1,284",
      icon: AlertTriangle,
    },
    {
      titleKey: "admin.aiAssistantChats",
      value: "8,921",
      icon: MessageSquare,
    },
    {
      titleKey: "admin.protectedUsers",
      value: "5,678",
      icon: Shield,
    },
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 transition-colors duration-300">

      {/* Header */}
      <div className="mb-8 sm:mb-10">

        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          {t('admin.dashboardTitle')}
        </h1>

        <p className="text-zinc-400 mt-3 text-sm sm:text-base max-w-2xl">
          {t('admin.dashboardDescription')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-10">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.titleKey}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 sm:p-6 shadow-lg hover:border-cyan-500/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                    {t(item.titleKey)}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {item.value}
                  </h2>
                </div>

                <div className="shrink-0">
                  <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-cyan-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics + Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">

        <div className="overflow-hidden">
          <Analytics />
        </div>

        <div className="overflow-hidden">
          <Reports />
        </div>
      </div>

      {/* Threat Feed */}
      <div className="mt-8 sm:mt-10">
        <ThreatFeed />
      </div>
    </div>
  );
}