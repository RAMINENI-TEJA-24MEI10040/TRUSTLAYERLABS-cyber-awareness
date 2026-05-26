import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  left: number;
  duration: number;
  delay: number;
  drift: number;
}

interface WaveBar {
  id: number;
  height: number;
  delay: number;
  duration: number;
}

interface WaveCompareBar {
  id: number;
  height: number;
  isRed: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  cyan: "#00f5ff",
  cyan2: "#00bcd4",
  blue: "#0066ff",
  emerald: "#00ff88",
  red: "#ff3366",
  amber: "#ffaa00",
  navy: "#020b18",
  navy2: "#030d1e",
  glass: "rgba(0,245,255,0.04)",
  glass2: "rgba(0,245,255,0.08)",
  borderGlow: "rgba(0,245,255,0.15)",
  borderGlow2: "rgba(0,245,255,0.3)",
};

const FACE_NODES = [
  { top: "5%", left: "50%", delay: 0.1 },
  { top: "20%", left: "20%", delay: 0.3 },
  { top: "20%", right: "20%", delay: 0.5 },
  { top: "30%", left: "35%", delay: 0.2 },
  { top: "30%", right: "35%", delay: 0.4 },
  { top: "45%", left: "15%", delay: 0.6 },
  { top: "45%", right: "15%", delay: 0.8 },
  { top: "55%", left: "30%", delay: 0.1 },
  { top: "55%", right: "30%", delay: 0.7 },
  { top: "65%", left: "20%", delay: 0.9 },
  { top: "65%", right: "20%", delay: 0.2 },
  { top: "75%", left: "40%", delay: 0.4 },
  { top: "75%", right: "40%", delay: 0.6 },
  { top: "85%", left: "50%", delay: 0.8 },
  { top: "50%", left: "50%", delay: 0.3 },
];

const AI_NODES = [
  { top: "10%", left: "20%", delay: 0 },
  { top: "15%", right: "22%", delay: 0.7 },
  { top: "40%", left: "5%", delay: 1.4 },
  { top: "40%", right: "5%", delay: 0.3 },
  { bottom: "15%", left: "18%", delay: 1.0 },
  { bottom: "10%", right: "20%", delay: 1.8 },
];

const LANDMARK_PTS = [
  [50, 5], [30, 25], [70, 25], [20, 45], [80, 45],
  [25, 60], [75, 60], [50, 70], [35, 85], [65, 85], [50, 95],
];

const ANOMALY_FRAMES = new Set([4, 12, 19]);

const AWARENESS_CARDS = [
  {
    icon: "🎭",
    level: "THREAT LEVEL: CRITICAL",
    levelColor: COLORS.red,
    title: "Celebrity Scams",
    desc: "AI-generated videos of celebrities endorsing fake investment schemes. Millions lost to synthetic influencer fraud using voice and face cloning.",
    tip: "⟩ Verify through official channels only",
  },
  {
    icon: "🏛️",
    level: "THREAT LEVEL: HIGH",
    levelColor: COLORS.red,
    title: "Political Misinformation",
    desc: "Fabricated speeches and statements from world leaders manipulate public opinion and destabilize democratic processes at scale.",
    tip: "⟩ Cross-reference with verified news sources",
  },
  {
    icon: "📞",
    level: "THREAT LEVEL: CRITICAL",
    levelColor: COLORS.red,
    title: "Fake Emergency Calls",
    desc: "Voice-cloned family members placed in fake emergencies to extract urgent wire transfers. Real-time synthesis makes detection nearly impossible.",
    tip: "⟩ Establish a secret family verification code",
  },
  {
    icon: "💔",
    level: "THREAT LEVEL: HIGH",
    levelColor: COLORS.red,
    title: "Romance Scams",
    desc: "Synthetic personas with AI-generated photos and videos build emotional relationships for months before executing financial fraud.",
    tip: "⟩ Request live video with specific gestures",
  },
  {
    icon: "💼",
    level: "THREAT LEVEL: HIGH",
    levelColor: COLORS.red,
    title: "Fake Job Interviews",
    desc: "Deepfake interviewers impersonate HR executives to extract personal data or deploy malware through fake onboarding documents.",
    tip: "⟩ Verify employer identity through company website",
  },
  {
    icon: "🎯",
    level: "THREAT LEVEL: CRITICAL",
    levelColor: COLORS.red,
    title: "Impersonation Fraud",
    desc: "CEO and executive voice/face cloning to authorize fraudulent transfers. Businesses lost billions to synthetic impersonation in 2024.",
    tip: "⟩ Implement two-factor verbal verification",
  },
];

const TIMELINE_ITEMS = [
  {
    side: "left",
    step: "PHASE 01 // INITIATION",
    title: "Synthetic Media Deployed",
    desc: "AI-generated video surfaces on social platform using voice clone of CFO authorizing $4.2M transfer. Distributed across 3 channels simultaneously.",
  },
  {
    side: "right",
    step: "PHASE 02 // MANIPULATION",
    title: "AI Manipulation Chain",
    desc: "Forensic analysis reveals 3-stage pipeline: base model face swap → voice synthesis overlay → lip-sync correction via wav2lip architecture.",
  },
  {
    side: "left",
    step: "PHASE 03 // IMPACT",
    title: "Victim Impact Documented",
    desc: "Transfer executed before detection. 47 employees exposed to synthetic content. Reputational damage across 3 markets. $4.2M lost within 6-hour window.",
  },
  {
    side: "right",
    step: "PHASE 04 // DETECTION",
    title: "Forensic Recovery",
    desc: "TrustLayer neural detection flagged spectral artifacts. Frequency analysis confirmed GAN fingerprints. Origin traced to rented GPU cluster in 3 jurisdictions.",
  },
  {
    side: "left",
    step: "PHASE 05 // PREVENTION",
    title: "Defense Protocol Installed",
    desc: "Real-time deepfake scanning implemented across all media ingest points. Executive voice-verification protocol deployed. Response time: 340ms per frame.",
  },
];

const DEFENSE_PROTOCOLS = [
  {
    num: "01",
    label: "PROTOCOL ALPHA",
    title: "Verify All Sources",
    desc: "Never trust media from unverified channels. Cross-reference with primary sources. Check domain authenticity and publication timestamps.",
    mark: "MANDATORY",
  },
  {
    num: "02",
    label: "PROTOCOL BRAVO",
    title: "Detect Emotional Manipulation",
    desc: "Deepfake content is designed to trigger urgency, fear, or excitement. Pause before acting. Emotional pressure is a primary attack vector.",
    mark: "CRITICAL",
  },
  {
    num: "03",
    label: "PROTOCOL CHARLIE",
    title: "Inspect Metadata",
    desc: "Analyze file metadata for creation date anomalies, stripped GPS data, and AI software signatures embedded in EXIF fields.",
    mark: "TECHNICAL",
  },
  {
    num: "04",
    label: "PROTOCOL DELTA",
    title: "Reverse Image Search",
    desc: "Use reverse image search to identify stolen source imagery. GAN-generated faces often have detectable frequency artifacts in eyebrow and hairline regions.",
    mark: "STANDARD",
  },
  {
    num: "05",
    label: "PROTOCOL ECHO",
    title: "Never Trust Urgency",
    desc: "AI-powered social engineering relies on manufactured urgency. Immediate financial requests — regardless of apparent source identity — require multi-channel verification.",
    mark: "PRIORITY ONE",
  },
  {
    num: "06",
    label: "PROTOCOL FOXTROT",
    title: "Deploy AI Detection Tools",
    desc: "Use TrustLayer and certified forensic tools to scan all incoming media before acting on contents. Automate scanning in enterprise environments.",
    mark: "RECOMMENDED",
  },
];

// ─── Utility hooks ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { ref, count };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Particles({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            left: `${p.left}%`,
            background: COLORS.cyan,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.1],
            x: [0, p.drift],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={{ y: window.innerHeight }}
        />
      ))}
    </div>
  );
}

function NeuralGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}

function SectionHeader({
  tag,
  title,
  titleHighlight,
  desc,
}: {
  tag: string;
  title: string;
  titleHighlight?: string;
  desc?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div
        className="text-xs tracking-widest uppercase mb-3"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.cyan }}
      >
        {tag}
      </div>
      <h2
        className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-4 text-white"
        style={{ letterSpacing: "-1px" }}
      >
        {title}{" "}
        {titleHighlight && <span style={{ color: COLORS.cyan }}>{titleHighlight}</span>}
      </h2>
      {desc && (
        <p className="text-sm mx-auto max-w-lg" style={{ color: "#7899aa" }}>
          {desc}
        </p>
      )}
    </motion.div>
  );
}

function WaveformBars({ bars }: { bars: WaveBar[] }) {
  return (
    <div className="absolute overflow-hidden flex items-end gap-px" style={{ bottom: 30, right: 0, width: 130, height: 50 }}>
      {bars.map((b) => (
        <motion.div
          key={b.id}
          className="rounded-sm"
          style={{
            width: 3,
            background: COLORS.emerald,
            flexShrink: 0,
          }}
          animate={{
            height: [4, b.height, 4],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function HeroScanner({ waveBars }: { waveBars: WaveBar[] }) {
  return (
    <div className="relative h-[520px] flex items-center justify-center">
      <div className="relative w-[420px] h-[420px]">
        {/* Rings */}
        {[
          { size: 380, color: "rgba(0,245,255,0.2)", dur: 12, dir: 1, style: "solid" },
          { size: 300, color: "rgba(0,245,255,0.15)", dur: 8, dir: -1, style: "dashed" },
          { size: 220, color: "rgba(0,102,255,0.3)", dur: 5, dir: 1, style: "solid" },
          { size: 140, color: "rgba(0,255,136,0.2)", dur: 3, dir: -1, style: "solid" },
        ].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: r.size,
              height: r.size,
              border: `1px ${r.style} ${r.color}`,
              top: "50%",
              left: "50%",
              marginTop: -r.size / 2,
              marginLeft: -r.size / 2,
            }}
            animate={{ rotate: r.dir > 0 ? 360 : -360 }}
            transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Scan beam */}
        <motion.div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "50%",
            height: 1,
            background: "linear-gradient(90deg, rgba(0,245,255,0.8), transparent)",
            transformOrigin: "left center",
            marginTop: -0.5,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* AI floating nodes */}
        <div className="absolute inset-0 pointer-events-none">
          {AI_NODES.map((n, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                ...(n as any),
                border: `1px solid ${COLORS.cyan}`,
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ inset: -4, background: COLORS.cyan, opacity: 0.1, borderRadius: "50%" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Face mesh */}
        <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 140 }}>
          {FACE_NODES.map((n, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                ...(n as any),
                background: COLORS.cyan,
                boxShadow: `0 0 8px ${COLORS.cyan}`,
              }}
              animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.4, 1] }}
              transition={{ duration: 2, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Probability meter */}
        <div
          className="absolute rounded-sm"
          style={{
            top: 30,
            right: 0,
            background: "rgba(2,11,24,0.8)",
            border: `1px solid ${COLORS.borderGlow}`,
            padding: "10px 14px",
            minWidth: 130,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <div className="text-xs tracking-widest uppercase mb-1.5" style={{ fontSize: 8, color: "#7899aa" }}>Authenticity</div>
          <div className="h-1 rounded-sm mb-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-sm"
              style={{ background: `linear-gradient(90deg, ${COLORS.emerald}, #00aa55)` }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              initial={{ width: "94%" }}
            />
          </div>
          <div className="text-xs text-right mb-2" style={{ color: "#c8e8f0", fontSize: 11 }}>94.2%</div>
          <div className="text-xs tracking-widest uppercase mb-1.5" style={{ fontSize: 8, color: "#7899aa" }}>AI Generated</div>
          <div className="h-1 rounded-sm mb-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-sm"
              style={{ background: `linear-gradient(90deg, ${COLORS.red}, #aa2244)`, width: "6%" }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <div className="text-xs text-right" style={{ color: "#c8e8f0", fontSize: 11 }}>5.8%</div>
        </div>

        {/* Auth ring */}
        <div className="absolute" style={{ bottom: 20, left: 20, width: 90, height: 90 }}>
          <svg viewBox="0 0 90 90" width="90" height="90">
            <defs>
              <linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="100%" stopColor="#00ff88" />
              </linearGradient>
            </defs>
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="6" />
            <circle
              cx="45" cy="45" r="38" fill="none" stroke="url(#authGrad)"
              strokeWidth="6" strokeDasharray="239" strokeDashoffset="15"
              strokeLinecap="round" transform="rotate(-90 45 45)"
            />
          </svg>
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.cyan,
              textAlign: "center",
            }}
          >
            94%<br /><span style={{ fontSize: 7, color: "#7899aa" }}>AUTH</span>
          </div>
        </div>

        {/* Waveform */}
        <WaveformBars bars={waveBars} />
      </div>
    </div>
  );
}

function StatCard({ label, target, prefix = "", suffix = "" }: { label: string; target: number; prefix?: string; suffix?: string }) {
  const { ref, count } = useCountUp(target);
  return (
    <div
      className="rounded-sm p-6 text-center relative overflow-hidden"
      style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)` }}
      />
      <div
        className="text-xs uppercase tracking-widest mb-3"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7899aa", letterSpacing: 2, fontSize: 9 }}
      >
        {label}
      </div>
      <div
        className="leading-none mb-1"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: COLORS.cyan }}
      >
        {prefix}
        <span ref={ref}>{count.toLocaleString()}</span>
        {suffix && <span style={{ fontSize: 16, color: "#7899aa" }}>{suffix}</span>}
      </div>
      <div className="inline-flex items-center gap-1.5 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: COLORS.emerald, letterSpacing: 1 }}>
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: COLORS.emerald }}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        LIVE
      </div>
    </div>
  );
}

function AwarenessCard({ card }: { card: typeof AWARENESS_CARDS[0] }) {
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: `${((e.clientX - r.left) / r.width) * 100}%`,
      y: `${((e.clientY - r.top) / r.height) * 100}%`,
    });
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-sm cursor-default"
      style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}`, padding: 28 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, rotate: -0.3, borderColor: COLORS.borderGlow2, boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,245,255,0.05)" }}
      transition={{ duration: 0.35 }}
    >
      {/* Radial glow follow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, rgba(0,245,255,0.04), transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <motion.div
        className="flex items-center justify-center rounded-sm mb-4"
        style={{ width: 48, height: 48, border: `1px solid ${COLORS.borderGlow}`, background: COLORS.glass, fontSize: 22 }}
        whileHover={{ borderColor: COLORS.cyan, boxShadow: "0 0 20px rgba(0,245,255,0.1)" }}
      >
        {card.icon}
      </motion.div>
      <div className="uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 2, color: card.levelColor }}>
        {card.level}
      </div>
      <div className="font-bold uppercase mb-3 text-white" style={{ fontSize: 15, letterSpacing: 0.5 }}>
        {card.title}
      </div>
      <div className="mb-3.5 leading-relaxed" style={{ fontSize: 12, color: "#7899aa" }}>
        {card.desc}
      </div>
      <div
        className="border-l-2 px-3 py-2"
        style={{ background: "rgba(0,255,136,0.04)", borderColor: COLORS.emerald, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6ec9a4" }}
      >
        {card.tip}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DeepfakeCommandCenter() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      drift: (Math.random() - 0.5) * 200,
    }))
  );

  const [waveBars] = useState<WaveBar[]>(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      height: Math.random() * 36 + 4,
      delay: Math.random() * 0.8,
      duration: 0.4 + Math.random() * 0.6,
    }))
  );

  const [waveCompareBars] = useState<WaveCompareBar[]>(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      height: Math.random() * 48 + 4,
      isRed: Math.random() > 0.6,
    }))
  );

  const [analyzeState, setAnalyzeState] = useState<"idle" | "scanning" | "done">("idle");

  const uploadSectionRef = useRef<HTMLElement>(null);
  const awarenessSectionRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const triggerAnalysis = () => {
    if (analyzeState === "scanning") return;
    setAnalyzeState("scanning");
    setTimeout(() => setAnalyzeState("done"), 2200);
  };

  // Global font injection
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700;900&display=swap";
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.navy,
        color: "#c8e8f0",
        overflowX: "hidden",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <NeuralGrid />
      <Particles particles={particles} />
      <Scanlines />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="grid gap-16 items-center"
          style={{
            minHeight: "100vh",
            gridTemplateColumns: "1fr 1fr",
            padding: "100px 60px",
            background: `
              radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,102,255,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,245,255,0.05) 0%, transparent 60%)
            `,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 uppercase"
              style={{
                border: `1px solid ${COLORS.borderGlow2}`,
                background: COLORS.glass2,
                padding: "6px 14px",
                borderRadius: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: 3,
                color: COLORS.cyan,
              }}
            >
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: COLORS.cyan }}
                animate={{ opacity: [1, 0.7, 1], boxShadow: ["0 0 0 0 rgba(0,245,255,0.4)", "0 0 0 6px rgba(0,245,255,0)", "0 0 0 0 rgba(0,245,255,0.4)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              CLASSIFIED // ACTIVE SYSTEM
            </div>

            {/* Title */}
            <h1
              className="font-black uppercase text-white mb-2"
              style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.05, letterSpacing: -1 }}
            >
              <span
                style={{
                  background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.blue}, ${COLORS.emerald})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI FORENSIC
              </span>
              <br />DEEPFAKE<br />COMMAND CENTER
            </h1>

            <p className="font-bold uppercase mb-5" style={{ fontSize: "clamp(18px,2.5vw,28px)", color: "#7ba8c4", letterSpacing: 2 }}>
              TRUSTLAYERLABS
            </p>
            <p className="mb-8 leading-7" style={{ fontSize: 15, color: "#7899aa", maxWidth: 480 }}>
              Military-grade AI forensic intelligence system. Detecting synthetic media, AI-generated fraud, and deepfake manipulation in real-time — protecting truth at the edge of synthetic deception.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2.5 mb-9">
              {["AI Analysis", "Neural Detection", "Face Authenticity", "Voice Scan"].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 uppercase"
                  style={{
                    border: `1px solid ${COLORS.borderGlow}`,
                    background: COLORS.glass,
                    padding: "8px 16px",
                    borderRadius: 2,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 1.5,
                    color: COLORS.cyan,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.emerald, flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <CyberButton onClick={() => scrollTo(uploadSectionRef)}>⬡ ANALYZE MEDIA</CyberButton>
              <SecondaryButton onClick={() => scrollTo(awarenessSectionRef)}>⬡ DEEPFAKE RISKS</SecondaryButton>
            </div>
          </motion.div>

          {/* Hero scanner - hidden on mobile */}
          <div className="hidden md:block">
            <HeroScanner waveBars={waveBars} />
          </div>
        </section>

        {/* ─── LIVE DETECTION PANEL ─────────────────────────────────────────── */}
        <section
          className="px-10 py-20"
          style={{ background: "linear-gradient(180deg, #020b18 0%, rgba(3,13,30,0.95) 100%)" }}
        >
          <SectionHeader
            tag="// FORENSIC ANALYSIS ENGINE"
            title="LIVE"
            titleHighlight="DETECTION PANEL"
            desc="Real-time AI forensic analysis with multi-layer neural detection and confidence scoring"
          />

          <motion.div
            className="grid gap-6 mx-auto"
            style={{ gridTemplateColumns: "1fr 1fr", maxWidth: 1000 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Card 1: Biometric */}
            <DetectionCard
              label="Authenticity Score"
              score="94.2"
              scoreColor={COLORS.emerald}
              title="FACE BIOMETRIC ANALYSIS"
              tags={[
                { text: "Facial Landmarks ✓", variant: "cyan" },
                { text: "Blink Rate ✓", variant: "cyan" },
                { text: "Micro-expression ⚠", variant: "amber" },
              ]}
              bars={[
                { name: "Neural Consistency", value: "96%", fillClass: "bg-gradient-to-r from-green-500 to-emerald-400", width: "96%" },
                { name: "Skin Texture", value: "91%", fillClass: "", width: "91%", gradient: `linear-gradient(90deg, ${COLORS.cyan2}, ${COLORS.cyan})` },
                { name: "Lip Sync Match", value: "78%", fillClass: "", width: "78%", gradient: `linear-gradient(90deg, #cc8800, ${COLORS.amber})` },
              ]}
            />

            {/* Card 2: Synthetic */}
            <DetectionCard
              label="Manipulation Score"
              score="23.7"
              scoreColor={COLORS.amber}
              title="SYNTHETIC ARTIFACT DETECTION"
              tags={[
                { text: "Voice Clone ⚠", variant: "red" },
                { text: "Lip-Sync Mismatch", variant: "red" },
                { text: "Synthetic Artifact", variant: "amber" },
                { text: "Metadata Anomaly", variant: "amber" },
              ]}
              bars={[
                { name: "AI Generation Prob", value: "23%", fillClass: "", width: "23%", gradient: `linear-gradient(90deg, #cc8800, ${COLORS.amber})` },
                { name: "Voice Synthesis", value: "67%", fillClass: "", width: "67%", gradient: `linear-gradient(90deg, #cc2244, ${COLORS.red})` },
              ]}
              warning="VOICE CLONE PATTERN DETECTED — REVIEW REQUIRED"
            />
          </motion.div>
        </section>

        {/* ─── MEDIA ANALYZER ───────────────────────────────────────────────── */}
        <section
          id="upload-section"
          ref={uploadSectionRef as any}
          className="px-10 py-20"
          style={{ background: COLORS.navy }}
        >
          <SectionHeader
            tag="// AI FORENSIC SCANNER"
            title="MEDIA"
            titleHighlight="ANALYZER"
            desc="Submit image, video, or audio for immediate AI forensic investigation"
          />

          <motion.div
            className="mx-auto relative overflow-hidden rounded-sm cursor-pointer"
            style={{
              maxWidth: 700,
              border: `1px dashed ${COLORS.borderGlow2}`,
              background: COLORS.glass,
              padding: "60px 40px",
              textAlign: "center",
            }}
            whileHover={{ borderColor: COLORS.cyan, background: COLORS.glass2, boxShadow: "0 0 40px rgba(0,245,255,0.05)" }}
            onClick={triggerAnalysis}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Scan beams */}
            <ScanBeam />

            <motion.div
              className="flex items-center justify-center mx-auto mb-5 text-3xl rounded-sm"
              style={{ width: 64, height: 64, border: `1px solid ${COLORS.borderGlow2}` }}
              animate={analyzeState === "scanning" ? { opacity: [1, 0.4, 1], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {analyzeState === "scanning" ? "⚡" : analyzeState === "done" ? "📡" : "📡"}
            </motion.div>

            <div className="font-bold uppercase mb-2 text-white" style={{ fontSize: 18, letterSpacing: 1 }}>
              {analyzeState === "scanning"
                ? "AI ANALYSIS IN PROGRESS"
                : analyzeState === "done"
                ? "ANALYSIS COMPLETE — DROP ANOTHER"
                : "DROP MEDIA FOR ANALYSIS"}
            </div>
            <div className="mb-6" style={{ fontSize: 13, color: "#7899aa" }}>
              {analyzeState === "scanning"
                ? "Neural forensic scan running..."
                : "Drag & drop or click to select — maximum security forensic scan"}
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {["IMAGE", "VIDEO", "AUDIO", "PDF"].map((t) => (
                <span
                  key={t}
                  className="uppercase"
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${COLORS.borderGlow}`,
                    background: COLORS.glass,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: 2,
                    color: COLORS.cyan,
                    borderRadius: 1,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Analysis result */}
          {analyzeState === "done" && (
            <motion.div
              className="mx-auto mt-8 rounded-sm p-7"
              style={{ maxWidth: 700, background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-5 pb-4" style={{ borderBottom: `1px solid ${COLORS.borderGlow}` }}>
                <div>
                  <div className="uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 2, color: "#7899aa" }}>
                    FORENSIC VERDICT
                  </div>
                  <div
                    className="uppercase"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      letterSpacing: 2,
                      padding: "8px 18px",
                      border: `1px solid ${COLORS.red}`,
                      color: COLORS.red,
                      background: "rgba(255,51,102,0.06)",
                      borderRadius: 1,
                    }}
                  >
                    ⚠ MANIPULATION DETECTED
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7899aa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Risk Score</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: COLORS.red }}>7.4</div>
                </div>
              </div>
              <div className="mb-5">
                <div className="uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7899aa", letterSpacing: 1 }}>
                  FORENSIC EXPLANATION
                </div>
                <p className="leading-7" style={{ fontSize: 13, color: "#c8e8f0" }}>
                  Neural analysis has identified characteristic GAN artifacts in facial regions. Frequency domain analysis reveals spectral inconsistencies typical of diffusion model synthesis. Voice pattern shows 67% match to known voice-clone architectures.
                </p>
              </div>
              <div className="p-3.5 rounded-sm" style={{ background: "rgba(255,51,102,0.04)", border: "1px solid rgba(255,51,102,0.2)" }}>
                <div className="uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: COLORS.red, letterSpacing: 2 }}>
                  RECOMMENDED ACTIONS
                </div>
                <div style={{ fontSize: 12, color: "#cc8899", lineHeight: 1.7 }}>
                  ① Do not share or trust this media ② Report to platform administrators ③ Contact originating source for verification ④ Preserve evidence chain for investigation
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* ─── FORENSIC VISUALIZATION ────────────────────────────────────────── */}
        <section
          className="px-10 py-20"
          style={{ background: "linear-gradient(180deg, rgba(3,13,30,0.95) 0%, #020b18 100%)" }}
        >
          <SectionHeader
            tag="// CINEMATIC FORENSICS"
            title="FORENSIC"
            titleHighlight="VISUALIZATION"
            desc="Advanced multi-layer forensic intelligence panels with neural pattern analysis"
          />

          <motion.div
            className="grid gap-5 mx-auto"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 1100 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Panel 1: Landmark */}
            <ForensicPanel label="Face Landmark Mapping">
              <div className="relative" style={{ height: 120 }}>
                {LANDMARK_PTS.map(([x, y], i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 3, height: 3,
                      left: `${x}%`, top: `${y}%`,
                      background: COLORS.cyan,
                      boxShadow: `0 0 4px ${COLORS.cyan}`,
                    }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, delay: Math.random(), repeat: Infinity }}
                  />
                ))}
              </div>
            </ForensicPanel>

            {/* Panel 2: Waveform compare */}
            <ForensicPanel label="Waveform Comparison">
              <div className="flex items-center gap-px" style={{ height: 60 }}>
                {waveCompareBars.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      flex: 1,
                      borderRadius: 1,
                      background: b.isRed ? "rgba(255,51,102,0.7)" : "rgba(0,245,255,0.5)",
                      height: b.height,
                      alignSelf: "center",
                    }}
                  />
                ))}
              </div>
              <div className="mt-3">
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.emerald }}>Original</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#c8e8f0" }}>95%</span>
                </div>
                <div className="h-0.5 rounded-sm overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-sm" style={{ background: `linear-gradient(90deg, #00cc66, ${COLORS.emerald})` }} initial={{ width: 0 }} whileInView={{ width: "95%" }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                </div>
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.red }}>Clone Signal</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#c8e8f0" }}>67%</span>
                </div>
                <div className="h-0.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-sm" style={{ background: `linear-gradient(90deg, #cc2244, ${COLORS.red})` }} initial={{ width: 0 }} whileInView={{ width: "67%" }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                </div>
              </div>
            </ForensicPanel>

            {/* Panel 3: Heatmap */}
            <ForensicPanel label="Heatmap Overlay">
              <div
                className="relative overflow-hidden rounded-sm"
                style={{ height: 100, background: "linear-gradient(135deg, rgba(0,102,255,0.2), rgba(255,51,102,0.3), rgba(255,170,0,0.2))" }}
              >
                <div
                  className="absolute uppercase"
                  style={{
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 2, color: "rgba(255,51,102,0.7)",
                  }}
                >
                  ANOMALY DETECTED
                </div>
              </div>
              <div className="mt-3 leading-relaxed" style={{ fontSize: 11, color: "#7899aa", fontFamily: "'JetBrains Mono', monospace" }}>
                GAN fingerprint residuals detected in eye region. Spectral anomaly confidence: 78%
              </div>
            </ForensicPanel>

            {/* Panel 4: Frame timeline */}
            <ForensicPanel label="Frame Anomaly Timeline">
              <div className="flex gap-0.5 items-center" style={{ height: 40 }}>
                {Array.from({ length: 28 }, (_, i) => {
                  const isAnomaly = ANOMALY_FRAMES.has(i);
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: isAnomaly ? 36 : 24,
                        background: isAnomaly ? "rgba(255,51,102,0.6)" : "rgba(0,245,255,0.15)",
                      }}
                      animate={isAnomaly ? { opacity: [0.6, 1, 0.6] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  );
                })}
              </div>
              <div className="mt-2.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7899aa" }}>
                3 anomalous frames detected @ 0:04, 0:12, 0:19
              </div>
            </ForensicPanel>

            {/* Panel 5: Metadata */}
            <ForensicPanel label="Metadata Intelligence">
              {[
                { key: "Device", val: "REDACTED ⚠", flag: true },
                { key: "GPS", val: "STRIPPED ⚠", flag: true },
                { key: "Created", val: "2025-03-14", flag: false },
                { key: "Modified", val: "2025-03-15 ⚠", flag: true },
                { key: "Software", val: "Stable Diffusion ⚠", flag: true },
              ].map((r) => (
                <div
                  key={r.key}
                  className="flex justify-between py-1.5"
                  style={{ borderBottom: "1px solid rgba(0,245,255,0.05)" }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7899aa" }}>{r.key}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: r.flag ? COLORS.red : "#c8e8f0" }}>{r.val}</span>
                </div>
              ))}
            </ForensicPanel>

            {/* Panel 6: AI Behavior Graph */}
            <ForensicPanel label="AI Behavior Graph">
              <div className="relative overflow-hidden" style={{ height: 100 }}>
                <svg width="100%" height="100" viewBox="0 0 220 100" preserveAspectRatio="none">
                  <polyline
                    points="0,80 20,75 40,60 60,70 80,40 100,30 120,50 140,20 160,35 180,25 200,30 220,20"
                    fill="none" stroke={COLORS.red} strokeWidth="1.5" opacity="0.8"
                  />
                  <polyline
                    points="0,90 20,88 40,85 60,82 80,78 100,75 120,70 140,65 160,60 180,55 200,52 220,48"
                    fill="none" stroke={COLORS.cyan} strokeWidth="1" opacity="0.5"
                  />
                </svg>
                <div
                  className="absolute"
                  style={{ top: 4, right: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: COLORS.red }}
                >
                  AI PATTERN ↑
                </div>
              </div>
            </ForensicPanel>
          </motion.div>
        </section>

        {/* ─── AWARENESS ────────────────────────────────────────────────────── */}
        <section
          id="awareness-section"
          ref={awarenessSectionRef as any}
          className="px-10 py-20"
          style={{ background: COLORS.navy }}
        >
          <SectionHeader
            tag="// THREAT INTELLIGENCE"
            title="DEEPFAKE SCAM"
            titleHighlight="AWARENESS"
            desc="Active threat vectors and countermeasures for AI-generated fraud patterns"
          />

          <motion.div
            className="grid gap-5 mx-auto"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", maxWidth: 1100 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {AWARENESS_CARDS.map((card) => (
              <AwarenessCard key={card.title} card={card} />
            ))}
          </motion.div>
        </section>

        {/* ─── TIMELINE ─────────────────────────────────────────────────────── */}
        <section
          className="px-10 py-20"
          style={{ background: "linear-gradient(180deg, #020b18 0%, rgba(3,13,30,0.95) 100%)" }}
        >
          <SectionHeader
            tag="// CYBER INCIDENT RECORD"
            title="FORENSIC"
            titleHighlight="CASE TIMELINE"
            desc="Documented cyber incident breakdown — from initial deepfake deployment to forensic resolution"
          />

          <motion.div
            className="relative mx-auto"
            style={{ maxWidth: 800 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Center line */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                transform: "translateX(-50%)",
                background: `linear-gradient(180deg, transparent, ${COLORS.cyan}, transparent)`,
              }}
            />

            {TIMELINE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex gap-10 mb-10 relative"
                style={{ flexDirection: item.side === "right" ? "row-reverse" : "row" }}
              >
                <div
                  className="flex-1 rounded-sm p-5 relative"
                  style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
                >
                  {/* Arrow */}
                  <div
                    className="absolute"
                    style={{
                      top: 18,
                      ...(item.side === "left"
                        ? { right: -12, borderLeft: `6px solid ${COLORS.borderGlow}`, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "none" }
                        : { left: -12, borderRight: `6px solid ${COLORS.borderGlow}`, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "none" }),
                    }}
                  />
                  <div className="uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 2, color: COLORS.cyan }}>
                    {item.step}
                  </div>
                  <div className="font-bold uppercase mb-2 text-white" style={{ fontSize: 14, letterSpacing: 0.5 }}>
                    {item.title}
                  </div>
                  <div className="leading-relaxed" style={{ fontSize: 12, color: "#7899aa" }}>
                    {item.desc}
                  </div>
                </div>

                {/* Node */}
                <motion.div
                  className="flex-shrink-0 rounded-full z-10"
                  style={{
                    width: 16,
                    height: 16,
                    background: COLORS.navy,
                    border: `2px solid ${COLORS.cyan}`,
                    alignSelf: "flex-start",
                    marginTop: 14,
                  }}
                  animate={{ boxShadow: ["0 0 8px rgba(0,245,255,0.3)", "0 0 20px rgba(0,245,255,0.6)", "0 0 8px rgba(0,245,255,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="flex-1" />
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── STATS ────────────────────────────────────────────────────────── */}
        <section
          className="px-10 py-20"
          style={{ background: "linear-gradient(180deg, rgba(3,13,30,0.95) 0%, #020b18 100%)" }}
        >
          <SectionHeader
            tag="// LIVE INTELLIGENCE METRICS"
            title="FORENSIC"
            titleHighlight="COMMAND STATS"
          />

          <motion.div
            className="grid gap-5 mx-auto"
            style={{ gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1000 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <StatCard label="Deepfakes Detected" target={2847193} />
            <StatCard label="Media Analyzed" target={18400000} />
            <StatCard label="Fraud Prevented" target={847} prefix="$" suffix="M" />
            <StatCard label="AI Models Tagged" target={1247} />
          </motion.div>
        </section>

        {/* ─── DEFENSE PROTOCOLS ────────────────────────────────────────────── */}
        <section
          className="px-10 py-20"
          style={{ background: "linear-gradient(180deg, #020b18 0%, rgba(3,13,30,0.95) 100%)" }}
        >
          <SectionHeader
            tag="// CLASSIFIED BRIEFING"
            title="CYBER DEFENSE"
            titleHighlight="PROTOCOLS"
            desc="Field-tested countermeasures for active deepfake threat environments"
          />

          <motion.div
            className="grid gap-4 mx-auto"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", maxWidth: 1000 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {DEFENSE_PROTOCOLS.map((p) => (
              <motion.div
                key={p.num}
                className="flex items-start gap-4 rounded-sm p-5"
                style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
                whileHover={{ borderColor: COLORS.borderGlow2, background: COLORS.glass2 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="flex-shrink-0 leading-none"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: "rgba(0,245,255,0.2)" }}
                >
                  {p.num}
                </div>
                <div>
                  <div className="uppercase mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 2, color: COLORS.amber }}>
                    {p.label}
                  </div>
                  <div className="font-bold uppercase mb-1.5 text-white" style={{ fontSize: 14, letterSpacing: 0.5 }}>
                    {p.title}
                  </div>
                  <div className="leading-relaxed mb-2" style={{ fontSize: 12, color: "#7899aa" }}>
                    {p.desc}
                  </div>
                  <div
                    className="uppercase inline-block"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      letterSpacing: 2,
                      color: COLORS.red,
                      border: `1px solid rgba(255,51,102,0.3)`,
                      padding: "2px 8px",
                    }}
                  >
                    {p.mark}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden flex items-center justify-center text-center px-10"
          style={{
            minHeight: "80vh",
            padding: "80px 40px",
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,102,255,0.08) 0%, transparent 70%)",
          }}
        >
          {/* Radar rings */}
          <div
            className="absolute pointer-events-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: "50%", left: "50%",
                  border: "1px solid rgba(0,245,255,0.06)",
                  transform: "translate(-50%,-50%)",
                }}
                animate={{ width: [0, 700], height: [0, 700], opacity: [0.8, 0] }}
                transition={{ duration: 4, delay: i, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="uppercase mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 4, color: COLORS.cyan }}
            >
              // DEFEND TRUTH
            </div>
            <h2
              className="font-black uppercase mb-5 text-white"
              style={{ fontSize: "clamp(28px,5vw,60px)", letterSpacing: -2, lineHeight: 1.05 }}
            >
              DEFEND REALITY<br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.blue}, ${COLORS.emerald})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AGAINST SYNTHETIC
              </span>
              <br />DECEPTION
            </h2>
            <p className="mb-10 mx-auto" style={{ fontSize: 15, color: "#7899aa", maxWidth: 500 }}>
              The frontier of AI manipulation advances daily. Deploy military-grade forensic intelligence before the next synthetic attack reaches your network.
            </p>
            <div className="flex justify-center gap-5 flex-wrap">
              <CyberButton onClick={() => scrollTo(uploadSectionRef)}>⬡ START AI SCAN</CyberButton>
              <SecondaryButton onClick={() => scrollTo(awarenessSectionRef)}>⬡ EXPLORE AWARENESS</SecondaryButton>
            </div>
            <div
              className="mt-10 uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(120,153,170,0.4)" }}
            >
              TRUSTLAYERLABS // AI FORENSIC INTELLIGENCE SYSTEM // v4.2.1 // CLASSIFIED
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function CyberButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden uppercase"
      style={{
        padding: "14px 28px",
        background: "transparent",
        border: `1px solid ${COLORS.cyan}`,
        color: COLORS.cyan,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: 2,
        cursor: "pointer",
        borderRadius: 2,
        ...(hovered ? { background: "rgba(0,245,255,0.08)", boxShadow: "0 0 20px rgba(0,245,255,0.2)" } : {}),
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent)" }}
        animate={hovered ? { x: ["-100%", "100%"] } : { x: "-100%" }}
        transition={{ duration: 0.4 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="uppercase"
      style={{
        padding: "14px 28px",
        background: "transparent",
        border: "1px solid rgba(0,102,255,0.4)",
        color: "#6699cc",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: 2,
        cursor: "pointer",
        borderRadius: 2,
      }}
      whileHover={{ borderColor: COLORS.blue, color: COLORS.blue, background: "rgba(0,102,255,0.06)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
}

function ScanBeam() {
  return (
    <>
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: 0, height: 1, background: COLORS.cyan, opacity: 0.4 }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: 0, height: 1, background: COLORS.cyan, opacity: 0.4 }}
        animate={{ x: ["100%", "-200%"] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}

function DetectionCard({
  label, score, scoreColor, title, tags, bars, warning,
}: {
  label: string;
  score: string;
  scoreColor: string;
  title: string;
  tags: { text: string; variant: "red" | "amber" | "cyan" }[];
  bars: { name: string; value: string; fillClass: string; width: string; gradient?: string }[];
  warning?: string;
}) {
  const tagStyles = {
    red: { border: "rgba(255,51,102,0.4)", color: COLORS.red, bg: "rgba(255,51,102,0.06)" },
    amber: { border: "rgba(255,170,0,0.4)", color: COLORS.amber, bg: "rgba(255,170,0,0.06)" },
    cyan: { border: "rgba(0,245,255,0.3)", color: COLORS.cyan, bg: "rgba(0,245,255,0.05)" },
  };

  return (
    <div
      className="rounded-sm p-7 relative overflow-hidden"
      style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)` }} />
      <div className="flex justify-between items-center mb-5">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#7899aa", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
          {score}<span style={{ fontSize: 18, color: "#7899aa" }}>%</span>
        </div>
      </div>
      <div className="font-semibold uppercase mb-4 text-white" style={{ fontSize: 13, letterSpacing: 1 }}>{title}</div>
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((t) => {
          const s = tagStyles[t.variant];
          return (
            <span key={t.text} className="rounded-sm uppercase" style={{ padding: "4px 10px", border: `1px solid ${s.border}`, color: s.color, background: s.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 1 }}>
              {t.text}
            </span>
          );
        })}
      </div>
      {bars.map((b) => (
        <div key={b.name} className="mb-3">
          <div className="flex justify-between mb-1.5">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7899aa" }}>{b.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#c8e8f0" }}>{b.value}</span>
          </div>
          <div className="h-0.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className={`h-full rounded-sm ${b.fillClass}`}
              style={b.gradient ? { background: b.gradient } : {}}
              initial={{ width: 0 }}
              whileInView={{ width: b.width }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
      {warning && (
        <div className="flex items-center gap-2.5 p-3 mt-4 rounded-sm" style={{ background: "rgba(255,51,102,0.04)", border: "1px solid rgba(255,51,102,0.2)" }}>
          <motion.div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: COLORS.red }}
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#cc8899", letterSpacing: 0.5 }}>{warning}</span>
        </div>
      )}
    </div>
  );
}

function ForensicPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-sm p-5 relative overflow-hidden"
      style={{ background: COLORS.glass, border: `1px solid ${COLORS.borderGlow}` }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)` }} />
      <div
        className="uppercase mb-3.5"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 3, color: COLORS.cyan }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
