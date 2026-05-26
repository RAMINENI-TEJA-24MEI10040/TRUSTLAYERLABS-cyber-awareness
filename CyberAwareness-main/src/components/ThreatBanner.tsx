// ThreatBanner.tsx — AI Cyber Awareness Command Center
// Stack: React + TypeScript + Tailwind CSS + Framer Motion

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "info";

interface ThreatAlert {
  id: number;
  message: string;
  severity: Severity;
  category: string;
  region?: string;
  code: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const THREAT_ALERTS: ThreatAlert[] = [
  { id: 1,  message: "QR payment scam activity rising — verify before scanning", severity: "critical", category: "QR SCAM",    region: "National",   code: "QRS-441" },
  { id: 2,  message: "Deepfake impersonation attempts detected across social platforms",  severity: "high",     category: "DEEPFAKE",   region: "Global",     code: "DPF-208" },
  { id: 3,  message: "Phishing campaigns targeting college students — stay alert",         severity: "high",     category: "PHISHING",   region: "Regional",   code: "PHI-779" },
  { id: 4,  message: "Fraudulent UPI payment links spreading via WhatsApp",               severity: "critical", category: "UPI FRAUD",  region: "National",   code: "UPI-334" },
  { id: 5,  message: "AI-generated scam calls impersonating bank officials increasing",   severity: "high",     category: "AI VOICE",   region: "Multi-city", code: "AVC-091" },
  { id: 6,  message: "Fake investment app scheme flagged — do not download",              severity: "medium",   category: "APP SCAM",   region: "Regional",   code: "APP-562" },
  { id: 7,  message: "SMS phishing surge targeting Aadhaar-linked accounts",             severity: "critical", category: "SMS LURE",   region: "National",   code: "SMS-887" },
  { id: 8,  message: "Social engineering playbook variant detected in the wild",          severity: "medium",   category: "SOC-ENG",    region: "Unknown",    code: "SEC-113" },
  { id: 9,  message: "Lottery scam wave active — awareness broadcast in progress",        severity: "info",     category: "AWARENESS",  region: "National",   code: "AWR-002" },
  { id: 10, message: "Malicious PDF attachments posing as government notices",            severity: "high",     category: "MALWARE",    region: "Regional",   code: "MAL-665" },
  { id: 11, message: "Romance scam vector expanding on dating platforms",                 severity: "medium",   category: "ROM-SCAM",   region: "Global",     code: "ROM-318" },
  { id: 12, message: "Cyber awareness alert — verify sources before sharing links",       severity: "info",     category: "BROADCAST",  region: "Public",     code: "BCT-001" },
];

const SEVERITY_CONFIG: Record<Severity, {
  border: string; text: string; bg: string; dot: string; glow: string; badge: string; scanColor: string;
}> = {
  critical: {
    border:    "border-red-500/50",
    text:      "text-red-300",
    bg:        "bg-red-500/8",
    dot:       "bg-red-400",
    glow:      "#ef444480",
    badge:     "bg-red-500/15 text-red-300 border-red-500/40",
    scanColor: "#ef4444",
  },
  high: {
    border:    "border-amber-500/40",
    text:      "text-amber-300",
    bg:        "bg-amber-500/5",
    dot:       "bg-amber-400",
    glow:      "#f59e0b60",
    badge:     "bg-amber-500/15 text-amber-300 border-amber-500/40",
    scanColor: "#f59e0b",
  },
  medium: {
    border:    "border-cyan-500/40",
    text:      "text-cyan-300",
    bg:        "bg-cyan-500/5",
    dot:       "bg-cyan-400",
    glow:      "#22d3ee50",
    badge:     "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
    scanColor: "#22d3ee",
  },
  info: {
    border:    "border-emerald-500/35",
    text:      "text-emerald-300",
    bg:        "bg-emerald-500/5",
    dot:       "bg-emerald-400",
    glow:      "#10b98140",
    badge:     "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    scanColor: "#10b981",
  },
};

// ─── Signal wave component ─────────────────────────────────────────────────────

const SignalWave = ({ color, delay = 0 }: { color: string; delay?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: 18, height: 18 }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute rounded-full border"
        style={{ borderColor: color, width: 6 + i * 5, height: 6 + i * 5 }}
        animate={{ opacity: [0.9, 0], scale: [0.6, 1.4] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: delay + i * 0.3, ease: "easeOut" }}
      />
    ))}
    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
  </div>
);

