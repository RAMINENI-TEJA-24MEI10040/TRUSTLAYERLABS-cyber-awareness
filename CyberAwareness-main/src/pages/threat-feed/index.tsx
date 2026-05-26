import {
  ShieldAlert,
  Globe,
  Bug,
  AlertTriangle,
  Activity,
  Radio,
  Cpu,
  Eye,
  Wifi,
  Zap,
  Target,
  Lock,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";

import { getLiveThreats } from "../../services/phishingFeeds";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Threat {
  title: string;
  severity: string;
  source: string;
  type: string;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const SEVERITY_CONFIG: Record<
  string,
  { glow: string; badge: string; bar: string; pulse: string; rank: number }
> = {
  LOW: {
    glow: "rgba(34,197,94,0.15)",
    badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    bar: "bg-emerald-500",
    pulse: "bg-emerald-400",
    rank: 1,
  },
  MEDIUM: {
    glow: "rgba(234,179,8,0.18)",
    badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    bar: "bg-yellow-400",
    pulse: "bg-yellow-400",
    rank: 2,
  },
  HIGH: {
    glow: "rgba(249,115,22,0.2)",
    badge: "text-orange-400 border-orange-500/40 bg-orange-500/10",
    bar: "bg-orange-500",
    pulse: "bg-orange-400",
    rank: 3,
  },
  CRITICAL: {
    glow: "rgba(239,68,68,0.25)",
    badge: "text-red-400 border-red-500/40 bg-red-500/10",
    bar: "bg-red-500",
    pulse: "bg-red-500",
    rank: 4,
  },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  Phishing: ShieldAlert,
  "QR Scam": AlertTriangle,
  Malware: Bug,
  Fraud: Globe,
  Deepfake: Eye,
  UPI: Zap,
  AI: Cpu,
  Default: Activity,
};

const FILTER_OPTIONS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

/* ─────────────────────────────────────────────
   Animated Cyber Grid Background
───────────────────────────────────────────── */
function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#020b18]" />

      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Diagonal accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={`${i * 9}%`} y1="0"
            x2={`${i * 9 + 15}%`} y2="100%"
            stroke="#00e5ff" strokeWidth="0.4"
          />
        ))}
      </svg>

      {/* Radial glow top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(ellipse, rgba(0,229,255,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Bottom red threat glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10"
        style={{
          background: "radial-gradient(ellipse, rgba(239,68,68,0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Scan line overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.012) 2px, rgba(0,229,255,0.012) 4px)",
        }}
        animate={{ backgroundPositionY: ["0px", "8px"] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Radar Sweep Widget
───────────────────────────────────────────── */
function RadarSweep({ threatCount }: { threatCount: number }) {
  const angleRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = canvas;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 4;

    ctx.clearRect(0, 0, w, h);

    // Rings
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,229,255,${0.08 + i * 0.02})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Cross hairs
    ctx.strokeStyle = "rgba(0,229,255,0.06)";
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();

    const sweepAngle = angleRef.current;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepAngle);

    const grad = ctx.createLinearGradient(0, 0, r, 0);
    grad.addColorStop(0, "rgba(0,229,255,0.4)");
    grad.addColorStop(1, "rgba(0,229,255,0)");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -Math.PI / 8, Math.PI / 8);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Blip dots (threat count driven)
    const blips = Array.from({ length: Math.min(threatCount, 6) }, (_, i) => ({
      angle: (i * 1.3 + 0.5) * Math.PI,
      dist: 0.3 + ((i * 0.618) % 0.6),
    }));
    blips.forEach((b) => {
      const bx = cx + Math.cos(b.angle) * b.dist * r;
      const by = cy + Math.sin(b.angle) * b.dist * r;
      const alpha = 0.4 + 0.6 * Math.max(0, Math.cos(sweepAngle - b.angle));
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fill();
    });

    angleRef.current += 0.02;
  });

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={160}
      className="opacity-80"
    />
  );
}

