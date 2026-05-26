import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ResultPanelProps {
  severity: "safe" | "low" | "medium" | "high" | "critical";
  score?: number;
  verdict: string;
  reasons: string[];
  actions: string[];
  children?: ReactNode;
}

export default function ResultPanel({
  severity,
  score,
  verdict,
  reasons,
  actions,
  children,
}: ResultPanelProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case "critical":
        return {
          bg: "from-red-500/20 to-rose-500/20",
          border: "border-red-500/40",
          text: "text-red-400",
          icon: "🚨",
        };

      case "high":
        return {
          bg: "from-orange-500/20 to-amber-500/20",
          border: "border-orange-500/40",
          text: "text-orange-400",
          icon: "⚠️",
        };

      case "medium":
        return {
          bg: "from-yellow-500/20 to-amber-500/20",
          border: "border-yellow-500/40",
          text: "text-yellow-400",
          icon: "⚡",
        };

      case "low":
        return {
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/40",
          text: "text-blue-400",
          icon: "ℹ️",
        };

      case "safe":
        return {
          bg: "from-green-500/20 to-emerald-500/20",
          border: "border-green-500/40",
          text: "text-green-400",
          icon: "✅",
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${config.bg} border ${config.border} backdrop-blur-sm`}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={`text-sm font-medium uppercase tracking-wider mb-2 ${config.text}`}
            >
              Security Analysis
            </div>

            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
              {config.icon} {verdict}
            </h3>
          </div>

          {score !== undefined && (
            <div className="text-right">
              <div className="mb-1 text-sm text-slate-400">
                Risk Score
              </div>

              <div className={`text-3xl font-black ${config.text}`}>
                {score}/100
              </div>
            </div>
          )}
        </div>

        {reasons.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">
              Key Findings
            </h4>

            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className={config.text}>•</span>

                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {actions.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">
              Recommended Actions
            </h4>

            <ul className="space-y-2">
              {actions.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-cyan-400">→</span>

                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children}
      </div>
    </motion.div>
  );
}