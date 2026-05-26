"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

const MODULE_ROUTES: Record<string, string> = {
  "scam-analyzer": "/analyzer",
  "threat-feed": "/threat-feed",
  "deepfake-lab": "/deepfake",
  "qr-scanner": "/qr",
  "phishing-sim": "/phishing",
  "cyber-laws": "/laws",
  challenges: "/quiz",
  reporting: "/reporting",
  "upi-fraud": "/upi",
  "ip-scanner": "/ip-scanner",
  "url-scanner": "/url-scanner",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CyberModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  statusLabel: string;
  statusType: "active" | "scanning" | "alert" | "monitoring" | "learning";
  tags: string[];
  pulseRings: number;
  gridPattern: "hex" | "diamond" | "circuit" | "wave" | "neural";
  liveData: string[];
}

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ScamAnalyzerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
    <path d="M12 20a8 8 0 1 0 16 0 8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 12v4M20 24v4M12 20h4M24 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3" fill="currentColor" />
    <path d="M26 14l2-2M12 28l2-2M14 14l-2-2M28 28l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ThreatFeedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L36 12v16L20 36 4 28V12L20 4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 10v20M10 15l10 5 10-5M10 25l10-5 10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.8" />
  </svg>
);

const DeepfakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 28c2-4 6-6 11-6s9 2 11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 8l4-4M12 8L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 18h-3M28 18h-3M20 13v-3M20 26v-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const QRScannerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="22" y="6" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="6" y="22" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="9" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="25" y="9" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="9" y="25" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
    <path d="M22 22h4v4h-4zM30 22v4M22 30h4M30 30h-4v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 15V6h9M36 15V6h-9M4 25v9h9M36 25v9h-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const PhishingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28c0-8 4-16 12-18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 10c4 1 8 6 8 12 0 4-2 7-5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="26" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 22v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 14l4 4M26 14l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <circle cx="8" cy="28" r="2" fill="currentColor" opacity="0.7" />
    <path d="M8 30v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 34h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CyberLawsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 20h20M14 26h12M17 32h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="20" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.6" />
    <path d="M8 20L4 28M32 20l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 28h8M28 28h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChallengesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4v6M20 30v6M4 20h6M30 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8.7 8.7l4.2 4.2M27.1 27.1l4.2 4.2M31.3 8.7l-4.2 4.2M12.9 27.1l-4.2 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17 20l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReportingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6h24v22l-6 6H8V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M26 28v6l6-6h-6z" fill="currentColor" opacity="0.4" />
    <path d="M13 13h14M13 18h14M13 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30" cy="10" r="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
    <path d="M30 8v3M30 12.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const UPIFraudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 16h24" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14" cy="23" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M22 21h6M22 25h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 6l-3 4h6l-3-4z" fill="currentColor" opacity="0.6" />
    <path d="M30 34l2-3-2-1-2 1 2 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

const IPScannerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="20" cy="20" rx="8" ry="16" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 20h32M20 4c0 0 6 4 6 16s-6 16-6 16" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    <path d="M20 12l-1.5 4h3L20 12zM20 28l1.5-4h-3L20 28z" fill="currentColor" opacity="0.5" />
  </svg>
);

const URLScannerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 20a4 4 0 0 0 4 4h8a4 4 0 0 0 0-8h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 20a4 4 0 0 0-4-4h-8a4 4 0 0 0 0 8h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M34 34l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5" />
  </svg>
);

// ─── Module Data ──────────────────────────────────────────────────────────────

