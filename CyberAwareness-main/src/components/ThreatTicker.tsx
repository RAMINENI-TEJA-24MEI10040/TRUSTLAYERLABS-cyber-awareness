import {
  AlertTriangle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

export default function ThreatTicker() {
  const { t } = useTranslation();

  const threats = [
    t('threatTicker.threat1'),
    t('threatTicker.threat2'),
    t('threatTicker.threat3'),
    t('threatTicker.threat4'),
    t('threatTicker.threat5'),
  ];

  return (
    <div className="w-full overflow-hidden border-y border-red-500/30 bg-red-500/10 backdrop-blur-md">

      <div className="flex items-center gap-4 whitespace-nowrap py-3 animate-[marquee_25s_linear_infinite]">

        {threats.map((threat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 shrink-0"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />

            <span className="text-sm sm:text-base text-red-100">
              {threat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}