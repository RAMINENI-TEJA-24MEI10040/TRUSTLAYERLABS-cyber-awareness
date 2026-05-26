/**
 * ScamAnalyzer.tsx — AI Scam Intelligence Center
 * Cinematic UI transformation. All logic preserved from original.
 * Requires: framer-motion, lucide-react, react-dropzone, jspdf, tesseract.js
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Upload,
  ChevronDown,
  Cpu,
  Radio,
  Zap,
  Globe,
  Lock,
  Eye,
  Activity,
  Target,
  Download,
  Scan,
} from "lucide-react";
import type { AnalysisResult } from "./types";
import { analyzeScamText, scanImageFile } from "./analyzerUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadingPhase = null | "scanning" | "analyzing" | "generating";

interface RiskColors {
  text: string;
  border: string;
  glow: string;
  bg: string;
  lightBg: string;
  accentBorder: string;
  scanColor: string;
  hex: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCAN_STAGES = [
  { phase: "scanning",   label: "OCR EXTRACTION",       icon: Scan,     detail: "Parsing visual signal matrix..." },
  { phase: "analyzing",  label: "THREAT ANALYSIS",       icon: Activity, detail: "Cross-referencing threat database..." },
  { phase: "generating", label: "AI INTELLIGENCE BRIEF", icon: Cpu,      detail: "Synthesizing neural assessment..." },
];

const DEMO_SCAMS = [
  "Your bank account will be blocked. Share OTP immediately to verify KYC.",
  "URGENT: Your Aadhaar has been suspended. Click here to reactivate: http://bit.ly/verify-aadhaar",
  "Congratulations! You won ₹5,00,000 in our lottery draw. Click to claim: http://lott-ery.in/claim",
  "Your SBI account shows abnormal activity. Verify now: http://secure-sbi-login.co/verify",
];

const RISK_CONFIG: Record<string, RiskColors> = {
  Low: {
    text: "text-emerald-400",
    border: "border-emerald-500/60",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/5",
    lightBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    scanColor: "#10b981",
    hex: "#10b981",
  },
  Medium: {
    text: "text-amber-400",
    border: "border-amber-500/60",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/5",
    lightBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    scanColor: "#f59e0b",
    hex: "#f59e0b",
  },
  High: {
    text: "text-orange-400",
    border: "border-orange-500/60",
    glow: "shadow-orange-500/20",
    bg: "bg-orange-500/5",
    lightBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/30",
    scanColor: "#f97316",
    hex: "#f97316",
  },
  Critical: {
    text: "text-red-400",
    border: "border-red-500/60",
    glow: "shadow-red-500/30",
    bg: "bg-red-500/5",
    lightBg: "bg-red-500/10",
    accentBorder: "border-red-500/30",
    scanColor: "#ef4444",
    hex: "#ef4444",
  },
};

function getRiskColors(risk: string): RiskColors {
  return RISK_CONFIG[risk] ?? RISK_CONFIG.Low;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated cyber grid background */
function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[#020408]" />

      {/* Perspective grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Finer grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      />

      {/* Radial atmospheric glow — top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #00d4ff 0%, transparent 70%)",
        }}
      />

      {/* Bottom atmospheric */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-5"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, #0066ff 0%, transparent 70%)",
        }}
      />

      {/* Scan line sweep animation */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Pulsing radar ring */
function RadarPulse({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-400/30"
          initial={{ width: 40, height: 40, opacity: 0.8 }}
          animate={{ width: 280, height: 280, opacity: 0 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Corner bracket decorations */
function CornerBrackets({ color = "#00d4ff", size = 16 }: { color?: string; size?: number }) {
  const s = size;
  const stroke = 1.5;
  const corners = [
    { x: 0, y: 0, path: `M${s},0 L0,0 L0,${s}` },
    { x: "100%", y: 0, tx: -s, path: `M0,0 L${s},0 L${s},${s}` },
    { x: 0, y: "100%", ty: -s, path: `M0,0 L0,${s} L${s},${s}` },
    { x: "100%", y: "100%", tx: -s, ty: -s, path: `M0,0 L${s},0 M0,0 L0,${s}` },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: c.x,
            top: c.y,
            transform: `translate(${(c as any).tx ?? 0}px, ${(c as any).ty ?? 0}px)`,
            width: s + 2,
            height: s + 2,
          }}
          viewBox={`0 0 ${s + 2} ${s + 2}`}
        >
          <path
            d={c.path}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="square"
          />
        </svg>
      ))}
    </>
  );
}

