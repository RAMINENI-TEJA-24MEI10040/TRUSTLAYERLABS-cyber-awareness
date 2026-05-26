import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ThreatResult {
  ip: string;
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  confidence: number;
  abuseScore: number;
  botnetnProb: number;
  spamRep: number;
  isProxy: boolean;
  isVPN: boolean;
  isTOR: boolean;
  openPorts: number[];
  blacklisted: boolean;
  attackHistory: number;
  asn: string;
  isp: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  reverseDNS: string;
  hostname: string;
  netOwner: string;
  lat: number;
  lon: number;
  aiExplanation: string;
}

// ─── Mock data generator ──────────────────────────────────────────────────────
function generateMockResult(ip: string): ThreatResult {
  const seed = ip.split(".").reduce((a, b) => a + parseInt(b || "0"), 0) % 100;
  const isMalicious = seed > 70;
  const isSuspicious = seed > 40 && !isMalicious;
  const verdict: ThreatResult["verdict"] = isMalicious
    ? "MALICIOUS"
    : isSuspicious
    ? "SUSPICIOUS"
    : "SAFE";

  const explanations = {
    MALICIOUS: [
      "This IP address exhibits behavioral fingerprints consistent with Command & Control (C2) infrastructure used in multi-stage botnet operations. Elevated abuse scores, active blacklisting, and historical correlation with credential harvesting campaigns confirm elevated threat posture.",
      "Network telemetry reveals this host has been actively participating in distributed denial-of-service amplification attacks. Reverse DNS patterns match known bulletproof hosting providers frequently used to rotate malicious infrastructure.",
    ],
    SUSPICIOUS: [
      "This IP shows anomalous traffic patterns consistent with reconnaissance scanning and data exfiltration probing. VPN masking combined with anonymization indicators suggests deliberate infrastructure obfuscation typical of advanced persistent threat actors.",
      "Elevated spam reputation and proxy detection signals suggest this address may be part of a residential proxy network abused for credential stuffing and account takeover operations.",
    ],
    SAFE: [
      "IP intelligence correlation indicates this address maintains a clean reputation across monitored threat feeds. Geolocation data aligns with declared network ownership, and no anomalous behavioral patterns have been detected in recent analysis windows.",
      "This network endpoint presents a low-risk profile consistent with legitimate enterprise traffic. ISP attribution matches expected routing topology with no blacklisting events in the past 90 days.",
    ],
  };

  return {
    ip,
    verdict,
    confidence: isMalicious ? 87 + (seed % 12) : isSuspicious ? 55 + (seed % 25) : 92 + (seed % 7),
    abuseScore: isMalicious ? 75 + (seed % 24) : isSuspicious ? 30 + (seed % 35) : seed % 8,
    botnetnProb: isMalicious ? 70 + (seed % 28) : isSuspicious ? 20 + (seed % 30) : seed % 5,
    spamRep: isMalicious ? 60 + (seed % 35) : isSuspicious ? 25 + (seed % 40) : seed % 10,
    isProxy: isMalicious || (isSuspicious && seed % 2 === 0),
    isVPN: isMalicious && seed % 3 !== 0,
    isTOR: isMalicious && seed > 85,
    openPorts: isMalicious ? [22, 80, 443, 8080, 3389] : isSuspicious ? [80, 443, 8080] : [80, 443],
    blacklisted: isMalicious,
    attackHistory: isMalicious ? 12 + (seed % 40) : isSuspicious ? seed % 8 : 0,
    asn: `AS${10000 + seed * 137}`,
    isp: ["Cloudflare Inc.", "Amazon Technologies", "Digital Ocean LLC", "Hetzner Online GmbH", "OVH SAS"][seed % 5],
    country: ["United States", "Germany", "Netherlands", "Russia", "China"][seed % 5],
    region: ["California", "Bavaria", "North Holland", "Moscow Oblast", "Beijing"][seed % 5],
    city: ["San Francisco", "Munich", "Amsterdam", "Moscow", "Beijing"][seed % 5],
    timezone: ["America/Los_Angeles", "Europe/Berlin", "Europe/Amsterdam", "Europe/Moscow", "Asia/Shanghai"][seed % 5],
    reverseDNS: `host-${seed}.${["cloudflare", "amazon", "do-not-reply", "hetzner", "ovh"][seed % 5]}.com`,
    hostname: `node${seed}.${["edge", "gateway", "proxy", "cdn", "relay"][seed % 5]}-cluster.net`,
    netOwner: ["Cloudflare, Inc.", "Amazon.com, Inc.", "DigitalOcean, LLC", "Hetzner Online GmbH", "OVH Hosting"][seed % 5],
    lat: [37.7749, 48.1351, 52.3676, 55.7558, 39.9042][seed % 5],
    lon: [-122.4194, 11.582, 4.9041, 37.6176, 116.4074][seed % 5],
    aiExplanation: explanations[verdict][seed % 2],
  };
}

// ─── Particles ────────────────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(0,229,255,0.4)",
            boxShadow: "0 0 6px rgba(0,229,255,0.6)",
          }}
          animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Radar ────────────────────────────────────────────────────────────────────
function RadarRing() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {[1, 0.7, 0.45, 0.25].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            borderColor: `rgba(0,229,255,${0.08 + i * 0.06})`,
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
      <motion.div
        className="absolute w-full h-full rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, rgba(0,229,255,0.15) 60deg, transparent 61deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${48 + 38 * Math.cos((i * Math.PI * 2) / 6)}%`,
            top: `${48 + 38 * Math.sin((i * Math.PI * 2) / 6)}%`,
            background: "#00e5ff",
            boxShadow: "0 0 8px #00e5ff",
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, delay: (i * 0.3), repeat: Infinity }}
        />
      ))}
      <div className="relative z-10 text-center">
        <div className="text-[10px] text-cyan-400/60 tracking-widest font-mono">SCANNING</div>
        <div className="text-cyan-400 font-mono text-xs tracking-wider">LIVE</div>
      </div>
    </div>
  );
}

// ─── Pipeline Stage ───────────────────────────────────────────────────────────
const PIPELINE_STAGES = [
  { id: 1, label: "IPv4 / IPv6 Detection", icon: "◈", duration: 400 },
  { id: 2, label: "DNS Resolution", icon: "⬡", duration: 500 },
  { id: 3, label: "ASN Intelligence Mapping", icon: "◎", duration: 600 },
  { id: 4, label: "Geo Threat Correlation", icon: "⊕", duration: 500 },
  { id: 5, label: "Abuse Reputation Scan", icon: "⚠", duration: 700 },
  { id: 6, label: "Botnet Detection", icon: "⟳", duration: 600 },
  { id: 7, label: "VPN / Proxy Analysis", icon: "◈", duration: 500 },
  { id: 8, label: "Threat Intelligence Correlation", icon: "⬡", duration: 800 },
  { id: 9, label: "AI Risk Interpretation", icon: "◉", duration: 700 },
];

function PipelineView({ onComplete }: { onComplete: () => void }) {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    let idx = 0;
    function runNext() {
      if (idx >= PIPELINE_STAGES.length) {
        setTimeout(onComplete, 400);
        return;
      }
      setActiveStage(idx);
      setTimeout(() => {
        setCompletedStages((prev) => [...prev, idx]);
        idx++;
        setTimeout(runNext, 100);
      }, PIPELINE_STAGES[idx].duration);
    }
    runNext();
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="text-xs tracking-[0.3em] text-cyan-400/60 font-mono mb-2">INTELLIGENCE PIPELINE</div>
        <h2 className="text-2xl font-light text-white tracking-wide">Analyzing Threat Vectors</h2>
      </div>
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage, i) => {
          const isActive = activeStage === i;
          const isDone = completedStages.includes(i);
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-5 py-3 rounded border"
              style={{
                borderColor: isDone ? "rgba(0,229,255,0.3)" : isActive ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.04)",
                background: isDone ? "rgba(0,229,255,0.04)" : isActive ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.02)",
              }}
            >
              <span className="text-base w-5 text-center" style={{ color: isDone ? "#00e5ff" : isActive ? "#22d3ee" : "#334155" }}>
                {stage.icon}
              </span>
              <span className="flex-1 text-sm font-mono tracking-wider" style={{ color: isDone ? "#e2e8f0" : isActive ? "#ffffff" : "#475569" }}>
                {stage.label}
              </span>
              <div className="w-20 h-px relative overflow-hidden rounded">
                <div className="absolute inset-0 bg-slate-800" />
                {(isDone || isActive) && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: isDone ? "100%" : "60%" }}
                    transition={{ duration: isDone ? 0.3 : 0.5 }}
                  />
                )}
              </div>
              <div className="w-5 text-center">
                {isDone && <span className="text-cyan-400 text-xs">✓</span>}
                {isActive && (
                  <motion.span
                    className="block w-2 h-2 rounded-full bg-cyan-400 mx-auto"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Verdict Badge ────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: ThreatResult["verdict"] }) {
  const cfg = {
    SAFE: { color: "#22c55e", glow: "rgba(34,197,94,0.3)", label: "SAFE" },
    SUSPICIOUS: { color: "#f97316", glow: "rgba(249,115,22,0.3)", label: "SUSPICIOUS" },
    MALICIOUS: { color: "#ef4444", glow: "rgba(239,68,68,0.35)", label: "MALICIOUS" },
  }[verdict];
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-3 px-6 py-3 rounded border font-mono tracking-widest text-sm"
      style={{ borderColor: cfg.color, color: cfg.color, background: cfg.glow, boxShadow: `0 0 20px ${cfg.glow}` }}
    >
      <motion.span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      {cfg.label}
    </motion.div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricBar({ label, value, max = 100, danger = false }: { label: string; value: number; max?: number; danger?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = danger ? (pct > 70 ? "#ef4444" : pct > 40 ? "#f97316" : "#22d3ee") : "#22d3ee";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono text-slate-400">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
      </div>
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="px-4 py-3 rounded border border-cyan-400/10 bg-white/[0.02] hover:border-cyan-400/25 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-cyan-400/60 text-xs">{icon}</span>}
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{label}</span>
      </div>
      <div className="text-sm font-mono text-slate-200 truncate">{value}</div>
    </div>
  );
}

// ─── Bool Badge ───────────────────────────────────────────────────────────────
function BoolBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-mono ${value ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-cyan-400/15 bg-cyan-400/5 text-cyan-400/70"}`}>
      <span>{value ? "✗" : "✓"}</span>
      {label}
    </div>
  );
}

// ─── Attack Flow ──────────────────────────────────────────────────────────────
const ATTACK_STEPS = [
  { label: "Compromised Device", desc: "Initial breach via phishing or exploit", icon: "⬡" },
  { label: "Botnet Enrollment", desc: "Device silently joins malicious network", icon: "◈" },
  { label: "C2 Server Contact", desc: "Receives commands from operator", icon: "◎" },
  { label: "Mass Campaign Launch", desc: "Coordinated phishing wave deployed", icon: "⊕" },
  { label: "Credential Theft", desc: "Victims' credentials captured", icon: "◉" },
  { label: "Financial Fraud", desc: "Stolen access monetized", icon: "⬡" },
];

