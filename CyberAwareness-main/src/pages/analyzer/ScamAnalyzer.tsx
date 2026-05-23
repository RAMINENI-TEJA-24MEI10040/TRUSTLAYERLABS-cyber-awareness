import { useState } from "react";

import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";

import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Upload,
  Loader,
  ChevronDown,
} from "lucide-react";

import type { AnalysisResult } from "./types";

import { analyzeScamText, scanImageFile } from "./analyzerUtils";

type LoadingPhase = null | "scanning" | "analyzing" | "generating";

// Risk color mapping
function getRiskColors(riskLevel: string) {
  const colors: Record<
    string,
    {
      text: string;
      border: string;
      bg: string;
      lightBg: string;
      accentBorder: string;
    }
  > = {
    Low: {
      text: "text-emerald-400",
      border: "border-emerald-500",
      bg: "bg-emerald-500/5",
      lightBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
    },
    Medium: {
      text: "text-amber-400",
      border: "border-amber-500",
      bg: "bg-amber-500/5",
      lightBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/30",
    },
    High: {
      text: "text-orange-400",
      border: "border-orange-500",
      bg: "bg-orange-500/5",
      lightBg: "bg-orange-500/10",
      accentBorder: "border-orange-500/30",
    },
    Critical: {
      text: "text-red-400",
      border: "border-red-500",
      bg: "bg-red-500/5",
      lightBg: "bg-red-500/10",
      accentBorder: "border-red-500/30",
    },
  };

  return colors[riskLevel] || colors.Low;
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
    </div>
  );
}

