import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getPostAuthPath } from "../../lib/postAuthRedirect";

// ─── Types ───────────────────────────────────────────────────────────────────
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

interface EnrollmentStep {
  message: string;
  duration: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ENROLLMENT_STEPS: EnrollmentStep[] = [
  { message: "Generating secure identity...", duration: 800 },
  { message: "Encrypting authentication layers...", duration: 900 },
  { message: "Establishing cyber defense profile...", duration: 850 },
  { message: "Threat awareness systems initialized...", duration: 900 },
  { message: "Enrollment complete.", duration: 600 },
];

const PARTICLE_COLORS = ["#00e5ff", "#06b6d4", "#22d3ee", "#7c3aed"];

// ─── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color + "33");
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Neural Ring ──────────────────────────────────────────────────────────────
function NeuralRings() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      {/* Outer orbit ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 320, height: 320,
          borderColor: "rgba(0,229,255,0.15)",
          boxShadow: "0 0 20px rgba(0,229,255,0.05)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            className="absolute rounded-full"
            style={{
              width: 6, height: 6,
              background: "#00e5ff",
              boxShadow: "0 0 8px #00e5ff, 0 0 16px #00e5ff",
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(158px) translateY(-3px)`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: deg / 300 }}
          />
        ))}
      </motion.div>

      {/* Mid orbit ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 240, height: 240,
          borderColor: "rgba(6,182,212,0.2)",
          borderStyle: "dashed",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <motion.div
            key={deg}
            className="absolute rounded-full"
            style={{
              width: 8, height: 8,
              background: "#06b6d4",
              boxShadow: "0 0 10px #06b6d4",
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(118px) translateY(-4px)`,
            }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: deg / 180 }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 160, height: 160,
          borderColor: "rgba(34,211,238,0.3)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Core identity avatar */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 100, height: 100,
          background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(5,8,22,0.9) 70%)",
          border: "1px solid rgba(0,229,255,0.4)",
          boxShadow: "0 0 30px rgba(0,229,255,0.2), inset 0 0 30px rgba(0,229,255,0.05)",
        }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Scan lines inside core */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          <motion.div
            className="absolute w-full"
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.8), transparent)",
            }}
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Identity icon — shield + neural */}
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            d="M21 4L6 10v12c0 8.5 6.4 16.4 15 18.5C29.6 38.4 36 30.5 36 22V10L21 4z"
            stroke="#00e5ff" strokeWidth="1.2" fill="none"
            style={{ filter: "drop-shadow(0 0 6px #00e5ff)" }}
          />
          <circle cx="21" cy="20" r="5" stroke="#22d3ee" strokeWidth="1" fill="none" />
          <circle cx="21" cy="20" r="2" fill="#00e5ff" style={{ filter: "drop-shadow(0 0 4px #00e5ff)" }} />
          <line x1="21" y1="10" x2="21" y2="15" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
          <line x1="21" y1="25" x2="21" y2="30" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
          <line x1="11" y1="20" x2="16" y2="20" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
          <line x1="26" y1="20" x2="31" y2="20" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Biometric scan beam */}
      <motion.div
        className="absolute"
        style={{
          width: 320, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent)",
          filter: "blur(1px)",
        }}
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: "rgba(0,229,255,0.3)", width: 100, height: 100 }}
          animate={{ scale: [1, 3.2], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
        />
      ))}

      {/* Corner brackets */}
      {[
        { top: 0, left: 0, rotate: 0 },
        { top: 0, right: 0, rotate: 90 },
        { bottom: 0, right: 0, rotate: 180 },
        { bottom: 0, left: 0, rotate: 270 },
      ].map((pos, i) => {
        const { rotate, ...cornerPos } = pos;
        return (
        <div
          key={i}
          className="absolute"
          style={{ ...cornerPos, width: 20, height: 20 }}
        >
          <motion.svg
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ transform: `rotate(${rotate}deg)` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          >
            <path d="M2 18 L2 2 L18 2" stroke="#00e5ff" strokeWidth="1.5" fill="none" />
          </motion.svg>
        </div>
        );
      })}
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: "WEAK", color: "#ef4444" };
    if (score <= 2) return { level: 2, label: "MODERATE", color: "#f59e0b" };
    if (score <= 3) return { level: 3, label: "STRONG", color: "#06b6d4" };
    return { level: 4, label: "MAXIMUM", color: "#00e5ff" };
  };

  const { level, label, color } = getStrength();

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5"
    >
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-0.5 flex-1 rounded-full"
            style={{ background: i <= level ? color : "rgba(255,255,255,0.08)" }}
            animate={i <= level ? {
              boxShadow: [`0 0 4px ${color}`, `0 0 8px ${color}`, `0 0 4px ${color}`],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color, letterSpacing: "0.1em" }}>
        {label} SECURITY LEVEL
      </p>
    </motion.div>
  );
}

