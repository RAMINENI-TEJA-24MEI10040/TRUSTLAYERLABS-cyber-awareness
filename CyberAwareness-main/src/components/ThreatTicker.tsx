"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, useAnimationFrame } from "framer-motion";

// ─────────────────────────────────────────────
// SOUND ARCHITECTURE — ready for future audio integration
// ─────────────────────────────────────────────
export type SoundEvent =
  | "radar_ping"
  | "alert_pulse"
  | "holographic_transmission"
  | "signal_interference"
  | "warning_tone"
  | "data_sync";

export interface SoundConfig {
  enabled: boolean;
  volume: number; // 0–1
  onTrigger?: (event: SoundEvent) => void;
}

const defaultSoundConfig: SoundConfig = {
  enabled: false,
  volume: 0.4,
  onTrigger: undefined,
};

// Hook — wire up real Web Audio API here later
function useSoundSystem(config: SoundConfig = defaultSoundConfig) {
  const trigger = useCallback(
    (event: SoundEvent) => {
      if (!config.enabled) return;
      config.onTrigger?.(event);
      // Future: play AudioBuffer from a preloaded SoundBank
    },
    [config]
  );
  return { trigger };
}

// ─────────────────────────────────────────────
// ALERT DATA
// ─────────────────────────────────────────────
export type ThreatLevel = "critical" | "high" | "medium" | "advisory";

export interface ThreatAlert {
  id: string;
  message: string;
  level: ThreatLevel;
  tag: string;
  source: string;
  timestamp: string;
}

const THREAT_ALERTS: Omit<ThreatAlert, "timestamp">[] = [
  {
    id: "T001",
    message: "Deepfake impersonation activity increasing across social platforms",
    level: "critical",
    tag: "DEEPFAKE",
    source: "AI-INTEL",
  },
  {
    id: "T002",
    message: "Phishing links targeting students detected — verify before clicking",
    level: "high",
    tag: "PHISHING",
    source: "EDU-WATCH",
  },
  {
    id: "T003",
    message: "QR payment scam campaign active in metro regions",
    level: "critical",
    tag: "QR-SCAM",
    source: "FIN-ALERT",
  },
  {
    id: "T004",
    message: "AI-generated fraud calls rising — verify caller identity",
    level: "high",
    tag: "VOICE-AI",
    source: "TELECOM",
  },
  {
    id: "T005",
    message: "Suspicious UPI clone websites detected — use official apps only",
    level: "critical",
    tag: "UPI-FRAUD",
    source: "CYBER-OPS",
  },
  {
    id: "T006",
    message: "Cyber awareness broadcast active — threat intelligence synchronized",
    level: "advisory",
    tag: "BROADCAST",
    source: "COMMAND",
  },
  {
    id: "T007",
    message: "Credential harvesting attempts detected on education portals",
    level: "high",
    tag: "CREDENTIAL",
    source: "EDU-WATCH",
  },
  {
    id: "T008",
    message: "Malicious APK files circulating via encrypted messaging apps",
    level: "critical",
    tag: "MALWARE",
    source: "AI-INTEL",
  },
  {
    id: "T009",
    message: "Fake job offer campaigns targeting fresh graduates — verify recruiters",
    level: "medium",
    tag: "JOB-SCAM",
    source: "SOC-INTEL",
  },
  {
    id: "T010",
    message: "SMS OTP interception vulnerability reported — enable app-based 2FA",
    level: "high",
    tag: "2FA-RISK",
    source: "TELECOM",
  },
  {
    id: "T011",
    message: "Threat intelligence channels synchronized — all nodes operational",
    level: "advisory",
    tag: "SYNC",
    source: "COMMAND",
  },
  {
    id: "T012",
    message: "Romance scam operations using AI-generated profiles detected",
    level: "medium",
    tag: "SOCIAL-ENG",
    source: "SOC-INTEL",
  },
];

function hydrateTimestamps(
  alerts: Omit<ThreatAlert, "timestamp">[]
): ThreatAlert[] {
  return alerts.map((a) => ({
    ...a,
    timestamp: new Date().toISOString().slice(11, 19) + "Z",
  }));
}

// ─────────────────────────────────────────────
// LEVEL CONFIG
// ─────────────────────────────────────────────
const LEVEL_CONFIG: Record<
  ThreatLevel,
  { color: string; glow: string; bg: string; dot: string; label: string }
