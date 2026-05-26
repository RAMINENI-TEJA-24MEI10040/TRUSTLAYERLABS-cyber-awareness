import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  status?: "live" | "new" | "beta";
  description: string;
  color: string;
}

interface ThreatLevel {
  level: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  color: string;
  pulse: string;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconRadar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    <path d="M12 6a6 6 0 0 1 6 6" strokeLinecap="round" />
    <path d="M12 10a2 2 0 0 1 2 2" strokeLinecap="round" />
    <path d="M12 12l8.5-5" strokeLinecap="round" />
  </svg>
);

const IconBrain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.75-3 2.5 2.5 0 0 1-1.37-4.36A2.5 2.5 0 0 1 5.5 7.5 2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.75-3 2.5 2.5 0 0 0 1.37-4.36A2.5 2.5 0 0 0 18.5 7.5 2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v1M12 14v1" strokeLinecap="round" />
  </svg>
);

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8M8 11h6" strokeLinecap="round" />
  </svg>
);

const IconLaw = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22V8M5 12H2l3-7 3 7H5zM19 12h-3l3-7 3 7h-3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8a4 4 0 0 0 0-4 4 4 0 0 0 0 4z" />
    <path d="M5 12c0 1.66 1.34 3 3 3s3-1.34 3-3M19 12c0 1.66-1.34 3-3 3s-3-1.34-3-3" />
    <path d="M3 22h18" strokeLinecap="round" />
  </svg>
);

const IconFlag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" strokeLinecap="round" />
  </svg>
);

const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M9 22v-3M15 22v-3M12 17c-3.87 0-7-3.13-7-7V4h14v6c0 3.87-3.13 7-7 7z" />
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <line x1="9" y1="18" x2="21" y2="18" strokeLinecap="round" />
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    id: "threat-feed",
    label: "Threat Feed",
    href: "/threat-feed",
    icon: <IconRadar />,
    status: "live",
    description: "Real-time global cyber threat intelligence",
    color: "#f43f5e",
  },
  {
    id: "ai-scanner",
    label: "AI Scanner",
    href: "/analyzer",
    icon: <IconBrain />,
    status: "new",
    description: "Scan links, files & content with AI",
    color: "#06b6d4",
  },
  {
    id: "learn",
    label: "Learn",
    href: "/awareness",
    icon: <IconBook />,
    description: "Structured cyber awareness curriculum",
    color: "#10b981",
  },
  {
    id: "deepfake-lab",
    label: "Deepfake Lab",
    href: "/deepfake",
    icon: <IconEye />,
    status: "beta",
    description: "Detect and understand AI-generated media",
    color: "#8b5cf6",
  },
  {
    id: "cyber-laws",
    label: "Cyber Laws",
    href: "/laws",
    icon: <IconLaw />,
    description: "Know your rights and digital protections",
    color: "#f59e0b",
  },
  {
    id: "reporting",
    label: "Reporting",
    href: "/reporting",
    icon: <IconFlag />,
    description: "Report incidents. Stay protected.",
    color: "#f43f5e",
  },
  {
    id: "challenges",
    label: "Challenges",
    href: "/quiz",
    icon: <IconTrophy />,
    description: "Test your cyber knowledge & earn badges",
    color: "#10b981",
  },
];

