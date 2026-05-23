import { useState } from "react";

import {
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Search,
} from "lucide-react";

import {
  scanUrl,
  VirusTotalResult,
} from "../../services/virustotal";

export default function UrlScanner() {
  const [url, setUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<VirusTotalResult | null>(null);

  const [error, setError] =
    useState("");

  const handleScan = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data =
        await scanUrl(url);

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to analyze URL"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDangerous =
    (result?.malicious || 0) > 0 ||
    (result?.suspicious || 0) > 0;

  return (
    <div className="bg-[#111827] border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">

      {/* INPUT */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
          className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 transition"
        />

        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Scan URL
            </>
          )}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8">

          <div
            className={`rounded-2xl p-6 border ${
              isDangerous
                ? "bg-red-500/10 border-red-500/30"
                : "bg-green-500/10 border-green-500/30"
            }`}
          >

            <div className="flex items-center gap-3 mb-5">

              {isDangerous ? (
                <ShieldAlert className="w-8 h-8 text-red-400" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-green-400" />
              )}

              <div>
                <h2 className="text-2xl font-bold">
                  {isDangerous
                    ? "Suspicious URL Detected"
                    : "URL Appears Safe"}
                </h2>

                <p className="text-slate-400">
                  Live VirusTotal analysis
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-4">

              <div className="bg-[#0f172a] rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Malicious
                </p>

                <h3 className="text-3xl font-bold text-red-400">
                  {result.malicious}
                </h3>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Suspicious
                </p>

                <h3 className="text-3xl font-bold text-yellow-400">
                  {result.suspicious}
                </h3>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Harmless
                </p>

                <h3 className="text-3xl font-bold text-green-400">
                  {result.harmless}
                </h3>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Reputation
                </p>

                <h3 className="text-3xl font-bold text-cyan-400">
                  {result.reputation}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}