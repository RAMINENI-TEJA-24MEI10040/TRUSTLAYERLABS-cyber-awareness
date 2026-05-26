// LoadingScreen.tsx — AI Cyber Awareness Command Center
// Stack: React + TypeScript + Tailwind CSS + Framer Motion

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BootPhase {
  id: number;
  label: string;
  sublabel: string;
  duration: number; // ms this phase occupies
  progress: number; // cumulative % at end of phase
}

interface LoadingScreenProps {
  onComplete?: () => void;
  /** total duration in ms; defaults to 5800 */
  totalDuration?: number;
}

// ─── Boot sequence ────────────────────────────────────────────────────────────

const BOOT_PHASES: BootPhase[] = [
  { id: 1, label: "SYSTEM WAKE-UP",               sublabel: "Core cryptographic keys loading…",          duration: 900,  progress: 12  },
  { id: 2, label: "NEURAL DEFENSE GRID ACTIVATING",sublabel: "Threat model weights synchronizing…",      duration: 1100, progress: 30  },
  { id: 3, label: "SCANNING ACTIVE THREAT CHANNELS",sublabel: "Connecting to intelligence relay nodes…", duration: 1000, progress: 52  },
  { id: 4, label: "INITIALIZING THREAT INTELLIGENCE",sublabel: "Phishing · Deepfake · QR vectors mapped…",duration: 1200, progress: 74  },
  { id: 5, label: "SYNCHRONIZING AWARENESS SYSTEMS", sublabel: "AI awareness engine calibrating…",       duration: 900,  progress: 92  },
  { id: 6, label: "CYBER INTELLIGENCE CORE ONLINE",  sublabel: "Command Center ready for deployment.",   duration: 700,  progress: 100 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Subtle animated hex-grid SVG */
const HexGrid = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.055] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="lhex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon
          points="30,4 56,18 56,44 30,56 4,44 4,18"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.7"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lhex)" />
  </svg>
);

/** Fine Cartesian grid */
const CartesianGrid = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="lcart" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
        <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lcart)" />
  </svg>
);

/** Floating ambient particles */
const Particles = ({ count = 34 }: { count?: number }) => {
  const items = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      dur: 8 + Math.random() * 18,
      delay: Math.random() * 10,
      color: i % 4 === 0 ? "#10b981" : i % 4 === 1 ? "#818cf8" : i % 4 === 2 ? "#22d3ee" : "#06b6d4",
      opacity: 0.12 + Math.random() * 0.4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -(28 + Math.random() * 40), 0],
            x: [0, (Math.random() - 0.5) * 24, 0],
            opacity: [p.opacity, p.opacity * 0.2, p.opacity],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/** Horizontal scan line that sweeps top → bottom */
const ScanBeam = ({ triggered }: { triggered: boolean }) => (
  <AnimatePresence>
    {triggered && (
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(to right, transparent, #22d3ee70, #22d3ee, #22d3ee70, transparent)",
          boxShadow: "0 0 18px 4px #22d3ee40",
        }}
        initial={{ top: "-1%" }}
        animate={{ top: "101%" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.2, ease: "linear" }}
      />
    )}
  </AnimatePresence>
);

