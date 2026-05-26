"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface ThreatNode {
  id: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  severity: "critical" | "high" | "medium" | "low";
  label: string;
  active: boolean;
}

interface ThreatStream {
  id: string;
  type: "ALERT" | "WARNING" | "SCAN" | "AI" | "INTEL" | "BREACH";
  message: string;
  timestamp: string;
  severity: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const THREAT_STREAMS_DATA: Omit<ThreatStream, "id" | "timestamp">[] = [
  { type: "ALERT", message: "Banking phishing campaign detected — 847 targets across Maharashtra", severity: 9 },
  { type: "AI", message: "Neural correlation engine identified cross-border fraud network", severity: 8 },
  { type: "SCAN", message: "Deepfake impersonation cluster — 23 verified synthetic media artifacts", severity: 7 },
  { type: "WARNING", message: "QR scam propagation velocity increasing +340% over 6 hours", severity: 8 },
  { type: "INTEL", message: "Social engineering vector active — targeting BFSI sector employees", severity: 6 },
  { type: "BREACH", message: "Credential stuffing attack wave originating from Eastern Europe nodes", severity: 9 },
  { type: "AI", message: "Pattern anomaly: coordinated smishing infrastructure detected", severity: 7 },
  { type: "SCAN", message: "Investment fraud ecosystem mapped — 134 linked domains identified", severity: 6 },
  { type: "ALERT", message: "Emergency: Real-time phishing kit deployment — fintech brand spoofed", severity: 10 },
  { type: "INTEL", message: "Threat actor TTPs correlate with APT-FIN7 behavioral signature", severity: 8 },
  { type: "WARNING", message: "Vishing campaign targeting elderly demographics — 3 states affected", severity: 7 },
  { type: "AI", message: "Predictive model: 94.3% confidence — next attack vector: UPI impersonation", severity: 9 },
];

const TERMINAL_SEQUENCES = [
  ["initializing sentinel core...", "loading neural threat matrices...", "calibrating awareness engines...", "sentinel core online ✓"],
  ["analyze phishing spike", "scanning threat intelligence feeds...", "neural correlation established...", "phishing surge detected — 847 endpoints compromised"],
  ["scan deepfake cluster", "loading synthetic media detection...", "running biometric divergence analysis...", "23 deepfake artifacts identified — threat level: HIGH"],
  ["correlate fraud vectors", "mapping financial crime networks...", "cross-referencing 2.3M data points...", "fraud nexus identified — 134 connected nodes"],
  ["predict next attack", "activating predictive threat engine...", "analyzing historical patterns...", "prediction: UPI impersonation wave — ETA 4.2 hours"],
];

const THREAT_NODES: ThreatNode[] = [
  { id: "n1", x: 22, y: 28, lat: 55.75, lng: 37.61, severity: "critical", label: "Moscow", active: true },
  { id: "n2", x: 48, y: 42, lat: 28.61, lng: 77.20, severity: "high", label: "Delhi", active: true },
  { id: "n3", x: 15, y: 35, lat: 51.50, lng: -0.12, severity: "medium", label: "London", active: true },
  { id: "n4", x: 8, y: 38, lat: 40.71, lng: -74.00, severity: "high", label: "New York", active: true },
  { id: "n5", x: 62, y: 50, lat: 1.35, lng: 103.82, severity: "medium", label: "Singapore", active: true },
  { id: "n6", x: 30, y: 55, lat: -1.28, lng: 36.82, severity: "low", label: "Nairobi", active: false },
  { id: "n7", x: 72, y: 30, lat: 35.68, lng: 139.69, severity: "high", label: "Tokyo", active: true },
  { id: "n8", x: 50, y: 38, lat: 19.07, lng: 72.87, severity: "critical", label: "Mumbai", active: true },
  { id: "n9", x: 25, y: 32, lat: 48.85, lng: 2.35, severity: "medium", label: "Paris", active: false },
  { id: "n10", x: 85, y: 45, lat: -33.86, lng: 151.21, severity: "low", label: "Sydney", active: true },
  { id: "n11", x: 18, y: 60, lat: -23.55, lng: -46.63, severity: "medium", label: "São Paulo", active: true },
  { id: "n12", x: 40, y: 25, lat: 60.19, lng: 24.93, severity: "low", label: "Helsinki", active: false },
  { id: "n13", x: 55, y: 40, lat: 12.97, lng: 77.59, severity: "critical", label: "Bengaluru", active: true },
];

const NAV_NODES = [
  { id: "sentinel", label: "SENTINEL", angle: 270, icon: "◈" },
  { id: "threats", label: "THREATS", angle: 330, icon: "⚠" },
  { id: "intelligence", label: "INTEL", angle: 30, icon: "◎" },
  { id: "neural", label: "NEURAL", angle: 90, icon: "⬡" },
  { id: "forensics", label: "FORENSICS", angle: 150, icon: "⊞" },
  { id: "command", label: "COMMAND", angle: 210, icon: "⊕" },
];

const SEVERITY_COLORS = {
  critical: "#ff2a2a",
  high: "#ff7a00",
  medium: "#ffcc00",
  low: "#00e5ff",
};

// ─── UTILITY ──────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ─── CANVAS: NEURAL MESH ──────────────────────────────────────────────────────
const NeuralMeshCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#00e5ff", "#06b6d4", "#22d3ee", "#7c3aed", "#0ea5e9"];
    particlesRef.current = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.1,
      size: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = "rgba(0,229,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      const particles = particlesRef.current;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Connections
        particles.forEach(q => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && p.id !== q.id) {
            ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        });

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Traveling data streams
      for (let i = 0; i < 3; i++) {
        const streamX = ((t * 80 + i * 300) % (canvas.width + 200)) - 100;
        const streamY = 150 + i * 200 + Math.sin(t + i) * 50;
        const grad = ctx.createLinearGradient(streamX - 80, 0, streamX + 80, 0);
        grad.addColorStop(0, "rgba(0,229,255,0)");
        grad.addColorStop(0.5, "rgba(0,229,255,0.4)");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(streamX - 80, streamY);
        ctx.lineTo(streamX + 80, streamY);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// ─── CANVAS: WORLD MAP ────────────────────────────────────────────────────────
const WorldThreatMap: React.FC<{ nodes: ThreatNode[] }> = ({ nodes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  const latLngToXY = (lat: number, lng: number, w: number, h: number) => ({
    x: ((lng + 180) / 360) * w,
    y: ((90 - lat) / 180) * h,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    let t = 0;
    const activeNodes = nodes.filter(n => n.active);

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      // Background atmosphere
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
      bg.addColorStop(0, "rgba(0,100,160,0.08)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Grid lines (simplified world map feel)
      ctx.strokeStyle = "rgba(0,229,255,0.06)";
      ctx.lineWidth = 0.5;
      for (let lng = -180; lng <= 180; lng += 30) {
        const x = ((lng + 180) / 360) * W;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let lat = -90; lat <= 90; lat += 30) {
        const y = ((90 - lat) / 180) * H;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // India highlight
      const indiaX = ((77 + 180) / 360) * W;
      const indiaY = ((90 - 20) / 180) * H;
      const indiaGrad = ctx.createRadialGradient(indiaX, indiaY, 0, indiaX, indiaY, 60);
      indiaGrad.addColorStop(0, "rgba(0,229,255,0.15)");
      indiaGrad.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = indiaGrad;
      ctx.beginPath();
      ctx.arc(indiaX, indiaY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Attack routes between nodes
      for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
          if (Math.random() > 0.7) continue;
          const a = latLngToXY(activeNodes[i].lat, activeNodes[i].lng, W, H);
          const b = latLngToXY(activeNodes[j].lat, activeNodes[j].lng, W, H);
          const severity = activeNodes[i].severity;
          const color = severity === "critical" ? "255,42,42" : severity === "high" ? "255,122,0" : "0,229,255";
          
          // Animated traveling packet
          const progress = (t * 0.3 + i * 0.15) % 1;
          const px = a.x + (b.x - a.x) * progress;
          const py = a.y + (b.y - a.y) * progress;

          const lineGrad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          lineGrad.addColorStop(0, `rgba(${color},0)`);
          lineGrad.addColorStop(0.5, `rgba(${color},0.25)`);
          lineGrad.addColorStop(1, `rgba(${color},0)`);
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -t * 8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Packet dot
          ctx.fillStyle = `rgba(${color},0.9)`;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodes
      activeNodes.forEach((node) => {
        const pos = latLngToXY(node.lat, node.lng, W, H);
        const color = SEVERITY_COLORS[node.severity];
        const pulse = Math.sin(t * 2 + node.id.charCodeAt(0)) * 0.5 + 0.5;

        // Outer ring pulse
        ctx.strokeStyle = color + "60";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10 + pulse * 8, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dot
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 6);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + "00");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "rgba(0,229,255,0.8)";
        ctx.font = "8px 'Courier New', monospace";
        ctx.fillText(node.label.toUpperCase(), pos.x + 8, pos.y - 4);
      });

      // Radar sweep centered on India
      const radarX = indiaX;
      const radarY = indiaY;
      const radarR = 80 + Math.sin(t * 0.3) * 10;
      ctx.save();
      ctx.translate(radarX, radarY);
      ctx.rotate(t * 0.8);
      const sweep = ctx.createLinearGradient(0, -radarR, 0, radarR);
      sweep.addColorStop(0, "rgba(0,229,255,0.3)");
      sweep.addColorStop(0.5, "rgba(0,229,255,0.05)");
      sweep.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = sweep;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radarR, -Math.PI / 4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Radar circle
      ctx.strokeStyle = "rgba(0,229,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(radarX, radarY, radarR, 0, Math.PI * 2);
      ctx.stroke();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [nodes]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

// ─── COMPONENT: AI CORE ──────────────────────────────────────────────────────
const AICore: React.FC<{ threatLevel: number }> = ({ threatLevel }) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      {/* Outermost ring */}
      {[280, 240, 200, 160, 120].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: i % 2 === 0 ? "rgba(0,229,255,0.15)" : "rgba(124,58,237,0.12)",
            boxShadow: i === 0 ? "0 0 40px rgba(0,229,255,0.05)" : "none",
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 12 + i * 5, repeat: Infinity, ease: "linear" }}
        >
          {/* Ring nodes */}
          {i === 0 && Array.from({ length: 6 }).map((_, j) => (
            <motion.div
              key={j}
              className="absolute w-2 h-2 rounded-full bg-cyan-400"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${j * 60}deg) translateY(-${size / 2}px) translateX(-50%) translateY(-50%)`,
                boxShadow: "0 0 8px #00e5ff",
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.25 }}
            />
          ))}
          {i === 2 && Array.from({ length: 4 }).map((_, j) => (
            <motion.div
              key={j}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${j * 90}deg) translateY(-${size / 2}px) translateX(-50%) translateY(-50%)`,
                boxShadow: "0 0 6px #a855f7",
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: j * 0.5 }}
            />
          ))}
        </motion.div>
      ))}

      {/* Scan lines */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 240, height: 240, border: "1px solid rgba(0,229,255,0.5)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "50%",
            height: "1px",
            background: "linear-gradient(to right, rgba(0,229,255,0.8), transparent)",
            transformOrigin: "left center",
          }}
        />
      </motion.div>

      {/* Core sphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          background: "radial-gradient(circle at 35% 35%, #22d3ee, #0891b2, #0a1020)",
          boxShadow: `0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2), inset 0 0 30px rgba(0,229,255,0.1)`,
        }}
        animate={{
          scale: [1, 1.06, 1],
          boxShadow: [
            "0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2)",
            "0 0 60px rgba(0,229,255,0.9), 0 0 120px rgba(0,229,255,0.4)",
            "0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner hex pattern */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.9)", textShadow: "0 0 20px #00e5ff" }}>⬡</span>
        </div>
      </motion.div>

      {/* Threat level indicator arc */}
      <svg className="absolute" style={{ width: 300, height: 300, top: 10, left: 10 }} viewBox="0 0 300 300">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor={threatLevel > 7 ? "#ff2a2a" : "#22d3ee"} />
          </linearGradient>
        </defs>
        <motion.circle
          cx="150" cy="150" r="145"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="1"
          strokeDasharray={`${(threatLevel / 10) * 911} 911`}
          strokeLinecap="round"
          transform="rotate(-90 150 150)"
          animate={{ strokeDasharray: [`${(threatLevel / 10) * 911} 911`, `${((threatLevel + 0.5) / 10) * 911} 911`, `${(threatLevel / 10) * 911} 911`] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Status labels */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div style={{ fontSize: 9, color: "#00e5ff", letterSpacing: "0.2em", fontFamily: "Courier New" }}>SENTINEL ACTIVE</div>
        <div style={{ fontSize: 7, color: "rgba(0,229,255,0.5)", letterSpacing: "0.15em", fontFamily: "Courier New" }}>NEURAL SYNC: 99.7%</div>
      </motion.div>
    </div>
  );
};

