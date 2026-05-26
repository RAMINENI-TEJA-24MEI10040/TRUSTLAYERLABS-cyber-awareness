import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { EASE_OUT_SOFT } from "../../lib/motion";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  threat: string;
  stat: string;
  statLabel: string;
  color: string;
  glow: string;
  href: string;
  visual: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

// ─── Canvas Globe ────────────────────────────────────────────────────────────
function CyberGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;

    const nodes: { lat: number; lon: number; pulse: number; speed: number }[] = Array.from({ length: 22 }, () => ({
      lat: (Math.random() - 0.5) * Math.PI,
      lon: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }));

    const lines = nodes.slice(0, 14).map((_, i) => ({
      from: i,
      to: (i + 2 + Math.floor(Math.random() * 5)) % nodes.length,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));

    function project(lat: number, lon: number, rot: number) {
      const x = Math.cos(lat) * Math.sin(lon + rot);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(lon + rot);
      return { x: cx + x * R, y: cy - y * R, z, visible: z > -0.2 };
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H);
      const rot = t * 0.00018;

      // Outer glow ring
      const outerGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.3);
      outerGrad.addColorStop(0, "rgba(0,229,255,0.07)");
      outerGrad.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Globe base gradient
      const baseGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      baseGrad.addColorStop(0, "rgba(6,182,212,0.12)");
      baseGrad.addColorStop(0.5, "rgba(5,8,22,0.6)");
      baseGrad.addColorStop(1, "rgba(0,229,255,0.06)");
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Latitude lines
      for (let i = -3; i <= 3; i++) {
        const lat = (i / 3.5) * (Math.PI / 2);
        const r = Math.cos(lat) * R;
        const yOff = Math.sin(lat) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy - yOff, r, r * 0.15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,229,255,0.12)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 8; i++) {
        const lon = (i / 8) * Math.PI * 2 + rot;
        ctx.beginPath();
        for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.05) {
          const p = project(lat, lon, 0);
          if (lat === -Math.PI / 2) ctx.moveTo(p.x, p.y);
          else if (p.visible) ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(0,229,255,0.08)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Arc connections
      lines.forEach((line) => {
        const from = nodes[line.from];
        const to = nodes[line.to];
        const pf = project(from.lat, from.lon, rot);
        const pt = project(to.lat, to.lon, rot);
        if (!pf.visible || !pt.visible) return;

        line.progress += line.speed;
        if (line.progress > 1) line.progress = 0;

        const ip = line.progress;
        const ix = pf.x + (pt.x - pf.x) * ip;
        const iy = pf.y + (pt.y - pf.y) * ip;

        ctx.beginPath();
        ctx.moveTo(pf.x, pf.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = "rgba(0,229,255,0.07)";
        ctx.lineWidth = 0.6;
        ctx.stroke();

        const grad = ctx.createRadialGradient(ix, iy, 0, ix, iy, 6);
        grad.addColorStop(0, "rgba(0,229,255,0.9)");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ix, iy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nodes
      nodes.forEach((node) => {
        const p = project(node.lat, node.lon, rot);
        if (!p.visible) return;
        node.pulse += 0.04 * node.speed;
        const pulse = (Math.sin(node.pulse) + 1) / 2;
        const alpha = 0.4 + pulse * 0.6;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8 + pulse * 6);
        grad.addColorStop(0, `rgba(0,229,255,${alpha})`);
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + pulse * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Radar sweep
      const sweepAngle = (t * 0.0006) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, sweepAngle - 0.8, sweepAngle);
      ctx.closePath();
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      rg.addColorStop(0, "rgba(0,229,255,0)");
      rg.addColorStop(0.7, "rgba(0,229,255,0.04)");
      rg.addColorStop(1, "rgba(0,229,255,0.12)");
      ctx.fillStyle = rg;
      ctx.fill();
      ctx.restore();

      // Globe rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,229,255,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasEl: HTMLCanvasElement = canvasRef.current;
    const ctx = canvasEl.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * canvasEl.width,
      y: Math.random() * canvasEl.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? "#8b5cf6" : "#00e5ff",
    }));

    function draw() {
      const w = canvasEl.width;
      const h = canvasEl.height;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── Module Visuals ───────────────────────────────────────────────────────────
function PhishingVisual() {
  return (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-70">
      <rect x="5" y="10" width="70" height="45" rx="4" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="5" y="10" width="70" height="12" rx="4" fill="#00e5ff" fillOpacity="0.08" />
      <circle cx="14" cy="16" r="3" fill="#ef4444" fillOpacity="0.7" />
      <circle cx="24" cy="16" r="3" fill="#f59e0b" fillOpacity="0.7" />
      <circle cx="34" cy="16" r="3" fill="#22c55e" fillOpacity="0.7" />
      <line x1="15" y1="28" x2="65" y2="28" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3" />
      <line x1="15" y1="36" x2="55" y2="36" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 3" />
      <line x1="15" y1="44" x2="60" y2="44" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 3" />
      <path d="M 20 50 L 40 38 L 60 50" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" />
      <motion.circle
        cx="40" cy="38" r="4"
        fill="#ef4444" fillOpacity="0.6"
        animate={{ r: [4, 7, 4], fillOpacity: [0.6, 0.1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  );
}

function QRVisual() {
  const cells: React.ReactElement[] = [];
  const pattern = [
    [1,1,1,0,1,1,1],[1,0,1,0,1,0,1],[1,0,1,1,0,0,1],[0,0,1,0,1,0,0],[1,0,1,1,0,0,1],[1,0,0,0,1,0,1],[1,1,1,0,1,1,1]
  ];
  pattern.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell) cells.push(<rect key={`${r}-${c}`} x={8 + c * 9} y={8 + r * 9} width="7" height="7" rx="1" fill="#00e5ff" fillOpacity="0.5" />);
    })
  );
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full opacity-70">
      {cells}
      <motion.rect
        x="2" y="2" width="76" height="76" rx="4"
        fill="none" stroke="#ef4444" strokeWidth="1.5"
        animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <line x1="0" y1="40" x2="80" y2="40" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}

function UPIVisual() {
  return (
    <svg viewBox="0 0 80 70" className="w-full h-full opacity-70">
      <rect x="10" y="8" width="60" height="40" rx="6" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="10" y="8" width="60" height="14" rx="6" fill="#00e5ff" fillOpacity="0.1" />
      <text x="40" y="20" textAnchor="middle" fill="#00e5ff" fontSize="6" fontFamily="monospace" fillOpacity="0.7">₹ 24,999</text>
      <line x1="20" y1="30" x2="60" y2="30" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x="25" y="39" fill="#00e5ff" fontSize="5" fontFamily="monospace" fillOpacity="0.5">UPI: victim@xyz</text>
      <motion.path
        d="M 30 52 L 40 60 L 50 52"
        fill="none" stroke="#ef4444" strokeWidth="2"
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <circle cx="40" cy="47" r="5" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="38" y1="45" x2="38" y2="49" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="42" y1="45" x2="42" y2="49" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );
}

function IdentityVisual() {
  return (
    <svg viewBox="0 0 80 70" className="w-full h-full opacity-70">
      <circle cx="40" cy="22" r="14" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="40" cy="18" r="7" fill="#00e5ff" fillOpacity="0.1" />
      <path d="M 20 48 Q 40 36 60 48" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.3" />
      <motion.rect
        x="8" y="8" width="64" height="54" rx="4"
        fill="none" stroke="#ef4444" strokeWidth="1"
        strokeDasharray="6 4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        style={{ transformOrigin: "40px 35px" }}
      />
      <line x1="15" y1="56" x2="65" y2="56" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="15" y1="62" x2="55" y2="62" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.2" />
    </svg>
  );
}

function PasswordVisual() {
  const chars = "A3!xK9@zP#";
  return (
    <svg viewBox="0 0 80 70" className="w-full h-full opacity-70">
      <rect x="25" y="8" width="30" height="22" rx="4" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="20" y="26" width="40" height="30" rx="4" fill="#00e5ff" fillOpacity="0.07" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="40" cy="41" r="5" fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="40" cy="41" r="2" fill="#00e5ff" fillOpacity="0.4" />
      {chars.split("").map((c, i) => (
        <motion.text
          key={i}
          x={22 + i * 4}
          y="65"
          fill={i % 3 === 0 ? "#8b5cf6" : "#00e5ff"}
          fontSize="5"
          fontFamily="monospace"
          fillOpacity="0.6"
          animate={{ fillOpacity: [0.2, 0.8, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
        >{c}</motion.text>
      ))}
    </svg>
  );
}

function SocialVisual() {
  return (
    <svg viewBox="0 0 80 70" className="w-full h-full opacity-70">
      {[
        { cx: 20, cy: 20, r: 10 },
        { cx: 60, cy: 20, r: 10 },
        { cx: 40, cy: 52, r: 10 },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.cx} cy={node.cy} r={node.r}
            fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4"
            animate={{ r: [node.r, node.r + 3, node.r] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
          />
          <circle cx={node.cx} cy={node.cy} r={4} fill="#00e5ff" fillOpacity="0.3" />
        </g>
      ))}
      <line x1="20" y1="20" x2="60" y2="20" stroke="#00e5ff" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="20" y1="20" x2="40" y2="52" stroke="#00e5ff" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="60" y1="20" x2="40" y2="52" stroke="#00e5ff" strokeWidth="0.8" strokeOpacity="0.3" />
      <motion.circle
        cx={40} cy={36} r={5}
        fill="#ef4444" fillOpacity="0.5"
        animate={{ r: [5, 9, 5], fillOpacity: [0.5, 0.1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
    </svg>
  );
}

function DeepfakeVisual() {
  return (
    <svg viewBox="0 0 80 70" className="w-full h-full opacity-70">
      <circle cx="40" cy="28" r="16" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 40 + Math.cos(angle) * 16;
        const y1 = 28 + Math.sin(angle) * 16;
        const x2 = 40 + Math.cos(angle) * 22;
        const y2 = 28 + Math.sin(angle) * 22;
        return <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4"
          animate={{ strokeOpacity: [0.2, 0.7, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.25 }} />;
      })}
      <circle cx="40" cy="24" r="5" fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M 26 36 Q 40 44 54 36" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" />
      <motion.rect
        x="14" y="12" width="52" height="42" rx="3"
        fill="none" stroke="#ef4444" strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <line x1="14" y1="54" x2="24" y2="44" stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="66" y1="54" x2="56" y2="44" stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.4" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES: Module[] = [
  {
    id: "phishing",
    title: "Phishing Intelligence",
    subtitle: "Email & Link Threat Analysis",
    icon: "⚠",
    threat: "CRITICAL",
    stat: "3.4B",
    statLabel: "phishing emails/day",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.3)",
    href: "/awareness/phishing",
    visual: <PhishingVisual />,
  },
  {
    id: "qr",
    title: "QR Scam Awareness",
    subtitle: "Visual Code Threat Vectors",
    icon: "◈",
    threat: "HIGH",
    stat: "587%",
    statLabel: "rise in QR phishing",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    href: "/awareness/qr",
    visual: <QRVisual />,
  },
  {
    id: "upi",
    title: "UPI Fraud Defense",
    subtitle: "Payment Intelligence Systems",
    icon: "₹",
    threat: "HIGH",
    stat: "₹1,750Cr",
    statLabel: "lost to UPI fraud FY23",
    color: "#00e5ff",
    glow: "rgba(0,229,255,0.3)",
    href: "/awareness/upi",
    visual: <UPIVisual />,
  },
  {
    id: "identity",
    title: "Identity Theft Intel",
    subtitle: "Personal Data Threat Vectors",
    icon: "◎",
    threat: "CRITICAL",
    stat: "33%",
    statLabel: "adults victimized globally",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.3)",
    href: "/awareness/identity-theft",
    visual: <IdentityVisual />,
  },
  {
    id: "password",
    title: "Password & MFA Defense",
    subtitle: "Authentication Security Matrix",
    icon: "⬡",
    threat: "MEDIUM",
    stat: "80%",
    statLabel: "breaches via weak creds",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
    href: "/awareness/password-mfa",
    visual: <PasswordVisual />,
  },
  {
    id: "social",
    title: "Social Media Threats",
    subtitle: "Network Manipulation Analysis",
    icon: "◉",
    threat: "HIGH",
    stat: "4.9B",
    statLabel: "active social media users",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    href: "/awareness/social-media",
    visual: <SocialVisual />,
  },
  {
    id: "deepfake",
    title: "Deepfake Intelligence",
    subtitle: "Synthetic Media Detection",
    icon: "⬢",
    threat: "EMERGING",
    stat: "900%",
    statLabel: "deepfakes increase YoY",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    href: "/awareness/deepfake",
    visual: <DeepfakeVisual />,
  },
];

const THREAT_FACTS = [
  "Deepfake scam calls increased 3000% this year alone — voice cloning now reaches millions",
  "QR phishing attacks bypass traditional email filters with 97% success rate",
  "Credential stuffing remains one of the largest account takeover vectors — 193B attempts logged annually",
  "Social engineering costs organizations over $4.1 billion annually worldwide",
  "UPI fraud complaints in India grew 89% year-over-year — real-time payments demand real-time vigilance",
  "AI-generated phishing emails have 40% higher click-through rates than manual variants",
  "1 in 3 users reuse passwords across more than 10 accounts — the domino breach is inevitable",
  "Identity theft affects 1.4 million Americans monthly — your digital shadow is your biggest vulnerability",
];

const FLOW_STEPS = [
  { label: "Awareness", icon: "◎", desc: "Recognize threats before they reach you", color: "#00e5ff" },
  { label: "Detection", icon: "⬡", desc: "Identify active attack patterns", color: "#06b6d4" },
  { label: "Verification", icon: "◈", desc: "Validate authenticity of requests", color: "#22d3ee" },
  { label: "Protection", icon: "⬢", desc: "Deploy layered defense mechanisms", color: "#8b5cf6" },
  { label: "Reporting", icon: "◉", desc: "Escalate threats to authorities", color: "#f59e0b" },
  { label: "Cyber Safety", icon: "⚠", desc: "Maintain ongoing security posture", color: "#22c55e" },
];

const THREAT_BADGE_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f59e0b",
  MEDIUM: "#06b6d4",
  EMERGING: "#8b5cf6",
};

// ─── Module Card ───────────────────────────────────────────────────────────────
function ModuleCard({ module, index }: { module: Module; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={module.href}
      className="relative block cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: EASE_OUT_SOFT }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{ background: module.glow }}
        animate={{ opacity: hovered ? 0.5 : 0.1 }}
        transition={{ duration: 0.3 }}
      />

      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          background: "linear-gradient(135deg, rgba(10,16,32,0.95) 0%, rgba(5,8,22,0.98) 100%)",
          borderColor: hovered ? module.color + "60" : "rgba(0,229,255,0.1)",
          transition: "border-color 0.3s",
        }}
      >
        {/* Top bar accent */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${module.color}80, transparent)` }} />

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: module.color + "15", color: module.color, border: `1px solid ${module.color}30` }}
            >
              {module.icon}
            </div>
            <span
              className="text-xs font-bold tracking-widest px-2 py-1 rounded"
              style={{
                color: THREAT_BADGE_COLORS[module.threat],
                background: THREAT_BADGE_COLORS[module.threat] + "15",
                border: `1px solid ${THREAT_BADGE_COLORS[module.threat]}30`,
              }}
            >
              {module.threat}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-base mb-1 leading-tight" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            {module.title}
          </h3>
          <p className="text-xs mb-4" style={{ color: "rgba(0,229,255,0.4)", fontFamily: "monospace" }}>
            {module.subtitle}
          </p>

          {/* Visual */}
          <div
            className="w-full rounded-lg mb-4 overflow-hidden"
            style={{ height: "80px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)" }}
          >
            {module.visual}
          </div>

          {/* Stat */}
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black" style={{ color: module.color, fontFamily: "'Exo 2', sans-serif" }}>
              {module.stat}
            </span>
            <span className="text-xs pb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
              {module.statLabel}
            </span>
          </div>

          {/* Enter indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-xs font-bold tracking-widest"
            style={{ color: module.color, fontFamily: "monospace" }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
          >
            ENTER MODULE
            <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
          </motion.div>
        </div>

        {/* Scan line on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-x-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${module.color}80, transparent)` }}
              initial={{ top: "0%", opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "linear" }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.a>
  );
}

// ─── Ticker ────────────────────────────────────────────────────────────────────
function ThreatTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % THREAT_FACTS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative border-y overflow-hidden py-3 px-6"
      style={{
        borderColor: "rgba(0,229,255,0.1)",
        background: "rgba(0,229,255,0.03)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <span
          className="flex-shrink-0 text-xs font-bold tracking-widest px-3 py-1 rounded"
          style={{ color: "#ef4444", background: "#ef444415", border: "1px solid #ef444430", fontFamily: "monospace" }}
        >
          ● LIVE INTEL
        </span>
        <div className="overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="text-sm"
              style={{ color: "rgba(0,229,255,0.7)", fontFamily: "monospace" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {THREAT_FACTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex-shrink-0 flex gap-1">
          {THREAT_FACTS.map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i === index ? "#00e5ff" : "rgba(0,229,255,0.2)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AwarenessIndex() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Share+Tech+Mono&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #050816 0%, #070b1a 50%, #050816 100%)",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Ambient cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-10 rounded-full blur-3xl"
        style={{
          width: 400,
          height: 400,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Background particles */}
      <ParticleField />

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── NAV ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(0,229,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)" }}>
            <span style={{ color: "#00e5ff", fontSize: "14px" }}>⬡</span>
          </div>
          <div>
            <div className="font-bold text-sm text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>TRUSTLAYER LABS</div>
            <div className="text-xs" style={{ color: "rgba(0,229,255,0.4)" }}>CYBER AWARENESS OS</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs" style={{ color: "rgba(0,229,255,0.5)" }}>
          <a href="#modules" className="hover:text-cyan-400 transition-colors">MODULES</a>
          <a href="#intelligence" className="hover:text-cyan-400 transition-colors">INTELLIGENCE</a>
          <a href="#flow" className="hover:text-cyan-400 transition-colors">PROTOCOL</a>
          <a href="/awareness/phishing" className="px-4 py-2 rounded text-xs font-bold" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
            ENTER GRID →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-8">
        {/* Corner brackets */}
        {[["top-8 left-8", "tl"], ["top-8 right-8 rotate-90", "tr"], ["bottom-8 left-8 -rotate-90", "bl"], ["bottom-8 right-8 rotate-180", "br"]].map(([pos]) => (
          <div key={pos} className={`absolute ${pos} w-8 h-8 opacity-30`}>
            <div className="absolute top-0 left-0 w-full h-px bg-cyan-400" />
            <div className="absolute top-0 left-0 h-full w-px bg-cyan-400" />
          </div>
        ))}

        {/* Status chip */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#22c55e" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-xs" style={{ color: "rgba(0,229,255,0.7)" }}>7 AWARENESS SYSTEMS ONLINE</span>
          <span className="text-xs px-2" style={{ color: "rgba(0,229,255,0.3)" }}>|</span>
          <span className="text-xs" style={{ color: "rgba(0,229,255,0.5)" }}>THREAT LEVEL: ELEVATED</span>
        </motion.div>

        {/* Globe + headline layout */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Headlines */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              className="text-xs mb-4 tracking-widest"
              style={{ color: "rgba(0,229,255,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ◈ CYBER INTELLIGENCE AWARENESS SYSTEM v2.4
            </motion.div>

            <motion.h1
              className="font-black leading-none mb-4"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="block text-white">CYBER THREATS</span>
              <span className="block" style={{ color: "#00e5ff" }}>EVOLVE DAILY.</span>
            </motion.h1>

            <motion.h2
              className="font-bold mb-6"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                color: "rgba(255,255,255,0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              KNOW THEM BEFORE<br />THEY REACH YOU.
            </motion.h2>

            <motion.p
              className="text-sm max-w-md mb-8 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.35)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              An immersive cyber awareness intelligence platform covering the 7 most critical digital threat vectors targeting individuals and organizations today.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <a
                href="#modules"
                className="px-6 py-3 rounded-lg font-bold text-sm relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #00e5ff20, #06b6d420)",
                  border: "1px solid rgba(0,229,255,0.4)",
                  color: "#00e5ff",
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                <span className="relative z-10">⚡ EXPLORE THREATS</span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, #00e5ff30, #06b6d430)" }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </a>
              <a
                href="#modules"
                className="px-6 py-3 rounded-lg font-bold text-sm"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#8b5cf6",
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                ◎ ENTER INTELLIGENCE GRID
              </a>
            </motion.div>

            {/* Live stats */}
            <motion.div
              className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[
                { val: "7", label: "Threat Vectors" },
                { val: "24/7", label: "Threat Intel Feed" },
                { val: "100+", label: "Attack Techniques" },
              ].map((s) => (
                <div key={s.val} className="text-center lg:text-left">
                  <div className="text-2xl font-black" style={{ color: "#00e5ff", fontFamily: "'Exo 2', sans-serif" }}>{s.val}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Globe */}
          <motion.div
            className="flex-shrink-0 relative"
            style={{ width: "min(420px, 90vw)", height: "min(420px, 90vw)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE_OUT_SOFT }}
          >
            {/* Outer rings */}
            {[1.15, 1.25].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{
                  transform: `scale(${scale})`,
                  borderColor: `rgba(0,229,255,${0.08 - i * 0.03})`,
                  top: "50%", left: "50%",
                  width: "100%", height: "100%",
                  marginTop: "-50%", marginLeft: "-50%",
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ repeat: Infinity, duration: 20 + i * 8, ease: "linear" }}
              />
            ))}

            {/* Rotating dashed ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px dashed rgba(0,229,255,0.15)",
                transform: "scale(1.05)",
                top: "50%", left: "50%",
                width: "100%", height: "100%",
                marginTop: "-50%", marginLeft: "-50%",
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            />

            {/* Globe canvas */}
            <div className="absolute inset-0">
              <CyberGlobe />
            </div>

            {/* Floating alert badges */}
            {[
              { top: "8%", right: "5%", label: "PHISHING", color: "#ef4444" },
              { bottom: "15%", left: "2%", label: "DEEPFAKE", color: "#8b5cf6" },
              { top: "40%", right: "-2%", label: "QR SCAM", color: "#f59e0b" },
            ].map((badge) => (
              <motion.div
                key={badge.label}
                className="absolute px-2 py-1 rounded text-xs font-bold"
                style={{
                  ...badge,
                  color: badge.color,
                  background: badge.color + "15",
                  border: `1px solid ${badge.color}40`,
                  fontFamily: "monospace",
                }}
                animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}
              >
                ● {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 flex flex-col items-center gap-2"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs" style={{ color: "rgba(0,229,255,0.4)" }}>SCROLL TO EXPLORE</span>
          <motion.div
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, rgba(0,229,255,0.4), transparent)" }}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      </section>

      {/* ── THREAT TICKER ── */}
      <ThreatTicker />

      {/* ── THREAT GRID ── */}
      <section id="modules" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            className="text-xs mb-3 tracking-widest"
            style={{ color: "rgba(0,229,255,0.4)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ◈ THREAT INTELLIGENCE GRID
          </motion.div>
          <motion.h2
            className="font-black text-3xl md:text-4xl text-white mb-3"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            7 AWARENESS SYSTEMS
          </motion.h2>
          <motion.p
            className="text-sm max-w-lg mx-auto"
            style={{ color: "rgba(0,229,255,0.4)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Deep-dive into every threat vector. Understand attack patterns, learn detection methods, and build your cyber defense protocol.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} />
          ))}

          {/* 8th card: System Status */}
          <motion.div
            className="relative rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,255,0.05), rgba(5,8,22,0.98))",
              border: "1px solid rgba(0,229,255,0.15)",
              gridColumn: "span 1",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div>
              <div className="text-xs mb-4 tracking-widest" style={{ color: "rgba(0,229,255,0.4)" }}>SYSTEM STATUS</div>
              <div className="space-y-3">
                {MODULES.map((mod) => (
                  <div key={mod.id} className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#22c55e" }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: Math.random() * 2 }}
                    />
                    <span className="text-xs flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>{mod.title.split(" ")[0]}</span>
                    <span className="text-xs" style={{ color: "#22c55e" }}>ONLINE</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-xs" style={{ color: "rgba(0,229,255,0.3)" }}>
              ALL 7 MODULES OPERATIONAL
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE INTELLIGENCE ── */}
      <section id="intelligence" className="relative z-10 py-20 px-6" style={{ background: "rgba(0,229,255,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-xs mb-3 tracking-widest"
              style={{ color: "rgba(0,229,255,0.4)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ◉ LIVE THREAT INTELLIGENCE
            </motion.div>
            <motion.h2
              className="font-black text-3xl md:text-4xl text-white"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              CURRENT THREAT LANDSCAPE
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Threat severity bars */}
            <motion.div
              className="col-span-1 rounded-2xl p-6"
              style={{ background: "rgba(5,8,22,0.9)", border: "1px solid rgba(0,229,255,0.1)" }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs mb-5 tracking-widest" style={{ color: "rgba(0,229,255,0.5)" }}>THREAT SEVERITY INDEX</div>
              <div className="space-y-4">
                {MODULES.map((mod, i) => (
                  <div key={mod.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{mod.title.split(" ")[0]}</span>
                      <span style={{ color: mod.color }}>{[92, 78, 85, 96, 71, 83, 88][i]}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(0,229,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${mod.color}80, ${mod.color})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${[92, 78, 85, 96, 71, 83, 88][i]}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Intelligence feed */}
            <motion.div
              className="col-span-2 rounded-2xl p-6"
              style={{ background: "rgba(5,8,22,0.9)", border: "1px solid rgba(0,229,255,0.1)" }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs mb-5 tracking-widest" style={{ color: "rgba(0,229,255,0.5)" }}>AWARENESS INTELLIGENCE FEED</div>
              <div className="space-y-3 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,229,255,0.2) transparent" }}>
                {THREAT_FACTS.concat(THREAT_FACTS).map((fact, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3 p-3 rounded-lg"
                    style={{ background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.06)" }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 8) * 0.05 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#f59e0b" : "#00e5ff" }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      />
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
                      {fact}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CYBER EDUCATION FLOW ── */}
      <section id="flow" className="relative z-10 py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-xs mb-3 tracking-widest"
              style={{ color: "rgba(0,229,255,0.4)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ⬡ CYBER DEFENSE PROTOCOL
            </motion.div>
            <motion.h2
              className="font-black text-3xl md:text-4xl text-white"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              THE AWARENESS JOURNEY
            </motion.h2>
          </div>

          {/* Flow on desktop: horizontal; on mobile: vertical */}
          <div className="hidden md:flex items-center justify-between gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <motion.div
                  className="flex flex-col items-center text-center flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                >
                  {/* Node */}
                  <div className="relative mb-3">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}15, ${step.color}05)`,
                        border: `1px solid ${step.color}40`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span style={{ color: step.color }}>{step.icon}</span>
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl blur-lg"
                      style={{ background: step.color + "20" }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                    />
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: step.color, fontFamily: "'Exo 2', sans-serif" }}>
                    {step.label.toUpperCase()}
                  </div>
                  <div className="text-xs leading-relaxed max-w-24" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {step.desc}
                  </div>
                </motion.div>

                {/* Connector */}
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flex-shrink-0 relative w-8">
                    <motion.div
                      className="h-px w-full"
                      style={{ background: `linear-gradient(90deg, ${step.color}60, ${FLOW_STEPS[i + 1].color}60)` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.5, duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: step.color, right: 0 }}
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile vertical flow */}
          <div className="md:hidden space-y-4">
            {FLOW_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${step.color}08, rgba(5,8,22,0.9))`,
                  border: `1px solid ${step.color}20`,
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: step.color + "15", border: `1px solid ${step.color}30` }}
                >
                  <span style={{ color: step.color }}>{step.icon}</span>
                </div>
                <div>
                  <div className="text-sm font-bold mb-0.5" style={{ color: step.color, fontFamily: "'Exo 2', sans-serif" }}>{step.label}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{step.desc}</div>
                </div>
                <div className="ml-auto text-xs font-bold" style={{ color: step.color + "60" }}>0{i + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-32 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,229,255,0.05), transparent)" }}
        />

        {/* Animated rings */}
        {[200, 350, 500].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: r, height: r,
              top: "50%", left: "50%",
              marginTop: -r / 2, marginLeft: -r / 2,
              borderColor: `rgba(0,229,255,${0.05 - i * 0.01})`,
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.8 }}
          />
        ))}

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            className="text-xs mb-4 tracking-widest"
            style={{ color: "rgba(0,229,255,0.4)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ◎ FINAL DIRECTIVE
          </motion.div>

          <motion.h2
            className="font-black text-3xl md:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            AWARENESS IS THE{" "}
            <span style={{ color: "#00e5ff" }}>FIRST LAYER</span>
            <br />OF DEFENSE.
          </motion.h2>

          <motion.p
            className="text-sm mb-10 max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.35)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Every cyber attack begins with a human being caught unaware. The most sophisticated firewall in the world cannot protect against a person who doesn't know what to look for.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="/awareness/phishing"
              className="px-8 py-4 rounded-xl font-black text-sm relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00e5ff, #06b6d4)",
                color: "#050816",
                fontFamily: "'Exo 2', sans-serif",
                boxShadow: "0 0 30px rgba(0,229,255,0.3)",
              }}
            >
              ⚡ START LEARNING
            </a>
            <a
              href="#modules"
              className="px-8 py-4 rounded-xl font-black text-sm"
              style={{
                background: "rgba(0,229,255,0.06)",
                border: "1px solid rgba(0,229,255,0.3)",
                color: "#00e5ff",
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              ◎ EXPLORE ALL THREATS
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 border-t px-6 py-6"
        style={{ borderColor: "rgba(0,229,255,0.08)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)" }}
            >
              <span style={{ color: "#00e5ff", fontSize: "10px" }}>⬡</span>
            </div>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>TRUSTLAYER LABS CYBER AWARENESS OS</span>
          </div>
          <div className="flex gap-6 text-xs" style={{ color: "rgba(0,229,255,0.3)" }}>
            {MODULES.map((m) => (
              <a key={m.id} href={m.href} className="hover:text-cyan-400 transition-colors hidden lg:block">
                {m.title.split(" ")[0]}
              </a>
            ))}
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            AWARENESS IS PROTECTION
          </div>
        </div>
      </footer>
    </div>
  );
}