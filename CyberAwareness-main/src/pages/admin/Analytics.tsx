import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import { useTranslation } from "react-i18next";

export default function Analytics() {
  const { t } = useTranslation();

  const data = [
    {
      name: t('dashboardPreview.phishingAttacks'),
      reports: 400,
    },
    {
      name: t('dashboardPreview.upiFraud'),
      reports: 300,
    },
    {
      name: t('dashboardPreview.qrScamProtection'),
      reports: 200,
    },
    {
      name: t('dashboardPreview.deepfakeLab'),
      reports: 278,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('admin.scamAnalytics')}
      </h2>

      <div className="h-[300px] transition-colors duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="reports" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}