export default function ScamAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>("why-flagged");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const downloadPdfReport = () => {
    if (!result) return;

    setGeneratingPdf(true);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = 50;
    const lineHeight = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("CyberShield Scam Analysis Report", margin, y);

    y += 30;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 16;
    doc.text(`Risk level: ${result.risk}`, margin, y);
    y += 16;
    doc.text(`Confidence: ${result.confidence}%`, margin, y);
    y += 16;
    doc.text(`Score: ${result.score}/100`, margin, y);
    y += 16;
    doc.text(`Category: ${result.category}`, margin, y);

    y += 24;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;

    const addSection = (title: string, content: string | string[]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, margin, y);
      y += lineHeight;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = Array.isArray(content)
        ? content.flatMap((line) => doc.splitTextToSize(line, usableWidth))
        : doc.splitTextToSize(content, usableWidth);

      lines.forEach((line) => {
        if (y > 750) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      y += 12;
    };

    addSection("Detected Indicators:", result.indicators.length > 0 ? result.indicators : ["None"]);
    addSection("Suspicious URLs:", result.suspiciousUrls.length > 0 ? result.suspiciousUrls : ["None"]);
    addSection("Recommendation:", result.recommendation);
    addSection("AI Explanation:", result.explanation);

    doc.save(`cybershield-scam-report-${Date.now()}.pdf`);
    setGeneratingPdf(false);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setStatusMessage(null);
    setLoadingPhase("scanning");

    const { text: extractedText, note } = await scanImageFile(file);

    setStatusMessage(note);
    setText(extractedText);

    if (extractedText) {
      setLoadingPhase("analyzing");
      const analysis = await analyzeScamText(extractedText);
      setResult(analysis);
      setLoadingPhase(null);
    } else {
      setLoadingPhase(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const analyze = async () => {
    setStatusMessage(null);
    setLoadingPhase("analyzing");
    const analysis = await analyzeScamText(text);
    setLoadingPhase("generating");
    // Simulate brief AI explanation generation delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setResult(analysis);
    setLoadingPhase(null);
  };

  const demoScamExamples = [
    "Your bank account will be blocked. Share OTP immediately to verify KYC.",
    "URGENT: Your Aadhaar has been suspended. Click here to reactivate: http://bit.ly/verify-aadhaar",
    "Congratulations! You won ₹5,00,000 in our lottery draw. Click to claim: http://lott-ery.in/claim",
    "Your SBI account shows abnormal activity. Verify now: http://secure-sbi-login.co/verify",
  ];

  const tryDemoScam = async () => {
    const randomDemo =
      demoScamExamples[Math.floor(Math.random() * demoScamExamples.length)];
    setText(randomDemo);

    // Auto-run analysis after a brief delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setStatusMessage(null);
    setLoadingPhase("analyzing");
    const analysis = await analyzeScamText(randomDemo);
    setLoadingPhase("generating");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setResult(analysis);
    setLoadingPhase(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <ShieldAlert className="w-12 h-12 text-cyan-400 shrink-0" />

          <div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">AI Scam Analyzer</h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-2xl">
              Analyze phishing messages, scam screenshots, suspicious QR codes, and fraud attempts instantly.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8">
          <textarea
            placeholder="Paste suspicious SMS, phishing email, WhatsApp message, or scam text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loadingPhase !== null}
            className="w-full h-44 bg-black border border-zinc-700 rounded-2xl p-4 sm:p-5 mb-8 outline-none focus:border-cyan-500 resize-none text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-cyan-500 rounded-3xl p-6 sm:p-12 text-center cursor-pointer hover:bg-zinc-800 transition-all mb-8 ${
              loadingPhase !== null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <input {...getInputProps()} disabled={loadingPhase !== null} />
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mb-4" />
              <p className="text-lg sm:text-2xl font-semibold">Upload Scam Screenshot</p>
              <p className="text-zinc-400 mt-3 text-sm sm:text-base">Drag & drop image here or click to upload.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={analyze}
              disabled={loadingPhase !== null || !text.trim()}
              className="w-full sm:flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-black font-bold px-8 py-4 rounded-2xl text-base sm:text-lg flex items-center justify-center gap-3"
            >
              {loadingPhase === "analyzing" ? (
                <>
                  <LoadingSpinner />
                  <span>Analyzing text...</span>
                </>
              ) : loadingPhase === "generating" ? (
                <>
                  <LoadingSpinner />
                  <span>Generating AI explanation...</span>
                </>
              ) : loadingPhase === "scanning" ? (
                <>
                  <LoadingSpinner />
                  <span>Scanning screenshot...</span>
                </>
              ) : (
                "Analyze Scam"
              )}
            </button>

            <button
              onClick={tryDemoScam}
              disabled={loadingPhase !== null}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-base sm:text-lg font-semibold border-2 border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-zinc-900/50"
            >
              Try Demo Scam
            </button>
          </div>

          {statusMessage && (
            <p className="mt-4 text-sm text-zinc-400">{statusMessage}</p>
          )}
          {loadingPhase === "scanning" && (
            <div className="mt-4 flex items-center gap-2 text-sm text-cyan-300">
              <LoadingSpinner />
              <span>Extracting text from screenshot...</span>
            </div>
          )}
        </div>

        {image && (
          <div className="mt-8">
            <img src={image} alt="Uploaded" className="rounded-3xl border border-zinc-800 w-full object-cover max-h-[400px]" />
          </div>
        )}

        {result && (
          <div
            className={`mt-10 bg-zinc-900 border-2 rounded-3xl p-5 sm:p-8 ${
              getRiskColors(result.risk).border
            } ${getRiskColors(result.risk).bg}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              {result.risk === "High" || result.risk === "Critical" ? (
                <AlertTriangle
                  className={`w-10 h-10 shrink-0 ${getRiskColors(result.risk).text}`}
                />
              ) : (
                <ShieldCheck
                  className={`w-10 h-10 shrink-0 ${getRiskColors(result.risk).text}`}
                />
              )}

              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold">Analysis Result</h2>
                    <p
                      className={`mt-2 text-sm sm:text-base max-w-2xl ${getRiskColors(result.risk).text}`}
                    >
                      {result.category} — {result.score}/100 risk score with {result.confidence}% confidence.
                    </p>
                  </div>

                  <button
                    onClick={downloadPdfReport}
                    disabled={generatingPdf}
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {generatingPdf ? "Preparing PDF..." : "Download Report"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div
                className={`bg-black border-2 rounded-2xl p-5 sm:p-6 ${
                  getRiskColors(result.risk).border
                } ${getRiskColors(result.risk).lightBg}`}
              >
                <p className="text-zinc-400 mb-2 text-sm">Risk Level</p>
                <h3
                  className={`text-2xl sm:text-3xl font-bold ${getRiskColors(result.risk).text}`}
                >
                  {result.risk}
                </h3>
              </div>

              <div
                className={`bg-black border-2 rounded-2xl p-5 sm:p-6 ${
                  getRiskColors(result.risk).border
                } ${getRiskColors(result.risk).lightBg}`}
              >
                <p className="text-zinc-400 mb-2 text-sm">Scam Score</p>
                <h3
                  className={`text-2xl sm:text-3xl font-bold ${getRiskColors(result.risk).text}`}
                >
                  {result.score}/100
                </h3>
              </div>

              <div className="bg-black border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <p className="text-zinc-400 mb-2 text-sm">Category</p>
                <h3 className="text-2xl sm:text-3xl font-bold">{result.category}</h3>
              </div>

              <div className="bg-black border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <p className="text-zinc-400 mb-2 text-sm">Confidence</p>
                <h3 className="text-2xl sm:text-3xl font-bold">{result.confidence}%</h3>
              </div>
            </div>

            <div
              className={`bg-black border-2 rounded-2xl overflow-hidden transition-all mb-8 ${
                getRiskColors(result.risk).accentBorder
              }`}
            >
              <button
                onClick={() =>
                  setExpandedPanel(
                    expandedPanel === "why-flagged" ? null : "why-flagged"
                  )
                }
                className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-zinc-900 transition-colors"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-left">
                  Why Flagged?
                </h3>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${
                    expandedPanel === "why-flagged" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedPanel === "why-flagged" && (
                <div className="border-t border-zinc-800 px-5 sm:px-6 py-5 sm:py-6">
                  <ul className="space-y-3">
                    {result.indicators.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm sm:text-base"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                            getRiskColors(result.risk).text
                          }`}
                        />
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.suspiciousUrls.length > 0 && (
              <div
                className={`bg-black border-2 rounded-2xl p-5 sm:p-6 mb-8 ${
                  getRiskColors(result.risk).accentBorder
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-5">Suspicious URLs</h3>
                <ul className="space-y-3 text-sm sm:text-base text-zinc-300">
                  {result.suspiciousUrls.map((url) => (
                    <li key={url} className="break-all">{url}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className={`border-2 rounded-2xl p-5 sm:p-6 mb-8 ${
                getRiskColors(result.risk).lightBg
              } ${getRiskColors(result.risk).border}`}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Recommendation</h3>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">{result.recommendation}</p>
            </div>

            <div
              className={`border-2 rounded-2xl p-5 sm:p-6 ${
                getRiskColors(result.risk).accentBorder
              } bg-zinc-950`}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">AI Explanation</h3>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
