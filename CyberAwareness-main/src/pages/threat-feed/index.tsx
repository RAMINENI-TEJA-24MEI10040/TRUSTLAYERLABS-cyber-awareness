import {
  ShieldAlert,
  Globe,
  Bug,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getLiveThreats,
} from "../../services/phishingFeeds";

interface Threat {
  title: string;
  severity: string;
  source: string;
  type: string;
}

const severityStyles: Record<string, string> = {
  LOW: "bg-green-500/10 text-green-400 border-green-500/20",

  MEDIUM:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  HIGH:
    "bg-orange-500/10 text-orange-400 border-orange-500/20",

  CRITICAL:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ThreatFeedPage() {

  const [threats, setThreats] =
    useState<Threat[]>([]);

  useEffect(() => {

    async function fetchThreats() {

      const data =
        await getLiveThreats();

      setThreats(data);
    }

    fetchThreats();

  }, []);

  const getIcon = (type: string) => {

    switch (type) {

      case "Phishing":
        return ShieldAlert;

      case "QR Scam":
        return AlertTriangle;

      case "Malware":
        return Bug;

      case "Fraud":
        return Globe;

      default:
        return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-28 px-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">

          <div className="flex items-center gap-3 mb-4">

            <Activity className="w-10 h-10 text-cyan-400" />

            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Live Threat Feed
            </h1>
          </div>

          <p className="text-slate-400 text-lg">
            Real-time phishing campaigns, malware activity,
            scam intelligence, and cyber alerts.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-5">

            <p className="text-slate-400 mb-2">
              Active Threats
            </p>

            <h2 className="text-4xl font-bold text-cyan-400">
              {threats.length}
            </h2>

          </div>

          <div className="bg-[#0f172a] border border-red-500/20 rounded-2xl p-5">

            <p className="text-slate-400 mb-2">
              Critical Alerts
            </p>

            <h2 className="text-4xl font-bold text-red-400">
              {
                threats.filter(
                  (t) =>
                    t.severity ===
                    "CRITICAL"
                ).length
              }
            </h2>

          </div>

          <div className="bg-[#0f172a] border border-yellow-500/20 rounded-2xl p-5">

            <p className="text-slate-400 mb-2">
              Phishing Domains
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {
                threats.filter(
                  (t) =>
                    t.type ===
                    "Phishing"
                ).length
              }
            </h2>

          </div>

          <div className="bg-[#0f172a] border border-green-500/20 rounded-2xl p-5">

            <p className="text-slate-400 mb-2">
              Safe Status
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              Stable
            </h2>

          </div>
        </div>

        {/* FEED */}
        <div className="space-y-5">

          {threats.map(
            (threat, index) => {

              const Icon =
                getIcon(
                  threat.type
                );

              return (
                <div
                  key={index}
                  className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/30 transition rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-start gap-4">

                      <div className="bg-cyan-500/10 p-3 rounded-xl">

                        <Icon className="w-7 h-7 text-cyan-400" />

                      </div>

                      <div>

                        <h3 className="text-2xl font-semibold mb-2">
                          {threat.title}
                        </h3>

                        <div className="flex flex-wrap gap-3">

                          <span className="bg-[#111827] px-3 py-1 rounded-lg text-sm text-slate-300">
                            {threat.type}
                          </span>

                          <span className="bg-[#111827] px-3 py-1 rounded-lg text-sm text-slate-300">
                            Source: {threat.source}
                          </span>

                        </div>
                      </div>
                    </div>

                    <div>

                      <span
                        className={`px-4 py-2 rounded-xl border font-semibold ${
                          severityStyles[
                            threat.severity
                          ]
                        }`}
                      >
                        {threat.severity}
                      </span>

                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}