/* ─────────────────────────────────────────────
   Live Pulse Dot
───────────────────────────────────────────── */
function PulseDot({ color = "bg-cyan-400", size = "w-2 h-2" }: { color?: string; size?: string }) {
  return (
    <span className="relative inline-flex">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50`} />
      <span className={`relative inline-flex rounded-full ${size} ${color}`} />
    </span>
  );
}

/* ─────────────────────────────────────────────
   Signal Ticker at the very top
───────────────────────────────────────────── */
function SignalTicker({ threats }: { threats: Threat[] }) {
  const items = threats.length > 0
    ? threats.map((t) => `[${t.severity}] ${t.title} — ${t.source}`)
    : ["SYSTEM INITIALIZING… SCANNING THREAT FEEDS…"];

  const content = [...items, ...items].join("   ///   ");

  return (
    <div className="relative overflow-hidden bg-[#00e5ff]/5 border-b border-cyan-500/20 py-1.5 text-[11px] font-mono text-cyan-400/70 select-none">
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {content}
      </motion.div>
      {/* edge fades */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#020b18] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#020b18] to-transparent pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat Panel
───────────────────────────────────────────── */
function StatPanel({
  label,
  value,
  accent,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  accent: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Glow behind panel */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: accent }}
      />
      <div
        className="relative rounded-2xl border p-5 backdrop-blur-md overflow-hidden"
        style={{
          background: "rgba(8,20,40,0.8)",
          borderColor: `${accent.replace("0.2", "0.3")}`,
        }}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{ background: `radial-gradient(circle at top right, ${accent}, transparent)` }}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">{label}</p>
            <motion.p
              key={String(value)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black tracking-tight"
              style={{ color: accent.includes("229,255") ? "#00e5ff" : accent.includes("239,68") ? "#ef4444" : accent.includes("234,179") ? "#eab308" : "#22c55e" }}
            >
              {value}
            </motion.p>
          </div>
          <div
            className="p-2 rounded-lg opacity-60"
            style={{ background: `${accent.replace("0.2", "0.08")}` }}
          >
            <Icon className="w-5 h-5" style={{ color: accent.includes("229,255") ? "#00e5ff" : accent.includes("239,68") ? "#ef4444" : accent.includes("234,179") ? "#eab308" : "#22c55e" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Threat Intelligence Card
───────────────────────────────────────────── */
function ThreatCard({ threat, index }: { threat: Threat; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cfg = SEVERITY_CONFIG[threat.severity] ?? SEVERITY_CONFIG.LOW;
  const Icon = TYPE_ICONS[threat.type] ?? TYPE_ICONS.Default;
  const severityWidth =
    cfg.rank === 1 ? "25%" : cfg.rank === 2 ? "50%" : cfg.rank === 3 ? "75%" : "100%";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-default"
    >
      {/* Glow halo */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -inset-px rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${cfg.glow}, transparent 70%)`,
              filter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="relative rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-300"
        style={{
          background: hovered
            ? "rgba(8,20,40,0.95)"
            : "rgba(6,15,30,0.85)",
          borderColor: hovered
            ? cfg.glow.replace("0.15", "0.45").replace("0.18", "0.45").replace("0.2", "0.45").replace("0.25", "0.55")
            : "rgba(30,50,80,0.5)",
        }}
      >
        {/* Top scan line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `linear-gradient(90deg, transparent, ${cfg.glow.replace("0.15", "0.8")}, transparent)` }}
        />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">

            {/* Icon block */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={hovered ? { scale: 1.08 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${cfg.glow.replace("0.15", "0.2")}, rgba(0,0,0,0))`,
                  border: `1px solid ${cfg.glow.replace("0.15", "0.3")}`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: cfg.bar.includes("emerald") ? "#22c55e" : cfg.bar.includes("yellow") ? "#eab308" : cfg.bar.includes("orange") ? "#f97316" : "#ef4444" }} />
                {/* Corner blip */}
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#020b18] ${cfg.pulse}`} />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Intelligence ID */}
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">
                INTEL #{String(index + 1).padStart(4, "0")} · {threat.type} · {threat.source}
              </p>

              <h3 className="text-lg font-bold text-white leading-snug mb-3 truncate pr-4">
                {threat.title}
              </h3>

              {/* Severity bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-[160px] h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: severityWidth }}
                    transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {cfg.rank}/4 THREAT LEVEL
                </span>
              </div>
            </div>

            {/* Severity badge */}
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <PulseDot
                  color={cfg.pulse}
                  size="w-1.5 h-1.5"
                />
                <span className={`text-[11px] font-black font-mono uppercase tracking-[0.18em] px-3 py-1.5 rounded-lg border ${cfg.badge}`}>
                  {threat.severity}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 text-right">
                LIVE MONITORING
              </span>
            </div>
          </div>
        </div>

        {/* Bottom data strip */}
        <motion.div
          className="px-6 py-2 border-t flex items-center gap-4"
          style={{ borderColor: "rgba(30,50,80,0.4)", background: "rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
            <Radio className="w-2.5 h-2.5 text-cyan-500/50" />
            SIGNAL ACTIVE
          </div>
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${cfg.glow.replace("0.15", "0.5")}, transparent)`,
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-700">
            SRC: {threat.source}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Filter Bar
───────────────────────────────────────────── */
function FilterBar({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (f: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((f) => (
        <motion.button
          key={f}
          onClick={() => onChange(f)}
          whileTap={{ scale: 0.95 }}
          className="relative px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none"
          style={{
            background: active === f ? "rgba(0,229,255,0.12)" : "rgba(8,20,40,0.6)",
            border: active === f ? "1px solid rgba(0,229,255,0.4)" : "1px solid rgba(30,50,80,0.5)",
            color: active === f ? "#00e5ff" : "#4b6a8a",
          }}
        >
          {active === f && (
            <motion.div
              layoutId="filterHighlight"
              className="absolute inset-0 rounded-lg"
              style={{ background: "rgba(0,229,255,0.06)" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">
            {f}
            {counts[f] !== undefined && (
              <span className="ml-1.5 opacity-60">({counts[f]})</span>
            )}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Loading State
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-500/30"
            animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">
          Initializing threat intelligence feed…
        </p>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-mono text-slate-600 mt-1"
        >
          SCANNING ACTIVE NETWORKS
        </motion.p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ThreatFeedPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tick, setTick] = useState(0);

  // ── Fetch (preserving existing data flow) ──
  useEffect(() => {
    async function fetchThreats() {
      const data = await getLiveThreats();
      setThreats(data);
      setLoading(false);
    }
    fetchThreats();
  }, []);

  // ── Live clock tick ──
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Filtering ──
  const filtered = filter === "ALL" ? threats : threats.filter((t) => t.severity === filter);

  const counts: Record<string, number> = { ALL: threats.length };
  FILTER_OPTIONS.filter((f) => f !== "ALL").forEach((f) => {
    counts[f] = threats.filter((t) => t.severity === f).length;
  });

  const criticalCount = threats.filter((t) => t.severity === "CRITICAL").length;
  const phishingCount = threats.filter((t) => t.type === "Phishing").length;

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      {/* ── Background ── */}
      <CyberGrid />

      {/* ── Signal Ticker (above header) ── */}
      <div className="relative z-20 pt-28">
        <SignalTicker threats={threats} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">

        {/* ══ HEADER BLOCK ══ */}
        <div className="py-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

          {/* Left: Titles */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-1"
            >
              <PulseDot color="bg-red-500" size="w-2 h-2" />
              <span className="text-[11px] font-mono text-red-400 uppercase tracking-[0.25em]">
                LIVE · THREAT INTELLIGENCE CENTER
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-3"
              style={{
                fontFamily: "'Geist', 'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #ffffff 0%, #00e5ff 50%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CYBER<br />THREAT FEED
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-slate-400 text-sm font-mono max-w-lg"
            >
              Real-time phishing campaigns · malware activity · AI scam trends ·
              deepfake alerts · UPI fraud intelligence · public cyber safety broadcasts
            </motion.p>
          </div>

          {/* Right: Radar + uptime */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="relative p-3 rounded-2xl border"
              style={{
                background: "rgba(0,229,255,0.04)",
                borderColor: "rgba(0,229,255,0.15)",
              }}
            >
              <RadarSweep threatCount={threats.length} />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-[9px] font-mono text-cyan-500/50 tracking-widest">
                  SCAN ACTIVE
                </span>
              </div>
            </div>
            <motion.p
              key={tick}
              className="text-[10px] font-mono text-slate-600 tracking-widest"
            >
              {new Date().toLocaleTimeString("en-IN", { hour12: false })} IST
            </motion.p>
          </motion.div>
        </div>

        {/* ══ STATS ROW ══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatPanel
            label="Active Threats"
            value={loading ? "—" : threats.length}
            accent="rgba(0,229,255,0.2)"
            icon={Activity}
            delay={0.15}
          />
          <StatPanel
            label="Critical Alerts"
            value={loading ? "—" : criticalCount}
            accent="rgba(239,68,68,0.2)"
            icon={ShieldAlert}
            delay={0.22}
          />
          <StatPanel
            label="Phishing Domains"
            value={loading ? "—" : phishingCount}
            accent="rgba(234,179,8,0.2)"
            icon={Globe}
            delay={0.29}
          />
          <StatPanel
            label="Network Status"
            value="STABLE"
            accent="rgba(34,197,94,0.2)"
            icon={Lock}
            delay={0.36}
          />
        </div>

        {/* ══ COMMAND BAR ══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 p-4 rounded-xl border"
          style={{
            background: "rgba(6,15,30,0.7)",
            borderColor: "rgba(0,229,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4 text-cyan-500/60" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              Filter by severity
            </span>
          </div>
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </motion.div>

        {/* ══ THREAT FEED ══ */}
        {loading ? (
          <LoadingState />
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <p className="text-slate-600 font-mono text-sm">
                  NO THREATS MATCHING CURRENT FILTER
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filtered.map((threat, index) => (
                  <ThreatCard key={`${filter}-${index}`} threat={threat} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ══ FOOTER STRIP ══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center justify-between pt-6 border-t"
          style={{ borderColor: "rgba(0,229,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <PulseDot color="bg-cyan-500" size="w-1.5 h-1.5" />
            <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
              Cyber Intelligence Network · Active Monitoring
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-700">
            {filtered.length} SIGNALS TRACKED
          </span>
        </motion.div>
      </div>
    </div>
  );
}