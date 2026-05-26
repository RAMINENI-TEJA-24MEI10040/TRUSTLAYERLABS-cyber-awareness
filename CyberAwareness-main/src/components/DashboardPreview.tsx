import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// ─── Font Injection ────────────────────────────────────────────────────────────
const FontStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
    .font-orbitron { font-family: 'Orbitron', monospace; }
    .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
    .font-mono-cyber { font-family: 'Space Mono', monospace; }
    @keyframes radar-sweep {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes scan-line {
      0%   { top: 0%; opacity: 0.8; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes flicker {
      0%,100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 95% { opacity: 1; } 97% { opacity: 0.6; } 99% { opacity: 1; }
    }
    @keyframes data-stream {
      0%   { transform: translateY(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-320px); opacity: 0; }
    }
    @keyframes typing {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes blink-cursor {
      50% { border-color: transparent; }
    }
    @keyframes node-pulse {
      0%,100% { r: 3; opacity: 1; }
      50%      { r: 5; opacity: 0.6; }
    }
    @keyframes flow-dash {
      to { stroke-dashoffset: -40; }
    }
    .radar-sweep { animation: radar-sweep 4s linear infinite; transform-origin: center; }
    .scan-anim   { animation: scan-line 2.8s linear infinite; }
    .flicker-anim { animation: flicker 6s infinite; }
    .stream-anim { animation: data-stream 5s linear infinite; }
    .node-pulse  { animation: node-pulse 2s ease-in-out infinite; }
    .flow-dash   { animation: flow-dash 1.2s linear infinite; stroke-dasharray: 8 4; }
  `}</style>
);

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ThreatEntry {
  id: string;
  type: string;
  source: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
  status: "intercepted" | "monitoring" | "neutralized";
}

interface ScanEntry {
  id: string;
  target: string;
  result: "phishing" | "safe" | "suspicious" | "deepfake";
  confidence: number;
  time: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const SEVERITY_COLORS: Record<string, string> = {
  critical: "#f43f5e",
  high:     "#f97316",
  medium:   "#f59e0b",
  low:      "#10b981",
};

const RESULT_COLORS: Record<string, string> = {
  phishing:  "#f43f5e",
  suspicious:"#f59e0b",
  deepfake:  "#8b5cf6",
  safe:      "#10b981",
};

const THREAT_LOG: ThreatEntry[] = [
  { id:"t1", type:"Phishing Campaign",   source:"IP 185.220.x.x",  severity:"critical", time:"00:12s", status:"intercepted" },
  { id:"t2", type:"QR Code Fraud",        source:"IN/MH Region",    severity:"high",     time:"01:44s", status:"monitoring"  },
  { id:"t3", type:"Deepfake Audio",       source:"Telegram Bot",    severity:"high",     time:"03:02s", status:"intercepted" },
  { id:"t4", type:"SIM Swap Attempt",     source:"Telecom API",     severity:"medium",   time:"04:55s", status:"neutralized" },
  { id:"t5", type:"OTP Harvesting",       source:"SMS Gateway",     severity:"critical", time:"06:11s", status:"intercepted" },
  { id:"t6", type:"Vishing Call",         source:"+91-9XXX-XXXX",   severity:"medium",   time:"07:30s", status:"monitoring"  },
  { id:"t7", type:"Fake Gov Portal",      source:"Domain Spoof",    severity:"high",     time:"09:18s", status:"intercepted" },
];

const SCAN_LOG: ScanEntry[] = [
  { id:"s1", target:"bit.ly/gov-refund",     result:"phishing",   confidence:98, time:"now"     },
  { id:"s2", target:"qr-ugc-apply.in",       result:"suspicious", confidence:82, time:"0:12s"   },
  { id:"s3", target:"uidai-portal.xyz",      result:"phishing",   confidence:99, time:"0:44s"   },
  { id:"s4", target:"naukri-offer-2025.com", result:"suspicious", confidence:74, time:"1:10s"   },
  { id:"s5", target:"whatsapp://deeplink",   result:"safe",       confidence:94, time:"1:55s"   },
  { id:"s6", target:"video-verify.reel",     result:"deepfake",   confidence:91, time:"2:30s"   },
];

const AWARENESS_STATS = [
  { label:"Phishing Links Flagged",  value:"2.4M",  delta:"+18%", color:"#f43f5e", icon:"🎣" },
  { label:"QR Scams Blocked",        value:"187K",  delta:"+32%", color:"#f59e0b", icon:"📷" },
  { label:"Deepfakes Detected",      value:"41K",   delta:"+67%", color:"#8b5cf6", icon:"🤖" },
  { label:"Citizens Protected",      value:"9.1M",  delta:"+12%", color:"#10b981", icon:"🛡️" },
];

// ─── Utilities ─────────────────────────────────────────────────────────────────
const glassStyle = (accent = "rgba(6,182,212,0.15)", border = "rgba(6,182,212,0.2)"): React.CSSProperties => ({
  background: `linear-gradient(135deg, rgba(2,10,24,0.92) 0%, rgba(4,16,36,0.88) 100%)`,
  border: `1px solid ${border}`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${accent}`,
});

const PanelHeader: React.FC<{ title: string; accent?: string; live?: boolean; badge?: string }> = ({
  title, accent = "#06b6d4", live, badge
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <motion.div
        className="w-1 h-4 rounded-full"
        style={{ background: `linear-gradient(180deg, ${accent}, ${accent}40)` }}
        animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="font-orbitron text-[10px] tracking-[0.2em] font-semibold" style={{ color: accent }}>
        {title}
      </span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="font-mono-cyber text-[8px] px-2 py-0.5 rounded" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
          {badge}
        </span>
      )}
      {live && (
        <span className="flex items-center gap-1.5 font-mono-cyber text-[8px] text-rose-400">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          LIVE
        </span>
      )}
    </div>
  </div>
);

// ─── Animated Cyber Grid Background ───────────────────────────────────────────
const CyberGridBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dp-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#06b6d4" strokeWidth="0.6"/>
        </pattern>
        <pattern id="dp-grid-lg" width="192" height="192" patternUnits="userSpaceOnUse">
          <path d="M 192 0 L 0 0 0 192" fill="none" stroke="#06b6d4" strokeWidth="1.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dp-grid)"/>
      <rect width="100%" height="100%" fill="url(#dp-grid-lg)"/>
    </svg>

    {/* Mesh gradients */}
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(6,182,212,0.07) 0%, transparent 60%)" }}/>
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 80% 70%, rgba(16,185,129,0.06) 0%, transparent 60%)" }}/>
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 10%, rgba(139,92,246,0.05) 0%, transparent 60%)" }}/>

    {/* Horizontal scanlines */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-x-0 h-px"
        style={{ top: `${12 + i * 11}%`, background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.12),transparent)" }}
        animate={{ opacity: [0, 0.8, 0], x: ["-100%", "100%"] }}
        transition={{ duration: 6 + i * 0.7, repeat: Infinity, delay: i * 1.1, ease: "linear" }}
      />
    ))}

    {/* Floating particles */}
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={`p${i}`}
        className="absolute rounded-full"
        style={{
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? 3 : 2,
          left: `${5 + (i * 47) % 90}%`,
          top: `${10 + (i * 31) % 80}%`,
          background: i % 4 === 0 ? "#10b981" : "#06b6d4",
        }}
        animate={{
          y: [-10, -30, -10],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ─── Radar Panel ───────────────────────────────────────────────────────────────
const RadarPanel: React.FC = () => {
  const threats = [
    { x: 55, y: 40, r: "#f43f5e" }, { x: 30, y: 65, r: "#f59e0b" },
    { x: 70, y: 70, r: "#f43f5e" }, { x: 45, y: 25, r: "#f59e0b" },
    { x: 80, y: 45, r: "#06b6d4" }, { x: 20, y: 40, r: "#10b981" },
  ];

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(6,182,212,0.12)", "rgba(6,182,212,0.2)")}>
      <PanelHeader title="THREAT RADAR" accent="#06b6d4" live badge="GLOBAL" />
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        <svg width="180" height="180" viewBox="0 0 180 180" className="absolute">
          {/* Rings */}
          {[20,40,60,80].map(r => (
            <circle key={r} cx="90" cy="90" r={r} fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth="1"/>
          ))}
          {/* Cross hairs */}
          <line x1="90" y1="10" x2="90" y2="170" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8"/>
          <line x1="10" y1="90" x2="170" y2="90" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8"/>
          <line x1="33" y1="33" x2="147" y2="147" stroke="rgba(6,182,212,0.07)" strokeWidth="0.6"/>
          <line x1="147" y1="33" x2="33" y2="147" stroke="rgba(6,182,212,0.07)" strokeWidth="0.6"/>

          {/* Sweep gradient */}
          <defs>
            <radialGradient id="radar-sweep-grad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(6,182,212,0)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </radialGradient>
            <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(6,182,212,0)"/>
              <stop offset="100%" stopColor="rgba(6,182,212,0.45)"/>
            </linearGradient>
          </defs>

          {/* Sweep arm */}
          <g className="radar-sweep" style={{ transformOrigin: "90px 90px" }}>
            <path d="M90 90 L90 10 A80 80 0 0 1 150 70 Z" fill="url(#sweep-grad)" opacity="0.6"/>
            <line x1="90" y1="90" x2="90" y2="12" stroke="rgba(6,182,212,0.9)" strokeWidth="1.5"/>
          </g>

          {/* Center dot */}
          <circle cx="90" cy="90" r="3" fill="#06b6d4" opacity="0.9"/>
          <circle cx="90" cy="90" r="6" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="1"/>

          {/* Threat blips */}
          {threats.map((t, i) => (
            <g key={i}>
              <motion.circle
                cx={t.x * 1.8} cy={t.y * 1.8} r="3" fill={t.r}
                animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 4, 2.5] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              />
              <motion.circle
                cx={t.x * 1.8} cy={t.y * 1.8} r="6" fill="none" stroke={t.r} strokeWidth="0.8"
                animate={{ r: [4, 10, 4], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.4 }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1 mt-1">
        {[
          { color:"#f43f5e", label:"Critical" }, { color:"#f59e0b", label:"High" },
          { color:"#06b6d4", label:"Monitoring"}, { color:"#10b981", label:"Resolved"},
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: l.color }}/>
            <span className="font-mono-cyber text-[9px] text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Threat Feed Panel ─────────────────────────────────────────────────────────
const ThreatFeedPanel: React.FC = () => {
  const [visible, setVisible] = useState(THREAT_LOG.slice(0, 5));
  const idx = useRef(5);

  useEffect(() => {
    const iv = setInterval(() => {
      const next = THREAT_LOG[idx.current % THREAT_LOG.length];
      idx.current++;
      setVisible(prev => [next, ...prev].slice(0, 5));
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(244,63,94,0.1)", "rgba(244,63,94,0.2)")}>
      <PanelHeader title="LIVE THREAT FEED" accent="#f43f5e" live />

      {/* Scan line */}
      <div className="absolute inset-x-4 overflow-hidden pointer-events-none" style={{ height: 2, top: 52 }}>
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg,transparent,rgba(244,63,94,0.8),transparent)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="space-y-2 mt-1">
        <AnimatePresence>
          {visible.map((t, i) => (
            <motion.div
              key={t.id + i}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="relative flex items-start gap-2 rounded-lg p-2"
              style={{
                background: `${SEVERITY_COLORS[t.severity]}0d`,
                border: `1px solid ${SEVERITY_COLORS[t.severity]}25`,
              }}
            >
              {/* Severity indicator */}
              <div className="flex-shrink-0 mt-0.5">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: SEVERITY_COLORS[t.severity] }}
                  animate={{ opacity: t.severity === "critical" ? [1, 0.2, 1] : 1 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-rajdhani text-[11px] font-semibold text-white truncate">{t.type}</span>
                  <span className="font-mono-cyber text-[9px] text-slate-500 flex-shrink-0">{t.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono-cyber text-[9px] text-slate-500 truncate">{t.source}</span>
                  <span
                    className="font-mono-cyber text-[8px] px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: t.status === "intercepted" ? "rgba(16,185,129,0.12)" : t.status === "monitoring" ? "rgba(245,158,11,0.12)" : "rgba(6,182,212,0.12)",
                      color:      t.status === "intercepted" ? "#10b981" : t.status === "monitoring" ? "#f59e0b" : "#06b6d4",
                    }}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── AI Scanner Panel ──────────────────────────────────────────────────────────
const AIScannerPanel: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [currentScan, setCurrentScan] = useState(SCAN_LOG[0]);
  const scanIdx = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      scanIdx.current = (scanIdx.current + 1) % SCAN_LOG.length;
      setCurrentScan(SCAN_LOG[scanIdx.current]);
      setProgress(0);
      setScanning(true);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let p = 0;
    const iv = setInterval(() => {
      p += 3;
      setProgress(Math.min(p, 100));
      if (p >= 100) { setScanning(false); clearInterval(iv); }
    }, 50);
    return () => clearInterval(iv);
  }, [scanning, currentScan]);

  const resultColor = RESULT_COLORS[currentScan.result];

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(6,182,212,0.12)", "rgba(6,182,212,0.2)")}>
      <PanelHeader title="AI LINK SCANNER" accent="#06b6d4" live={scanning} badge="GPT-VERIFIED" />

      {/* Scanning animation */}
      <div className="relative rounded-xl overflow-hidden mb-3" style={{ height: 80, background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
        {scanning && (
          <motion.div
            className="absolute inset-x-0 h-0.5"
            style={{ background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.9),transparent)", top: `${progress}%` }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3">
          <span className="font-mono-cyber text-[10px] text-cyan-300 truncate w-full text-center">
            {scanning ? "▶ " : "◼ "}{currentScan.target}
          </span>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: scanning ? "linear-gradient(90deg,#06b6d4,#10b981)" : `linear-gradient(90deg,${resultColor},${resultColor}88)` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-cyber text-[9px] text-slate-500">{scanning ? "SCANNING..." : "ANALYSIS COMPLETE"}</span>
            {!scanning && (
              <span
                className="font-mono-cyber text-[9px] px-2 py-0.5 rounded-full"
                style={{ background: `${resultColor}18`, color: resultColor, border: `1px solid ${resultColor}30` }}
              >
                {currentScan.result.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        {/* Corner decorations */}
        {["tl","tr","bl","br"].map(c => (
          <div key={c} className={`absolute w-3 h-3 ${c.includes("t") ? "top-1" : "bottom-1"} ${c.includes("l") ? "left-1" : "right-1"}`}
            style={{
              borderTop:    c.includes("t") ? "1px solid rgba(6,182,212,0.5)" : undefined,
              borderBottom: c.includes("b") ? "1px solid rgba(6,182,212,0.5)" : undefined,
              borderLeft:   c.includes("l") ? "1px solid rgba(6,182,212,0.5)" : undefined,
              borderRight:  c.includes("r") ? "1px solid rgba(6,182,212,0.5)" : undefined,
            }}
          />
        ))}
      </div>

      {/* Recent scans */}
      <div className="space-y-1.5">
        {SCAN_LOG.slice(0, 4).map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RESULT_COLORS[s.result] }}/>
            <span className="font-mono-cyber text-[9px] text-slate-400 flex-1 truncate">{s.target}</span>
            <span className="font-rajdhani text-[10px] font-semibold flex-shrink-0" style={{ color: RESULT_COLORS[s.result] }}>
              {s.confidence}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Neural Network SVG ────────────────────────────────────────────────────────
const NeuralNetworkPanel: React.FC = () => {
  const nodes = [
    { x: 30,  y: 50,  id: "i1" }, { x: 30,  y: 110, id: "i2" }, { x: 30,  y: 170, id: "i3" },
    { x: 105, y: 30,  id: "h1" }, { x: 105, y: 80,  id: "h2" }, { x: 105, y: 130, id: "h3" }, { x: 105, y: 180, id: "h4" },
    { x: 180, y: 60,  id: "o1" }, { x: 180, y: 120, id: "o2" }, { x: 180, y: 170, id: "o3" },
    { x: 255, y: 90,  id: "r1" }, { x: 255, y: 150, id: "r2" },
  ];

  const edges = [
    ["i1","h1"],["i1","h2"],["i1","h3"],
    ["i2","h1"],["i2","h2"],["i2","h3"],["i2","h4"],
    ["i3","h2"],["i3","h3"],["i3","h4"],
    ["h1","o1"],["h1","o2"],["h2","o1"],["h2","o2"],["h2","o3"],
    ["h3","o2"],["h3","o3"],["h4","o3"],
    ["o1","r1"],["o2","r1"],["o2","r2"],["o3","r2"],
  ];

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const nodeColors: Record<string, string> = {
    i1:"#06b6d4",i2:"#06b6d4",i3:"#06b6d4",
    h1:"#8b5cf6",h2:"#8b5cf6",h3:"#8b5cf6",h4:"#8b5cf6",
    o1:"#10b981",o2:"#10b981",o3:"#10b981",
    r1:"#f43f5e",r2:"#f43f5e",
  };

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(139,92,246,0.1)", "rgba(139,92,246,0.2)")}>
      <PanelHeader title="AI THREAT NEURAL NET" accent="#8b5cf6" badge="LIVE INFERENCE" />

      <div className="relative overflow-hidden rounded-xl" style={{ height: 220 }}>
        <svg width="100%" height="220" viewBox="0 0 285 210" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {edges.map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b];
            if (!na || !nb) return null;
            return (
              <line
                key={`e${i}`}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke="rgba(139,92,246,0.2)"
                strokeWidth="0.8"
                className="flow-dash"
                style={{ animationDelay: `${i * 0.1}s`, strokeDasharray: "6 4" }}
              />
            );
          })}

          {/* Animated signal pulses */}
          {edges.filter((_, i) => i % 4 === 0).map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b];
            if (!na || !nb) return null;
            return (
              <motion.circle key={`p${i}`} r="2.5" fill="#8b5cf6"
                animate={{
                  cx: [na.x, nb.x], cy: [na.y, nb.y], opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="8" fill={`${nodeColors[n.id]}18`} stroke={nodeColors[n.id]} strokeWidth="1"/>
              <motion.circle
                cx={n.x} cy={n.y} r="4" fill={nodeColors[n.id]}
                animate={{ r: [3, 5, 3], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              />
              <motion.circle
                cx={n.x} cy={n.y} r="12" fill="none" stroke={nodeColors[n.id]} strokeWidth="0.6"
                animate={{ r: [10, 18, 10], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              />
            </g>
          ))}
        </svg>

        {/* Layer labels */}
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-2">
          {["INPUT","HIDDEN","OUTPUT","RESULT"].map(l => (
            <span key={l} className="font-mono-cyber text-[7px] text-slate-600 tracking-widest">{l}</span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {[
          { label:"Accuracy", value:"99.2%", color:"#10b981" },
          { label:"Latency",  value:"18ms",  color:"#06b6d4" },
          { label:"Threats",  value:"2.4K",  color:"#f43f5e" },
        ].map(s => (
          <div key={s.label} className="text-center rounded-lg py-1.5" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="font-orbitron text-[12px] font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="font-mono-cyber text-[8px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Awareness Stats Panel ─────────────────────────────────────────────────────
const AwarenessStatsPanel: React.FC = () => (
  <div className="relative rounded-2xl p-4 overflow-hidden" style={glassStyle("rgba(16,185,129,0.1)", "rgba(16,185,129,0.2)")}>
    <PanelHeader title="PROTECTION INTELLIGENCE" accent="#10b981" badge="INDIA·2025" />
    <div className="grid grid-cols-2 gap-3">
      {AWARENESS_STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative rounded-xl p-3 overflow-hidden"
          style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
        >
          <div className="text-xl mb-1">{s.icon}</div>
          <div className="font-orbitron text-[16px] font-bold" style={{ color: s.color }}>{s.value}</div>
          <div className="font-rajdhani text-[10px] text-slate-400 leading-tight">{s.label}</div>
          <div className="font-mono-cyber text-[9px] mt-1" style={{ color: s.color }}>{s.delta} this week</div>

          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-2xl" style={{ background: `radial-gradient(circle at top right, ${s.color}25, transparent)` }}/>

          {/* Animated bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 rounded-full"
            style={{ background: s.color }}
            initial={{ width: "0%" }}
            animate={{ width: "85%" }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Deepfake Monitor Panel ────────────────────────────────────────────────────
const DeepfakeMonitorPanel: React.FC = () => {
  const [detection, setDetection] = useState(78);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const iv1 = setInterval(
      () =>
        setDetection((v) =>
          Math.min(
            99,
            Math.max(
              60,
              v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4)
            )
          )
        ),
      900
    );
    const iv2 = setInterval(() => setActiveFrame(f => (f + 1) % 6), 500);
    return () => { clearInterval(iv1); clearInterval(iv2); };
  }, []);

  const isHigh = detection > 80;

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(139,92,246,0.12)", "rgba(139,92,246,0.22)")}>
      <PanelHeader title="DEEPFAKE DETECTOR" accent="#8b5cf6" live badge="AI VISION" />

      {/* Frame grid simulation */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative rounded-md overflow-hidden aspect-video flex items-center justify-center"
            style={{
              background: i === activeFrame ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${i === activeFrame ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.06)"}`,
              minHeight: 36,
            }}
          >
            {i === activeFrame && (
              <motion.div className="absolute inset-0" style={{ background: "linear-gradient(45deg, rgba(139,92,246,0.1), transparent)" }}
                animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 0.5, repeat: Infinity }} />
            )}
            {/* Scan lines */}
            {i === activeFrame && (
              <motion.div className="absolute inset-x-0 h-px"
                style={{ background: "rgba(139,92,246,0.8)" }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="font-mono-cyber text-[7px] text-slate-600">FR{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Detection score */}
      <div className="relative rounded-xl p-3 overflow-hidden" style={{ background: isHigh ? "rgba(244,63,94,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${isHigh ? "rgba(244,63,94,0.2)" : "rgba(16,185,129,0.2)"}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-rajdhani text-[11px] font-semibold text-slate-300">Manipulation Score</span>
          <motion.span
            className="font-orbitron text-[18px] font-bold"
            style={{ color: isHigh ? "#f43f5e" : "#10b981" }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            {detection}%
          </motion.span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isHigh ? "linear-gradient(90deg,#f97316,#f43f5e)" : "linear-gradient(90deg,#10b981,#06b6d4)" }}
            animate={{ width: `${detection}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-1.5">
          <span className="font-mono-cyber text-[9px]" style={{ color: isHigh ? "#f43f5e" : "#10b981" }}>
            {isHigh ? "⚠ HIGH MANIPULATION DETECTED" : "✓ LOW RISK — AUTHENTIC"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Cyber Alert Ticker ────────────────────────────────────────────────────────
const AlertTicker: React.FC = () => {
  const alerts = [
    "⚠ NEW PHISHING WAVE TARGETING UPI USERS IN MH/KA REGION",
    "🔴 DEEPFAKE VIDEO CIRCULATING — PM IMPERSONATION CONFIRMED",
    "⚡ AI SCANNER BLOCKED 18,432 MALICIOUS LINKS IN LAST HOUR",
    "🟡 QR CODE FRAUD SPIKE DETECTED — METRO CITIES AT RISK",
    "🛡 CYBER LAW UPDATE: IT ACT AMENDMENT 2025 NOW IN EFFECT",
    "🤖 VOICE CLONE SCAM WAVE REPORTED ACROSS BANKING SECTOR",
  ];

  return (
    <div className="relative overflow-hidden rounded-xl py-2 px-4" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
      <div className="flex items-center gap-3">
        <motion.span
          className="font-orbitron text-[9px] font-bold text-rose-400 flex-shrink-0 tracking-widest"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ◉ ALERT
        </motion.span>
        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...alerts, ...alerts].map((a, i) => (
              <span key={i} className="font-rajdhani text-[11px] text-slate-300 font-medium">{a}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ─── Digital Signal Stream ─────────────────────────────────────────────────────
const DataStreamColumn: React.FC<{ delay?: number; color?: string }> = ({ delay = 0, color = "#06b6d4" }) => {
  const chars = "アイウエオカキクケコサシスセソタチツテト01アイウエオカキクケコ";
  const col = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]);

  return (
    <div className="flex flex-col gap-0.5" style={{ animationDelay: `${delay}s` }}>
      {col.map((c, i) => (
        <motion.span
          key={i}
          className="font-mono-cyber text-[8px] leading-none"
          style={{ color }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: delay + i * 0.08, ease: "easeInOut" }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
};

const DataStream: React.FC = () => (
  <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(16,185,129,0.08)", "rgba(16,185,129,0.15)")}>
    <PanelHeader title="DATA SIGNAL FEED" accent="#10b981" live />
    <div className="flex gap-2 overflow-hidden" style={{ height: 160 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <DataStreamColumn key={i} delay={i * 0.3} color={i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#06b6d4" : "rgba(139,92,246,0.8)"} />
      ))}
    </div>
    <div className="mt-2 font-mono-cyber text-[9px] text-slate-600">
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
        █ STREAM ACTIVE · 4.2 TB/s · ENCRYPTED
      </motion.span>
    </div>
  </div>
);

// ─── QR Fraud Analysis ─────────────────────────────────────────────────────────
const QRAnalysisPanel: React.FC = () => {
  const [scanPhase, setScanPhase] = useState(0);
  const phases = ["DECODING QR MATRIX", "RESOLVING REDIRECT CHAIN", "AI RISK ANALYSIS", "THREAT CONFIRMED"];

  useEffect(() => {
    const iv = setInterval(() => setScanPhase(p => (p + 1) % phases.length), 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative rounded-2xl p-4 overflow-hidden h-full" style={glassStyle("rgba(245,158,11,0.1)", "rgba(245,158,11,0.2)")}>
      <PanelHeader title="QR FRAUD ANALYSIS" accent="#f59e0b" live />

      {/* QR code simulation */}
      <div className="relative mx-auto mb-3 rounded-lg overflow-hidden" style={{ width: 100, height: 100, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* QR pattern simulation */}
          {Array.from({ length: 7 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => {
              const isCorner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
              return (
                <rect key={`${r}-${c}`}
                  x={10 + c * 12} y={10 + r * 12}
                  width={isCorner ? 10 : Math.random() > 0.4 ? 8 : 4}
                  height={isCorner ? 10 : Math.random() > 0.4 ? 8 : 4}
                  fill={isCorner ? "#f59e0b" : `rgba(245,158,11,${0.3 + Math.random() * 0.7})`}
                  rx="1"
                />
              );
            })
          )}
        </svg>
        {/* Scan overlay */}
        <motion.div
          className="absolute inset-x-0 h-0.5"
          style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.9),transparent)" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Corner markers */}
        {["top-1 left-1 border-t border-l","top-1 right-1 border-t border-r","bottom-1 left-1 border-b border-l","bottom-1 right-1 border-b border-r"].map((c, i) => (
          <div key={i} className={`absolute w-3 h-3 ${c}`} style={{ borderColor: "rgba(245,158,11,0.8)", borderWidth: 1.5 }}/>
        ))}
      </div>

      {/* Phase indicator */}
      <div className="space-y-1.5">
        {phases.map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: i < scanPhase ? "rgba(244,63,94,0.2)" : i === scanPhase ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i < scanPhase ? "#f43f5e" : i === scanPhase ? "#f59e0b" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {i < scanPhase && <span style={{ fontSize: 7, color: "#f43f5e" }}>✓</span>}
              {i === scanPhase && (
                <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
              )}
            </div>
            <span className="font-mono-cyber text-[9px]" style={{
              color: i < scanPhase ? "#f43f5e" : i === scanPhase ? "#f59e0b" : "rgba(255,255,255,0.2)",
            }}>
              {p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader: React.FC = () => (
  <div className="text-center mb-12 relative z-10">
    {/* Eyebrow */}
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
      style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.span
        className="w-2 h-2 rounded-full bg-cyan-400"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="font-orbitron text-[10px] text-cyan-400 tracking-[0.25em]">COMMAND CENTER · LIVE ENVIRONMENT</span>
      <motion.span
        className="w-2 h-2 rounded-full bg-emerald-400"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </motion.div>

    <motion.h2
      className="font-orbitron font-black text-4xl md:text-5xl lg:text-6xl leading-tight mb-4"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #06b6d4 40%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      AI INTELLIGENCE
      <br />
      <span style={{ background: "linear-gradient(135deg, #8b5cf6, #f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        OPERATIONS CORE
      </span>
    </motion.h2>

    <motion.p
      className="font-rajdhani text-lg text-slate-400 max-w-2xl mx-auto font-medium"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      Every second, our AI monitors the digital threat landscape — detecting phishing, deepfakes, and scams before they reach you.
      <br />
      <span className="text-cyan-400/70">This is your shield. This is AEGIS.</span>
    </motion.p>
  </div>
);

// ─── Mouse parallax hook ───────────────────────────────────────────────────────
function useMouseParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / rect.width * 20);
    mouseY.set((e.clientY - cy) / rect.height * 20);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return { springX, springY, handleMouseMove, handleMouseLeave };
}

// ─── Main Component ────────────────────────────────────────────────────────────
const DashboardPreview: React.FC = () => {
  const { springX, springY, handleMouseMove, handleMouseLeave } = useMouseParallax();

  return (
    <>
      <FontStyles />

      <section
        className="relative w-full overflow-hidden py-24 px-4 md:px-8"
        style={{ background: "linear-gradient(180deg, rgba(0,4,12,1) 0%, rgba(0,8,20,1) 50%, rgba(0,4,12,1) 100%)", minHeight: "100vh" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <CyberGridBackground />

        {/* Deep ambient radial */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)" }}/>

        {/* Section header */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader />

          {/* Alert Ticker */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <AlertTicker />
          </motion.div>

          {/* Main dashboard grid */}
          <motion.div
            className="relative"
            style={{ x: springX, y: springY }}
          >
            {/* ── Row 1: 3 columns ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <RadarPanel />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="md:col-span-1"
              >
                <ThreatFeedPanel />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="md:col-span-2 lg:col-span-1"
              >
                <AIScannerPanel />
              </motion.div>
            </div>

            {/* ── Row 2: Neural Net full + 2 side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
              >
                <NeuralNetworkPanel />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <DeepfakeMonitorPanel />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <QRAnalysisPanel />
                </motion.div>
              </div>
            </div>

            {/* ── Row 3: Stats + Data stream ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
              >
                <AwarenessStatsPanel />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <DataStream />
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom CTA line */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
              style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}>
              <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="font-rajdhani text-sm text-slate-400 font-medium">
                Live intelligence updated every <span className="text-cyan-400 font-semibold">30 seconds</span> · Protected by <span className="text-emerald-400 font-semibold">AEGIS AI Core v4.2</span>
              </span>
              <motion.div className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Edge vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,4,12,0.8) 100%)"
        }}/>
      </section>
    </>
  );
};

export default DashboardPreview;