> = {
  critical: {
    color: "text-red-400",
    glow: "shadow-red-500/60",
    bg: "bg-red-500/10",
    dot: "bg-red-400",
    label: "CRITICAL",
  },
  high: {
    color: "text-amber-400",
    glow: "shadow-amber-500/50",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
    label: "HIGH",
  },
  medium: {
    color: "text-cyan-400",
    glow: "shadow-cyan-500/40",
    bg: "bg-cyan-500/10",
    dot: "bg-cyan-400",
    label: "MEDIUM",
  },
  advisory: {
    color: "text-emerald-400",
    glow: "shadow-emerald-500/40",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    label: "INFO",
  },
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

// Animated radar ping
function RadarPing({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 ${className}`}>
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
        animate={{ scale: [1, 2.4, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
    </span>
  );
}

// Scan-line overlay (single moving horizontal beam)
function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.35) 30%, rgba(34,211,238,0.7) 50%, rgba(34,211,238,0.35) 70%, transparent 100%)",
          boxShadow: "0 0 8px 1px rgba(34,211,238,0.5)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// Ambient corner glow pulsing
function CornerGlow({
  position,
  color,
}: {
  position: "left" | "right";
  color: string;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute top-0 bottom-0 w-24 ${
        position === "left" ? "left-0" : "right-0"
      }`}
      style={{
        background:
          position === "left"
            ? `linear-gradient(90deg, ${color} 0%, transparent 100%)`
            : `linear-gradient(270deg, ${color} 0%, transparent 100%)`,
      }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Signal wave distortion bar at the very bottom
function SignalDistortionBar() {
  const bars = Array.from({ length: 28 });
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[2px] h-[3px] overflow-hidden pointer-events-none"
      aria-hidden
    >
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-cyan-500/40 rounded-full"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 1.2 + (i % 5) * 0.2,
            repeat: Infinity,
            delay: (i * 0.07) % 1.2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

// Floating data particle
function DataParticle({ index }: { index: number }) {
  const startY = 20 + Math.random() * 60;
  const size = 1 + Math.random() * 2;
  const duration = 6 + Math.random() * 8;
  const delay = (index * 1.3) % duration;

  return (
    <motion.div
      className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
      style={{
        width: size,
        height: size,
        top: `${startY}%`,
        left: `-${size}px`,
      }}
      animate={{
        left: ["0%", "105%"],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
        times: [0, 0.05, 0.95, 1],
      }}
    />
  );
}

// AI status label with animated dot
function AIStatusLabel() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <span
        className="text-[9px] font-bold tracking-[0.2em] text-emerald-400/90"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        AI·MONITOR
      </span>
    </div>
  );
}

// Single alert pill rendered inside the scrolling stream
function AlertPill({
  alert,
  isActive,
}: {
  alert: ThreatAlert;
  isActive: boolean;
}) {
  const cfg = LEVEL_CONFIG[alert.level];

  return (
    <motion.div
      className={`
        inline-flex items-center gap-3 px-4 py-1.5 rounded-full border
        whitespace-nowrap cursor-default select-none
        ${cfg.bg}
        ${isActive ? "border-current/40" : "border-white/5"}
        ${cfg.color}
        transition-all duration-500
      `}
      style={{
        boxShadow: isActive
          ? `0 0 14px 2px rgba(var(--glow-rgb, 34 211 238) / 0.25), inset 0 0 10px rgba(var(--glow-rgb, 34 211 238) / 0.05)`
          : "none",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Level dot */}
      <motion.span
        className={`h-1.5 w-1.5 rounded-full ${cfg.dot} flex-shrink-0`}
        animate={
          alert.level === "critical"
            ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }
            : {}
        }
        transition={{ duration: 0.9, repeat: Infinity }}
      />

      {/* Level badge */}
      <span
        className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} border border-current/20`}
      >
        {cfg.label}
      </span>

      {/* Tag */}
      <span className="text-[9px] font-bold tracking-wider text-white/40">
        [{alert.tag}]
      </span>

      {/* Message */}
      <span className="text-[11px] font-medium tracking-wide text-white/85">
        {alert.message}
      </span>

      {/* Source */}
      <span className="text-[9px] text-white/25 font-mono">
        /{alert.source}
      </span>

      {/* Timestamp */}
      <span className="text-[9px] text-white/20 font-mono">
        {alert.timestamp}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// CONTINUOUS SCROLL ENGINE
// ─────────────────────────────────────────────
function useContinuousScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  paused: boolean,
  speed: number // px per second
) {
  const xRef = useRef(0);

  useAnimationFrame((_, delta) => {
    if (paused) return;
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const contentW = content.scrollWidth / 2; // duplicated content
    xRef.current -= (speed * delta) / 1000;

    if (xRef.current <= -contentW) {
      xRef.current += contentW;
    }

    content.style.transform = `translateX(${xRef.current}px)`;
  });
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export interface ThreatTickerProps {
  soundConfig?: SoundConfig;
  scrollSpeed?: number; // px/sec, default 55
  className?: string;
}

export default function ThreatTicker({
  soundConfig = defaultSoundConfig,
  scrollSpeed = 55,
  className = "",
}: ThreatTickerProps) {
  const { trigger: triggerSound } = useSoundSystem(soundConfig);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [alerts] = useState<ThreatAlert[]>(() =>
    hydrateTimestamps(THREAT_ALERTS)
  );
  const [, setRadarPhase] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Radar sweep tick — triggers sound hook
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarPhase((p) => (p + 1) % 360);
      triggerSound("radar_ping");
    }, 3000);
    return () => clearInterval(interval);
  }, [triggerSound]);

  // Occasional subtle glitch flash
  useEffect(() => {
    const glitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    };
    const id = setInterval(glitch, 8000 + Math.random() * 6000);
    return () => clearInterval(id);
  }, []);

  // Alert cycle — highlight active pill + sound
  useEffect(() => {
    let idx = 0;
    const cycle = () => {
      setActiveId(alerts[idx].id);
      triggerSound(
        alerts[idx].level === "critical" ? "alert_pulse" : "warning_tone"
      );
      idx = (idx + 1) % alerts.length;
    };
    cycle();
    const id = setInterval(cycle, 4500);
    return () => clearInterval(id);
  }, [alerts, triggerSound]);

  // Scroll engine
  useContinuousScroll(containerRef, contentRef, hovered, scrollSpeed);

  const doubledAlerts = useMemo(() => [...alerts, ...alerts], [alerts]);

  const particles = useMemo(() => Array.from({ length: 8 }), []);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: "48px" }}
      aria-label="Live cyber threat intelligence ticker"
      role="marquee"
    >
      {/* ── BACKGROUND ── */}
      {/* Deep base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,8,20,0.97) 0%, rgba(4,12,28,0.99) 50%, rgba(2,8,20,0.97) 100%)",
        }}
      />

      {/* Cyber grid lines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Mesh ambient glow — center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Glitch flash overlay */}
      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: "rgba(34,211,238,0.04)", mixBlendMode: "screen" }}
        />
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <DataParticle key={i} index={i} />
        ))}
      </div>

      {/* Scan line */}
      <ScanLine />

      {/* Signal distortion bar */}
      <SignalDistortionBar />

      {/* ── EDGE CHROME ── */}
      {/* Top border beam */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.6) 20%, rgba(34,211,238,0.9) 50%, rgba(34,211,238,0.6) 80%, transparent 100%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Bottom border beam */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 30%, rgba(34,211,238,0.5) 50%, rgba(34,211,238,0.3) 70%, transparent 100%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      {/* Corner fade masks */}
      <CornerGlow position="left" color="rgba(2,8,20,0.95)" />
      <CornerGlow position="right" color="rgba(2,8,20,0.95)" />

      {/* ── LEFT COMMAND BADGE ── */}
      <div
        className="absolute left-0 top-0 bottom-0 z-30 flex items-center px-4 gap-3"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,12,28,1) 0%, rgba(4,12,28,0.92) 70%, transparent 100%)",
          minWidth: "200px",
        }}
      >
        {/* Radar mini-indicator */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-6 h-6 rounded-full border border-cyan-500/40 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 6px rgba(34,211,238,0.2)", "0 0 14px rgba(34,211,238,0.5)", "0 0 6px rgba(34,211,238,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Sweep arm */}
            <motion.div
              className="absolute w-2.5 h-px bg-gradient-to-r from-cyan-400 to-transparent origin-left"
              style={{ left: "50%", top: "50%", translateY: "-50%" }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-1 h-1 rounded-full bg-cyan-400/80" />
          </motion.div>
        </div>

        {/* Labels */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[8px] font-black tracking-[0.25em] text-cyan-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              THREAT·FEED
            </span>
            <RadarPing />
          </div>
          <AIStatusLabel />
        </div>

        {/* Divider */}
        <div className="w-px self-stretch my-2 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />
      </div>

      {/* ── SCROLLING ALERT STREAM ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center overflow-hidden"
        style={{ left: "200px", right: "120px" }}
        onMouseEnter={() => {
          setHovered(true);
          triggerSound("holographic_transmission");
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          ref={contentRef}
          className="flex items-center gap-5 will-change-transform"
          style={{ whiteSpace: "nowrap" }}
        >
          {doubledAlerts.map((alert, i) => (
            <AlertPill
              key={`${alert.id}-${i}`}
              alert={alert}
              isActive={alert.id === activeId}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT STATUS BADGE ── */}
      <div
        className="absolute right-0 top-0 bottom-0 z-30 flex items-center px-4 gap-3"
        style={{
          background:
            "linear-gradient(270deg, rgba(4,12,28,1) 0%, rgba(4,12,28,0.92) 70%, transparent 100%)",
          minWidth: "120px",
        }}
      >
        <div className="w-px self-stretch my-2 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex flex-col items-end gap-0.5">
          <motion.span
            className="text-[8px] font-bold tracking-widest text-emerald-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LIVE
          </motion.span>
          <span
            className="text-[7px] tracking-widest text-white/25"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ENCRYPTED
          </span>
        </div>
      </div>

      {/* Hover pause vignette */}
      {hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: "inset 0 0 40px rgba(34,211,238,0.05)",
            border: "1px solid rgba(34,211,238,0.12)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}