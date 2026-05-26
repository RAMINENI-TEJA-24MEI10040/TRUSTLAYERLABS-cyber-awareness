// Hero.tsx — AI Cyber Awareness Command Center
// Stack: React + TypeScript + Tailwind CSS + Framer Motion

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThreatNode {
  id: number;
  x: number;
  y: number;
  type: "phishing" | "deepfake" | "qr" | "scam" | "malware";
  severity: "low" | "medium" | "high" | "critical";
  label: string;
  pulseDelay: number;
}

interface CyberParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

interface IntelAlert {
  id: number;
  message: string;
  type: "warning" | "info" | "critical" | "detected";
  timestamp: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const THREAT_NODES: ThreatNode[] = [
  { id: 1, x: 22, y: 18, type: "phishing", severity: "critical", label: "Phishing Spike", pulseDelay: 0 },
  { id: 2, x: 68, y: 28, type: "deepfake", severity: "high", label: "Deepfake Activity", pulseDelay: 0.6 },
  { id: 3, x: 45, y: 55, type: "qr", severity: "medium", label: "QR Scam Vector", pulseDelay: 1.2 },
  { id: 4, x: 80, y: 62, type: "scam", severity: "high", label: "Voice Scam", pulseDelay: 0.3 },
  { id: 5, x: 15, y: 70, type: "malware", severity: "low", label: "Malware Pattern", pulseDelay: 0.9 },
  { id: 6, x: 58, y: 15, type: "phishing", severity: "medium", label: "Email Lure", pulseDelay: 1.5 },
  { id: 7, x: 35, y: 82, type: "deepfake", severity: "critical", label: "AI Impersonation", pulseDelay: 0.4 },
  { id: 8, x: 88, y: 40, type: "qr", severity: "high", label: "QR Hijack", pulseDelay: 1.1 },
];

const INTEL_ALERTS: IntelAlert[] = [
  { id: 1, message: "Phishing wave detected across 12 regions", type: "critical", timestamp: "just now" },
  { id: 2, message: "Deepfake impersonation pattern emerging", type: "warning", timestamp: "2m ago" },
  { id: 3, message: "QR code scam cluster — public spaces", type: "warning", timestamp: "4m ago" },
  { id: 4, message: "AI voice clone scam intercepted", type: "detected", timestamp: "7m ago" },
  { id: 5, message: "SMS phishing surge — banking sector", type: "critical", timestamp: "11m ago" },
  { id: 6, message: "Social engineering playbook flagged", type: "info", timestamp: "15m ago" },
];

const SEVERITY_COLORS: Record<ThreatNode["severity"], { ring: string; dot: string; glow: string }> = {
  critical: { ring: "border-red-400", dot: "bg-red-400", glow: "shadow-red-500/60" },
  high:     { ring: "border-amber-400", dot: "bg-amber-400", glow: "shadow-amber-500/60" },
  medium:   { ring: "border-cyan-400", dot: "bg-cyan-400", glow: "shadow-cyan-500/50" },
  low:      { ring: "border-emerald-400", dot: "bg-emerald-400", glow: "shadow-emerald-500/40" },
};

const ALERT_COLORS: Record<IntelAlert["type"], string> = {
  critical: "text-red-400 border-red-500/40 bg-red-500/5",
  warning:  "text-amber-400 border-amber-500/40 bg-amber-500/5",
  detected: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5",
  info:     "text-cyan-400 border-cyan-500/40 bg-cyan-500/5",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const HexGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
        <polygon
          points="28,4 52,16 52,40 28,52 4,40 4,16"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.8"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

const CyberGridLines = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const RadarSweep = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative w-full h-full">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "120%", height: "120%", maxWidth: 700, maxHeight: 700 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 600 600" className="w-full h-full opacity-20">
          <defs>
            <radialGradient id="radarGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.0" />
              <stop offset="85%" stopColor="#22d3ee" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
            </radialGradient>
            <mask id="radarMask">
              <path
                d="M300,300 L300,0 A300,300 0 0,1 580,380 Z"
                fill="white"
              />
            </mask>
          </defs>
          <circle cx="300" cy="300" r="298" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="200" fill="none" stroke="#22d3ee" strokeWidth="0.3" />
          <circle cx="300" cy="300" r="100" fill="none" stroke="#22d3ee" strokeWidth="0.3" />
          <path
            d="M300,300 L300,0 A300,300 0 0,1 580,380 Z"
            fill="url(#radarGrad)"
            mask="url(#radarMask)"
          />
          <line x1="300" y1="0" x2="300" y2="600" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="4 8" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="4 8" />
        </svg>
      </motion.div>
    </div>
  </div>
);

const NeuralNetwork = () => {
  const nodes = [
    { x: 10, y: 30 }, { x: 10, y: 55 }, { x: 10, y: 80 },
    { x: 38, y: 18 }, { x: 38, y: 42 }, { x: 38, y: 66 }, { x: 38, y: 88 },
    { x: 65, y: 30 }, { x: 65, y: 58 }, { x: 65, y: 78 },
    { x: 90, y: 45 }, { x: 90, y: 70 },
  ];
  const edges = [
    [0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],
    [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,9],
    [7,10],[7,11],[8,10],[8,11],[9,11],
  ];
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="xMidYMid meet">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#22d3ee"
          strokeWidth="0.3"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 2 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="1.5"
          fill="#22d3ee"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], r: [1.5, 2.2, 1.5] }}
          transition={{ duration: 1.8 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
};

const FloatingParticles = () => {
  const particles: CyberParticle[] = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    speed: 6 + Math.random() * 16,
    opacity: 0.15 + Math.random() * 0.5,
    angle: Math.random() * 360,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "#22d3ee" : p.id % 3 === 1 ? "#10b981" : "#818cf8",
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const GlobeSphere = () => {
  const lines = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        style={{ width: "min(55%, 340px)", aspectRatio: "1" }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full" style={{ filter: "drop-shadow(0 0 24px #22d3ee55)" }}>
          <defs>
            <radialGradient id="globeGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#164e63" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0f1e" stopOpacity="0.95" />
            </radialGradient>
            <clipPath id="globeClip">
              <circle cx="150" cy="150" r="130" />
            </clipPath>
          </defs>
          <circle cx="150" cy="150" r="130" fill="url(#globeGrad)" />
          <circle cx="150" cy="150" r="130" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
          {lines.map((i) => (
            <ellipse
              key={i}
              cx="150" cy="150"
              rx={130 * Math.abs(Math.cos((i * Math.PI) / lines.length))}
              ry="130"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.4"
              opacity="0.25"
              clipPath="url(#globeClip)"
            />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((frac, i) => (
            <ellipse
              key={i}
              cx="150" cy="150"
              rx="130"
              ry={130 * Math.abs(Math.cos(frac * Math.PI))}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.4"
              opacity="0.25"
              clipPath="url(#globeClip)"
            />
          ))}
          {[
            { cx: 105, cy: 115 }, { cx: 185, cy: 130 },
            { cx: 140, cy: 180 }, { cx: 200, cy: 170 },
            { cx: 80, cy: 165 }, { cx: 160, cy: 100 },
          ].map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx} cy={dot.cy} r="3"
              fill="#22d3ee"
              initial={{ opacity: 0.3, r: 2 }}
              animate={{ opacity: [0.3, 1, 0.3], r: [2, 4, 2] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          ))}
          <motion.circle
            cx="150" cy="150" r="130"
            fill="none"
            stroke="url(#globeGlow)"
            strokeWidth="2"
            opacity="0.4"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

const ThreatNodeMarker = ({ node }: { node: ThreatNode }) => {
  const [hovered, setHovered] = useState(false);
  const colors = SEVERITY_COLORS[node.severity];
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: node.pulseDelay + 0.5, duration: 0.4, type: "spring" }}
    >
      <motion.div
        className={`w-3 h-3 rounded-full border ${colors.ring} ${colors.dot} shadow-lg ${colors.glow}`}
        animate={{ scale: [1, 1.3, 1], boxShadow: ["0 0 6px 0px", "0 0 14px 4px", "0 0 6px 0px"] }}
        transition={{ duration: 2, repeat: Infinity, delay: node.pulseDelay, ease: "easeInOut" }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-5 top-0 z-50 whitespace-nowrap px-2.5 py-1.5 rounded-md border border-cyan-500/30 bg-[#050d1a]/90 backdrop-blur-md text-xs text-cyan-300 font-mono"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
          >
            <span className={`font-bold uppercase text-[10px] tracking-wider ${
              node.severity === "critical" ? "text-red-400" :
              node.severity === "high" ? "text-amber-400" :
              node.severity === "medium" ? "text-cyan-400" : "text-emerald-400"
            }`}>{node.severity}</span>
            <span className="ml-1.5 text-slate-300">{node.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const IntelFeed = () => {
  const [visibleAlerts, setVisibleAlerts] = useState<IntelAlert[]>(INTEL_ALERTS.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleAlerts((current) => {
        const prevIndex = INTEL_ALERTS.indexOf(current[0] ?? INTEL_ALERTS[0]);
        const next = (prevIndex + 1) % INTEL_ALERTS.length;
        return [
          INTEL_ALERTS[next],
          ...INTEL_ALERTS.slice(0, 3).filter((_, i) => i < 3),
        ].slice(0, 4);
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-cyan-500/20 bg-[#040c18]/80 backdrop-blur-xl p-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-2.5 border-b border-cyan-500/10 pb-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-red-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70">Live Intel Feed</span>
        <span className="ml-auto text-[10px] font-mono text-slate-500">ENCRYPTED · REALTIME</span>
      </div>
      <div className="space-y-1.5 overflow-hidden max-h-24">
        <AnimatePresence mode="popLayout">
          {visibleAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              className={`flex items-start gap-2 px-2 py-1.5 rounded-md border text-[11px] font-mono ${ALERT_COLORS[alert.type]}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              layout
              transition={{ duration: 0.3 }}
            >
              <span className="shrink-0 mt-0.5">
                {alert.type === "critical" ? "⚠" : alert.type === "warning" ? "◈" : alert.type === "detected" ? "✓" : "◉"}
              </span>
              <span className="flex-1 text-slate-300">{alert.message}</span>
              <span className="shrink-0 text-slate-600 text-[10px]">{alert.timestamp}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HoloPanel = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-xl border border-cyan-500/20 bg-[#040c18]/70 backdrop-blur-xl ${className}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
  >
    {children}
  </motion.div>
);

const ThreatMeter = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-mono text-slate-400">
      <span>{label}</span>
      <span className={color}>{value}%</span>
    </div>
    <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
      />
    </div>
  </div>
);

const CyberScene = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const offsetX = (mouseX - 0.5) * 18;
  const offsetY = (mouseY - 0.5) * 12;

  return (
    <div ref={sceneRef} className="relative w-full h-full overflow-hidden rounded-2xl" style={{ minHeight: 580 }}>
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-[#030910]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 60% 40%, #0e4f6620 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 30% 70%, #05302020 0%, transparent 60%)",
        }}
      />

      {/* Static layers */}
      <CyberGridLines />
      <HexGrid />
      <FloatingParticles />

      {/* Parallax group */}
      <motion.div
        className="absolute inset-0"
        style={{ x: offsetX * 0.6, y: offsetY * 0.6 }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      >
        <GlobeSphere />
        <RadarSweep />
      </motion.div>

      {/* Neural network — deeper parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ x: offsetX * 0.3, y: offsetY * 0.3 }}
        transition={{ type: "spring", stiffness: 40, damping: 16 }}
      >
        <NeuralNetwork />
      </motion.div>

      {/* Threat nodes */}
      <motion.div
        className="absolute inset-0"
        style={{ x: offsetX * 0.8, y: offsetY * 0.8 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {THREAT_NODES.map((node) => (
          <ThreatNodeMarker key={node.id} node={node} />
        ))}
      </motion.div>

      {/* Floating connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {[
          { x1: "22%", y1: "18%", x2: "45%", y2: "55%" },
          { x1: "68%", y1: "28%", x2: "45%", y2: "55%" },
          { x1: "45%", y1: "55%", x2: "80%", y2: "62%" },
          { x1: "15%", y1: "70%", x2: "45%", y2: "55%" },
          { x1: "58%", y1: "15%", x2: "68%", y2: "28%" },
          { x1: "35%", y1: "82%", x2: "80%", y2: "62%" },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke="#22d3ee"
            strokeWidth="0.6"
            strokeDasharray="4 6"
            animate={{ opacity: [0.1, 0.6, 0.1], strokeDashoffset: [0, -40] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
          />
        ))}
      </svg>

      {/* Top-right holo panel: threat summary */}
      <HoloPanel className="top-4 right-4 p-3 w-44" delay={0.6}>
        <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-500/60 mb-2 flex items-center gap-1.5">
          <motion.span
            className="w-1 h-1 rounded-full bg-emerald-400 inline-block"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          THREAT INDEX
        </div>
        <div className="space-y-2.5">
          <ThreatMeter label="Phishing" value={78} color="text-red-400" />
          <ThreatMeter label="Deepfakes" value={61} color="text-amber-400" />
          <ThreatMeter label="QR Scams" value={44} color="text-cyan-400" />
          <ThreatMeter label="Voice AI" value={55} color="text-violet-400" />
        </div>
      </HoloPanel>

      {/* Top-left holo panel: AI status */}
      <HoloPanel className="top-4 left-4 p-3 w-40" delay={0.8}>
        <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-500/60 mb-2">AI GUARDIAN</div>
        <motion.div
          className="text-2xl font-bold text-emerald-400 font-mono leading-none"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ACTIVE
        </motion.div>
        <div className="mt-1.5 space-y-1">
          {["Scanning", "Analyzing", "Learning"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <motion.div
                className="w-1 h-1 rounded-full bg-emerald-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              />
              {s}
            </div>
          ))}
        </div>
      </HoloPanel>

      {/* Right-side middle panel: scan info */}
      <HoloPanel className="right-4 top-1/2 -translate-y-1/2 p-3 w-40" delay={1.0}>
        <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-500/60 mb-2">VECTORS MAPPED</div>
        {[
          { label: "Phishing URLs", count: "12.4K" },
          { label: "Fake Domains", count: "3.1K" },
          { label: "Deepfake Clips", count: "847" },
          { label: "QR Traps", count: "1.9K" },
        ].map(({ label, count }) => (
          <div key={label} className="flex justify-between text-[10px] font-mono py-0.5 border-b border-slate-800/60 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="text-cyan-400">{count}</span>
          </div>
        ))}
      </HoloPanel>

      {/* Intelligence feed at bottom */}
      <IntelFeed />

      {/* Glow orb center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "42%",
          paddingTop: "42%",
          background: "radial-gradient(circle, #22d3ee08 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// ─── Left side ────────────────────────────────────────────────────────────────

const Eyebrow = () => (
  <motion.div
    className="flex items-center gap-2 mb-6"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
  >
    <motion.div
      className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400"
      animate={{ scaleX: [0, 1] }}
      transition={{ delay: 0.4, duration: 0.5 }}
    />
    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400/80 font-medium">
      AI Cyber Intelligence
    </span>
    <motion.div
      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    />
    <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-emerald-400/70">
      Command Center
    </span>
  </motion.div>
);

const Headline = () => (
  <motion.div
    className="mb-6 space-y-1"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.7 }}
  >
    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08]" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}>
      <span className="block text-white">Stay Aware.</span>
      <span
        className="block"
        style={{
          background: "linear-gradient(135deg, #22d3ee 0%, #34d399 60%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Stay Protected.
      </span>
      <span className="block text-slate-300 text-3xl sm:text-4xl xl:text-5xl font-semibold mt-1">
        Stay in Control.
      </span>
    </h1>
  </motion.div>
);

const SubCopy = () => (
  <motion.p
    className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mb-8 font-light"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    AI-powered threat intelligence that helps you recognize phishing, deepfakes, QR scams, and social
    engineering — before they reach you. Real awareness. Real protection.
  </motion.p>
);

const CTAButtons = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-wrap gap-3 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.6 }}
    >
      <motion.button
        type="button"
        onClick={() => navigate("/threat-feed")}
        className="group relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #0e7490 0%, #0d9488 100%)",
          boxShadow: "0 0 30px #22d3ee30, 0 2px 12px #00000040",
        }}
        whileHover={{ scale: 1.04, boxShadow: "0 0 40px #22d3ee50, 0 2px 18px #00000060" }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "linear-gradient(135deg, #0891b2 0%, #0f766e 100%)" }}
        />
        <span className="relative text-white">Enter the Command Center</span>
        <motion.span
          className="relative text-cyan-200 text-lg pointer-events-none"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => navigate("/awareness")}
        className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-cyan-300 border border-cyan-500/25 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span>Learn the Threats</span>
      </motion.button>
    </motion.div>
  );
};

const TrustIndicators = () => {
  const indicators = [
    { icon: "⬡", label: "AI-powered detection", color: "text-cyan-400" },
    { icon: "◈", label: "Real-time threat mapping", color: "text-emerald-400" },
    { icon: "◎", label: "Human-first awareness", color: "text-violet-400" },
  ];
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-4 sm:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.85, duration: 0.6 }}
    >
      {indicators.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex items-center gap-2 text-sm text-slate-400"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85 + i * 0.1, duration: 0.4 }}
        >
          <span className={`text-base ${item.color}`}>{item.icon}</span>
          <span>{item.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const AwarenessJourney = () => {
  const steps = ["Detect", "Understand", "Learn", "Protect", "Act"];
  return (
    <motion.div
      className="mt-10 pt-8 border-t border-slate-800/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.6 }}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-3">The Awareness Cycle</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <motion.div
              className="px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/20 bg-cyan-500/5 text-cyan-300/80"
              animate={{ borderColor: ["rgba(34,211,238,0.2)", "rgba(34,211,238,0.5)", "rgba(34,211,238,0.2)"] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            >
              {step}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                className="text-slate-700 text-xs"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
              >
                →
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Hero Root ────────────────────────────────────────────────────────────────

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);
  const smoothX = useSpring(rawMouseX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(rawMouseY, { stiffness: 60, damping: 18 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rawMouseX.set(x);
    rawMouseY.set(y);
    setMousePos({ x, y });
  }, [rawMouseX, rawMouseY]);

  // Sync spring values to state for child components
  useEffect(() => {
    const unsubX = smoothX.on("change", (v) => setMousePos((prev) => ({ ...prev, x: v })));
    const unsubY = smoothY.on("change", (v) => setMousePos((prev) => ({ ...prev, y: v })));
    return () => { unsubX(); unsubY(); };
  }, [smoothX, smoothY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center"
      style={{ background: "#030910" }}
    >
      {/* Global background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient glow blobs */}
        <motion.div
          className="absolute top-[-10%] left-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0e7490 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #064e3b 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], x: [0, -15, 0], y: [0, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
        <CyberGridLines />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-12 xl:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: messaging */}
          <div className="flex flex-col">
            <Eyebrow />
            <Headline />
            <SubCopy />
            <CTAButtons />
            <TrustIndicators />
            <AwarenessJourney />
          </div>

          {/* Right: cyber scene */}
          <motion.div
            className="relative"
            style={{ minHeight: 580 }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, type: "spring", stiffness: 50 }}
          >
            {/* Outer glow border */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none z-10"
              style={{
                background: "linear-gradient(135deg, #22d3ee15, #10b98115, #818cf810)",
                boxShadow: "0 0 60px #22d3ee18, inset 0 0 40px #22d3ee08",
              }}
            />
            <CyberScene mouseX={mousePos.x} mouseY={mousePos.y} />
          </motion.div>
        </div>
      </div>

      {/* Bottom scan line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Hero;