// ─── COMPONENT: TERMINAL ─────────────────────────────────────────────────────
const CyberTerminal: React.FC = () => {
  const [lines, setLines] = useState<{ text: string; type: "cmd" | "output" | "success" | "warn" }[]>([
    { text: "SENTINEL CORE v4.7.2 — TRUSTLAYERLABS INTELLIGENCE PLATFORM", type: "output" },
    { text: "Quantum encryption active. Neural matrices loaded.", type: "output" },
    { text: "█", type: "cmd" },
  ]);
  const [seqIdx, setSeqIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    const seq = TERMINAL_SEQUENCES[seqIdx % TERMINAL_SEQUENCES.length];
    const delay = lineIdx === 0 && !isTyping ? 3000 : 40;

    const timer = setTimeout(() => {
      const currentLine = seq[lineIdx];
      if (!currentLine) return;

      if (charIdx === 0) {
        setIsTyping(true);
        setLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            text: lineIdx === 0 ? "> " : "  ",
            type: lineIdx === 0 ? "cmd" : lineIdx === seq.length - 1 ? "success" : "output",
          };
          return updated;
        });
      }

      if (charIdx < currentLine.length) {
        setLines(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, text: last.text + currentLine[charIdx] };
          return updated;
        });
        setCharIdx(c => c + 1);
      } else {
        // Line done
        if (lineIdx < seq.length - 1) {
          setLines(prev => [...prev, { text: "█", type: "cmd" }]);
          setLineIdx(l => l + 1);
          setCharIdx(0);
        } else {
          // Sequence done — wait then restart
          setIsTyping(false);
          setTimeout(() => {
            setLines(prev => [...prev.slice(-6), { text: "█", type: "cmd" }]);
            setSeqIdx(s => s + 1);
            setLineIdx(0);
            setCharIdx(0);
          }, 2500);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [lines, seqIdx, lineIdx, charIdx, isTyping]);

  const typeColors = {
    cmd: "#00e5ff",
    output: "rgba(0,229,255,0.5)",
    success: "#00ff88",
    warn: "#ff7a00",
  };

  return (
    <div
      className="relative"
      style={{
        background: "rgba(5,8,22,0.92)",
        border: "1px solid rgba(0,229,255,0.2)",
        borderRadius: 8,
        padding: "12px 16px",
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        height: 200,
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0,229,255,0.05), inset 0 0 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-2" style={{ borderBottom: "1px solid rgba(0,229,255,0.1)" }}>
        <div className="w-2 h-2 rounded-full bg-red-500 opacity-70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-70" />
        <div className="w-2 h-2 rounded-full bg-green-500 opacity-70" />
        <span style={{ color: "rgba(0,229,255,0.4)", fontSize: 9, letterSpacing: "0.2em", marginLeft: 8 }}>NEURAL COMMAND INTERFACE</span>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.01) 2px, rgba(0,229,255,0.01) 4px)",
          borderRadius: 8,
        }}
      />

      <div className="overflow-hidden" style={{ height: 150 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: typeColors[line.type], lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {line.text}
            {i === lines.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ display: "inline-block", width: 6, height: 12, background: "#00e5ff", verticalAlign: "middle", marginLeft: 1 }}
              />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

// ─── COMPONENT: THREAT STREAM FEED ───────────────────────────────────────────
const ThreatStreamFeed: React.FC = () => {
  const [streams, setStreams] = useState<ThreatStream[]>([]);

  useEffect(() => {
    const initial = THREAT_STREAMS_DATA.slice(0, 5).map((s) => ({
      ...s,
      id: generateId(),
      timestamp: formatTime(),
    }));
    setStreams(initial);

    const interval = setInterval(() => {
      const template = THREAT_STREAMS_DATA[Math.floor(Math.random() * THREAT_STREAMS_DATA.length)];
      const newStream: ThreatStream = {
        ...template,
        id: generateId(),
        timestamp: formatTime(),
      };
      setStreams(prev => [newStream, ...prev.slice(0, 7)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const typeColors: Record<string, string> = {
    ALERT: "#ff2a2a",
    WARNING: "#ff7a00",
    SCAN: "#00e5ff",
    AI: "#a855f7",
    INTEL: "#22d3ee",
    BREACH: "#ff0055",
  };

  return (
    <div className="space-y-1.5" style={{ height: 240, overflow: "hidden" }}>
      <AnimatePresence initial={false}>
        {streams.map((stream) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-2 py-1.5 px-2 rounded"
            style={{ background: "rgba(0,229,255,0.03)", border: `1px solid ${typeColors[stream.type]}22` }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "Courier New",
                color: typeColors[stream.type],
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
                paddingTop: 1,
                textShadow: `0 0 8px ${typeColors[stream.type]}`,
              }}
            >
              [{stream.type}]
            </span>
            <span style={{ fontSize: 10, color: "rgba(0,229,255,0.7)", fontFamily: "Courier New", lineHeight: 1.4 }}>
              {stream.message}
            </span>
            <span style={{ fontSize: 8, color: "rgba(0,229,255,0.25)", fontFamily: "Courier New", whiteSpace: "nowrap", marginLeft: "auto", paddingTop: 1 }}>
              {stream.timestamp}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── COMPONENT: HOLOGRAPHIC PANEL ────────────────────────────────────────────
interface HoloPanelProps {
  title: string;
  icon: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  accentColor?: string;
  delay?: number;
}

const HoloPanel: React.FC<HoloPanelProps> = ({ title, icon, style, children, accentColor = "#00e5ff", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="relative"
    style={{
      background: "linear-gradient(135deg, rgba(5,8,22,0.95) 0%, rgba(7,11,26,0.98) 100%)",
      border: `1px solid ${accentColor}25`,
      borderRadius: 8,
      backdropFilter: "blur(20px)",
      boxShadow: `0 0 30px ${accentColor}08, inset 0 0 30px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.5)`,
      ...style,
    }}
  >
    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: `1px solid ${accentColor}`, borderLeft: `1px solid ${accentColor}`, borderRadius: "8px 0 0 0" }} />
    <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: `1px solid ${accentColor}`, borderRight: `1px solid ${accentColor}`, borderRadius: "0 8px 0 0" }} />
    <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: `1px solid ${accentColor}`, borderLeft: `1px solid ${accentColor}`, borderRadius: "0 0 0 8px" }} />
    <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: `1px solid ${accentColor}`, borderRight: `1px solid ${accentColor}`, borderRadius: "0 0 8px 0" }} />

    {/* Header */}
    <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${accentColor}15` }}>
      <span style={{ color: accentColor, fontSize: 14 }}>{icon}</span>
      <span style={{ color: accentColor, fontSize: 9, fontFamily: "Courier New", letterSpacing: "0.25em", textShadow: `0 0 10px ${accentColor}` }}>
        {title}
      </span>
      <motion.div
        className="ml-auto w-1.5 h-1.5 rounded-full"
        style={{ background: accentColor }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>

    <div className="p-4">{children}</div>
  </motion.div>
);

// ─── COMPONENT: METRIC COUNTER ────────────────────────────────────────────────
const MetricGauge: React.FC<{ label: string; value: number; max: number; color: string; unit?: string }> = ({ label, value, max, color, unit = "" }) => {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span style={{ fontSize: 9, color: "rgba(0,229,255,0.5)", fontFamily: "Courier New", letterSpacing: "0.1em" }}>{label}</span>
        <motion.span
          style={{ fontSize: 14, color, fontFamily: "Courier New", fontWeight: "bold", textShadow: `0 0 10px ${color}` }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {value}{unit}
        </motion.span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(0,229,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ─── COMPONENT: RADIAL NAV ───────────────────────────────────────────────────
const RadialNav: React.FC<{ activeNode: string; onSelect: (id: string) => void }> = ({ activeNode, onSelect }) => {
  return (
    <div className="relative" style={{ width: 180, height: 180 }}>
      {/* Center button */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center cursor-pointer"
        style={{
          width: 48,
          height: 48,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(0,229,255,0.2), rgba(0,229,255,0.05))",
          border: "1px solid rgba(0,229,255,0.5)",
          zIndex: 10,
        }}
        whileHover={{ scale: 1.1 }}
        animate={{ boxShadow: ["0 0 15px rgba(0,229,255,0.3)", "0 0 30px rgba(0,229,255,0.6)", "0 0 15px rgba(0,229,255,0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontSize: 16, color: "#00e5ff" }}>◈</span>
      </motion.div>

      {/* Rotating ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 170,
          height: 170,
          top: 5,
          left: 5,
          border: "1px solid rgba(0,229,255,0.08)",
          borderTop: "1px solid rgba(0,229,255,0.3)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {NAV_NODES.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const r = 75;
        const x = 90 + r * Math.cos(rad);
        const y = 90 + r * Math.sin(rad);
        const isActive = activeNode === node.id;

        return (
          <motion.button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className="absolute flex flex-col items-center justify-center cursor-pointer"
            style={{
              width: 38,
              height: 38,
              left: x - 19,
              top: y - 19,
              background: isActive
                ? "radial-gradient(circle, rgba(0,229,255,0.3), rgba(0,229,255,0.05))"
                : "radial-gradient(circle, rgba(0,229,255,0.08), transparent)",
              border: `1px solid ${isActive ? "rgba(0,229,255,0.7)" : "rgba(0,229,255,0.2)"}`,
              borderRadius: "50%",
              boxShadow: isActive ? "0 0 20px rgba(0,229,255,0.4)" : "none",
            }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span style={{ fontSize: 12, color: isActive ? "#00e5ff" : "rgba(0,229,255,0.5)" }}>{node.icon}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── COMPONENT: CIRCULAR THREAT METER ─────────────────────────────────────────
const ThreatMeter: React.FC<{ level: number }> = ({ level }) => {
  const circumference = 2 * Math.PI * 40;
  const color = level >= 8 ? "#ff2a2a" : level >= 6 ? "#ff7a00" : level >= 4 ? "#ffcc00" : "#00e5ff";
  const label = level >= 8 ? "CRITICAL" : level >= 6 ? "HIGH" : level >= 4 ? "ELEVATED" : "NOMINAL";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 100, height: 100 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - level / 10)}
            strokeLinecap="round"
            animate={{ filter: [`drop-shadow(0 0 4px ${color})`, `drop-shadow(0 0 10px ${color})`, `drop-shadow(0 0 4px ${color})`] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            style={{ fontSize: 22, fontFamily: "Courier New", fontWeight: "bold", color, lineHeight: 1 }}
            animate={{ opacity: level >= 8 ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {level}
          </motion.span>
          <span style={{ fontSize: 8, color: "rgba(0,229,255,0.4)", fontFamily: "Courier New" }}>/10</span>
        </div>
      </div>
      <span style={{ fontSize: 9, color, fontFamily: "Courier New", letterSpacing: "0.15em", textShadow: `0 0 8px ${color}` }}>{label}</span>
    </div>
  );
};

// ─── COMPONENT: INTEL AWARENESS ──────────────────────────────────────────────
const AwarenessScorecard: React.FC = () => {
  const metrics = [
    { label: "PHISHING VECTORS", value: 847, max: 1000, color: "#ff2a2a" },
    { label: "DEEPFAKE DETECTIONS", value: 23, max: 50, color: "#a855f7" },
    { label: "FRAUD NODES MAPPED", value: 134, max: 200, color: "#ff7a00" },
    { label: "NEURAL CONFIDENCE", value: 94, max: 100, color: "#00e5ff" },
    { label: "AWARENESS COVERAGE", value: 78, max: 100, color: "#22d3ee" },
  ];

  return (
    <div className="space-y-3">
      {metrics.map((m) => (
        <MetricGauge key={m.label} {...m} unit={m.label === "NEURAL CONFIDENCE" || m.label === "AWARENESS COVERAGE" ? "%" : ""} />
      ))}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SentinelCorePage() {
  const [activeNav, setActiveNav] = useState("sentinel");
  const [threatLevel, setThreatLevel] = useState(8);
  const [activeThreats, setActiveThreats] = useState(23);
  const [scanProgress, setScanProgress] = useState(0);
  const [systemTime, setSystemTime] = useState(formatTime());
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(formatTime());
      setThreatLevel(prev => {
        const d = (Math.random() - 0.5) * 0.4;
        return Math.min(10, Math.max(5, prev + d));
      });
      setActiveThreats(prev => prev + Math.floor((Math.random() - 0.3) * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scan = setInterval(() => {
      setScanProgress(p => (p >= 100 ? 0 : p + 0.8));
    }, 50);
    return () => clearInterval(scan);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set((e.clientX - window.innerWidth / 2) / window.innerWidth * 20);
    mouseY.set((e.clientY - window.innerHeight / 2) / window.innerHeight * 20);
  }, [mouseX, mouseY]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#050816", fontFamily: "Courier New, monospace" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── LAYER 1: Neural mesh canvas ── */}
      <NeuralMeshCanvas />

      {/* ── LAYER 2: Ambient radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,100,160,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── LAYER 3: Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(5,8,22,0.85) 100%)",
        }}
      />

      {/* ── HEADER BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 flex items-center justify-between px-8 py-3"
        style={{ borderBottom: "1px solid rgba(0,229,255,0.12)", background: "rgba(5,8,22,0.9)", backdropFilter: "blur(20px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00e5ff22, #06b6d410)", border: "1px solid rgba(0,229,255,0.4)" }}
            animate={{ boxShadow: ["0 0 8px rgba(0,229,255,0.3)", "0 0 20px rgba(0,229,255,0.6)", "0 0 8px rgba(0,229,255,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span style={{ fontSize: 14, color: "#00e5ff" }}>⬡</span>
          </motion.div>
          <div>
            <div style={{ fontSize: 11, color: "#00e5ff", letterSpacing: "0.3em", fontWeight: "bold", textShadow: "0 0 15px rgba(0,229,255,0.5)" }}>
              TRUSTLAYERLABS
            </div>
            <div style={{ fontSize: 8, color: "rgba(0,229,255,0.4)", letterSpacing: "0.4em" }}>SENTINEL CORE</div>
          </div>
        </div>

        {/* Center status */}
        <div className="flex items-center gap-6">
          {["NEURAL ENGINE", "THREAT MATRIX", "AWARENESS AI", "SCAN GRID"].map((sys, i) => (
            <div key={sys} className="flex items-center gap-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 1 ? "#ff7a00" : "#00e5ff" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
              <span style={{ fontSize: 8, color: "rgba(0,229,255,0.4)", letterSpacing: "0.15em" }}>{sys}</span>
            </div>
          ))}
        </div>

        {/* Right: time and alert */}
        <div className="flex items-center gap-4">
          <motion.div
            className="px-3 py-1 rounded"
            style={{ background: "rgba(255,42,42,0.1)", border: "1px solid rgba(255,42,42,0.3)" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span style={{ fontSize: 9, color: "#ff4444", letterSpacing: "0.1em" }}>THREAT LEVEL: {Math.round(threatLevel)}/10</span>
          </motion.div>
          <div className="text-right">
            <div style={{ fontSize: 11, color: "#00e5ff", fontFamily: "Courier New", letterSpacing: "0.1em" }}>{systemTime}</div>
            <div style={{ fontSize: 7, color: "rgba(0,229,255,0.3)", letterSpacing: "0.2em" }}>IST • LIVE</div>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex gap-4 p-4" style={{ minHeight: "calc(100vh - 56px)" }}>

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-4" style={{ width: 280, flexShrink: 0 }}>

          {/* Radial nav + threat meter */}
          <HoloPanel title="COMMAND NAV" icon="◎" delay={0.1}>
            <div className="flex items-center justify-between gap-2">
              <RadialNav activeNode={activeNav} onSelect={setActiveNav} />
              <ThreatMeter level={Math.round(threatLevel)} />
            </div>
          </HoloPanel>

          {/* Awareness scorecard */}
          <HoloPanel title="THREAT INTELLIGENCE METRICS" icon="⊞" delay={0.2} style={{ flex: 1 }}>
            <AwarenessScorecard />
          </HoloPanel>

          {/* Scan progress */}
          <HoloPanel title="ACTIVE SCAN OPERATION" icon="◉" delay={0.3} accentColor="#a855f7">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ fontSize: 9, color: "rgba(168,85,247,0.7)", fontFamily: "Courier New" }}>DEEP SCAN PROGRESS</span>
                <span style={{ fontSize: 9, color: "#a855f7", fontFamily: "Courier New" }}>{Math.round(scanProgress)}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(168,85,247,0.1)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ width: `${scanProgress}%`, background: "linear-gradient(to right, #7c3aed, #a855f7)", boxShadow: "0 0 8px #a855f7" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[{ l: "DOMAINS SCANNED", v: "2.3M" }, { l: "THREATS FOUND", v: activeThreats }, { l: "FALSE POSITIVES", v: "0.3%" }, { l: "ACCURACY", v: "99.7%" }].map(m => (
                  <div key={m.l} className="p-1.5 rounded" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)" }}>
                    <div style={{ fontSize: 7, color: "rgba(168,85,247,0.5)", letterSpacing: "0.1em" }}>{m.l}</div>
                    <div style={{ fontSize: 13, color: "#a855f7", fontFamily: "Courier New", fontWeight: "bold" }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </HoloPanel>
        </div>

        {/* ── CENTER COLUMN ── */}
        <div className="flex flex-col gap-4" style={{ flex: 1, minWidth: 0 }}>

          {/* World Threat Map */}
          <HoloPanel title="GLOBAL THREAT INTELLIGENCE MAP" icon="◈" delay={0.15} style={{ height: 380 }}>
            <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ top: 44 }}>
              <WorldThreatMap nodes={THREAT_NODES} />
            </div>
            {/* Node legend */}
            <div className="absolute bottom-3 right-4 flex items-center gap-3">
              {(["critical", "high", "medium", "low"] as const).map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: SEVERITY_COLORS[s], boxShadow: `0 0 4px ${SEVERITY_COLORS[s]}` }} />
                  <span style={{ fontSize: 7, color: "rgba(0,229,255,0.4)", fontFamily: "Courier New", letterSpacing: "0.1em" }}>{s.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </HoloPanel>

          {/* AI Core + Terminal row */}
          <div className="flex gap-4">
            {/* AI CORE */}
            <HoloPanel title="SENTINEL AI CORE" icon="⬡" delay={0.2} style={{ width: 380, flexShrink: 0 }}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  style={{ x: springX, y: springY }}
                >
                  <AICore threatLevel={threatLevel} />
                </motion.div>
                <div className="flex gap-4 mt-1">
                  {[
                    { label: "NEURAL SYNC", value: "99.7%" },
                    { label: "ACTIVE THREADS", value: "2,847" },
                    { label: "UPTIME", value: "99.9%" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div style={{ fontSize: 12, color: "#00e5ff", fontFamily: "Courier New", fontWeight: "bold" }}>{s.value}</div>
                      <div style={{ fontSize: 7, color: "rgba(0,229,255,0.4)", letterSpacing: "0.1em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </HoloPanel>

            {/* Terminal */}
            <div className="flex flex-col gap-4" style={{ flex: 1, minWidth: 0 }}>
              <HoloPanel title="NEURAL COMMAND TERMINAL" icon="▶" delay={0.25} style={{ flex: 1 }}>
                <CyberTerminal />
              </HoloPanel>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "INCIDENTS TODAY", value: "47", color: "#ff2a2a" },
                  { label: "CASES RESOLVED", value: "31", color: "#00ff88" },
                  { label: "UNDER ANALYSIS", value: "16", color: "#ff7a00" },
                ].map(s => (
                  <motion.div
                    key={s.label}
                    className="p-3 rounded text-center"
                    style={{ background: "rgba(5,8,22,0.9)", border: `1px solid ${s.color}25`, boxShadow: `0 0 15px ${s.color}06` }}
                    whileHover={{ borderColor: `${s.color}60`, boxShadow: `0 0 20px ${s.color}15` }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      style={{ fontSize: 26, color: s.color, fontFamily: "Courier New", fontWeight: "bold", textShadow: `0 0 10px ${s.color}` }}
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {s.value}
                    </motion.div>
                    <div style={{ fontSize: 7, color: "rgba(0,229,255,0.4)", letterSpacing: "0.12em", marginTop: 2 }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4" style={{ width: 290, flexShrink: 0 }}>

          {/* Live threat feed */}
          <HoloPanel title="LIVE THREAT INTELLIGENCE FEED" icon="⚡" delay={0.1} accentColor="#ff4444" style={{ flex: "none" }}>
            <ThreatStreamFeed />
          </HoloPanel>

          {/* Incident breakdown */}
          <HoloPanel title="CYBER INCIDENT TAXONOMY" icon="⊕" delay={0.2}>
            <div className="space-y-2">
              {[
                { label: "Phishing Campaigns", count: 847, pct: 42, color: "#ff2a2a" },
                { label: "Investment Fraud", count: 312, pct: 28, color: "#ff7a00" },
                { label: "Deepfake Impersonation", count: 134, pct: 15, color: "#a855f7" },
                { label: "QR Scams", count: 98, pct: 10, color: "#ffcc00" },
                { label: "Credential Stuffing", count: 47, pct: 5, color: "#00e5ff" },
              ].map(item => (
                <div key={item.label} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span style={{ fontSize: 9, color: "rgba(0,229,255,0.6)", fontFamily: "Courier New" }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: item.color, fontFamily: "Courier New" }}>{item.count}</span>
                  </div>
                  <div className="h-0.5 rounded-full" style={{ background: "rgba(0,229,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </HoloPanel>

          {/* AI Predictions */}
          <HoloPanel title="PREDICTIVE THREAT ANALYSIS" icon="◎" delay={0.3} accentColor="#a855f7">
            <div className="space-y-2">
              {[
                { threat: "UPI Impersonation Wave", eta: "4.2h", confidence: 94, color: "#ff2a2a" },
                { threat: "SMS Phishing Surge", eta: "8.7h", confidence: 87, color: "#ff7a00" },
                { threat: "Job Scam Campaign", eta: "12.1h", confidence: 71, color: "#ffcc00" },
                { threat: "Parcel Delivery Fraud", eta: "18.3h", confidence: 63, color: "#a855f7" },
              ].map(p => (
                <motion.div
                  key={p.threat}
                  className="p-2 rounded"
                  style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.12)" }}
                  whileHover={{ background: "rgba(168,85,247,0.08)" }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span style={{ fontSize: 9, color: "rgba(0,229,255,0.7)", fontFamily: "Courier New", lineHeight: 1.3 }}>{p.threat}</span>
                    <span style={{ fontSize: 8, color: "#a855f7", fontFamily: "Courier New", whiteSpace: "nowrap", marginLeft: 8 }}>ETA {p.eta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-0.5 rounded-full" style={{ background: "rgba(168,85,247,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, background: p.color, boxShadow: `0 0 4px ${p.color}` }} />
                    </div>
                    <span style={{ fontSize: 8, color: p.color, fontFamily: "Courier New" }}>{p.confidence}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </HoloPanel>

          {/* System health */}
          <HoloPanel title="SYSTEM VITALS" icon="◈" delay={0.4}>
            <div className="space-y-2.5">
              {[
                { label: "CPU NEURAL LOAD", value: 73, color: "#00e5ff" },
                { label: "MEMORY MATRIX", value: 61, color: "#22d3ee" },
                { label: "DATA THROUGHPUT", value: 88, color: "#06b6d4" },
                { label: "SENSOR COVERAGE", value: 97, color: "#00ff88" },
              ].map(v => (
                <MetricGauge key={v.label} label={v.label} value={v.value} max={100} color={v.color} unit="%" />
              ))}
            </div>
          </HoloPanel>
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-2"
        style={{ background: "rgba(5,8,22,0.95)", borderTop: "1px solid rgba(0,229,255,0.1)", backdropFilter: "blur(20px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-6">
          {[
            { label: "SENTINEL ENGINE", status: "ONLINE", ok: true },
            { label: "NEURAL CORRELATOR", status: "ACTIVE", ok: true },
            { label: "DEEPFAKE SCANNER", status: "SCANNING", ok: true },
            { label: "THREAT RADAR", status: "LIVE", ok: true },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: s.ok ? "#00e5ff" : "#ff2a2a" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span style={{ fontSize: 8, color: "rgba(0,229,255,0.4)", letterSpacing: "0.1em" }}>{s.label}</span>
              <span style={{ fontSize: 8, color: s.ok ? "#00e5ff" : "#ff2a2a", letterSpacing: "0.1em" }}>— {s.status}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 8, color: "rgba(0,229,255,0.3)", letterSpacing: "0.15em" }}>
            TRUSTLAYERLABS © 2025 — CLASSIFIED INTELLIGENCE ENVIRONMENT
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* ── FLOATING SCAN OVERLAY ── */}
      <motion.div
        className="fixed pointer-events-none z-40"
        style={{
          top: "10%",
          right: "1%",
          width: 2,
          height: "80%",
          background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.3), transparent)",
        }}
        animate={{ x: [0, -10, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── CORNER DECORATIONS ── */}
      {["top-16 left-4", "top-16 right-4"].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} pointer-events-none z-30`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path
              d={i === 0 ? "M10,10 L10,2 L2,2 M10,10 L2,10" : "M50,10 L50,2 L58,2 M50,10 L58,10"}
              fill="none"
              stroke="rgba(0,229,255,0.4)"
              strokeWidth="1"
            />
            <motion.circle
              cx={i === 0 ? 10 : 50}
              cy="10"
              r="2"
              fill="#00e5ff"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}