const THREAT_LEVELS: Record<string, ThreatLevel> = {
  LOW: { level: "LOW", color: "#10b981", pulse: "rgba(16,185,129,0.4)" },
  MODERATE: { level: "MODERATE", color: "#f59e0b", pulse: "rgba(245,158,11,0.4)" },
  ELEVATED: { level: "ELEVATED", color: "#f97316", pulse: "rgba(249,115,22,0.4)" },
  HIGH: { level: "HIGH", color: "#f43f5e", pulse: "rgba(244,63,94,0.4)" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const CyberLogo: React.FC = () => (
  <Link to="/" className="flex items-center gap-3 group select-none" aria-label="AEGIS AI — Home">
    {/* Animated Shield Mark */}
    <div className="relative w-9 h-9 flex items-center justify-center">
      {/* Outer orbit ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-500/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ borderStyle: "dashed", borderDasharray: "4 4" } as React.CSSProperties}
      />
      {/* Glow core */}
      <motion.div
        className="absolute inset-1 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Shield SVG */}
      <motion.svg
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        className="relative z-10 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
        animate={{ filter: ["drop-shadow(0 0 4px rgba(6,182,212,0.7))", "drop-shadow(0 0 10px rgba(6,182,212,1))", "drop-shadow(0 0 4px rgba(6,182,212,0.7))"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.08)" />
        <motion.path
          d="M9 12l2 2 4-4" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        />
        {/* Neural nodes */}
        <circle cx="12" cy="8" r="0.8" fill="#06b6d4" opacity="0.7" />
        <circle cx="8.5" cy="10" r="0.6" fill="#06b6d4" opacity="0.5" />
        <circle cx="15.5" cy="10" r="0.6" fill="#06b6d4" opacity="0.5" />
      </motion.svg>
    </div>

    {/* Wordmark */}
    <div className="flex flex-col leading-none">
      <motion.span
        className="text-[15px] font-bold tracking-[0.18em] text-white"
        style={{ fontFamily: "'Orbitron', 'Rajdhani', monospace", letterSpacing: "0.2em" }}
        animate={{ textShadow: ["0 0 8px rgba(6,182,212,0.4)", "0 0 16px rgba(6,182,212,0.8)", "0 0 8px rgba(6,182,212,0.4)"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        AEGIS
      </motion.span>
      <span
        className="text-[8.5px] tracking-[0.35em] text-cyan-400/60 font-medium"
        style={{ fontFamily: "'Rajdhani', 'Space Mono', monospace" }}
      >
        AI · CYBER · COMMAND
      </span>
    </div>
  </Link>
);

interface ThreatPillProps {
  threatLevel: ThreatLevel;
}

const AUTH_LINK_CLASS =
  "hidden lg:inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider transition-colors";

const AuthNavLinks: React.FC = () => (
  <div className="hidden lg:flex items-center gap-1.5">
    <Link
      to="/login"
      className={AUTH_LINK_CLASS}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        color: "rgba(148,163,184,0.9)",
        border: "1px solid rgba(148,163,184,0.15)",
      }}
    >
      Login
    </Link>
    <Link
      to="/signup"
      className={AUTH_LINK_CLASS}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        color: "#06b6d4",
        border: "1px solid rgba(6,182,212,0.25)",
        background: "rgba(6,182,212,0.06)",
      }}
    >
      Signup
    </Link>
    <Link
      to="/admin"
      className={AUTH_LINK_CLASS}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        color: "rgba(167,139,250,0.95)",
        border: "1px solid rgba(139,92,246,0.3)",
        background: "rgba(139,92,246,0.08)",
      }}
    >
      Access Terminal
    </Link>
  </div>
);

const ThreatPill: React.FC<ThreatPillProps> = ({ threatLevel }) => (
  <motion.div
    className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.2em] select-none"
    style={{
      borderColor: `${threatLevel.color}40`,
      backgroundColor: `${threatLevel.color}0d`,
      color: threatLevel.color,
      fontFamily: "'Space Mono', monospace",
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    {/* Pulsing dot */}
    <span className="relative flex h-1.5 w-1.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: threatLevel.color }}
        animate={{ scale: [1, 2.5, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: threatLevel.color }} />
    </span>
    THREAT · {threatLevel.level}
  </motion.div>
);

interface StatusBadgeProps {
  status: "live" | "new" | "beta";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = {
    live: { label: "LIVE", color: "#f43f5e" },
    new: { label: "NEW", color: "#06b6d4" },
    beta: { label: "BETA", color: "#8b5cf6" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider"
      style={{
        backgroundColor: `${cfg.color}18`,
        color: cfg.color,
        border: `1px solid ${cfg.color}35`,
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {status === "live" && (
        <motion.span
          className="w-1 h-1 rounded-full inline-block"
          style={{ backgroundColor: cfg.color }}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {cfg.label}
    </span>
  );
};

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a
        href={item.href}
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 outline-none group"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.06em",
          color: isActive ? item.color : hovered ? "#e2e8f0" : "#94a3b8",
        }}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Background fill on hover/active */}
        <AnimatePresence>
          {(hovered || isActive) && (
            <motion.span
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: `${item.color}10`, border: `1px solid ${item.color}25` }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.span
          className="relative z-10 flex-shrink-0"
          style={{ color: isActive || hovered ? item.color : "#475569" }}
          animate={isActive ? { filter: [`drop-shadow(0 0 4px ${item.color}88)`, `drop-shadow(0 0 8px ${item.color})`, `drop-shadow(0 0 4px ${item.color}88)`] } : { filter: "none" }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {item.icon}
        </motion.span>

        {/* Label */}
        <span className="relative z-10 whitespace-nowrap">{item.label}</span>

        {/* Status badge */}
        {item.status && <span className="relative z-10"><StatusBadge status={item.status} /></span>}

        {/* Active underline bar */}
        {isActive && (
          <motion.span
            className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
            layoutId="activeBar"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </a>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && !isActive && (
          <motion.div
            className="absolute top-full left-1/2 mt-3 z-50 pointer-events-none"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            {/* Connector line */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-px h-2" style={{ background: `linear-gradient(to bottom, ${item.color}60, transparent)` }} />
            <div
              className="relative px-3 py-2 rounded-xl text-[11px] whitespace-nowrap"
              style={{
                background: "rgba(5,10,20,0.92)",
                border: `1px solid ${item.color}30`,
                color: "#94a3b8",
                backdropFilter: "blur(16px)",
                boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${item.color}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              <span style={{ color: item.color }} className="font-semibold mr-1">//</span>
              {item.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Scan line component ──────────────────────────────────────────────────────

const ScanLine: React.FC = () => (
  <motion.div
    className="absolute inset-x-0 h-px pointer-events-none"
    style={{
      background: "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 30%, rgba(16,185,129,0.8) 50%, rgba(6,182,212,0.6) 70%, transparent 100%)",
      top: "100%",
      boxShadow: "0 0 12px rgba(6,182,212,0.5)",
    }}
    animate={{ scaleX: [0, 1, 1, 0], x: ["-50%", "0%", "0%", "50%"] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
  />
);

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  activeId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
  threatLevel: ThreatLevel;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, activeId, onClose, onNavigate, threatLevel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,4,12,0.85)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-x-0 top-0 z-50 flex flex-col"
            style={{
              background: "linear-gradient(180deg, rgba(2,8,18,0.98) 0%, rgba(2,12,24,0.96) 100%)",
              borderBottom: "1px solid rgba(6,182,212,0.2)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(6,182,212,0.08)",
              maxHeight: "100dvh",
              overflowY: "auto",
            }}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-900/40">
              <CyberLogo />
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="Close menu"
              >
                <IconX />
              </button>
            </div>

            {/* Threat status bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800/60" style={{ background: `${threatLevel.color}08` }}>
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full"
                  style={{ backgroundColor: threatLevel.color, opacity: 0.6 }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: threatLevel.color }} />
              </span>
              <span
                className="text-[10px] tracking-[0.2em] font-bold"
                style={{ color: threatLevel.color, fontFamily: "'Space Mono', monospace" }}
              >
                GLOBAL THREAT · {threatLevel.level}
              </span>
              <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: "'Space Mono', monospace" }}>
                {new Date().toUTCString().slice(17, 22)} UTC
              </span>
            </div>

            {/* Nav grid */}
            <div className="grid grid-cols-2 gap-2 p-4">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeId === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); onNavigate(item.id); onClose(); }}
                    className="relative flex flex-col gap-2 p-4 rounded-xl border transition-colors"
                    style={{
                      background: isActive ? `${item.color}10` : "rgba(255,255,255,0.02)",
                      borderColor: isActive ? `${item.color}40` : "rgba(255,255,255,0.06)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.045, type: "spring", stiffness: 300, damping: 28 }}
                    whileHover={{ scale: 1.02, borderColor: `${item.color}50` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        background: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Label + badge */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[13px] font-semibold"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          letterSpacing: "0.05em",
                          color: isActive ? item.color : "#e2e8f0",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.status && <StatusBadge status={item.status} />}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-tight">{item.description}</p>

                    {/* Active glow */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ boxShadow: `inset 0 0 20px ${item.color}18` }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {[
                { to: "/login", label: "Login" },
                { to: "/signup", label: "Signup" },
                { to: "/admin", label: "Access Terminal" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="flex-1 min-w-[calc(50%-4px)] text-center px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-wider border border-cyan-500/20 text-cyan-400/90"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 mt-auto border-t border-slate-800/60">
              <span className="text-[10px] text-slate-600" style={{ fontFamily: "'Space Mono', monospace" }}>
                AEGIS · PROTECTED ENVIRONMENT
              </span>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] text-emerald-400/70" style={{ fontFamily: "'Space Mono', monospace" }}>SECURE</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Ambient background grid ──────────────────────────────────────────────────

const CyberGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="navbar-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#navbar-grid)" />
    </svg>
  </div>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>("threat-feed");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [threatLevel] = useState<ThreatLevel>(THREAT_LEVELS.ELEVATED);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const match = [...NAV_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find(
        (item) =>
          location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(`${item.href}/`))
      );
    if (match) setActiveId(match.id);
  }, [location.pathname]);

  const handleNavigate = useCallback(
    (id: string) => {
      setActiveId(id);
      const href = NAV_ITEMS.find((i) => i.id === id)?.href;
      if (href) navigate(href);
    },
    [navigate]
  );

  return (
    <>
      {/* Font imports via style tag — in production, add to <head> */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <motion.header
        className="fixed inset-x-0 top-0 z-30"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 30, delay: 0.1 }}
      >
        <motion.div
          className="relative mx-4 mt-3 rounded-2xl overflow-hidden"
          animate={{
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(6,182,212,0.18), 0 0 60px rgba(6,182,212,0.06)"
              : "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.10)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Glassmorphism base */}
          <div
            className="absolute inset-0"
            style={{
              background: scrolled
                ? "linear-gradient(135deg, rgba(2,8,20,0.96) 0%, rgba(2,12,28,0.94) 100%)"
                : "linear-gradient(135deg, rgba(2,8,20,0.88) 0%, rgba(2,12,28,0.86) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
            }}
          />

          {/* Cyber grid texture */}
          <CyberGrid />

          {/* Top highlight edge */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5) 30%, rgba(16,185,129,0.5) 70%, transparent)" }}
          />

          {/* Animated ambient glow */}
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Content Row ── */}
          <div className="relative flex items-center gap-4 px-5 py-3">
            {/* Logo */}
            <CyberLogo />

            {/* Divider */}
            <div className="hidden lg:block w-px h-7 mx-1" style={{ background: "linear-gradient(180deg, transparent, rgba(6,182,212,0.3), transparent)" }} />

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }} aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => handleNavigate(item.id)}
                />
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0 flex-shrink-0">
              <AuthNavLinks />

              {/* Threat level pill */}
              <ThreatPill threatLevel={threatLevel} />

              {/* Divider */}
              <div className="hidden lg:block w-px h-5" style={{ background: "rgba(6,182,212,0.15)" }} />

              {/* Shield CTA */}
              <motion.a
                href="/reporting"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold tracking-wider relative overflow-hidden select-none"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.1) 100%)",
                  border: "1px solid rgba(6,182,212,0.35)",
                  color: "#06b6d4",
                  letterSpacing: "0.08em",
                }}
                whileHover={{ scale: 1.02, borderColor: "rgba(6,182,212,0.7)" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shimmer sweep */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(6,182,212,0.15) 50%, transparent 70%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                />
                <IconShield />
                <span className="relative z-10">Stay Protected</span>
              </motion.a>

              {/* Mobile hamburger */}
              <motion.button
                className="flex lg:hidden items-center justify-center w-10 h-10 rounded-xl border text-slate-400 relative"
                style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.06)" }}
                onClick={() => setMobileOpen(true)}
                whileHover={{ scale: 1.05, borderColor: "rgba(6,182,212,0.5)", color: "#06b6d4" }}
                whileTap={{ scale: 0.94 }}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <IconMenu />
                {/* Badge for active threat */}
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: threatLevel.color }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </div>
          </div>

          {/* Bottom scan-line */}
          <ScanLine />
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        activeId={activeId}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleNavigate}
        threatLevel={threatLevel}
      />
    </>
  );
};

export default Navbar;