"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  badge?: string;
  badgeType?: "alert" | "new" | "live";
}

interface SystemStatus {
  label: string;
  status: "online" | "active" | "monitoring";
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULE_LINKS: NavLink[] = [
  { label: "AI Scam Analyzer", href: "/analyzer", badge: "LIVE", badgeType: "live" },
  { label: "Threat Feed", href: "/threat-feed", badge: "ACTIVE", badgeType: "alert" },
  { label: "Deepfake Detection Lab", href: "/deepfake" },
  { label: "QR Scam Scanner", href: "/qr" },
  { label: "Phishing Simulator", href: "/phishing" },
  { label: "URL Safety Scanner", href: "/url-scanner" },
];

const AWARENESS_LINKS: NavLink[] = [
  { label: "Cyber Laws Hub", href: "/laws" },
  { label: "Awareness Challenges", href: "/quiz", badge: "NEW", badgeType: "new" },
  { label: "UPI Fraud Awareness", href: "/upi" },
  { label: "IP Intelligence Scanner", href: "/ip-scanner" },
  { label: "Report a Scam", href: "/reporting" },
  { label: "Emergency Resources", href: "/reporting" },
];

const SYSTEM_STATUSES: SystemStatus[] = [
  { label: "Threat Feed", status: "online", color: "#22d3ee" },
  { label: "AI Engine", status: "active", color: "#34d399" },
  { label: "Scam Monitor", status: "monitoring", color: "#f59e0b" },
];

const EMERGENCY_LINKS = [
  { label: "Cyber Crime Portal", href: "https://cybercrime.gov.in", code: "cybercrime.gov.in" },
  { label: "CERT-In", href: "https://cert-in.org.in", code: "cert-in.org.in" },
  { label: "RBI Fraud Helpline", href: "#", code: "1930 · National Helpline" },
];

// ─── Animated Background ──────────────────────────────────────────────────────

const FooterGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
    {/* Top edge glow */}
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.4) 30%, rgba(52,211,153,0.4) 70%, transparent 100%)",
      }}
    />
    {/* Ambient top lighting */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at top, rgba(34,211,238,0.05) 0%, transparent 70%)",
      }}
    />
    {/* Left + right corner glows */}
    <div
      className="absolute bottom-0 left-0 w-80 h-80"
      style={{
        background: "radial-gradient(circle at bottom left, rgba(167,139,250,0.04) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-0 right-0 w-80 h-80"
      style={{
        background: "radial-gradient(circle at bottom right, rgba(52,211,153,0.04) 0%, transparent 70%)",
      }}
    />
    {/* Scanlines */}
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.4) 3px, rgba(34,211,238,0.4) 4px)",
      }}
    />
  </div>
);

// ─── Animated Pulse Divider ───────────────────────────────────────────────────

const PulseDivider: React.FC = () => {
  return (
    <div className="relative h-px w-full my-12">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.15) 30%, rgba(34,211,238,0.15) 70%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-32 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.7), rgba(52,211,153,0.7), transparent)",
          boxShadow: "0 0 12px rgba(34,211,238,0.5)",
        }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      />
    </div>
  );
};

// ─── System Status Row ────────────────────────────────────────────────────────

const SystemStatusBar: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6" key={tick}>
      {SYSTEM_STATUSES.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: s.color }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
            />
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{ borderColor: s.color, border: `1px solid ${s.color}` }}
              animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: Math.random() }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest" style={{ color: s.color }}>
            {s.label.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-white/20 tracking-wider">
            {s.status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Animated Link ────────────────────────────────────────────────────────────

const FooterLink: React.FC<{ link: NavLink; delay?: number }> = ({ link, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const badgeColors = {
    live: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#f87171" },
    alert: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", text: "#fbbf24" },
    new: { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", text: "#34d399" },
  };

  return (
    <motion.a
      href={link.href}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group flex items-center gap-2 relative"
    >
      {/* Hover accent */}
      <motion.div
        className="flex-shrink-0 w-1 rounded-full"
        style={{ backgroundColor: "#22d3ee" }}
        animate={{ height: hovered ? 14 : 4, opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.25 }}
      />

      <span className="text-[13px] font-mono text-white/45 transition-colors duration-200 group-hover:text-white/80 tracking-wide">
        {link.label}
      </span>

      {link.badge && link.badgeType && (
        <span
          className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest"
          style={{
            background: badgeColors[link.badgeType].bg,
            border: `1px solid ${badgeColors[link.badgeType].border}`,
            color: badgeColors[link.badgeType].text,
          }}
        >
          {link.badge}
        </span>
      )}

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-3 right-0 h-px"
        style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(52,211,153,0.4))" }}
        animate={{ scaleX: hovered ? 1 : 0, originX: 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.a>
  );
};

// ─── Logo / Brand ─────────────────────────────────────────────────────────────

const BrandBlock: React.FC = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(52,211,153,0.1) 100%)",
            border: "1px solid rgba(34,211,238,0.3)",
          }}
        >
          {/* Shield icon */}
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-cyan-400">
            <path
              d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.2), transparent)" }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div>
          <motion.div
            animate={glitch ? { x: [0, -2, 2, 0], opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 0.15 }}
          >
            <p className="text-white font-semibold text-sm tracking-tight font-mono">
              CYBER AWARE
            </p>
            <p className="text-[10px] font-mono tracking-[0.25em] text-cyan-400/50 uppercase">
              Command Center
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tagline */}
      <div className="space-y-2 max-w-xs">
        <p className="text-white/60 text-sm leading-relaxed font-light">
          Cyber awareness is digital self-defense.
        </p>
        <p className="text-white/30 text-xs leading-relaxed font-mono">
          AI-powered public cyber safety — free, open, and built for everyone.
        </p>
      </div>

      {/* Emergency row */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(239,68,68,0.04)",
          border: "1px solid rgba(239,68,68,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-red-400"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono tracking-widest text-red-400/70 uppercase">
            Emergency Resources
          </span>
        </div>
        {EMERGENCY_LINKS.map((link) => (
          <a
            key={link.code}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between group"
          >
            <span className="text-[12px] font-mono text-white/50 group-hover:text-white/80 transition-colors duration-200">
              {link.label}
            </span>
            <span className="text-[10px] font-mono text-red-400/50 group-hover:text-red-400/80 transition-colors duration-200">
              {link.code}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

// ─── Live Cyber Time ──────────────────────────────────────────────────────────

const LiveCyberClock: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().split("T")[1].slice(0, 8) + " UTC");
      setDate(now.toISOString().split("T")[0]);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span className="text-[10px] font-mono text-white/25 tracking-widest">
        {date} · {time}
      </span>
    </div>
  );
};

// ─── Main Footer ──────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #030609 0%, #020408 100%)",
      }}
    >
      <FooterGrid />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* System status bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div
            className="rounded-xl px-6 py-3 inline-flex w-full justify-center"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <SystemStatusBar />
          </div>
        </motion.div>

        {/* Primary grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Col 1 — Brand */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <BrandBlock />
          </motion.div>

          {/* Col 2 — Protection Modules */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/25 uppercase mb-5">
              Protection Modules
            </p>
            <div className="flex flex-col gap-3">
              {MODULE_LINKS.map((link, i) => (
                <FooterLink key={link.href} link={link} delay={0.2 + i * 0.04} />
              ))}
            </div>
          </motion.div>

          {/* Col 3 — Awareness & Help */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/25 uppercase mb-5">
              Awareness & Help
            </p>
            <div className="flex flex-col gap-3">
              {AWARENESS_LINKS.map((link, i) => (
                <FooterLink key={link.href} link={link} delay={0.3 + i * 0.04} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pulse divider */}
        <PulseDivider />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Left — awareness note */}
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}
            >
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-cyan-400">
                <path d="M6 1L10 3.5v5L6 11 2 8.5v-5z" stroke="currentColor" strokeWidth="1" />
                <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[11px] font-mono text-white/25 tracking-wide">
              Stay aware · Stay protected · Threat intelligence for everyone
            </p>
          </div>

          {/* Right — live clock + build info */}
          <div className="flex flex-col items-end gap-1">
            <LiveCyberClock />
            <span className="text-[9px] font-mono text-white/15 tracking-widest">
              CYBERAWARE · PUBLIC SAFETY PLATFORM · v2.0
            </span>
          </div>
        </motion.div>

        {/* Final bottom glow line */}
        <div className="mt-8 relative h-px">
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.12) 40%, rgba(52,211,153,0.12) 60%, transparent 100%)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;