// ─── Enrollment Overlay ───────────────────────────────────────────────────────
function EnrollmentOverlay({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let total = 0;
    ENROLLMENT_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setStepIndex(i);
        if (i === ENROLLMENT_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 1200);
          }, step.duration + 400);
        }
      }, total);
      total += step.duration + 200;
    });
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,8,22,0.97)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Scan beam */}
      <motion.div
        className="absolute w-full"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
          filter: "blur(1px)",
          boxShadow: "0 0 20px #00e5ff",
        }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Rings */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          {[180, 140, 100, 60].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size, height: size,
                borderColor: `rgba(0,229,255,${0.1 + i * 0.08})`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: done ? [1, 1.5] : 1 }}
              transition={{
                rotate: { duration: 4 - i * 0.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.6 }
              }}
            />
          ))}

          {/* Center */}
          <motion.div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: 50, height: 50,
              background: "radial-gradient(circle, rgba(0,229,255,0.3) 0%, transparent 70%)",
              border: "1px solid rgba(0,229,255,0.5)",
            }}
            animate={done ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="rounded-full"
              style={{ width: 16, height: 16, background: "#00e5ff", boxShadow: "0 0 20px #00e5ff" }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>

          {/* Success checkmark */}
          <AnimatePresence>
            {done && (
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <motion.path
                    d="M8 20 L16 28 L32 12"
                    stroke="#00e5ff" strokeWidth="2.5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps */}
        <div className="text-center space-y-3">
          {ENROLLMENT_STEPS.map((step, i) => (
            <motion.p
              key={i}
              className="font-mono text-sm tracking-widest"
              style={{
                color: i === stepIndex ? "#00e5ff" : i < stepIndex ? "rgba(0,229,255,0.35)" : "rgba(255,255,255,0.08)",
                textShadow: i === stepIndex ? "0 0 12px #00e5ff" : "none",
              }}
              animate={i === stepIndex ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {i < stepIndex ? "✓ " : i === stepIndex ? "▶ " : "  "}{step.message.toUpperCase()}
            </motion.p>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="w-64 h-px rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #06b6d4, #00e5ff)", boxShadow: "0 0 8px #00e5ff" }}
            initial={{ width: "0%" }}
            animate={{ width: `${((stepIndex + 1) / ENROLLMENT_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Cyber Input ──────────────────────────────────────────────────────────────
function CyberInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        className="flex items-center gap-2 text-xs font-mono tracking-widest"
        style={{ color: focused ? "#00e5ff" : "rgba(0,229,255,0.5)", letterSpacing: "0.12em" }}
      >
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full outline-none font-mono text-sm placeholder-opacity-30 transition-all duration-300"
          style={{
            background: focused
              ? "rgba(0,229,255,0.04)"
              : "rgba(255,255,255,0.02)",
            border: `1px solid ${error ? "#ef4444" : focused ? "rgba(0,229,255,0.5)" : "rgba(0,229,255,0.1)"}`,
            borderRadius: 6,
            padding: "12px 16px",
            color: "#e2f8ff",
            boxShadow: focused ? "0 0 16px rgba(0,229,255,0.08), inset 0 0 16px rgba(0,229,255,0.02)" : "none",
            backdropFilter: "blur(8px)",
          }}
          autoComplete="off"
        />
        {/* Scan line on focus */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-b"
              style={{ height: 1, background: "linear-gradient(90deg, transparent, #00e5ff, transparent)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono"
            style={{ color: "#ef4444", letterSpacing: "0.05em" }}
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [authError, setAuthError] = useState("");

  const updateField = (field: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Identity designation required";
    if (!form.email.includes("@")) e.email = "Valid neural address required";
    if (form.password.length < 8) e.password = "Minimum 8 character encryption key";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Authentication keys do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setAuthError("");
    setEnrolling(true);

    try {
      await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
    } catch {
      setAuthError("Enrollment failed — email may already be registered or password is invalid.");
      setEnrolling(false);
    }
  };

  const handleEnrollComplete = () => {
    setEnrolling(false);
    setEnrolled(true);
    const destination = getPostAuthPath(auth.currentUser?.email ?? form.email);
    navigate(destination, { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex overflow-hidden relative"
      style={{ background: "#050816", fontFamily: "'Courier New', monospace" }}
    >
      {/* Global scan lines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.008) 2px, rgba(0,229,255,0.008) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Radial ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,229,255,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(6,182,212,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── LEFT PANEL ── */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center p-12 overflow-hidden"
        style={{ minWidth: 0 }}
      >
        <ParticleField />

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          {/* Brand header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-2"
          >
            <p
              className="font-mono text-xs tracking-[0.4em]"
              style={{ color: "rgba(0,229,255,0.4)", letterSpacing: "0.4em" }}
            >
              ◈ TRUSTLAYERLABS ◈
            </p>
          </motion.div>

          {/* Neural rings visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="my-6"
          >
            <NeuralRings />
          </motion.div>

          {/* Intelligence streams */}
          <motion.div
            className="w-full flex justify-between mb-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {["BIOMETRIC", "NEURAL", "QUANTUM"].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <motion.div
                  className="h-8 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, #00e5ff, transparent)" }}
                  animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                />
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(0,229,255,0.3)", fontSize: 9, letterSpacing: "0.15em" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-bold mb-4 leading-tight"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "#e2f8ff",
              letterSpacing: "0.04em",
              textShadow: "0 0 40px rgba(0,229,255,0.2)",
            }}
          >
            CREATE YOUR{" "}
            <span style={{ color: "#00e5ff", textShadow: "0 0 20px #00e5ff" }}>
              DIGITAL DEFENSE
            </span>{" "}
            IDENTITY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm leading-relaxed"
            style={{ color: "rgba(180,220,235,0.5)", maxWidth: 400 }}
          >
            Join the cyber awareness intelligence ecosystem and gain access to immersive threat intelligence,
            forensic systems, awareness modules, and AI-powered protection tools.
          </motion.p>

          {/* Feature tags */}
          <motion.div
            className="flex flex-wrap gap-2 mt-6 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {["THREAT INTEL", "FORENSIC AI", "ZERO TRUST", "NEURAL DEFENSE"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded font-mono text-xs"
                style={{
                  background: "rgba(0,229,255,0.04)",
                  border: "1px solid rgba(0,229,255,0.12)",
                  color: "rgba(0,229,255,0.5)",
                  letterSpacing: "0.1em",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom scan line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* ── DIVIDER ── */}
      <div
        className="w-px self-stretch my-8"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.15) 20%, rgba(0,229,255,0.15) 80%, transparent)",
        }}
      />

      {/* ── RIGHT PANEL — SIGNUP FORM ── */}
      <motion.div
        className="relative flex items-center justify-center p-8 overflow-y-auto"
        style={{ width: "min(480px, 45vw)", minWidth: 380 }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Glass panel bg */}
        <div
          className="absolute inset-4 rounded-2xl"
          style={{
            background: "rgba(7,11,26,0.7)",
            border: "1px solid rgba(0,229,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(0,229,255,0.04), inset 0 1px 0 rgba(0,229,255,0.08)",
          }}
        />

        {/* Corner brackets on panel */}
        {[
          { top: 16, left: 16 }, { top: 16, right: 16 },
          { bottom: 16, left: 16 }, { bottom: 16, right: 16 },
        ].map((pos, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ ...pos, width: 16, height: 16, transform: `rotate(${i * 90}deg)` }}
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M1 15 L1 1 L15 1" stroke="rgba(0,229,255,0.3)" strokeWidth="1" />
          </svg>
        ))}

        <div className="relative z-10 w-full max-w-sm py-4">
          {/* Panel header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded mb-3"
              style={{
                background: "rgba(0,229,255,0.06)",
                border: "1px solid rgba(0,229,255,0.15)",
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#00e5ff", boxShadow: "0 0 6px #00e5ff" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span
                className="text-xs font-mono tracking-widest"
                style={{ color: "rgba(0,229,255,0.7)", fontSize: 10, letterSpacing: "0.2em" }}
              >
                IDENTITY ENROLLMENT PROTOCOL
              </span>
            </div>

            <h2
              className="text-xl font-bold mb-1"
              style={{ color: "#e2f8ff", letterSpacing: "0.05em" }}
            >
              REGISTER YOUR IDENTITY
            </h2>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(0,229,255,0.35)", letterSpacing: "0.08em" }}
            >
              SECURE · ENCRYPTED · VERIFIED
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <CyberInput
              label="FULL DESIGNATION"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Enter your identity name"
              error={errors.name}
              icon={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1" />
                  <path d="M1 9c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              }
            />

            <CyberInput
              label="NEURAL ADDRESS"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="identity@trustlayerlabs.com"
              error={errors.email}
              icon={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="1" y="2.5" width="8" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
                  <path d="M1 3.5L5 6.5L9 3.5" stroke="currentColor" strokeWidth="1" />
                </svg>
              }
            />

            <div>
              <CyberInput
                label="ENCRYPTION KEY"
                type="password"
                value={form.password}
                onChange={updateField("password")}
                placeholder="Min. 8 character cipher"
                error={errors.password}
                icon={
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect x="2" y="4.5" width="6" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1" />
                    <path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                }
              />
              <PasswordStrength password={form.password} />
            </div>

            <CyberInput
              label="VERIFY ENCRYPTION KEY"
              type="password"
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              placeholder="Confirm your cipher"
              error={errors.confirmPassword}
              icon={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />
          </div>

          {authError && (
            <p className="mt-4 text-center font-mono text-xs" style={{ color: "#f87171", letterSpacing: "0.06em" }}>
              {authError}
            </p>
          )}

          {/* Submit button */}
          <motion.button
            className="w-full mt-6 py-3.5 rounded-lg font-mono font-bold text-sm tracking-widest relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(6,182,212,0.1) 100%)",
              border: "1px solid rgba(0,229,255,0.35)",
              color: "#00e5ff",
              letterSpacing: "0.2em",
              boxShadow: "0 0 20px rgba(0,229,255,0.1)",
            }}
            onClick={handleSubmit}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Hover glow sweep */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.08), transparent)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#00e5ff", boxShadow: "0 0 6px #00e5ff" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              INITIATE ENROLLMENT
            </span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(0,229,255,0.07)" }} />
            <span className="text-xs font-mono" style={{ color: "rgba(0,229,255,0.2)", letterSpacing: "0.1em" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,229,255,0.07)" }} />
          </div>

          {/* Login redirect */}
          <p
            className="text-center text-xs font-mono"
            style={{ color: "rgba(0,229,255,0.3)", letterSpacing: "0.06em" }}
          >
            ALREADY ENROLLED?{" "}
            <Link to="/login" className="cursor-pointer" style={{ color: "#00e5ff" }}>
              <motion.span whileHover={{ textShadow: "0 0 10px #00e5ff" }}>
                ACCESS TERMINAL →
              </motion.span>
            </Link>
          </p>

          {/* System status */}
          <div
            className="mt-6 p-3 rounded-lg"
            style={{
              background: "rgba(0,229,255,0.02)",
              border: "1px solid rgba(0,229,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              {[
                { label: "ENCRYPTION", status: "AES-256" },
                { label: "PROTOCOL", status: "TLS 1.3" },
                { label: "STATUS", status: "SECURE" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-mono" style={{ color: "rgba(0,229,255,0.25)", fontSize: 8, letterSpacing: "0.12em" }}>
                    {item.label}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(0,229,255,0.5)", fontSize: 9 }}>
                    {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── ENROLLMENT OVERLAY ── */}
      <AnimatePresence>
        {enrolling && <EnrollmentOverlay onComplete={handleEnrollComplete} />}
      </AnimatePresence>

      {/* ── SUCCESS STATE ── */}
      <AnimatePresence>
        {enrolled && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(5,8,22,0.98)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="flex items-center justify-center mb-6 mx-auto rounded-full"
                style={{
                  width: 80, height: 80,
                  background: "rgba(0,229,255,0.1)",
                  border: "1px solid rgba(0,229,255,0.3)",
                  boxShadow: "0 0 40px rgba(0,229,255,0.2)",
                }}
                animate={{ boxShadow: ["0 0 40px rgba(0,229,255,0.2)", "0 0 80px rgba(0,229,255,0.4)", "0 0 40px rgba(0,229,255,0.2)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <motion.path
                    d="M6 18L14 26L30 10"
                    stroke="#00e5ff" strokeWidth="2.5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ filter: "drop-shadow(0 0 8px #00e5ff)" }}
                  />
                </svg>
              </motion.div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#00e5ff", letterSpacing: "0.1em", textShadow: "0 0 20px #00e5ff" }}
              >
                IDENTITY ENROLLED
              </h2>
              <p className="font-mono text-sm" style={{ color: "rgba(0,229,255,0.5)", letterSpacing: "0.06em" }}>
                Welcome to the TrustLayerLabs defense ecosystem.
              </p>
              <Link
                to={getPostAuthPath(auth.currentUser?.email ?? form.email)}
                className="inline-block mt-6 px-6 py-2.5 rounded font-mono text-xs"
                style={{
                  background: "rgba(0,229,255,0.1)",
                  border: "1px solid rgba(0,229,255,0.3)",
                  color: "#00e5ff",
                  letterSpacing: "0.15em",
                }}
              >
                <motion.span
                  animate={{ boxShadow: ["0 0 10px rgba(0,229,255,0.1)", "0 0 20px rgba(0,229,255,0.2)", "0 0 10px rgba(0,229,255,0.1)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ENTER COMMAND CENTER →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}