const CYBER_MODULES: CyberModule[] = [
  {
    id: "scam-analyzer",
    title: "AI Scam Analyzer",
    subtitle: "Neural Threat Recognition",
    description: "Feed suspicious messages, calls, or links into our AI engine. Detects social engineering patterns, urgency manipulation, and impersonation tactics in real time.",
    icon: ScamAnalyzerIcon,
    accentColor: "text-cyan-400",
    glowColor: "rgba(34,211,238,0.15)",
    borderColor: "rgba(34,211,238,0.3)",
    statusLabel: "ANALYZING PATTERNS",
    statusType: "scanning",
    tags: ["Social Engineering", "SMS Fraud", "Voice Cloning"],
    pulseRings: 3,
    gridPattern: "circuit",
    liveData: ["Voice scam detected — India +91", "SMS phishing blocked", "Credential harvest attempt"],
  },
  {
    id: "threat-feed",
    title: "Live Threat Feed",
    subtitle: "Global Cyber Intelligence",
    description: "Real-time aggregation of emerging scam campaigns, ransomware spreads, and social fraud vectors from public threat intelligence sources across India and globally.",
    icon: ThreatFeedIcon,
    accentColor: "text-red-400",
    glowColor: "rgba(248,113,113,0.15)",
    borderColor: "rgba(248,113,113,0.3)",
    statusLabel: "LIVE MONITORING",
    statusType: "alert",
    tags: ["Ransomware Alerts", "Scam Campaigns", "Dark Web Signals"],
    pulseRings: 2,
    gridPattern: "hex",
    liveData: ["New OTP scam wave detected", "Govt impersonation surge", "Banking fraud pattern flagged"],
  },
  {
    id: "deepfake-lab",
    title: "Deepfake Detection Lab",
    subtitle: "Synthetic Media Analysis",
    description: "Upload images or video clips. Our multimodal AI identifies facial synthesis artifacts, voice cloning signatures, and AI-generated content used in fraud and disinformation.",
    icon: DeepfakeIcon,
    accentColor: "text-violet-400",
    glowColor: "rgba(167,139,250,0.15)",
    borderColor: "rgba(167,139,250,0.3)",
    statusLabel: "MODEL ACTIVE",
    statusType: "active",
    tags: ["Face Swap", "Voice Synthesis", "Video Forensics"],
    pulseRings: 3,
    gridPattern: "neural",
    liveData: ["Deepfake video analyzed", "Synthetic audio confirmed", "Real face — verified"],
  },
  {
    id: "qr-scanner",
    title: "QR Scam Scanner",
    subtitle: "Malicious Code Detection",
    description: "Scan any QR code before you pay or visit. Our engine decodes hidden redirect chains, UPI manipulation, malware distribution URLs, and payment fraud embedded in QR.",
    icon: QRScannerIcon,
    accentColor: "text-amber-400",
    glowColor: "rgba(251,191,36,0.15)",
    borderColor: "rgba(251,191,36,0.3)",
    statusLabel: "SCAN READY",
    statusType: "monitoring",
    tags: ["UPI Redirect", "Malware Links", "Fake Payments"],
    pulseRings: 2,
    gridPattern: "diamond",
    liveData: ["Malicious UPI QR blocked", "Redirect chain exposed", "Safe QR confirmed"],
  },
  {
    id: "phishing-sim",
    title: "Phishing Simulator",
    subtitle: "Awareness Training Engine",
    description: "Experience simulated phishing attacks in a safe environment. Learn to identify deceptive links, spoofed domains, fake login pages, and urgency-based manipulation tactics.",
    icon: PhishingIcon,
    accentColor: "text-emerald-400",
    glowColor: "rgba(52,211,153,0.15)",
    borderColor: "rgba(52,211,153,0.3)",
    statusLabel: "SIM ACTIVE",
    statusType: "active",
    tags: ["Domain Spoofing", "Credential Harvest", "Urgency Baiting"],
    pulseRings: 3,
    gridPattern: "wave",
    liveData: ["Simulation: bank phish", "User caught fake login", "Awareness score: HIGH"],
  },
  {
    id: "cyber-laws",
    title: "Cyber Laws Hub",
    subtitle: "Legal Intelligence System",
    description: "Navigate India's IT Act 2000, DPDP Bill, and global cyber regulations. AI-guided summaries help citizens understand their digital rights and legal recourse.",
    icon: CyberLawsIcon,
    accentColor: "text-sky-400",
    glowColor: "rgba(56,189,248,0.15)",
    borderColor: "rgba(56,189,248,0.3)",
    statusLabel: "KNOWLEDGE BASE",
    statusType: "learning",
    tags: ["IT Act 2000", "DPDP Bill", "Cyber Rights"],
    pulseRings: 1,
    gridPattern: "circuit",
    liveData: ["Section 66A explained", "DPDP rights clarified", "Complaint process mapped"],
  },
  {
    id: "challenges",
    title: "Awareness Challenges",
    subtitle: "Cyber Defense Training",
    description: "Gamified cyber awareness missions. Identify scam screenshots, decode phishing emails, spot fake websites — build real-world recognition skills through immersive challenges.",
    icon: ChallengesIcon,
    accentColor: "text-fuchsia-400",
    glowColor: "rgba(232,121,249,0.15)",
    borderColor: "rgba(232,121,249,0.3)",
    statusLabel: "MISSION ACTIVE",
    statusType: "active",
    tags: ["Gamified Learning", "Scam Spotting", "Security IQ"],
    pulseRings: 2,
    gridPattern: "hex",
    liveData: ["Challenge: spot the phish", "Level 4 unlocked", "Security IQ improved"],
  },
  {
    id: "reporting",
    title: "Reporting Center",
    subtitle: "Incident Documentation",
    description: "Structured cyber incident reporting with AI-assisted form completion. Automatically routes reports to CERT-In, Cyber Crime Portal, or RBI Ombudsman based on incident type.",
    icon: ReportingIcon,
    accentColor: "text-orange-400",
    glowColor: "rgba(251,146,60,0.15)",
    borderColor: "rgba(251,146,60,0.3)",
    statusLabel: "REPORTS OPEN",
    statusType: "monitoring",
    tags: ["CERT-In", "Cyber Crime Portal", "RBI Ombudsman"],
    pulseRings: 1,
    gridPattern: "diamond",
    liveData: ["Report filed to CERT-In", "Case number generated", "Escalation triggered"],
  },
  {
    id: "upi-fraud",
    title: "UPI Fraud Awareness",
    subtitle: "Payment Safety Intelligence",
    description: "Understand how UPI scams operate — collect requests, screen share fraud, fake payment screenshots, and merchant impersonation. Interactive fraud map of common attack patterns.",
    icon: UPIFraudIcon,
    accentColor: "text-teal-400",
    glowColor: "rgba(45,212,191,0.15)",
    borderColor: "rgba(45,212,191,0.3)",
    statusLabel: "FRAUD MAP LIVE",
    statusType: "alert",
    tags: ["Collect Scams", "Screen Fraud", "Fake Screenshots"],
    pulseRings: 2,
    gridPattern: "circuit",
    liveData: ["Collect request scam wave", "New screen share attack", "Fake receipt pattern"],
  },
  {
    id: "ip-scanner",
    title: "IP Intelligence Scanner",
    subtitle: "Network Origin Analysis",
    description: "Analyze IP addresses for threat reputation, geolocation, hosting provider, and blacklist status. Understand if a caller, website, or sender originates from known threat infrastructure.",
    icon: IPScannerIcon,
    accentColor: "text-lime-400",
    glowColor: "rgba(163,230,53,0.15)",
    borderColor: "rgba(163,230,53,0.3)",
    statusLabel: "SCANNER ONLINE",
    statusType: "scanning",
    tags: ["Reputation Check", "Blacklist Status", "Geo Trace"],
    pulseRings: 3,
    gridPattern: "neural",
    liveData: ["IP blacklisted — flagged", "VPN origin detected", "Clean IP — verified"],
  },
  {
    id: "url-scanner",
    title: "URL Safety Scanner",
    subtitle: "Link Threat Assessment",
    description: "Paste any suspicious link for instant deep analysis. Detects typosquatting, malware payloads, phishing pages, fake login portals, and redirect-based deception chains.",
    icon: URLScannerIcon,
    accentColor: "text-rose-400",
    glowColor: "rgba(251,113,133,0.15)",
    borderColor: "rgba(251,113,133,0.3)",
    statusLabel: "LINK SCANNER",
    statusType: "scanning",
    tags: ["Typosquatting", "Malware Payload", "Redirect Chain"],
    pulseRings: 2,
    gridPattern: "wave",
    liveData: ["Phishing URL detected", "Typosquat identified", "Clean URL — safe"],
  },
];