/** Radar ring set — central rotating sweep */
const RadarCore = ({ progress }: { progress: number }) => {
  const rings = [120, 90, 60, 34];
  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      {/* Static rings */}
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: r * 2,
            height: r * 2,
            borderColor: `rgba(34,211,238,${0.08 + i * 0.04})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.18, duration: 0.5, type: "spring" }}
        />
      ))}

      {/* Rotating sweep arm */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 260 260" className="w-full h-full opacity-40">
          <defs>
            <radialGradient id="sweepGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="80%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <path
            d="M130,130 L130,10 A120,120 0 0,1 230,180 Z"
            fill="url(#sweepGrad)"
          />
          <line
            x1="130" y1="130" x2="130" y2="10"
            stroke="#22d3ee" strokeWidth="1" strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Orbiting data blips */}
      {[0, 60, 140, 220, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 5,
            height: 5,
            background: i % 2 === 0 ? "#22d3ee" : "#10b981",
            boxShadow: `0 0 8px ${i % 2 === 0 ? "#22d3ee" : "#10b981"}`,
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * (rings[i % rings.length] - 10)}px - 2.5px)`,
            top:  `calc(50% + ${Math.sin((deg * Math.PI) / 180) * (rings[i % rings.length] - 10)}px - 2.5px)`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}

      {/* Central core */}
      <div className="absolute flex items-center justify-center" style={{ width: 60, height: 60 }}>
        <motion.div
          className="absolute w-14 h-14 rounded-full border border-cyan-400/30"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-9 h-9 rounded-full border border-cyan-400/50"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        {/* AI icon center */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: "radial-gradient(circle, #0e4f6680, #030910)" }}
          animate={{ boxShadow: ["0 0 12px #22d3ee40", "0 0 28px #22d3ee90", "0 0 12px #22d3ee40"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-cyan-400" fill="currentColor">
            <path d="M10 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 17 11a1 1 0 0 1-2 0 5 5 0 0 0-10 0 1 1 0 0 1-2 0 7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
        </motion.div>
      </div>

      {/* Progress arc */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 260 260"
      >
        <circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke="#22d3ee18"
          strokeWidth="1.5"
        />
        <motion.circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 120}`}
          animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }}
        />
      </svg>
    </div>
  );
};

/** Neural network side visual */
const NeuralSide = ({ side }: { side: "left" | "right" }) => {
  const nodes = side === "left"
    ? [{ x: 80, y: 20 }, { x: 80, y: 50 }, { x: 80, y: 80 }, { x: 50, y: 35 }, { x: 50, y: 65 }, { x: 20, y: 50 }]
    : [{ x: 20, y: 20 }, { x: 20, y: 50 }, { x: 20, y: 80 }, { x: 50, y: 35 }, { x: 50, y: 65 }, { x: 80, y: 50 }];
  const edges = [[0,3],[1,3],[1,4],[2,4],[3,5],[4,5]];

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-25">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#22d3ee" strokeWidth="0.8"
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="3"
          fill="#22d3ee"
          animate={{ r: [2.5, 4, 2.5], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8 + (i % 3) * 0.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
};

/** Segmented progress bar */
const ProgressBar = ({ progress }: { progress: number }) => {
  const segments = 24;
  const filled = Math.round((progress / 100) * segments);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: segments }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1.5 flex-1 rounded-sm"
          animate={{
            background: i < filled
              ? i < filled - 2
                ? "#22d3ee"
                : "#22d3eecc"
              : "#1e293b",
            boxShadow: i < filled && i >= filled - 2
              ? "0 0 6px #22d3ee"
              : "none",
          }}
          transition={{ duration: 0.25 }}
        />
      ))}
    </div>
  );
};

/** Data stream columns — right side */
const DataStream = () => {
  const cols = [
    ["01101001", "SCAN_OK", "NODE_84", "ENCRYPT", "0xAF3C", "VERIFY", "NEURAL", "ACTIVE"],
    ["THREAT_0", "QR_MAP", "ANALYZE", "10110100", "DETECT", "0xBE91", "SYNC_OK", "LEARN"],
    ["PHISH_DB", "0x22CE", "PATTERN", "MATCH_Y", "01001011", "SHIELD", "GUARD_X", "READY"],
  ];
  return (
    <div className="flex gap-3 opacity-20 font-mono text-[9px] text-cyan-400 tracking-wider select-none pointer-events-none overflow-hidden" style={{ maxHeight: 180 }}>
      {cols.map((col, ci) => (
        <motion.div
          key={ci}
          className="flex flex-col gap-1.5"
          animate={{ y: [0, -60] }}
          transition={{ duration: 5 + ci * 1.2, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {[...col, ...col].map((item, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

/** Phase log — terminal style */
const PhaseLog = ({ phases, currentPhase }: { phases: BootPhase[]; currentPhase: number }) => (
  <div className="space-y-1 font-mono text-[10px]">
    {phases.slice(0, currentPhase + 1).map((phase, i) => {
      const done = i < currentPhase;
      const active = i === currentPhase;
      return (
        <motion.div
          key={phase.id}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className={done ? "text-emerald-400" : active ? "text-cyan-400" : "text-slate-600"}>
            {done ? "✓" : active ? "›" : "·"}
          </span>
          <span className={done ? "text-slate-500" : active ? "text-cyan-300" : "text-slate-700"}>
            {phase.label}
          </span>
          {active && (
            <motion.span
              className="inline-block w-1 h-3 bg-cyan-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}
        </motion.div>
      );
    })}
  </div>
);

// ─── LoadingScreen Root ───────────────────────────────────────────────────────

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  totalDuration = 5800,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scanTrigger, setScanTrigger] = useState(0);
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());
  const rafRef = useRef<number>(0);

  // Smooth progress drive
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(elapsed / totalDuration, 1);
      // Ease-in-out feel
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const pct = Math.min(eased * 100, 100);
      setProgress(pct);

      // Phase update
      let phase = 0;
      for (let i = 0; i < BOOT_PHASES.length; i++) {
        if (pct >= (BOOT_PHASES[i - 1]?.progress ?? 0)) phase = i;
      }
      setCurrentPhase(phase);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setCurrentPhase(BOOT_PHASES.length - 1);
        setTimeout(() => {
          setDone(true);
          onComplete?.();
        }, 900);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [totalDuration, onComplete]);

  // Periodic scan beam
  useEffect(() => {
    const t = setInterval(() => setScanTrigger((n) => n + 1), 2800);
    return () => clearInterval(t);
  }, []);

  const currentLabel = BOOT_PHASES[currentPhase]?.label ?? "";
  const currentSub   = BOOT_PHASES[currentPhase]?.sublabel ?? "";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#030910" }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Background ──────────────────────────── */}
          <HexGrid />
          <CartesianGrid />
          <Particles />

          {/* Glow blobs */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: "55vw", height: "55vw",
              maxWidth: 700, maxHeight: 700,
              top: "10%", left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, #0e749010 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: "40vw", height: "40vw",
              maxWidth: 500, maxHeight: 500,
              bottom: "5%", right: "8%",
              background: "radial-gradient(circle, #05302012 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />

          {/* Scan beam */}
          <ScanBeam triggered={scanTrigger > 0} key={scanTrigger} />

          {/* Top + bottom border glow */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, #22d3ee60, transparent)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, #10b98140, transparent)" }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
          />

          {/* ── Layout ───────────────────────────────── */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-10">

            {/* Top bar */}
            <motion.div
              className="w-full flex items-center justify-between text-[10px] font-mono text-slate-600 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span>CLASSIFIED // CYBER-INTEL</span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="text-cyan-600"
              >
                ◈ SYSTEM BOOT SEQUENCE
              </motion.span>
              <span>BUILD 4.1.0-ALPHA</span>
            </motion.div>

            {/* Main row */}
            <div className="w-full flex items-center justify-between gap-6">
              {/* Left neural */}
              <motion.div
                className="hidden lg:block"
                style={{ width: 140, height: 140 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <NeuralSide side="left" />
              </motion.div>

              {/* Center radar core */}
              <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 60 }}
              >
                <RadarCore progress={progress} />

                {/* Identity badge */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.p
                    className="text-[10px] font-mono uppercase tracking-[0.28em] text-cyan-500/60 mb-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    AI Cyber Awareness
                  </motion.p>
                  <h1
                    className="text-xl font-black tracking-tight"
                    style={{
                      fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                      background: "linear-gradient(135deg, #22d3ee 0%, #34d399 60%, #818cf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    COMMAND CENTER
                  </h1>
                </motion.div>
              </motion.div>

              {/* Right neural + data stream */}
              <motion.div
                className="hidden lg:flex flex-col items-end gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div style={{ width: 140, height: 140 }}>
                  <NeuralSide side="right" />
                </div>
                <DataStream />
              </motion.div>
            </div>

            {/* Phase label */}
            <motion.div className="w-full max-w-lg text-center" layout>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-sm font-mono font-bold tracking-[0.15em] text-cyan-300 uppercase mb-1">
                    {currentLabel}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 tracking-wider">
                    {currentSub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Progress bar + % */}
            <motion.div
              className="w-full max-w-lg space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mb-1">
                <span className="tracking-widest uppercase">Initialization</span>
                <motion.span
                  className="text-cyan-400 font-bold"
                  key={Math.round(progress)}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
              <ProgressBar progress={progress} />
            </motion.div>

            {/* Phase log (terminal) */}
            <motion.div
              className="w-full max-w-lg rounded-xl border border-cyan-500/10 bg-[#040c18]/70 backdrop-blur-xl p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-3 border-b border-cyan-500/10 pb-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-500/50">
                  Boot Log // Secure Channel
                </span>
              </div>
              <PhaseLog phases={BOOT_PHASES} currentPhase={currentPhase} />
            </motion.div>

            {/* Bottom corner info */}
            <motion.div
              className="w-full flex items-center justify-between text-[9px] font-mono text-slate-700 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span>ENCRYPTION: AES-256</span>
              <motion.span
                className="text-cyan-700"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ◉ SECURE CHANNEL ACTIVE
              </motion.span>
              <span>NODE: CYB-INTEL-07</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;