// ─── Scan line overlay ─────────────────────────────────────────────────────────

const ScanLine = () => (
  <motion.div
    className="absolute inset-y-0 w-px pointer-events-none z-30"
    style={{ background: "linear-gradient(to bottom, transparent, #22d3ee60, transparent)" }}
    animate={{ left: ["-2%", "102%"] }}
    transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
  />
);

// ─── Animated cyber grid strip ─────────────────────────────────────────────────

const CyberStrip = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="bstrip" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bstrip)" />
  </svg>
);

// ─── Radar blip ───────────────────────────────────────────────────────────────

const RadarBlip = ({ x, severity, delay }: { x: number; severity: Severity; delay: number }) => {
  const c = SEVERITY_CONFIG[severity];
  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${c.dot}`}
      style={{ left: `${x}%`, boxShadow: `0 0 8px ${c.glow}` }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.5] }}
      transition={{ duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
};

// ─── Ticker item ──────────────────────────────────────────────────────────────

const TickerItem = ({ alert }: { alert: ThreatAlert }) => {
  const c = SEVERITY_CONFIG[alert.severity];
  return (
    <span className="inline-flex items-center gap-3 px-6 whitespace-nowrap select-none">
      {/* Severity pill */}
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-widest uppercase ${c.badge}`}>
        <motion.span
          className={`w-1 h-1 rounded-full ${c.dot}`}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {alert.category}
      </span>
      {/* Message */}
      <span className={`text-[12px] font-mono tracking-wide ${c.text} opacity-90`}>
        {alert.message}
      </span>
      {/* Code + region */}
      <span className="text-slate-600 text-[10px] font-mono">
        [{alert.code}
        {alert.region ? ` · ${alert.region}` : ""}]
      </span>
      {/* Separator */}
      <span className="text-slate-700 text-sm mx-2">◈</span>
    </span>
  );
};

// ─── Infinite ticker ──────────────────────────────────────────────────────────

const InfiniteTicker = ({ speed = 42 }: { speed?: number }) => {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth / 2);
    }
  }, []);

  const duration = trackWidth > 0 ? trackWidth / speed : 80;

  return (
    <div
      className="relative overflow-hidden flex-1 min-w-0 cursor-default"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #030910, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #030910, transparent)" }} />

      <motion.div
        ref={trackRef}
        className="flex items-center w-max"
        animate={{ x: paused ? undefined : [0, -trackWidth] }}
        transition={{
          x: { duration, repeat: Infinity, ease: "linear", repeatType: "loop" },
        }}
        style={{ willChange: "transform" }}
      >
        {[...THREAT_ALERTS, ...THREAT_ALERTS].map((alert, i) => (
          <TickerItem key={`${alert.id}-${i}`} alert={alert} />
        ))}
      </motion.div>

      {paused && (
        <motion.div
          className="absolute right-20 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-500/50 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          PAUSED
        </motion.div>
      )}
    </div>
  );
};

// ─── Status left panel ────────────────────────────────────────────────────────