/** Animated scan beam over image */
function ScanBeam({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute left-0 right-0 h-1 pointer-events-none z-10"
      style={{
        background: "linear-gradient(90deg, transparent, #00d4ff, #ffffff, #00d4ff, transparent)",
        boxShadow: "0 0 20px 4px rgba(0,212,255,0.6)",
      }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Status ticker showing active phase label */
function PhaseTicker({ phase }: { phase: LoadingPhase }) {
  const stage = SCAN_STAGES.find((s) => s.phase === phase);
  if (!stage) return null;
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 mt-5 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5"
    >
      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
      <div>
        <div className="text-[10px] font-mono text-cyan-500 tracking-widest">{stage.label}</div>
        <div className="text-xs text-cyan-300/70 mt-0.5">{stage.detail}</div>
      </div>
      {/* Blinking dot — sound hook: "scan-pulse" */}
      <motion.div
        className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.div>
  );
}

/** Circular progress ring for score */
function ThreatRing({ score, color }: { score: number; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
      <motion.circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {score}
      </text>
    </svg>
  );
}

/** Confidence bar */
function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

/** Glassy stat card */
function StatCard({
  label,
  value,
  sub,
  color,
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 overflow-hidden group"
    >
      <CornerBrackets color={color} size={10} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15, transparent 70%)` }}
      />
      <p className="text-[10px] font-mono tracking-widest text-white/40 mb-1">{label}</p>
      <p className="text-xl font-bold font-mono" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-white/30 mt-0.5 font-mono">{sub}</p>}
    </motion.div>
  );
}

/** Collapsible intelligence panel */
function IntelPanel({
  id,
  title,
  icon: Icon,
  expanded,
  onToggle,
  color,
  delay,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  expanded: boolean;
  onToggle: () => void;
  color: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay ?? 0, duration: 0.5 }}
      className="relative rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <CornerBrackets color={color} size={10} />
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        <Icon className="w-4 h-4 shrink-0" style={{ color }} />
        <span className="flex-1 text-sm font-mono tracking-wider text-white/80 uppercase">{title}</span>
        <ChevronDown
          className="w-4 h-4 text-white/30 transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="border-t px-5 py-5"
              style={{ borderColor: `${color}30` }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Floating cyber particles */
function CyberParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -40, -80],
            x: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Main header with holographic ring */
function IntelHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-12 relative"
    >
      {/* Central glyph */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-500/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "conic-gradient(from 0deg, transparent 70%, rgba(0,212,255,0.4) 100%)",
            }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-cyan-400/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Icon */}
          <ShieldAlert className="w-9 h-9 text-cyan-400 relative z-10" />
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl" />
        </div>
      </div>

      <div className="text-[10px] font-mono tracking-[0.4em] text-cyan-500/70 mb-2 uppercase">
        CYBERSHIELD ◈ INTELLIGENCE SYSTEM ◈ v4.1
      </div>
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none mb-3">
        AI SCAM INTELLIGENCE{" "}
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
          }}
        >
          CENTER
        </span>
      </h1>
      <p className="text-sm text-white/40 font-mono max-w-xl mx-auto">
        Advanced neural threat analysis · Heuristic pattern recognition · AI-powered forensic assessment
      </p>

      {/* Horizontal line decoration */}
      <div className="flex items-center gap-3 justify-center mt-5">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
        <div className="w-32 h-px bg-cyan-500/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScamAnalyzer() {
  // ── All original state preserved exactly ──
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>("why-flagged");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // ── Extra UI state ──
  const [scanProgress, setScanProgress] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isLoading = loadingPhase !== null;

  // Animate scan progress bar while loading
  useEffect(() => {
    if (!isLoading) {
      setScanProgress(0);
      return;
    }
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((p) => (p >= 92 ? 92 : p + Math.random() * 3));
    }, 120);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Complete progress to 100 when done
  useEffect(() => {
    if (!isLoading && result) {
      setScanProgress(100);
    }
  }, [isLoading, result]);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [result]);

  // ── Original PDF logic ──────────────────────────────────────────────────────
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
      lines.forEach((line: string) => {
        if (y > 750) { doc.addPage(); y = margin; }
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

  // ── Original dropzone/OCR logic ─────────────────────────────────────────────
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setStatusMessage(null);
    setResult(null);
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: isLoading,
  });

  // ── Original analyze logic ──────────────────────────────────────────────────
  const analyze = async () => {
    setStatusMessage(null);
    setResult(null);
    setLoadingPhase("analyzing");
    const analysis = await analyzeScamText(text);
    setLoadingPhase("generating");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setResult(analysis);
    setLoadingPhase(null);
  };

  // ── Original demo logic ─────────────────────────────────────────────────────
  const tryDemoScam = async () => {
    const randomDemo = DEMO_SCAMS[Math.floor(Math.random() * DEMO_SCAMS.length)];
    setText(randomDemo);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setStatusMessage(null);
    setLoadingPhase("analyzing");
    const analysis = await analyzeScamText(randomDemo);
    setLoadingPhase("generating");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setResult(analysis);
    setLoadingPhase(null);
  };

  const riskColors = result ? getRiskColors(result.risk) : getRiskColors("Low");

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(0,212,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 2px; }
      `}</style>

      {/* Background atmosphere */}
      <CyberGrid />
      <CyberParticles />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <IntelHeader />

        {/* ── Input Panel ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 sm:p-8 mb-6 overflow-hidden"
        >
          <CornerBrackets color="#00d4ff" size={14} />

          {/* Panel label */}
          <div className="flex items-center gap-2 mb-5">
            <Radio className="w-3 h-3 text-cyan-500" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-500/70 uppercase">
              Signal Input Terminal
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-500 ml-auto"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Textarea */}
          <div className="relative mb-6">
            <CornerBrackets color="#00d4ff40" size={8} />
            <textarea
              placeholder="Paste suspicious SMS, phishing email, WhatsApp message, or scam text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              className="w-full h-40 bg-black/40 border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3.5 text-sm text-white/80 placeholder:text-white/20 resize-none outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
              style={{ fontFamily: "inherit" }}
            />
            {/* Character count */}
            <div className="absolute bottom-3 right-3 text-[10px] text-white/20">
              {text.length} chars
            </div>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`relative border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 mb-6 overflow-hidden
              ${isDragActive
                ? "border-cyan-400/80 bg-cyan-500/10"
                : "border-white/20 hover:border-cyan-500/50 hover:bg-white/[0.02]"}
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} disabled={isLoading} />
            <CornerBrackets color={isDragActive ? "#00d4ff" : "#ffffff20"} size={10} />

            {/* Radar pulse when dragging */}
            <RadarPulse active={isDragActive} />

            <div className="relative flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                <Upload className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/70">
                  {isDragActive ? "Drop to initiate OCR scan..." : "Upload Threat Screenshot"}
                </p>
                <p className="text-[11px] text-white/30 mt-1">
                  Drag & drop or click · Image OCR extraction enabled
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: isLoading || !text.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !text.trim() ? 1 : 0.98 }}
              onClick={analyze}
              disabled={isLoading || !text.trim()}
              className="relative flex-1 overflow-hidden rounded-xl py-3.5 px-6 font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isLoading || !text.trim()
                  ? "rgba(0,212,255,0.1)"
                  : "linear-gradient(135deg, #00d4ff, #0066ff)",
                color: isLoading || !text.trim() ? "#00d4ff" : "#000",
                border: "1px solid rgba(0,212,255,0.4)",
              }}
            >
              {/* Sound hook: "holographic-activation" */}
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ◌
                  </motion.span>
                  {loadingPhase === "scanning"
                    ? "OCR EXTRACTION..."
                    : loadingPhase === "analyzing"
                    ? "THREAT ANALYSIS..."
                    : "AI SYNTHESIS..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Initiate Intelligence Scan
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              onClick={tryDemoScam}
              disabled={isLoading}
              className="sm:w-auto px-5 py-3.5 rounded-xl text-sm font-semibold border border-white/15 text-white/50 hover:border-cyan-500/40 hover:text-cyan-400/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-wider uppercase"
            >
              ◈ Demo Signal
            </motion.button>
          </div>

          {/* Phase ticker */}
          <AnimatePresence>
            {isLoading && <PhaseTicker phase={loadingPhase} />}
          </AnimatePresence>

          {/* Status message */}
          <AnimatePresence>
            {statusMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-[11px] text-cyan-400/60 font-mono"
              >
                ◈ {statusMessage}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono">
                  <span>SCAN PROGRESS</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #00d4ff, #0066ff)",
                      boxShadow: "0 0 8px rgba(0,212,255,0.6)",
                    }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Image Preview ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative rounded-2xl border border-white/10 overflow-hidden mb-6"
            >
              <ScanBeam active={loadingPhase === "scanning"} />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl pointer-events-none z-10" />
              <img
                src={image}
                alt="Uploaded threat screenshot"
                className="w-full object-cover max-h-[320px]"
                style={{ filter: loadingPhase === "scanning" ? "brightness(0.7)" : "none" }}
              />
              {loadingPhase === "scanning" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center">
                    <motion.div
                      className="text-2xl font-mono text-cyan-400 mb-2"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      ◈ OCR SCANNING ◈
                    </motion.div>
                    <p className="text-xs text-cyan-300/60 font-mono">Extracting text matrix...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, transparent, ${riskColors.hex}50)` }}
                />
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase"
                  style={{ color: riskColors.hex }}>
                  <Eye className="w-3 h-3" />
                  Intelligence Assessment Complete
                </div>
                <div className="h-px flex-1"
                  style={{ backgroundImage: `linear-gradient(90deg, ${riskColors.hex}50, transparent)` }}
                />
              </motion.div>

              {/* Threat classification banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative rounded-2xl border overflow-hidden mb-5 p-5 sm:p-6"
                style={{
                  borderColor: `${riskColors.hex}40`,
                  background: `linear-gradient(135deg, ${riskColors.hex}08, transparent)`,
                  boxShadow: `0 0 40px ${riskColors.hex}10`,
                }}
              >
                <CornerBrackets color={riskColors.hex} size={14} />

                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {/* Threat ring */}
                  <div className="relative shrink-0">
                    <ThreatRing score={result.score} color={riskColors.hex} />
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-30"
                      style={{ background: riskColors.hex }}
                    />
                  </div>

                  {/* Classification details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono tracking-widest text-white/40 mb-1 uppercase">
                      Threat Classification
                    </div>
                    <div
                      className="text-3xl sm:text-4xl font-black tracking-tight mb-1"
                      style={{ color: riskColors.hex }}
                    >
                      {result.risk.toUpperCase()}
                    </div>
                    <div className="text-sm text-white/50 mb-3 font-mono">{result.category}</div>

                    {/* Confidence bar */}
                    <div className="mb-1 flex justify-between text-[10px] font-mono text-white/30">
                      <span>AI CONFIDENCE</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <ConfidenceBar value={result.confidence} color={riskColors.hex} />
                  </div>

                  {/* Download report */}
                  <motion.button
                    whileHover={{ scale: generatingPdf ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={downloadPdfReport}
                    disabled={generatingPdf}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono tracking-widest uppercase transition-all disabled:opacity-50"
                    style={{
                      borderColor: `${riskColors.hex}40`,
                      color: riskColors.hex,
                      background: `${riskColors.hex}10`,
                    }}
                  >
                    {/* Sound hook: "download-ping" */}
                    <Download className="w-3.5 h-3.5" />
                    {generatingPdf ? "Compiling..." : "Intel Report"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <StatCard label="RISK LEVEL" value={result.risk} color={riskColors.hex} delay={0.15} />
                <StatCard label="THREAT SCORE" value={`${result.score}`} sub="out of 100" color={riskColors.hex} delay={0.2} />
                <StatCard label="CONFIDENCE" value={`${result.confidence}%`} color="#00d4ff" delay={0.25} />
                <StatCard
                  label="INDICATORS"
                  value={`${result.indicators.length}`}
                  sub="signals detected"
                  color={result.indicators.length > 3 ? riskColors.hex : "#00d4ff"}
                  delay={0.3}
                />
              </div>

              {/* Intelligence panels */}
              <div className="space-y-3">

                {/* Why Flagged */}
                <IntelPanel
                  id="why-flagged"
                  title="Threat Indicators"
                  icon={AlertTriangle}
                  expanded={expandedPanel === "why-flagged"}
                  onToggle={() => setExpandedPanel(expandedPanel === "why-flagged" ? null : "why-flagged")}
                  color={riskColors.hex}
                  delay={0.35}
                >
                  {result.indicators.length > 0 ? (
                    <ul className="space-y-2.5">
                      {result.indicators.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span
                            className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: riskColors.hex, boxShadow: `0 0 6px ${riskColors.hex}` }}
                          />
                          <span className="text-white/70 leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/30 font-mono">No threat indicators detected.</p>
                  )}
                </IntelPanel>

                {/* Suspicious URLs */}
                {result.suspiciousUrls.length > 0 && (
                  <IntelPanel
                    id="urls"
                    title="Flagged URLs"
                    icon={Globe}
                    expanded={expandedPanel === "urls"}
                    onToggle={() => setExpandedPanel(expandedPanel === "urls" ? null : "urls")}
                    color={riskColors.hex}
                    delay={0.4}
                  >
                    <ul className="space-y-2">
                      {result.suspiciousUrls.map((url) => (
                        <li key={url} className="flex items-start gap-2 text-xs font-mono break-all">
                          <span style={{ color: riskColors.hex }} className="shrink-0 mt-0.5">▶</span>
                          <span className="text-white/60">{url}</span>
                        </li>
                      ))}
                    </ul>
                  </IntelPanel>
                )}

                {/* Recommendation */}
                <IntelPanel
                  id="recommendation"
                  title="Safety Directive"
                  icon={Lock}
                  expanded={expandedPanel === "recommendation"}
                  onToggle={() => setExpandedPanel(expandedPanel === "recommendation" ? null : "recommendation")}
                  color="#00d4ff"
                  delay={0.45}
                >
                  <div
                    className="rounded-lg border p-4 text-sm leading-relaxed text-white/70"
                    style={{
                      borderColor: `${riskColors.hex}25`,
                      background: `${riskColors.hex}08`,
                    }}
                  >
                    {result.recommendation}
                  </div>
                </IntelPanel>

                {/* AI Explanation */}
                <IntelPanel
                  id="ai-explanation"
                  title="AI Intelligence Brief"
                  icon={Cpu}
                  expanded={expandedPanel === "ai-explanation"}
                  onToggle={() => setExpandedPanel(expandedPanel === "ai-explanation" ? null : "ai-explanation")}
                  color="#0066ff"
                  delay={0.5}
                >
                  <div className="text-sm leading-relaxed text-white/60 whitespace-pre-line">
                    {result.explanation}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-white/25">
                    <Zap className="w-3 h-3" />
                    Generated by Groq · Heuristic + Neural Analysis
                  </div>
                </IntelPanel>

              </div>

              {/* Footer note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center text-[10px] font-mono text-white/20 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-3 h-3" />
                CyberShield Intelligence · Public safety awareness tool · Always verify through official channels
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}