// ─── Animated Background Grid ─────────────────────────────────────────────────

const CyberGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base mesh */}
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
    {/* Finer grid */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "15px 15px",
      }}
    />
    {/* Radial atmospheric glow */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(167,139,250,0.04) 0%, transparent 60%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 50% 40% at 80% 60%, rgba(52,211,153,0.04) 0%, transparent 60%)",
      }}
    />
    {/* Scanline overlay */}
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.3) 2px, rgba(34,211,238,0.3) 4px)",
      }}
    />
  </div>
);

// ─── Floating Particles ───────────────────────────────────────────────────────

const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    const generated: ParticleData[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 20 + 10,
      angle: Math.random() * 360,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.sin(p.angle) * 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

// ─── Status Indicator ─────────────────────────────────────────────────────────

const statusConfig = {
  active: { color: "bg-emerald-400", label: "text-emerald-400", ring: "rgba(52,211,153,0.4)" },
  scanning: { color: "bg-cyan-400", label: "text-cyan-400", ring: "rgba(34,211,238,0.4)" },
  alert: { color: "bg-red-400", label: "text-red-400", ring: "rgba(248,113,113,0.4)" },
  monitoring: { color: "bg-amber-400", label: "text-amber-400", ring: "rgba(251,191,36,0.4)" },
  learning: { color: "bg-sky-400", label: "text-sky-400", ring: "rgba(56,189,248,0.4)" },
};

const StatusDot: React.FC<{ type: CyberModule["statusType"]; label: string }> = ({ type, label }) => {
  const cfg = statusConfig[type];
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <motion.div
          className={`w-2 h-2 rounded-full ${cfg.color}`}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute w-5 h-5 rounded-full border ${cfg.color.replace("bg-", "border-")}`}
          animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ borderColor: cfg.ring }}
        />
      </div>
      <span className={`text-[10px] font-mono tracking-widest ${cfg.label}`}>{label}</span>
    </div>
  );
};

// ─── Live Data Ticker ─────────────────────────────────────────────────────────

const LiveTicker: React.FC<{ items: string[]; accentColor: string }> = ({ items, accentColor }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2500 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="flex-shrink-0 w-1 h-3 bg-current opacity-60" style={{ backgroundColor: "currentColor" }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`text-[10px] font-mono truncate ${accentColor} opacity-70`}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// ─── Grid Pattern Overlays ────────────────────────────────────────────────────

const GridOverlay: React.FC<{ pattern: CyberModule["gridPattern"]; color: string }> = ({ pattern, color }) => {
  const patterns: Record<string, string> = {
    hex: `url("data:image/svg+xml,%3Csvg width='40' height='46' viewBox='0 0 40 46' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 1L38 11v20L20 41 2 31V11z' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
    diamond: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2L38 20L20 38L2 20z' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
    circuit: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h15M25 20h15M20 0v15M20 25v15' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3Ccircle cx='20' cy='20' r='3' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
    wave: `url("data:image/svg+xml,%3Csvg width='60' height='20' viewBox='0 0 60 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q15 0 30 10 Q45 20 60 10' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
    neural: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='50' cy='10' r='2' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='30' cy='30' r='2' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='10' cy='50' r='2' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='50' cy='50' r='2' fill='${encodeURIComponent(color)}'/%3E%3Cpath d='M10 10L30 30M50 10L30 30M10 50L30 30M50 50L30 30' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
  };

  return (
    <div
      className="absolute inset-0 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.14]"
      style={{ backgroundImage: patterns[pattern], backgroundSize: "40px 40px" }}
    />
  );
};

// ─── Radar Pulse ──────────────────────────────────────────────────────────────

const RadarPulse: React.FC<{ rings: number; color: string }> = ({ rings, color }) => (
  <div className="absolute top-4 right-4 w-12 h-12 pointer-events-none">
    {Array.from({ length: rings }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: color }}
        animate={{
          scale: [0.2, 1.4],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeOut",
        }}
      />
    ))}
    <div
      className="absolute inset-0 m-auto w-2 h-2 rounded-full"
      style={{ backgroundColor: color, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    />
  </div>
);

// ─── Module Card ──────────────────────────────────────────────────────────────

const ModuleCard: React.FC<{ module: CyberModule; index: number }> = ({ module, index }) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const moduleRoute = MODULE_ROUTES[module.id];

  const launchModule = useCallback(() => {
    if (moduleRoute) navigate(moduleRoute);
  }, [moduleRoute, navigate]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  // Scan line animation
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
    setScanPosition(0);
  }, [mouseX, mouseY]);

  const Icon = module.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={launchModule}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          launchModule();
        }
      }}
      role={moduleRoute ? "button" : undefined}
      tabIndex={moduleRoute ? 0 : undefined}
      className="group relative cursor-pointer"
      whileHover={{ z: 20 }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-px rounded-2xl"
        style={{ background: module.glowColor }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card body */}
      <div
        className="relative rounded-2xl overflow-hidden h-full"
        style={{
          background: "linear-gradient(135deg, rgba(10,15,25,0.95) 0%, rgba(5,10,20,0.98) 100%)",
          border: `1px solid ${isHovered ? module.borderColor : "rgba(255,255,255,0.06)"}`,
          backdropFilter: "blur(20px)",
          transition: "border-color 0.3s ease",
          boxShadow: isHovered
            ? `0 0 40px ${module.glowColor}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Grid pattern */}
        <GridOverlay pattern={module.gridPattern} color={module.borderColor.replace("0.3", "1")} />

        {/* Scan line effect */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none z-10"
            style={{
              top: `${scanPosition}%`,
              background: `linear-gradient(90deg, transparent, ${module.borderColor.replace("0.3", "0.8")}, transparent)`,
            }}
          />
        )}

        {/* Radar pulse */}
        <RadarPulse rings={module.pulseRings} color={module.borderColor.replace("0.3", "0.6")} />

        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${module.borderColor.replace("0.3", "0.8")}, transparent)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full gap-5">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Icon container */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${module.glowColor} 0%, rgba(0,0,0,0.4) 100%)`,
                    border: `1px solid ${module.borderColor}`,
                  }}
                >
                  <Icon className={`w-7 h-7 ${module.accentColor}`} />
                  {/* Icon shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${module.glowColor}, transparent)`,
                    }}
                    animate={{ opacity: isHovered ? [0, 0.6, 0] : 0 }}
                    transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                  />
                </div>
              </motion.div>

              {/* Title + subtitle */}
              <div>
                <h3 className="text-white font-semibold text-base leading-tight font-mono tracking-tight">
                  {module.title}
                </h3>
                <p className={`text-xs mt-0.5 font-mono tracking-widest uppercase ${module.accentColor} opacity-60`}>
                  {module.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center justify-between">
            <StatusDot type={module.statusType} label={module.statusLabel} />
            <div className="h-px flex-1 mx-3" style={{ background: `linear-gradient(90deg, ${module.borderColor}, transparent)` }} />
            <span className="text-[9px] font-mono text-white/20 tracking-widest">SYS/{module.id.toUpperCase().slice(0, 6)}</span>
          </div>

          {/* Description */}
          <p className="text-white/50 text-[13px] leading-relaxed font-light flex-1">
            {module.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {module.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wide"
                style={{
                  background: module.glowColor,
                  border: `1px solid ${module.borderColor}`,
                  color: module.borderColor.replace("rgba(", "").replace(", 0.3)", "").split(",").map((n) => parseInt(n)).join(","),
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Live data ticker */}
          <div
            className="rounded-lg px-3 py-2.5 font-mono"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${module.borderColor.replace("0.3", "0.15")}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Live Intelligence</span>
            </div>
            <LiveTicker items={module.liveData} accentColor={module.accentColor} />
          </div>

          {/* CTA row */}
          <motion.div
            className="flex items-center justify-between pt-1"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            <span className={`text-xs font-mono ${module.accentColor} tracking-widest`}>
              LAUNCH MODULE →
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 rounded-full"
                  style={{ background: module.borderColor }}
                  animate={{ scaleY: isHovered ? [1, 1.5 + i * 0.3, 1] : 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: isHovered ? Infinity : 0 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC = () => (
  <div className="text-center mb-20 relative z-10 px-4">
    {/* Overline */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center gap-4 mb-6"
    >
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
      <span className="text-[11px] font-mono tracking-[0.3em] text-cyan-400/60 uppercase">
        AI · Awareness · Intelligence
      </span>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
    </motion.div>

    {/* Title */}
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
      style={{ fontFamily: "'Space Grotesk', 'SF Pro Display', system-ui, sans-serif", letterSpacing: "-0.02em" }}
    >
      Command Center
      <span className="block text-transparent bg-clip-text"
        style={{ backgroundImage: "linear-gradient(135deg, #22d3ee 0%, #34d399 50%, #818cf8 100%)" }}>
        Core Modules
      </span>
    </motion.h2>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
    >
      Eleven AI-powered awareness systems designed to educate, protect, and empower
      citizens against the evolving landscape of cyber threats.
    </motion.p>

    {/* Animated divider */}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.4 }}
      className="mt-10 h-px max-w-lg mx-auto"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(52,211,153,0.5), transparent)",
      }}
    />

    {/* Live system count */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
      className="mt-6 flex items-center justify-center gap-6 text-[11px] font-mono text-white/30"
    >
      {[
        { label: "ACTIVE MODULES", value: "11" },
        { label: "THREAT VECTORS", value: "40+" },
        { label: "AWARENESS SYSTEMS", value: "ONLINE" },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400/60">{value}</span>
          <span>{label}</span>
        </div>
      ))}
    </motion.div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CoreModules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020408 0%, #040810 30%, #030609 70%, #020408 100%)",
      }}
    >
      {/* Background layers */}
      <CyberGrid />
      <FloatingParticles />

      {/* Atmospheric depth gradients */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-80 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-72 h-72 pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 auto-rows-fr">
          {CYBER_MODULES.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(52,211,153,0.06) 100%)",
              border: "1px solid rgba(34,211,238,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="text-left">
              <p className="text-white font-medium text-sm">All modules are free and educational</p>
              <p className="text-white/40 text-xs mt-0.5 font-mono">No data stored · No accounts required · Public cyber intelligence</p>
            </div>
            <motion.button
              type="button"
              onClick={() => navigate("/threat-feed")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-mono font-medium text-black relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)",
                boxShadow: "0 4px 20px rgba(34,211,238,0.3)",
              }}
            >
              <span className="relative z-10 tracking-widest text-xs">ENTER COMMAND CENTER</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreModules;