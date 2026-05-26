import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { getPostAuthPath } from "../../lib/postAuthRedirect";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ThreatEvent {
  id: number;
  text: string;
  level: "LOW" | "MED" | "HIGH" | "CRIT";
  time: string;
}

interface Node {
  id: number;
  x: number;
  y: number;
  pulseDelay: number;
  size: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const THREAT_EVENTS: Omit<ThreatEvent, "id" | "time">[] = [
  { text: "SQL injection attempt blocked — IP 185.234.219.x", level: "HIGH" },
  { text: "Brute-force auth denied — 47 attempts from TOR exit node", level: "CRIT" },
  { text: "Phishing domain takedown confirmed — trust score 0.02", level: "MED" },
  { text: "Zero-day CVE-2024-3891 patched across 14 nodes", level: "HIGH" },
  { text: "Anomalous API traffic flagged — OSINT correlation active", level: "MED" },
  { text: "Dark web credential leak detected — 3.2M records indexed", level: "CRIT" },
  { text: "Ransomware signature matched — quarantine enforced", level: "HIGH" },
  { text: "DNS hijack attempt neutralized — DNSSEC integrity verified", level: "MED" },
  { text: "Lateral movement blocked — honeypot trap triggered", level: "HIGH" },
  { text: "Certificate spoofing attempt logged — TLS validation active", level: "LOW" },
];

const CYBER_FACTS = [
  "43% of cyber attacks target small businesses",
  "A data breach costs $4.45M on average in 2024",
  "Ransomware attacks occur every 11 seconds globally",
  "95% of breaches are caused by human error",
  "Zero-day exploits sell for up to $2.5M on dark markets",
];

const AUTH_STEPS = [
  { label: "Encrypting credentials...", icon: "🔐", duration: 900 },
  { label: "Verifying identity...", icon: "🧬", duration: 1100 },
  { label: "Checking security clearance...", icon: "🛡️", duration: 950 },
  { label: "Threat integrity confirmed...", icon: "✅", duration: 800 },
  { label: "Access granted.", icon: "⚡", duration: 600 },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): Particle[] {
  const colors = ["#00e5ff", "#06b6d4", "#22d3ee", "#8b5cf6", "#ffffff"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: randomBetween(1, 3.5),
    speedX: randomBetween(-0.015, 0.015),
    speedY: randomBetween(-0.02, -0.005),
    opacity: randomBetween(0.2, 0.9),
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function generateNodes(count: number): Node[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(5, 95),
    y: randomBetween(5, 95),
    pulseDelay: randomBetween(0, 4),
    size: randomBetween(2, 5),
  }));
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated canvas for particles */
function ParticleCanvas({ particles }: { particles: Particle[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const localParticles = useRef(particles.map((p) => ({ ...p })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      localParticles.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -2) p.y = 102;
        if (p.x < -2) p.x = 102;
        if (p.x > 102) p.x = -2;

        const x = (p.x / 100) * canvas.width;
        const y = (p.y / 100) * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/** Radar rings */
function RadarRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[280, 220, 160, 100, 50].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(0, 229, 255, ${0.04 + i * 0.025})`,
            animation: `radarSpin ${8 + i * 3}s linear infinite`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
      {/* Radar sweep */}
      <div
        className="absolute"
        style={{
          width: 280,
          height: 280,
          animation: "radarSpin 4s linear infinite",
          background:
            "conic-gradient(from 0deg, transparent 340deg, rgba(0,229,255,0.18) 360deg)",
          borderRadius: "50%",
        }}
      />
      {/* Center pulse */}
      <div
        className="absolute rounded-full"
        style={{
          width: 12,
          height: 12,
          background: "#00e5ff",
          boxShadow: "0 0 20px #00e5ff, 0 0 40px rgba(0,229,255,0.4)",
          animation: "centerPulse 2s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/** Threat level badge */
function ThreatBadge({ level }: { level: ThreatEvent["level"] }) {
  const cfg = {
    LOW: { bg: "rgba(34,211,238,0.15)", color: "#22d3ee", label: "LOW" },
    MED: { bg: "rgba(139,92,246,0.2)", color: "#8b5cf6", label: "MED" },
    HIGH: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "HIGH" },
    CRIT: { bg: "rgba(239,68,68,0.3)", color: "#ff2020", label: "CRIT" },
  }[level];
  return (
    <span
      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
    >
      {cfg.label}
    </span>
  );
}

/** Neural node map */
function NeuralNodes({ nodes }: { nodes: Node[] }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35 }}>
      {/* Connection lines */}
      {nodes.slice(0, 12).map((a, ai) =>
        nodes.slice(ai + 1, ai + 4).map((b, bi) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 35) return null;
          return (
            <line
              key={`${ai}-${bi}`}
              x1={`${a.x}%`} y1={`${a.y}%`}
              x2={`${b.x}%`} y2={`${b.y}%`}
              stroke="#00e5ff"
              strokeWidth="0.5"
              strokeOpacity={0.4}
            />
          );
        })
      )}
      {/* Nodes */}
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={`${n.x}%`}
          cy={`${n.y}%`}
          r={n.size}
          fill="#00e5ff"
          style={{
            animation: `nodePulse 3s ease-in-out infinite`,
            animationDelay: `${n.pulseDelay}s`,
          }}
        />
      ))}
    </svg>
  );
}

/** Scan beam */
function ScanBeam({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, #00e5ff, #22d3ee, transparent)",
          boxShadow: "0 0 20px #00e5ff, 0 0 40px rgba(0,229,255,0.6)",
          animation: "scanSweep 1.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/** Auth step animation */
function AuthOverlay({ step }: { step: number }) {
  const current = AUTH_STEPS[step];
  const progress = ((step + 1) / AUTH_STEPS.length) * 100;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: "rgba(5,8,22,0.95)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
      }}
    >
      {/* Shield ring */}
      <div className="relative mb-8" style={{ width: 120, height: 120 }}>
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" style={{ animation: "radarSpin 2s linear infinite" }}>
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeDasharray="80 260"
            strokeLinecap="round"
          />
        </svg>
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" style={{ animation: "radarSpin 3s linear infinite reverse" }}>
          <circle
            cx="60" cy="60" r="44"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeDasharray="40 240"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {current.icon}
        </div>
      </div>

      <p className="font-mono text-cyan-300 text-lg tracking-widest mb-2" style={{ animation: "textFlicker 0.5s ease-in-out" }}>
        {current.label}
      </p>
      <p className="font-mono text-cyan-600 text-xs tracking-[0.3em] mb-8">
        TRUSTLAYERLABS SECURITY PROTOCOL
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1 rounded-full" style={{ background: "rgba(0,229,255,0.15)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #06b6d4, #00e5ff)",
            boxShadow: "0 0 10px #00e5ff",
          }}
        />
      </div>
      <p className="font-mono text-cyan-600 text-xs mt-3 tracking-widest">
        {Math.round(progress)}% VERIFIED
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(-1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [cyberFact, setCyberFact] = useState(0);
  const [currentTime, setCurrentTime] = useState(formatTime());
  const [particles] = useState(() => generateParticles(60));
  const [nodes] = useState(() => generateNodes(20));
  const [scanActive, setScanActive] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(t);
  }, []);

  // Threat feed
  useEffect(() => {
    function addEvent() {
      const src = THREAT_EVENTS[Math.floor(Math.random() * THREAT_EVENTS.length)];
      const evt: ThreatEvent = { ...src, id: Date.now(), time: formatTime() };
      setThreatEvents((prev) => [evt, ...prev].slice(0, 6));
    }
    addEvent();
    const t = setInterval(addEvent, 3200);
    return () => clearInterval(t);
  }, []);

  // Cyber fact rotation
  useEffect(() => {
    const t = setInterval(() => setCyberFact((f) => (f + 1) % CYBER_FACTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Scan beam interval
  useEffect(() => {
    let beamTimeout: ReturnType<typeof setTimeout> | undefined;
    const t = setInterval(() => {
      setScanActive(true);
      beamTimeout = setTimeout(() => setScanActive(false), 1500);
    }, 8000);
    return () => {
      clearInterval(t);
      if (beamTimeout) clearTimeout(beamTimeout);
    };
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailError("");

      if (!email.includes("@")) {
        setEmailError("Invalid identity token — check your credentials.");
        return;
      }

      if (!password) {
        setEmailError("Cipher key required — enter your password.");
        return;
      }

      setIsAuthenticating(true);
      setAuthStep(0);

      try {
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        );
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

        for (let i = 0; i < AUTH_STEPS.length; i++) {
          await new Promise((r) => setTimeout(r, AUTH_STEPS[i].duration));
          if (i < AUTH_STEPS.length - 1) setAuthStep(i + 1);
        }

        await new Promise((r) => setTimeout(r, 800));
        navigate(getPostAuthPath(credential.user.email, fromPath), { replace: true });
      } catch {
        setEmailError("Authentication failed — verify credentials and retry.");
      } finally {
        setIsAuthenticating(false);
        setAuthStep(-1);
      }
    },
    [email, password, navigate, fromPath, rememberMe]
  );

  return (
    <>
      {/* ── Global keyframe styles ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }

        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes centerPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.5; }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.3; r: 3px; }
          50%       { opacity: 1;   r: 5px; }
        }
        @keyframes scanSweep {
          0%   { transform: translateY(0vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes textFlicker {
          0%, 100% { opacity: 1; }
          30%       { opacity: 0.7; }
          60%       { opacity: 1; }
          80%       { opacity: 0.85; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,229,255,0.2), inset 0 0 20px rgba(0,229,255,0.03); }
          50%       { box-shadow: 0 0 40px rgba(0,229,255,0.4), inset 0 0 30px rgba(0,229,255,0.08); }
        }
        @keyframes statCount {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes threatSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes orbitA {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbitB {
          from { transform: rotate(180deg) translateX(100px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(100px) rotate(-540deg); }
        }
        @keyframes scanlineScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(4px); }
        }
        @keyframes inputGlow {
          0%, 100% { border-color: rgba(0,229,255,0.4); box-shadow: 0 0 0 0 transparent; }
          50%       { border-color: rgba(0,229,255,0.8); box-shadow: 0 0 16px rgba(0,229,255,0.2); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1); }
          50%       { box-shadow: 0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2); }
        }
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes factFade {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes cornerBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        .cyber-input:focus { outline: none; animation: inputGlow 2s ease-in-out infinite; }
        .login-btn:hover   { transform: translateY(-2px); transition: transform 0.2s ease; }
        .login-btn:active  { transform: translateY(0px); }
        
        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,229,255,0.015) 2px,
            rgba(0,229,255,0.015) 4px
          );
          pointer-events: none;
          animation: scanlineScroll 0.1s linear infinite;
          border-radius: inherit;
        }
      `}</style>

      {/* ── Root ──────────────────────────────────────────────────────────── */}
      <div
        className="relative w-screen h-screen overflow-hidden flex"
        style={{
          background: "#050816",
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {/* Animated neural grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridScroll 8s linear infinite",
          }}
        />

        {/* Deep vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,8,22,0.8) 100%)",
          }}
        />

        {/* ── LEFT PANEL ──────────────────────────────────────────────── */}
        <div
          className="relative flex-1 flex flex-col overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <ParticleCanvas particles={particles} />
          <NeuralNodes nodes={nodes} />
          <ScanBeam active={scanActive} />

          {/* Radar */}
          <div
            className="absolute pointer-events-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <RadarRings />

            {/* Orbiting elements */}
            <div
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: 10, height: 10,
                marginTop: -5, marginLeft: -5,
                animation: "orbitA 6s linear infinite",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 10, height: 10,
                  background: "#00e5ff",
                  boxShadow: "0 0 12px #00e5ff",
                }}
              />
            </div>
            <div
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: 6, height: 6,
                marginTop: -3, marginLeft: -3,
                animation: "orbitB 9s linear infinite",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 6, height: 6,
                  background: "#8b5cf6",
                  boxShadow: "0 0 10px #8b5cf6",
                }}
              />
            </div>
          </div>

          {/* Content column */}
          <div className="relative z-10 flex flex-col h-full p-8 xl:p-12">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-auto">
              <div className="flex items-center gap-3">
                {/* Logo mark */}
                <div
                  className="flex items-center justify-center rounded"
                  style={{
                    width: 36, height: 36,
                    background: "linear-gradient(135deg, #00e5ff22, #8b5cf622)",
                    border: "1px solid rgba(0,229,255,0.3)",
                  }}
                >
                  <span style={{ fontSize: 16 }}>⬡</span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#00e5ff",
                      letterSpacing: "0.2em",
                    }}
                  >
                    TRUSTLAYERLABS
                  </p>
                  <p style={{ fontSize: 9, color: "#22d3ee88", letterSpacing: "0.15em" }}>
                    CYBER INTELLIGENCE DIVISION
                  </p>
                </div>
              </div>

              {/* System time */}
              <div className="text-right">
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 18,
                    color: "#00e5ff",
                    letterSpacing: "0.1em",
                  }}
                >
                  {currentTime}
                </p>
                <p style={{ fontSize: 9, color: "#22d3ee66", letterSpacing: "0.2em" }}>
                  UTC+0 · SYSTEM ACTIVE
                </p>
              </div>
            </div>

            {/* Hero text block */}
            <div className="flex flex-col mt-auto mb-6">
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  color: "#00e5ff",
                  letterSpacing: "0.35em",
                  marginBottom: 16,
                }}
              >
                ◈ SECURE ACCESS TERMINAL v4.7.1 ◈
              </p>

              <h1
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(22px, 3vw, 42px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  marginBottom: 16,
                  textShadow: "0 0 40px rgba(0,229,255,0.3)",
                }}
              >
                SECURE ACCESS TO THE{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00e5ff, #22d3ee, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  CYBER INTELLIGENCE
                </span>{" "}
                GRID
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "clamp(12px, 1.2vw, 15px)",
                  lineHeight: 1.7,
                  maxWidth: 520,
                  marginBottom: 32,
                }}
              >
                AI-powered cyber awareness and threat intelligence platform designed to educate,
                detect, analyze, and defend against evolving digital threats in real-time.
              </p>

              {/* Stats row */}
              <div className="flex gap-6 mb-8">
                {[
                  { value: "14.2M", label: "THREATS BLOCKED" },
                  { value: "99.97%", label: "UPTIME SLA" },
                  { value: "< 0.3ms", label: "RESPONSE TIME" },
                ].map((s, i) => (
                  <div key={i} style={{ animation: `statCount 0.6s ease ${i * 0.15}s both` }}>
                    <p
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#00e5ff",
                        textShadow: "0 0 20px rgba(0,229,255,0.5)",
                      }}
                    >
                      {s.value}
                    </p>
                    <p style={{ fontSize: 9, color: "#22d3ee88", letterSpacing: "0.2em" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Threat feed */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(0,229,255,0.03)",
                border: "1px solid rgba(0,229,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderBottom: "1px solid rgba(0,229,255,0.1)" }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 6, height: 6,
                    background: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                    animation: "centerPulse 1s ease-in-out infinite",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 9,
                    color: "#22d3ee",
                    letterSpacing: "0.3em",
                  }}
                >
                  LIVE THREAT INTELLIGENCE FEED
                </p>
                <div className="ml-auto flex gap-1.5">
                  {["#00e5ff", "#8b5cf6", "#22d3ee"].map((c, i) => (
                    <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: c, opacity: 0.6 }} />
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 space-y-2.5" style={{ maxHeight: 160, overflow: "hidden" }}>
                {threatEvents.slice(0, 4).map((evt, i) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3"
                    style={{
                      animation: i === 0 ? "threatSlide 0.4s ease" : undefined,
                      opacity: 1 - i * 0.2,
                    }}
                  >
                    <ThreatBadge level={evt.level} />
                    <p
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.65)",
                        flex: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      {evt.text}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 9,
                        color: "#22d3ee66",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {evt.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cyber fact ticker */}
            <div className="mt-4 flex items-center gap-3">
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 9,
                  color: "#8b5cf6",
                  letterSpacing: "0.25em",
                  whiteSpace: "nowrap",
                }}
              >
                ◈ DID YOU KNOW
              </div>
              <div
                key={cyberFact}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.45)",
                  animation: "factFade 5s ease forwards",
                }}
              >
                {CYBER_FACTS[cyberFact]}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Auth Terminal ─────────────────────────────── */}
        <div
          className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{
            width: "clamp(360px, 38vw, 520px)",
            background: "linear-gradient(180deg, #070b1a 0%, #050816 100%)",
            borderLeft: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          {/* Ambient glow behind panel */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "30%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 400, height: 400,
              background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Auth holographic card */}
          <div
            className="scanlines relative w-full mx-6 rounded-2xl overflow-visible"
            style={{
              maxWidth: 400,
              padding: "2.5rem",
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(139,92,246,0.03) 50%, rgba(0,229,255,0.02) 100%)",
              border: "1px solid rgba(0,229,255,0.2)",
              backdropFilter: "blur(16px)",
              animation: "glowPulse 4s ease-in-out infinite",
            }}
          >
            {/* Corner markers */}
            {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos}`}
                style={{
                  width: 12, height: 12,
                  borderColor: "#00e5ff",
                  borderStyle: "solid",
                  borderWidth: 0,
                  ...(i === 0 ? { borderTopWidth: 2, borderLeftWidth: 2 } :
                     i === 1 ? { borderTopWidth: 2, borderRightWidth: 2 } :
                     i === 2 ? { borderBottomWidth: 2, borderLeftWidth: 2 } :
                               { borderBottomWidth: 2, borderRightWidth: 2 }),
                  opacity: 0.6,
                  animation: `cornerBlink ${2 + i * 0.3}s ease-in-out infinite`,
                }}
              />
            ))}

            {/* Auth overlay on login */}
            {isAuthenticating && authStep >= 0 && (
              <AuthOverlay step={authStep} />
            )}

            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center rounded-2xl mb-4"
                style={{
                  width: 64, height: 64,
                  background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(139,92,246,0.1))",
                  border: "1px solid rgba(0,229,255,0.3)",
                  fontSize: 28,
                  animation: "float 4s ease-in-out infinite",
                  boxShadow: "0 0 30px rgba(0,229,255,0.15)",
                }}
              >
                🛡️
              </div>

              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.15em",
                  marginBottom: 6,
                }}
              >
                IDENTITY AUTHENTICATION
              </h2>

              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 9,
                  color: "#00e5ff",
                  letterSpacing: "0.3em",
                }}
              >
                ◈ CLEARANCE LEVEL: OPERATOR ◈
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 9,
                    color: "#22d3ee",
                    letterSpacing: "0.25em",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  ◦ IDENTITY TOKEN (EMAIL)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="operator@trustlayerlabs.com"
                    className="cyber-input w-full rounded-lg px-4 py-3"
                    style={{
                      background: "rgba(0,229,255,0.04)",
                      border: `1px solid ${emailError ? "#ef4444" : focusedField === "email" ? "rgba(0,229,255,0.6)" : "rgba(0,229,255,0.2)"}`,
                      color: "#e2e8f0",
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#00e5ff", fontSize: 14, opacity: 0.6 }}
                  >
                    ◈
                  </div>
                </div>
                {emailError && (
                  <p
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 9,
                      color: "#ef4444",
                      marginTop: 6,
                      letterSpacing: "0.1em",
                    }}
                  >
                    ⚠ {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 9,
                    color: "#22d3ee",
                    letterSpacing: "0.25em",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  ◦ CIPHER KEY (PASSWORD)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••••••••••"
                    className="cyber-input w-full rounded-lg px-4 py-3 pr-12"
                    style={{
                      background: "rgba(0,229,255,0.04)",
                      border: `1px solid ${focusedField === "password" ? "rgba(0,229,255,0.6)" : "rgba(0,229,255,0.2)"}`,
                      color: "#e2e8f0",
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 12,
                      letterSpacing: showPassword ? "0.05em" : "0.2em",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#00e5ff",
                      fontSize: 14,
                      opacity: 0.6,
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {showPassword ? "◉" : "◎"}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className="relative flex items-center justify-center rounded"
                    style={{
                      width: 16, height: 16,
                      border: "1px solid rgba(0,229,255,0.4)",
                      background: rememberMe ? "rgba(0,229,255,0.15)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {rememberMe && (
                      <span style={{ color: "#00e5ff", fontSize: 10, lineHeight: 1 }}>✓</span>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    MAINTAIN SESSION
                  </span>
                </label>

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10,
                    color: "#00e5ff",
                    letterSpacing: "0.1em",
                    opacity: 0.8,
                  }}
                >
                  RESET CIPHER KEY
                </button>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="login-btn w-full rounded-xl py-4 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(6,182,212,0.2) 100%)",
                  border: "1px solid rgba(0,229,255,0.5)",
                  color: "#00e5ff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  cursor: isAuthenticating ? "not-allowed" : "pointer",
                  animation: "btnPulse 3s ease-in-out infinite",
                  transition: "all 0.3s",
                }}
              >
                {/* Button shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(0,229,255,0.1) 50%, transparent 60%)",
                    animation: "radarSpin 3s linear infinite",
                    borderRadius: "inherit",
                  }}
                />
                <span className="relative z-10">
                  {isAuthenticating ? "AUTHENTICATING..." : "INITIATE SECURE LOGIN"}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div style={{ flex: 1, height: 1, background: "rgba(0,229,255,0.1)" }} />
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 9,
                  color: "#22d3ee66",
                  letterSpacing: "0.2em",
                }}
              >
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(0,229,255,0.1)" }} />
            </div>

            {/* Sign up */}
            <p
              className="text-center"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
              }}
            >
              NO CLEARANCE?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#00e5ff",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                REQUEST ACCESS
              </Link>
            </p>

            {/* Bottom security badge */}
            <div
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg"
              style={{
                background: "rgba(0,229,255,0.04)",
                border: "1px solid rgba(0,229,255,0.1)",
              }}
            >
              <span style={{ fontSize: 12 }}>🔒</span>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 9,
                  color: "#22d3ee88",
                  letterSpacing: "0.15em",
                }}
              >
                AES-256-GCM · TLS 1.3 · ZERO-TRUST ARCHITECTURE
              </p>
            </div>
          </div>

          {/* Footer */}
          <p
            className="absolute bottom-4"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.2em",
            }}
          >
            © 2025 TRUSTLAYERLABS · CLASSIFIED · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </>
  );
}