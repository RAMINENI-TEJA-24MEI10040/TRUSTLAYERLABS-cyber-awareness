import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem { value: string; label: string; accent: string }
interface AttackStep { icon: string; label: string; detail: string }
interface DetectionSignal { label: string; value: number; color: string }
interface ScamCard { type: string; target: string; vector: string; outcome: string; severity: "CRITICAL" | "HIGH" | "MEDIUM" }

// ─── Constants ────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
  { value: "96%", label: "of deepfakes target women", accent: "#ff2d55" },
  { value: "3,000%", label: "surge in deepfake fraud 2023–2025", accent: "#00e5ff" },
  { value: "$25M", label: "lost in single deepfake CFO scam", accent: "#ff2d55" },
  { value: "8 sec", label: "voice clone requires only 8 seconds of audio", accent: "#a78bfa" },
  { value: "90%", label: "of humans cannot detect quality deepfakes", accent: "#ff2d55" },
  { value: "500K+", label: "synthetic media pieces circulate daily", accent: "#00e5ff" },
];

const ATTACK_CHAIN: AttackStep[] = [
  { icon: "◉", label: "Target Identity", detail: "Social media, leaked data, public records harvested" },
  { icon: "⊕", label: "Voice & Data Collection", detail: "Audio scraping, video mining, behavioral mapping" },
  { icon: "⊗", label: "AI Model Training", detail: "GAN / diffusion models trained on target's likeness" },
  { icon: "◈", label: "Synthetic Media Generation", detail: "Hyper-realistic video, voice, and text fabricated" },
  { icon: "◎", label: "Victim Manipulation", detail: "Deployed via social platforms, calls, deepfake meetings" },
  { icon: "⊘", label: "Financial / Political Abuse", detail: "Fraud executed, reputation destroyed, narrative hijacked" },
];

const DETECTION_SIGNALS: DetectionSignal[] = [
  { label: "Facial Boundary Coherence", value: 23, color: "#ff2d55" },
  { label: "Eye Blink Pattern", value: 41, color: "#ff6b35" },
  { label: "Lip Sync Accuracy", value: 58, color: "#ffd60a" },
  { label: "Lighting Consistency", value: 34, color: "#ff2d55" },
  { label: "Hair / Edge Artifacts", value: 19, color: "#ff2d55" },
  { label: "Audio-Visual Sync", value: 67, color: "#a78bfa" },
];

const SCAM_CARDS: ScamCard[] = [
  {
    type: "CEO Voice Fraud",
    target: "Corporate Finance Teams",
    vector: "AI voice clone of executive via phone call",
    outcome: "Wire transfer of $25M+ to attacker accounts",
    severity: "CRITICAL",
  },
  {
    type: "Political Disinfo",
    target: "Voting Public",
    vector: "Fabricated candidate speech deployed pre-election",
    outcome: "Narrative shift, voter suppression, trust erosion",
    severity: "CRITICAL",
  },
  {
    type: "Celebrity Scam Ads",
    target: "General Public",
    vector: "Deepfake endorsement of fraudulent products",
    outcome: "Mass financial fraud, reputational damage",
    severity: "HIGH",
  },
  {
    type: "Romance Deepfake",
    target: "Vulnerable Individuals",
    vector: "AI-generated persona sustains long-term relationship",
    outcome: "Emotional manipulation, financial extortion",
    severity: "HIGH",
  },
  {
    type: "Synthetic KYC Bypass",
    target: "Financial Institutions",
    vector: "AI-generated face defeats identity verification",
    outcome: "Account takeover, money laundering",
    severity: "CRITICAL",
  },
  {
    type: "Deepfake Courtroom",
    target: "Legal Proceedings",
    vector: "Fabricated evidence video submitted as genuine",
    outcome: "Wrongful conviction, case corruption",
    severity: "HIGH",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NeuralParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const alpha = 0.3 + 0.2 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function HolographicFace() {
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Outer radar rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400/20"
          style={{ inset: `${i * 14}px` }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Rotating scan ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 70%, rgba(0,229,255,0.6) 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Face silhouette grid */}
      <div className="absolute inset-8 rounded-full overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-70">
          <defs>
            <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="95" rx="55" ry="70" fill="url(#faceGrad)" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.4" />
          {/* Mesh lines horizontal */}
          {[55, 65, 75, 85, 95, 105, 115, 125, 135].map((y) => (
            <line key={y} x1="50" y1={y} x2="150" y2={y} stroke="#00e5ff" strokeWidth="0.3" strokeOpacity="0.25" />
          ))}
          {/* Mesh lines vertical */}
          {[60, 72, 84, 96, 108, 120, 132, 140].map((x) => (
            <line key={x} x1={x} y1="30" x2={x} y2="160" stroke="#00e5ff" strokeWidth="0.3" strokeOpacity="0.25" />
          ))}
          {/* Eye markers */}
          <circle cx="78" cy="85" r="7" fill="none" stroke="#ff2d55" strokeWidth="1" strokeOpacity="0.8" />
          <circle cx="122" cy="85" r="7" fill="none" stroke="#ff2d55" strokeWidth="1" strokeOpacity="0.8" />
          {/* Nose bridge */}
          <path d="M100 92 L94 112 L106 112" fill="none" stroke="#00e5ff" strokeWidth="0.6" strokeOpacity="0.5" />
          {/* Mouth */}
          <path d="M83 125 Q100 135 117 125" fill="none" stroke="#00e5ff" strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Jawline */}
          <path d="M55 100 Q50 140 100 160 Q150 140 145 100" fill="none" stroke="#06b6d4" strokeWidth="0.6" strokeOpacity="0.4" />
          {/* Forehead scan marker */}
          <rect x="88" y="35" width="24" height="8" rx="1" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1="100" y1="43" x2="100" y2="50" stroke="#a78bfa" strokeWidth="0.5" strokeOpacity="0.5" />
        </svg>

        {/* Horizontal scan beam */}
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.8), transparent)" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Corner brackets */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-5 h-5 border-cyan-400 ${cls}`} />
      ))}

      {/* ANALYZING label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-cyan-400 font-mono"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ANALYZING AUTHENTICITY
      </motion.div>
    </div>
  );
}

function WaveformAnalysis() {
  const bars = Array.from({ length: 48 }, (_, i) => i);
  return (
    <div className="relative bg-[#070b1a] border border-cyan-900/40 rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono text-cyan-400/70 tracking-widest">VOICE PATTERN ANALYSIS</span>
        <div className="ml-auto text-xs font-mono text-red-400">⚠ SYNTHETIC DETECTED</div>
      </div>
      <div className="flex items-center gap-0.5 h-16">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ background: i > 18 && i < 28 ? "#ff2d55" : "#00e5ff" }}
            animate={{
              height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
              opacity: i > 18 && i < 28 ? [0.6, 1, 0.6] : [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.02 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-mono text-cyan-900">
        <span>0.0s</span>
        <span className="text-red-500/70">↑ ANOMALY REGION</span>
        <span>4.2s</span>
      </div>
    </div>
  );
}

function AuthenticityMeter({ value, label }: { value: number; label: string }) {
  const color = value < 40 ? "#ff2d55" : value < 70 ? "#ffd60a" : "#00e5ff";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-cyan-400/60">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Deepfake() {
  const [activeScam, setActiveScam] = useState<number | null>(null);
  const [callSimActive, setCallSimActive] = useState(false);
  const [callPhase, setCallPhase] = useState(0);
  const callLines = [
    { speaker: "CALLER", text: "Hi, this is Sarah from HR. We need to verify your credentials urgently.", synthetic: true },
    { speaker: "YOU", text: "Oh — okay, sure. What do you need?", synthetic: false },
    { speaker: "CALLER", text: "Please confirm your employee ID and current system password.", synthetic: true },
    { speaker: "SYSTEM", text: "⚠ SYNTHETIC VOICE SIGNATURE DETECTED — CALL TERMINATED", synthetic: null },
  ];

  useEffect(() => {
    if (!callSimActive) { setCallPhase(0); return; }
    const timers = callLines.map((_, i) =>
      setTimeout(() => setCallPhase(i + 1), i * 2200)
    );
    return () => timers.forEach(clearTimeout);
  }, [callSimActive]);

  const severityColor = (s: ScamCard["severity"]) =>
    s === "CRITICAL" ? "#ff2d55" : s === "HIGH" ? "#ff6b35" : "#ffd60a";

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#050816",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        .orbitron { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glow-cyan { text-shadow: 0 0 20px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.3); }
        .glow-red { text-shadow: 0 0 20px rgba(255,45,85,0.6); }
        .panel { background: linear-gradient(135deg, rgba(7,11,26,0.95) 0%, rgba(10,16,32,0.9) 100%); border: 1px solid rgba(0,229,255,0.12); }
        .panel-red { background: linear-gradient(135deg, rgba(20,5,10,0.95) 0%, rgba(10,16,32,0.9) 100%); border: 1px solid rgba(255,45,85,0.2); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #050816; } ::-webkit-scrollbar-thumb { background: #00e5ff33; border-radius: 2px; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <NeuralParticles />

        {/* Radial background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }} />
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px)" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
            style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)" }}
          >
            <motion.div className="w-2 h-2 rounded-full bg-red-500" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-xs tracking-[0.25em] text-cyan-400/80 orbitron">TRUSTLAYERLABS · SYNTHETIC MEDIA INTELLIGENCE</span>
          </motion.div>

          {/* Face */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-10"
          >
            <HolographicFace />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="orbitron text-5xl md:text-7xl font-black mb-4 leading-tight"
          >
            <span className="glow-cyan" style={{ color: "#00e5ff" }}>DEEP</span>
            <span style={{ color: "#ffffff" }}>FAKE</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="orbitron text-lg md:text-xl tracking-[0.4em] text-cyan-400/50 mb-6"
          >
            SYNTHETIC MEDIA · IDENTITY WARFARE
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-base text-cyan-100/50 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            AI-generated impersonation has become the most dangerous vector in modern cyber warfare.
            Voices, faces, and entire identities are being synthesized, weaponized, and deployed at scale.
            This is not science fiction. This is happening now.
          </motion.p>

          {/* CTA indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center justify-center gap-6 text-xs tracking-widest text-cyan-900"
          >
            {["VOICE CLONING", "FACE SYNTHESIS", "IDENTITY FRAUD", "POLITICAL DISINFO"].map((t) => (
              <span key={t} className="hidden md:block">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[10px] tracking-[0.3em] text-cyan-900 orbitron">SCROLL TO INVESTIGATE</div>
          <div className="w-px h-8" style={{ background: "linear-gradient(180deg, rgba(0,229,255,0.4), transparent)" }} />
        </motion.div>
      </section>

      {/* ── STATISTICS BAR ───────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-16 px-6" style={{ background: "#070b1a", borderTop: "1px solid rgba(0,229,255,0.08)", borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-2">THREAT INTELLIGENCE BRIEF</div>
              <h2 className="orbitron text-2xl font-bold text-white">THE SCALE OF SYNTHETIC DECEPTION</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="panel rounded-lg p-4 text-center"
                >
                  <div className="orbitron text-2xl font-black mb-1" style={{ color: s.accent }}>{s.value}</div>
                  <div className="text-[10px] text-cyan-400/50 leading-tight">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── HOW DEEPFAKES FOOL HUMANS ─────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.4em] text-red-400/70 orbitron mb-3">COGNITIVE VULNERABILITY ANALYSIS</div>
              <h2 className="orbitron text-3xl font-bold text-white mb-6">How Deepfakes <span className="glow-red" style={{ color: "#ff2d55" }}>Fool</span> Human Perception</h2>
              <div className="space-y-5 text-sm text-cyan-100/50 leading-relaxed">
                <p>Human brains are evolutionarily wired to trust familiar faces and voices. Deepfake technology exploits these cognitive shortcuts by generating synthetic media that triggers the same neural trust pathways as authentic stimuli.</p>
                <p>When we recognize a known voice or face, critical thinking is suppressed. The brain says "I know this person" — and compliance follows. Threat actors know this. They weaponize it.</p>
                <p>Advanced generative models now produce outputs indistinguishable from reality at a perceptual level. Standard visual inspection fails in over 90% of cases when exposed to current-generation deepfakes.</p>
              </div>
              <div className="mt-8 space-y-3">
                {DETECTION_SIGNALS.map((sig, i) => (
                  <AuthenticityMeter key={i} label={sig.label} value={sig.value} />
                ))}
                <div className="mt-3 text-[10px] text-cyan-900 font-mono">↑ FORENSIC SCORE: Example deepfake analysis — all metrics degraded</div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Authenticity panel */}
              <div className="panel rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs orbitron text-cyan-400/70 tracking-widest">SYNTHETIC MEDIA SCAN</span>
                  <motion.span
                    className="text-xs font-bold text-red-400 orbitron"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >⚠ FABRICATED</motion.span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "FACE", score: "12%", flag: true },
                    { label: "VOICE", score: "8%", flag: true },
                    { label: "CONTEXT", score: "71%", flag: false },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded" style={{ background: item.flag ? "rgba(255,45,85,0.08)" : "rgba(0,229,255,0.05)", border: `1px solid ${item.flag ? "rgba(255,45,85,0.3)" : "rgba(0,229,255,0.1)"}` }}>
                      <div className="text-lg font-black orbitron" style={{ color: item.flag ? "#ff2d55" : "#00e5ff" }}>{item.score}</div>
                      <div className="text-[10px] text-white/40 mt-1">{item.label}</div>
                      <div className="text-[9px] mt-1" style={{ color: item.flag ? "#ff2d55" : "#00e5ff" }}>{item.flag ? "SYNTHETIC" : "AUTHENTIC"}</div>
                    </div>
                  ))}
                </div>
                <WaveformAnalysis />
              </div>

              {/* Manipulation heatmap */}
              <div className="panel rounded-lg p-5">
                <div className="text-xs orbitron text-cyan-400/70 tracking-widest mb-3">MANIPULATION HEATMAP — DETECTED REGIONS</div>
                <div className="relative h-32 rounded overflow-hidden" style={{ background: "#0a1020" }}>
                  {/* Grid */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-20">
                    {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ border: "0.5px solid #00e5ff20" }} />)}
                  </div>
                  {/* Hotspots */}
                  {[
                    { top: "15%", left: "28%", w: 60, h: 50, color: "rgba(255,45,85,0.35)", label: "EYE REGION" },
                    { top: "55%", left: "38%", w: 40, h: 25, color: "rgba(255,107,53,0.3)", label: "MOUTH" },
                    { top: "5%", left: "55%", w: 30, h: 20, color: "rgba(255,45,85,0.2)", label: "HAIRLINE" },
                  ].map((h, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-sm flex items-center justify-center"
                      style={{ top: h.top, left: h.left, width: h.w, height: h.h, background: h.color, border: "1px solid rgba(255,45,85,0.5)" }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <span className="text-[8px] text-red-300 font-mono">{h.label}</span>
                    </motion.div>
                  ))}
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-900">GAN ARTIFACT DETECTION v4.2</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── ATTACK CHAIN ─────────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6" style={{ background: "#070b1a", borderTop: "1px solid rgba(0,229,255,0.06)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-3">SYNTHETIC MEDIA ATTACK CHAIN</div>
              <h2 className="orbitron text-3xl font-bold text-white">From Identity to <span style={{ color: "#ff2d55" }} className="glow-red">Exploitation</span></h2>
              <p className="text-sm text-cyan-100/40 mt-3 max-w-xl mx-auto">How threat actors build, deploy, and monetize synthetic identity attacks in 6 stages</p>
            </div>

            <div className="relative">
              {/* Vertical connector */}
              <div className="absolute left-6 top-8 bottom-8 w-px hidden md:block" style={{ background: "linear-gradient(180deg, rgba(0,229,255,0.4), rgba(255,45,85,0.4))" }} />

              <div className="space-y-4">
                {ATTACK_CHAIN.map((step, i) => {
                  const progress = i / (ATTACK_CHAIN.length - 1);
                  const color = `rgba(${Math.round(255 * progress)},${Math.round(229 * (1 - progress))},${Math.round(255 * (1 - progress))},1)`;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-start gap-5 panel rounded-lg p-5 md:ml-12 relative group hover:border-cyan-400/30 transition-all duration-300"
                    >
                      {/* Node */}
                      <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ background: "#070b1a", border: `1px solid ${color}` }}>
                        <motion.div className="w-2 h-2 rounded-full" style={{ background: color }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                      </div>

                      <div className="text-2xl" style={{ color }}>{step.icon}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] orbitron tracking-widest text-cyan-900">PHASE {i + 1}</span>
                          <div className="flex-1 h-px bg-cyan-900/20" />
                        </div>
                        <div className="orbitron text-sm font-bold text-white mb-1">{step.label}</div>
                        <div className="text-xs text-cyan-100/40">{step.detail}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── VOICE CLONE SIMULATOR ─────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-red-400/70 orbitron mb-3">INTERACTIVE SIMULATION</div>
            <h2 className="orbitron text-3xl font-bold text-white">AI Scam Call <span style={{ color: "#ff2d55" }} className="glow-red">Simulation</span></h2>
            <p className="text-sm text-cyan-100/40 mt-3 max-w-lg mx-auto">Experience how a deepfake voice call unfolds. This is an educational reconstruction of real attack patterns.</p>
          </div>

          <div className="panel-red rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg orbitron"
                  style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)" }}>☎</div>
                <div>
                  <div className="text-sm font-bold text-white">INCOMING CALL</div>
                  <div className="text-xs text-cyan-400/50 font-mono">+1 (202) 555-0147 · HR DEPARTMENT</div>
                </div>
              </div>
              <motion.div
                className="text-[10px] orbitron text-red-400 tracking-widest"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {callSimActive && callPhase < callLines.length ? "● LIVE" : callPhase >= callLines.length ? "TERMINATED" : "STANDBY"}
              </motion.div>
            </div>

            {/* Call transcript */}
            <div className="space-y-3 min-h-[200px] mb-5">
              <AnimatePresence>
                {callLines.slice(0, callPhase).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: line.synthetic === false ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${line.synthetic === false ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[80%] rounded-lg px-4 py-2.5"
                      style={{
                        background: line.synthetic === null
                          ? "rgba(255,45,85,0.15)"
                          : line.synthetic
                          ? "rgba(0,229,255,0.07)"
                          : "rgba(167,139,250,0.1)",
                        border: `1px solid ${line.synthetic === null ? "rgba(255,45,85,0.4)" : line.synthetic ? "rgba(0,229,255,0.15)" : "rgba(167,139,250,0.2)"}`,
                      }}
                    >
                      <div className="text-[9px] orbitron mb-1" style={{ color: line.synthetic === null ? "#ff2d55" : line.synthetic ? "#00e5ff" : "#a78bfa" }}>
                        {line.speaker} {line.synthetic && <span className="text-red-400 ml-1">⚡ AI-GENERATED</span>}
                      </div>
                      <div className="text-xs text-white/80">{line.text}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Waveform */}
            {callSimActive && callPhase > 0 && callPhase < callLines.length && (
              <div className="mb-4">
                <WaveformAnalysis />
              </div>
            )}

            <button
              onClick={() => { setCallSimActive(true); setCallPhase(0); setTimeout(() => setCallPhase(0), 50); }}
              className="w-full py-3 rounded-lg orbitron text-xs tracking-[0.2em] font-bold transition-all duration-300"
              style={{
                background: callSimActive ? "rgba(255,45,85,0.1)" : "rgba(0,229,255,0.1)",
                border: `1px solid ${callSimActive ? "rgba(255,45,85,0.4)" : "rgba(0,229,255,0.4)"}`,
                color: callSimActive ? "#ff2d55" : "#00e5ff",
              }}
            >
              {callSimActive ? "↺ REPLAY SIMULATION" : "▶ RUN SIMULATION"}
            </button>
            <div className="mt-3 text-center text-[10px] text-cyan-900">Educational simulation only — no real audio is generated or played</div>
          </div>
        </section>
      </SectionReveal>

      {/* ── SCAM ATTACK CARDS ─────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6" style={{ background: "#070b1a", borderTop: "1px solid rgba(0,229,255,0.06)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-3">ACTIVE THREAT CATALOG</div>
              <h2 className="orbitron text-3xl font-bold text-white">Known <span style={{ color: "#00e5ff" }} className="glow-cyan">Attack</span> Vectors</h2>
              <p className="text-sm text-cyan-100/40 mt-3">Documented deepfake-enabled attack patterns in the wild</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCAM_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setActiveScam(activeScam === i ? null : i)}
                  className="panel rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-cyan-400/25"
                  style={{ borderColor: activeScam === i ? severityColor(card.severity) + "60" : undefined }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-xs font-bold orbitron tracking-wider" style={{ color: severityColor(card.severity) }}>
                      ● {card.severity}
                    </div>
                    <div className="text-[10px] text-cyan-900 font-mono">VECTOR_{String(i + 1).padStart(2, "0")}</div>
                  </div>
                  <div className="orbitron text-sm font-bold text-white mb-2">{card.type}</div>
                  <div className="text-xs text-cyan-400/50 mb-3">Target: <span className="text-cyan-400/80">{card.target}</span></div>

                  <AnimatePresence>
                    {activeScam === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-cyan-900/30 pt-3 mt-1 space-y-2">
                          <div>
                            <div className="text-[9px] orbitron text-cyan-900 tracking-widest mb-1">VECTOR</div>
                            <div className="text-xs text-cyan-100/60">{card.vector}</div>
                          </div>
                          <div>
                            <div className="text-[9px] orbitron tracking-widest mb-1" style={{ color: severityColor(card.severity) + "aa" }}>OUTCOME</div>
                            <div className="text-xs" style={{ color: severityColor(card.severity) + "cc" }}>{card.outcome}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 text-[10px] text-cyan-900 font-mono">
                    {activeScam === i ? "▲ COLLAPSE" : "▼ EXPAND INTEL"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── VOICE CLONE AWARENESS ─────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.4em] text-purple-400/70 orbitron mb-3">VOICE SYNTHESIS INTELLIGENCE</div>
              <h2 className="orbitron text-3xl font-bold text-white mb-6">
                Voice Cloning: <span style={{ color: "#a78bfa" }}>8 Seconds</span> to Impersonation
              </h2>
              <div className="space-y-4 text-sm text-cyan-100/50 leading-relaxed">
                <p>Modern AI voice synthesis models require as little as 8 seconds of audio to generate a convincing clone. A voicemail, a social media video, a recorded meeting — all are viable harvesting sources.</p>
                <p>Once cloned, the synthetic voice can say anything. It can authorize transactions, provide credentials, or emotionally manipulate family members into sending money. The "grandparent scam" has been supercharged by AI.</p>
                <p>Real-time voice conversion tools allow live impersonation during phone calls, making caller ID and even voice biometric authentication systems vulnerable.</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Audio Required", value: "8 sec", color: "#ff2d55" },
                  { label: "Cloning Accuracy", value: "~96%", color: "#a78bfa" },
                  { label: "Cost to Deploy", value: "$0", color: "#ff2d55" },
                ].map((item) => (
                  <div key={item.label} className="panel rounded-lg p-3 text-center">
                    <div className="orbitron text-lg font-black" style={{ color: item.color }}>{item.value}</div>
                    <div className="text-[10px] text-cyan-400/40 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Voice frequency card */}
              <div className="panel rounded-xl p-5">
                <div className="text-xs orbitron text-purple-400/70 tracking-widest mb-4">REAL-TIME VOICE AUTHENTICATION BYPASS</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.1)" }}>
                    <div className="text-[9px] text-cyan-400/60 orbitron mb-2">ORIGINAL VOICE</div>
                    <div className="flex items-center gap-0.5 h-10 justify-center">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div key={i} className="w-1 rounded-sm bg-cyan-400" animate={{ height: [`${15 + Math.sin(i) * 20}px`, `${10 + Math.cos(i) * 25}px`, `${15 + Math.sin(i) * 20}px`] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }} />
                      ))}
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-2">AUTHENTIC</div>
                  </div>
                  <div className="text-center p-3 rounded" style={{ background: "rgba(255,45,85,0.05)", border: "1px solid rgba(255,45,85,0.2)" }}>
                    <div className="text-[9px] text-red-400/60 orbitron mb-2">CLONED VOICE</div>
                    <div className="flex items-center gap-0.5 h-10 justify-center">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div key={i} className="w-1 rounded-sm bg-red-400" animate={{ height: [`${14 + Math.sin(i + 0.3) * 22}px`, `${11 + Math.cos(i + 0.3) * 24}px`, `${14 + Math.sin(i + 0.3) * 22}px`] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }} />
                      ))}
                    </div>
                    <div className="text-[10px] text-red-400 mt-2 animate-pulse">⚠ SYNTHETIC</div>
                  </div>
                </div>
                <div className="text-center text-xs text-cyan-100/30 font-mono">Human ear cannot distinguish — forensic AI required</div>
              </div>

              {/* How it spreads */}
              <div className="panel rounded-xl p-5">
                <div className="text-xs orbitron text-cyan-400/70 tracking-widest mb-3">HARVEST VECTORS FOR VOICE DATA</div>
                <div className="space-y-2">
                  {[
                    { src: "Voicemail Recordings", risk: "HIGH" },
                    { src: "YouTube / TikTok Videos", risk: "CRITICAL" },
                    { src: "Earnings Call Recordings", risk: "CRITICAL" },
                    { src: "Podcast Appearances", risk: "HIGH" },
                    { src: "Social Media Stories", risk: "HIGH" },
                    { src: "Conference Presentations", risk: "MEDIUM" },
                  ].map((item) => (
                    <div key={item.src} className="flex items-center justify-between text-xs py-1.5 border-b border-cyan-900/20">
                      <span className="text-cyan-100/50 font-mono">{item.src}</span>
                      <span className="orbitron text-[10px]" style={{ color: item.risk === "CRITICAL" ? "#ff2d55" : item.risk === "HIGH" ? "#ff6b35" : "#ffd60a" }}>
                        {item.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── POLITICAL DISINFO ─────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6" style={{ background: "#070b1a", borderTop: "1px solid rgba(0,229,255,0.06)" }}>
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-red-400/70 orbitron mb-3">GEOPOLITICAL THREAT VECTOR</div>
            <h2 className="orbitron text-3xl font-bold text-white">Synthetic Media in <span style={{ color: "#ff2d55" }} className="glow-red">Political Warfare</span></h2>
            <p className="text-sm text-cyan-100/40 mt-3 max-w-xl mx-auto">Nation-state actors and political operatives deploy deepfakes to manufacture crises, manipulate elections, and destroy institutional trust.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Pre-Election Fabrications",
                detail: "Fake video of a candidate making inflammatory statements deployed 48 hours before polls — insufficient time for fact-checkers to respond. Millions of views before removal.",
                icon: "⚡",
                color: "#ff2d55",
              },
              {
                title: "Diplomatic Crisis Fabrication",
                detail: "Synthetic audio of a head of state issuing threats used to manufacture international incidents. AI forensics required to establish falsity — hours of global panic in between.",
                icon: "🌐",
                color: "#a78bfa",
              },
              {
                title: "Protest Incitement Media",
                detail: "Deepfake footage of police violence or civil unrest seeded on social platforms to ignite protests. Emotional visual content bypasses critical reasoning before it can be analyzed.",
                icon: "📡",
                color: "#ff6b35",
              },
              {
                title: "Credibility Destruction",
                detail: "Fabricated scandal footage of political opponents, judges, or journalists distributed to permanently damage credibility — even after debunking, the association persists.",
                icon: "⊗",
                color: "#ff2d55",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="panel rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="orbitron text-sm font-bold" style={{ color: item.color }}>{item.title}</div>
                </div>
                <div className="text-xs text-cyan-100/50 leading-relaxed">{item.detail}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* ── PREVENTION & VERIFICATION ─────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-3">DEFENSE PROTOCOLS</div>
            <h2 className="orbitron text-3xl font-bold text-white">Detection & <span style={{ color: "#00e5ff" }} className="glow-cyan">Verification</span> Strategies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "PERSONAL DEFENSE",
                color: "#00e5ff",
                items: [
                  "Establish a live video call policy for any financial or credential request",
                  "Create a family safe word unknown to AI training data",
                  "Never act on urgency — synthetic calls weaponize time pressure",
                  "Verify any unusual request through a second, independent channel",
                  "Minimize publicly accessible voice and video content",
                ],
              },
              {
                category: "ORGANIZATIONAL DEFENSE",
                color: "#a78bfa",
                items: [
                  "Deploy multi-person authorization for all wire transfers",
                  "Implement real-time deepfake detection in video conferencing",
                  "Train employees specifically on CEO fraud voice cloning",
                  "Use cryptographic communication signing for executive directives",
                  "Conduct regular deepfake red-team exercises",
                ],
              },
              {
                category: "TECHNICAL VERIFICATION",
                color: "#00e5ff",
                items: [
                  "Use AI detection tools (Hive, Reality Defender, Sensity AI)",
                  "Check for unnatural eye blinking patterns and micro-expressions",
                  "Look for boundary artifacts around hair and complex backgrounds",
                  "Analyze audio for spectral inconsistencies using forensic tools",
                  "Verify content on C2PA-compliant provenance platforms",
                ],
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="panel rounded-xl p-6"
              >
                <div className="text-xs orbitron tracking-widest mb-4" style={{ color: col.color }}>{col.category}</div>
                <div className="space-y-3">
                  {col.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3 text-xs text-cyan-100/50 leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: col.color }}>◆</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detection tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 panel rounded-xl p-6"
          >
            <div className="text-xs orbitron text-cyan-400/70 tracking-widest mb-4">FORENSIC DETECTION TOOLKIT</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Reality Defender", type: "Enterprise Platform", status: "VERIFIED" },
                { name: "Hive Moderation", type: "API Detection", status: "VERIFIED" },
                { name: "Sensity AI", type: "Visual Forensics", status: "VERIFIED" },
                { name: "C2PA Standard", type: "Content Provenance", status: "EMERGING" },
              ].map((tool) => (
                <div key={tool.name} className="text-center p-3 rounded-lg" style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.1)" }}>
                  <div className="text-xs font-bold text-white mb-1 orbitron">{tool.name}</div>
                  <div className="text-[10px] text-cyan-400/40 mb-2">{tool.type}</div>
                  <div className="text-[9px] orbitron" style={{ color: tool.status === "VERIFIED" ? "#00e5ff" : "#ffd60a" }}>● {tool.status}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </SectionReveal>

      {/* ── FORENSIC TIMELINE ─────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6" style={{ background: "#070b1a", borderTop: "1px solid rgba(0,229,255,0.06)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-3">SYNTHETIC MEDIA EVOLUTION</div>
              <h2 className="orbitron text-2xl font-bold text-white">The Deepfake <span style={{ color: "#00e5ff" }} className="glow-cyan">Timeline</span></h2>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-1/2 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(180deg, rgba(0,229,255,0.1), rgba(0,229,255,0.3), rgba(255,45,85,0.3))" }} />
              <div className="space-y-8">
                {[
                  { year: "2017", event: "First GAN-based face swap appears on Reddit", severity: "LOW" },
                  { year: "2019", event: "Deepfake pornography accounts for 96% of synthetic media", severity: "HIGH" },
                  { year: "2020", event: "Political deepfakes deployed in multiple elections globally", severity: "HIGH" },
                  { year: "2022", event: "Real-time voice cloning APIs become publicly accessible", severity: "CRITICAL" },
                  { year: "2023", event: "$25M wire fraud via deepfake CFO video call confirmed", severity: "CRITICAL" },
                  { year: "2024", event: "Deepfake KYC bypass attacks surge at financial institutions", severity: "CRITICAL" },
                  { year: "2025", event: "AI-generated synthetic identities deployed at nation-state scale", severity: "CRITICAL" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className={`flex-1 panel rounded-lg p-4 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                      <div className="orbitron text-xs font-bold mb-1" style={{ color: item.severity === "CRITICAL" ? "#ff2d55" : item.severity === "HIGH" ? "#ff6b35" : "#00e5ff" }}>
                        {item.severity}
                      </div>
                      <div className="text-xs text-cyan-100/60">{item.event}</div>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center orbitron text-xs font-bold z-10"
                      style={{ background: "#070b1a", border: `1px solid ${item.severity === "CRITICAL" ? "#ff2d55" : "#00e5ff"}`, color: item.severity === "CRITICAL" ? "#ff2d55" : "#00e5ff" }}>
                      {item.year.slice(2)}
                    </div>
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <SectionReveal>
        <section className="py-20 px-6 text-center relative overflow-hidden" style={{ background: "#050816" }}>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)" }} />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-xs tracking-[0.4em] text-cyan-400/50 orbitron mb-4">AWARENESS IS YOUR FIRST LINE OF DEFENSE</div>
            <h2 className="orbitron text-3xl font-bold text-white mb-4">
              The Question Is Not <span style={{ color: "#00e5ff" }} className="glow-cyan">If</span><br />
              But <span style={{ color: "#ff2d55" }} className="glow-red">When</span> You'll Be Targeted
            </h2>
            <p className="text-sm text-cyan-100/40 leading-relaxed mb-8">
              Deepfake technology is no longer a theoretical threat. It is active, scalable, and targeting individuals, executives, and institutions today.
              The only reliable defense is informed awareness combined with verified protocols.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 rounded-lg orbitron text-xs tracking-wider font-bold"
                style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
                TRUST NO SINGLE CHANNEL
              </div>
              <div className="px-6 py-3 rounded-lg orbitron text-xs tracking-wider font-bold"
                style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)", color: "#ff2d55" }}>
                VERIFY BEFORE YOU ACT
              </div>
              <div className="px-6 py-3 rounded-lg orbitron text-xs tracking-wider font-bold"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}>
                EDUCATE YOUR NETWORK
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-cyan-900/20 text-[10px] text-cyan-900 orbitron tracking-widest">
            TRUSTLAYERLABS · SYNTHETIC MEDIA INTELLIGENCE DIVISION · EDUCATIONAL USE ONLY
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}