function AttackFlow() {
  return (
    <div className="relative">
      {ATTACK_STEPS.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4 mb-0"
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-10 h-10 rounded border flex items-center justify-center text-sm flex-shrink-0"
              style={{ borderColor: "rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.06)", color: "#00e5ff" }}
              whileInView={{ boxShadow: ["0 0 0px #00e5ff", "0 0 12px #00e5ff", "0 0 0px #00e5ff"] }}
              transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
            >
              {step.icon}
            </motion.div>
            {i < ATTACK_STEPS.length - 1 && (
              <motion.div
                className="w-px flex-1 my-1"
                style={{ background: "rgba(0,229,255,0.2)" }}
                initial={{ height: 0 }}
                whileInView={{ height: 40 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              />
            )}
          </div>
          <div className="pb-8">
            <div className="text-sm font-mono text-white tracking-wide">{step.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{step.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Cyber Facts ──────────────────────────────────────────────────────────────
const CYBER_FACTS = [
  "Botnets generate over 25 billion malicious requests every single day.",
  "Open ports expose services to automated exploitation within minutes of exposure.",
  "Compromised IoT devices are commonly weaponized in DDoS attacks exceeding 1 Tbps.",
  "VPN masking is used in over 40% of documented phishing infrastructure campaigns.",
  "Malicious actors rotate IP addresses every 2–6 hours to evade detection systems.",
  "Over 90% of successful cyberattacks begin with a phishing email.",
  "Ransomware attacks occur every 11 seconds globally.",
  "Dark web IP leasing allows attackers to rent clean addresses for targeted attacks.",
];

function CyberFacts() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % CYBER_FACTS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative overflow-hidden h-16 flex items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-mono text-cyan-300/80 text-center w-full px-4"
        >
          <span className="text-cyan-400 mr-2">◈</span>
          {CYBER_FACTS[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Globe Dots (SVG fake globe) ──────────────────────────────────────────────
function CyberGlobe() {
  const dots = Array.from({ length: 80 }, () => {
    const lat = (Math.random() - 0.5) * Math.PI;
    const lon = Math.random() * 2 * Math.PI;
    const r = 90;
    const x = 110 + r * Math.cos(lat) * Math.cos(lon);
    const y = 110 + r * Math.sin(lat);
    return { x, y, size: Math.random() * 1.5 + 0.5 };
  });
  const lines = Array.from({ length: 8 }, (_, i) => {
    const a = dots[i * 5];
    const b = dots[i * 5 + 10];
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });
  return (
    <motion.svg width="220" height="220" viewBox="0 0 220 220" className="opacity-80">
      <defs>
        <radialGradient id="gGlobe" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#050816" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="95" fill="url(#gGlobe)" stroke="rgba(0,229,255,0.12)" strokeWidth="1" />
      {[...Array(5)].map((_, i) => (
        <motion.circle key={i} cx="110" cy="110" r={20 + i * 18} fill="none" stroke="rgba(0,229,255,0.05)" strokeWidth="0.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }} />
      ))}
      {lines.map((l, i) => (
        <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(0,229,255,0.2)" strokeWidth="0.5"
          animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }} />
      ))}
      {dots.map((d, i) => (
        <motion.circle key={i} cx={d.x} cy={d.y} r={d.size} fill="#00e5ff"
          animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.5 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }} />
      ))}
    </motion.svg>
  );
}

// ─── Educational Section ──────────────────────────────────────────────────────
const EDU_TOPICS = [
  {
    title: "What is an IP Address?",
    icon: "◎",
    content: "An Internet Protocol address is a unique numerical label assigned to every device connected to a network. It serves two fundamental purposes: host identification and location addressing. Like a postal address for data packets, IPs enable information to be routed across the global internet.",
  },
  {
    title: "IPv4 vs IPv6",
    icon: "⬡",
    content: "IPv4 uses 32-bit addresses (e.g., 192.168.1.1), supporting ~4.3 billion unique addresses — nearly exhausted. IPv6 uses 128-bit addresses (e.g., 2001:db8::1), providing 340 undecillion unique addresses. IPv6 adoption is accelerating as the internet scales.",
  },
  {
    title: "DNS: The Internet's Directory",
    icon: "◈",
    content: "Domain Name System translates human-readable domain names into IP addresses. When you visit a website, your device queries DNS resolvers in a hierarchical chain — from root servers to authoritative nameservers — to locate the destination IP. Attackers exploit DNS for tunneling and data exfiltration.",
  },
  {
    title: "How Attackers Hide Infrastructure",
    icon: "⊕",
    content: "Threat actors use bulletproof hosting, residential proxies, VPN services, and TOR to obscure attack origins. Fast-flux DNS rapidly rotates IPs behind domain names, making attribution and takedowns extremely difficult for defenders and law enforcement.",
  },
  {
    title: "Botnet Architecture",
    icon: "◉",
    content: "Botnets are networks of compromised devices controlled by a central command-and-control (C2) server. Operators issue instructions to thousands or millions of bots simultaneously — launching DDoS floods, sending spam, stealing credentials, or mining cryptocurrency.",
  },
  {
    title: "Proxy & VPN Abuse Patterns",
    icon: "⬡",
    content: "While VPNs serve legitimate privacy purposes, cybercriminals abuse them to anonymize malicious activity. Residential proxies — routing traffic through real consumer devices — are particularly hard to block without impacting legitimate users, making them favored by fraud actors.",
  },
];

function EducationalSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {EDU_TOPICS.map((topic, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded border border-cyan-400/10 bg-white/[0.02] overflow-hidden cursor-pointer hover:border-cyan-400/25 transition-colors"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="text-cyan-400 text-base">{topic.icon}</span>
            <span className="text-sm font-mono text-white flex-1">{topic.title}</span>
            <motion.span className="text-cyan-400/50 text-xs" animate={{ rotate: open === i ? 90 : 0 }}>▶</motion.span>
          </div>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-4"
              >
                <p className="text-xs text-slate-400 leading-relaxed border-t border-cyan-400/10 pt-3">{topic.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────────
function ResultsPanel({ result, onReset }: { result: ThreatResult; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto space-y-6 py-8">
      {/* Verdict */}
      <div className="text-center space-y-3">
        <div className="text-[10px] tracking-[0.35em] text-cyan-400/50 font-mono">THREAT VERDICT</div>
        <VerdictBadge verdict={result.verdict} />
        <div className="text-xs font-mono text-slate-400">Analysis confidence: <span className="text-cyan-400">{result.confidence}%</span></div>
      </div>

      {/* Threat metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded border border-cyan-400/10 bg-white/[0.02]">
        <div className="space-y-4">
          <div className="text-[10px] tracking-widest text-cyan-400/50 font-mono mb-3">THREAT INDICATORS</div>
          <MetricBar label="Abuse Score" value={result.abuseScore} danger />
          <MetricBar label="Botnet Probability" value={result.botnetnProb} danger />
          <MetricBar label="Spam Reputation" value={result.spamRep} danger />
        </div>
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest text-cyan-400/50 font-mono mb-3">DETECTION FLAGS</div>
          <BoolBadge label="Proxy Detected" value={result.isProxy} />
          <BoolBadge label="VPN Masking" value={result.isVPN} />
          <BoolBadge label="TOR Exit Node" value={result.isTOR} />
          <BoolBadge label="Blacklisted" value={result.blacklisted} />
        </div>
      </div>

      {/* Network info */}
      <div className="p-5 rounded border border-cyan-400/10 bg-white/[0.02]">
        <div className="text-[10px] tracking-widest text-cyan-400/50 font-mono mb-4">NETWORK INTELLIGENCE</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <InfoCard label="IP Address" value={result.ip} icon="◈" />
          <InfoCard label="ASN" value={result.asn} icon="⬡" />
          <InfoCard label="ISP" value={result.isp} icon="◎" />
          <InfoCard label="Country" value={result.country} icon="⊕" />
          <InfoCard label="Region" value={result.region} icon="◉" />
          <InfoCard label="Timezone" value={result.timezone} icon="◈" />
          <InfoCard label="Reverse DNS" value={result.reverseDNS} icon="⬡" />
          <InfoCard label="Hostname" value={result.hostname} icon="◎" />
          <InfoCard label="Network Owner" value={result.netOwner} icon="⊕" />
          {result.openPorts.length > 0 && (
            <InfoCard label="Open Ports" value={result.openPorts.join(", ")} icon="◈" />
          )}
          {result.attackHistory > 0 && (
            <InfoCard label="Attack Events" value={`${result.attackHistory} recorded`} icon="⚠" />
          )}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="p-5 rounded border border-cyan-400/20 bg-cyan-400/[0.03]">
        <div className="flex items-center gap-2 mb-3">
          <motion.span className="text-cyan-400" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}>◉</motion.span>
          <span className="text-[10px] tracking-widest text-cyan-400/60 font-mono">AI THREAT ANALYSIS</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-light">{result.aiExplanation}</p>
      </div>

      {/* Reset */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3 rounded border border-cyan-400/40 text-cyan-400 font-mono text-sm tracking-widest hover:bg-cyan-400/10 transition-all"
        >
          ANALYZE ANOTHER IP
        </button>
      </div>
    </motion.div>
  );
}

// ─── Threat Map ───────────────────────────────────────────────────────────────
function ThreatMap() {
  const attackLines = [
    { x1: 15, y1: 30, x2: 55, y2: 50 },
    { x1: 70, y1: 20, x2: 55, y2: 50 },
    { x1: 80, y1: 60, x2: 55, y2: 50 },
    { x1: 20, y1: 70, x2: 55, y2: 50 },
    { x1: 45, y1: 15, x2: 55, y2: 50 },
    { x1: 90, y1: 35, x2: 55, y2: 50 },
  ];
  const nodes = [
    { x: 15, y: 30, threat: true },
    { x: 70, y: 20, threat: true },
    { x: 80, y: 60, threat: true },
    { x: 20, y: 70, threat: false },
    { x: 45, y: 15, threat: true },
    { x: 90, y: 35, threat: true },
    { x: 55, y: 50, threat: false, hub: true },
  ];
  return (
    <div className="relative w-full h-64 rounded border border-cyan-400/10 bg-slate-950/60 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
        {/* Grid */}
        {[...Array(10)].map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="80" stroke="rgba(0,229,255,0.04)" strokeWidth="0.3" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(0,229,255,0.04)" strokeWidth="0.3" />
        ))}
        {attackLines.map((l, i) => (
          <motion.line key={i} x1={`${l.x1}%`} y1={`${l.y1}%`} x2={`${l.x2}%`} y2={`${l.y2}%`}
            stroke="rgba(239,68,68,0.5)" strokeWidth="0.5"
            animate={{ opacity: [0.2, 0.8, 0.2], strokeWidth: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + i * 0.3, delay: i * 0.4, repeat: Infinity }} />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.hub ? 3 : 1.5}
              fill={n.hub ? "#22d3ee" : n.threat ? "#ef4444" : "#22d3ee"}
              animate={{ r: n.hub ? [2.5, 3.5, 2.5] : [1.2, 2, 1.2], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} />
            <motion.circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.hub ? 6 : 4} fill="none"
              stroke={n.hub ? "rgba(34,211,238,0.3)" : "rgba(239,68,68,0.25)"} strokeWidth="0.5"
              animate={{ r: n.hub ? [4, 8, 4] : [3, 6, 3], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] font-mono">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Attack Origin</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Target Node</span>
      </div>
      <div className="absolute top-3 right-4 text-[10px] font-mono text-cyan-400/50 tracking-widest">LIVE THREAT FEED</div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="py-16 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-[10px] tracking-[0.35em] text-cyan-400/50 font-mono mb-2">{subtitle}</div>
          <h2 className="text-2xl font-light text-white tracking-wide">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ip, setIp] = useState("");
  const [phase, setPhase] = useState<"hero" | "scanning" | "results">("hero");
  const [result, setResult] = useState<ThreatResult | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!ip.trim()) return;
    setPhase("scanning");
  }, [ip]);

  const handlePipelineComplete = useCallback(() => {
    setResult(generateMockResult(ip.trim()));
    setPhase("results");
  }, [ip]);

  const handleReset = useCallback(() => {
    setIp("");
    setResult(null);
    setPhase("hero");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen font-mono" style={{ background: "#050816", color: "#e2e8f0" }}>
      <FloatingParticles />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-white/[0.05] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div className="w-6 h-6 rounded border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xs"
              animate={{ boxShadow: ["0 0 4px rgba(0,229,255,0.3)", "0 0 12px rgba(0,229,255,0.6)", "0 0 4px rgba(0,229,255,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}>◈</motion.div>
            <span className="text-xs tracking-[0.25em] text-white/80">TRUSTLAYERLABS</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] tracking-widest text-slate-500">
            <span className="hidden md:block">IP THREAT INTELLIGENCE</span>
            <div className="flex items-center gap-1.5">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-cyan-400/70">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[400, 600, 800].map((sz, i) => (
            <motion.div key={i} className="absolute rounded-full border" style={{ width: sz, height: sz, borderColor: "rgba(0,229,255,0.04)" }}
              animate={{ scale: [1, 1.03, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 5, delay: i * 1.2, repeat: Infinity }} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] tracking-[0.5em] text-cyan-400/50 mb-8">
          INTELLIGENCE COMMAND CENTER
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-light tracking-tight text-white mb-6 max-w-3xl leading-tight"
          style={{ textShadow: "0 0 40px rgba(0,229,255,0.15)" }}>
          TRACE THE THREATS<br />
          <span style={{ color: "#00e5ff" }}>BEFORE THEY TRACE YOU</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-sm text-slate-400 max-w-xl mb-12 leading-relaxed font-light">
          AI-powered IP intelligence that analyzes malicious infrastructure, attack origins, botnets, abuse reports, VPN masking, and cyber threat patterns.
        </motion.p>

        {/* Globe + Radar */}
        <div className="flex items-center justify-center gap-12 mb-12">
          <div className="hidden md:block"><CyberGlobe /></div>
          <RadarRing />
          <div className="hidden md:block opacity-60" style={{ transform: "scaleX(-1)" }}><CyberGlobe /></div>
        </div>

        {/* Cyber facts */}
        <div className="w-full max-w-xl mb-8 rounded border border-cyan-400/10 bg-white/[0.02] py-1">
          <CyberFacts />
        </div>

        {/* Input */}
        <AnimatePresence>
          {phase === "hero" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-md space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Enter IP address — e.g. 8.8.8.8"
                  className="w-full px-5 py-4 rounded border bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-mono tracking-wider"
                  style={{ borderColor: ip ? "rgba(0,229,255,0.4)" : "rgba(255,255,255,0.08)", boxShadow: ip ? "0 0 20px rgba(0,229,255,0.08)" : "none" }}
                />
                {ip && (
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleAnalyze}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded border text-sm tracking-widest font-mono transition-all"
                  style={{ borderColor: "rgba(0,229,255,0.5)", color: "#00e5ff", background: "rgba(0,229,255,0.08)" }}
                >
                  ANALYZE IP
                </motion.button>
                <motion.button
                  onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded border text-sm tracking-widest font-mono transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}
                >
                  LEARN THREATS
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "scanning" && (
          <div className="w-full max-w-2xl">
            <PipelineView onComplete={handlePipelineComplete} />
          </div>
        )}

        {phase === "results" && result && (
          <ResultsPanel result={result} onReset={handleReset} />
        )}
      </section>

      {/* ── THREAT MAP ─────────────────────────────────────────────────────── */}
      <Section subtitle="GLOBAL INTELLIGENCE" title="Live Threat Map">
        <ThreatMap />
        <p className="text-xs text-slate-500 mt-3">Animated representation of active attack vectors being monitored across threat intelligence feeds.</p>
      </Section>

      {/* ── ATTACK FLOW ────────────────────────────────────────────────────── */}
      <Section subtitle="ATTACK CHAIN ANALYSIS" title="Cyber Attack Lifecycle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <AttackFlow />
          <div className="space-y-4">
            <p className="text-sm text-slate-400 leading-relaxed">Modern cyberattacks follow predictable operational patterns. Understanding attack chains enables defenders to identify indicators of compromise (IOCs) at each stage and break the kill chain before impact.</p>
            <div className="p-4 rounded border border-cyan-400/15 bg-cyan-400/[0.03] text-xs text-cyan-300/80 leading-relaxed">
              <span className="text-cyan-400 font-mono">◉ AI INSIGHT — </span>
              IP intelligence analysis can identify C2 servers, botnet enrollment endpoints, and phishing infrastructure at the network layer — often before campaigns reach end users.
            </div>
          </div>
        </div>
      </Section>

      {/* ── EDUCATION ──────────────────────────────────────────────────────── */}
      <div id="education">
        <Section subtitle="CYBER AWARENESS" title="Intelligence Education">
          <EducationalSection />
        </Section>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[10px] tracking-[0.4em] text-cyan-400/40 font-mono mb-6">COMMAND CENTER</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
            EVERY CONNECTION<br /><span className="text-cyan-400">TELLS A STORY.</span>
          </motion.h2>
          <p className="text-sm text-slate-500 mb-10">Analyze IPs. Understand threats. Stay informed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleReset}
              className="px-8 py-3 rounded border border-cyan-400/50 text-cyan-400 font-mono text-sm tracking-widest hover:bg-cyan-400/10 transition-all">
              ANALYZE ANOTHER IP
            </button>
            <button onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 rounded border border-white/10 text-slate-400 font-mono text-sm tracking-widest hover:border-white/20 transition-all">
              EXPLORE AWARENESS
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] px-6 py-6 text-center text-[10px] font-mono text-slate-600 tracking-widest">
        TRUSTLAYERLABS — IP THREAT INTELLIGENCE COMMAND CENTER &nbsp;◈&nbsp; FOR EDUCATIONAL AND AWARENESS PURPOSES
      </footer>
    </div>
  );
}