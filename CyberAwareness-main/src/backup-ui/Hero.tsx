import { Shield, Bot } from "lucide-react";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white pt-32 pb-24 px-4 sm:px-6 transition-colors duration-300">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto">

        <div className="max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">

            <Shield className="w-4 h-4" />

            {t("hero.badgeText")}
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 text-gray-900 dark:text-white">

            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-10">

            {t("hero.subtitle")}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/analyzer")}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-base sm:text-lg"
            >
              <Bot className="w-5 h-5" />

              {t("hero.analyzerBtn")}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 px-8 py-4 rounded-2xl transition-colors duration-300 text-base sm:text-lg text-gray-900 dark:text-white"
            >
              <Shield className="w-5 h-5" />

              {t("hero.dashboardBtn")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}