const LiveStatusBadge = ({ criticalCount }: { criticalCount: number }) => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setFlash((f) => !f), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2.5 shrink-0 pl-4 pr-3 border-r border-cyan-500/15">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className="relative w-2 h-2 flex items-center justify-center"
        >
          <motion.span
            className="absolute w-4 h-4 rounded-full bg-red-500/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="w-2 h-2 rounded-full bg-red-400 block" style={{ boxShadow: "0 0 8px #ef4444" }} />
        </motion.div>
        <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-red-400 uppercase">Live</span>
      </div>

      {/* Divider */}
      <span className="text-slate-700 text-xs">|</span>

      {/* Critical count */}
      <motion.div
        className="flex items-center gap-1"
        animate={{ opacity: flash ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[10px] font-mono text-red-400 font-bold">{criticalCount}</span>
        <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase">Critical</span>
      </motion.div>
    </div>
  );
};

// ─── Right panel: system status ───────────────────────────────────────────────

const SystemStatusPanel = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const scanPct = [62, 75, 81, 68, 90, 73][tick % 6];

  return (
    <div className="flex items-center gap-3 shrink-0 pl-3 pr-4 border-l border-cyan-500/15">
      {/* Radar mini */}
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 28 28" className="w-full h-full">
          <circle cx="14" cy="14" r="12" fill="none" stroke="#22d3ee" strokeWidth="0.6" opacity="0.3" />
          <circle cx="14" cy="14" r="8"  fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.2" />
          <circle cx="14" cy="14" r="4"  fill="none" stroke="#22d3ee" strokeWidth="0.3" opacity="0.2" />
          <motion.line
            x1="14" y1="14" x2="14" y2="2"
            stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round"
            style={{ transformOrigin: "14px 14px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="14" cy="14" r="1.2" fill="#22d3ee" opacity="0.8" />
        </svg>
      </div>

      {/* Scan info */}
      <div className="hidden sm:flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">AI Scan</span>
          <motion.span
            className="text-[10px] font-mono text-cyan-400 font-bold"
            key={scanPct}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {scanPct}%
          </motion.span>
        </div>
        <div className="w-20 h-0.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
            animate={{ width: `${scanPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── ThreatBanner Root ────────────────────────────────────────────────────────

const ThreatBanner: React.FC = () => {
  const criticalCount = THREAT_ALERTS.filter((a) => a.severity === "critical").length;

  const blips: Array<{ x: number; severity: Severity; delay: number }> = [
    { x: 15,  severity: "critical", delay: 0 },
    { x: 32,  severity: "high",     delay: 0.8 },
    { x: 54,  severity: "medium",   delay: 1.4 },
    { x: 71,  severity: "critical", delay: 0.4 },
    { x: 88,  severity: "high",     delay: 1.9 },
  ];

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      style={{ height: 40, background: "#030910" }}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Background layers ────────────────────────── */}
      <CyberStrip />

      {/* Gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 30% 100% at 20% 50%, #0e749008 0%, transparent 70%)",
            "radial-gradient(ellipse 25% 100% at 75% 50%, #ef444406 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Top border — cyan glow line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent 0%, #22d3ee50 30%, #ef444440 70%, transparent 100%)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #22d3ee20, transparent)" }}
      />

      {/* Radar blips across width */}
      {blips.map((b, i) => (
        <RadarBlip key={i} {...b} />
      ))}

      {/* Scan line sweep */}
      <ScanLine />

      {/* ── Content row ──────────────────────────────── */}
      <div className="relative z-20 flex items-center h-full gap-0">
        {/* Left: LIVE badge */}
        <LiveStatusBadge criticalCount={criticalCount} />

        {/* Label */}
        <div className="flex items-center gap-2 shrink-0 px-3 border-r border-cyan-500/15">
          <SignalWave color="#22d3ee" delay={0} />
          <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-cyan-500/70 hidden md:block">
            Threat Intel
          </span>
        </div>

        {/* Ticker */}
        <InfiniteTicker speed={44} />

        {/* Right: System status */}
        <SystemStatusPanel />
      </div>

      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 -1px 20px #22d3ee06, inset 0 1px 12px #ef444404",
        }}
      />
    </motion.div>
  );
};

export default ThreatBanner;