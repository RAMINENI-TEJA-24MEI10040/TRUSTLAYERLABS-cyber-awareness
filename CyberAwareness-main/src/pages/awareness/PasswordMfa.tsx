import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { EASE_OUT } from "../../lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg0: "#050816",
  bg1: "#070b1a",
  bg2: "#0a1020",
  bg3: "#0d1628",
  cyan: "#00e5ff",
  cyan2: "#06b6d4",
  cyan3: "#22d3ee",
  purple: "#a855f7",
  purple2: "#7c3aed",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  muted: "#64748b",
  mutedLt: "#94a3b8",
  snow: "#e2f4ff",
  glass: "rgba(0,229,255,0.04)",
  glassBorder: "rgba(0,229,255,0.10)",
  redGlass: "rgba(239,68,68,0.06)",
  redBorder: "rgba(239,68,68,0.18)",
  purpleGlass: "rgba(168,85,247,0.06)",
  purpleBorder: "rgba(168,85,247,0.18)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const GlassCard = ({
  children,
  className = "",
  danger = false,
  purple = false,
  glow = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
  purple?: boolean;
  glow?: boolean;
  onClick?: () => void;
}) => {
  const bg = danger ? T.redGlass : purple ? T.purpleGlass : T.glass;
  const border = danger ? T.redBorder : purple ? T.purpleBorder : T.glassBorder;
  const shadow = glow
    ? danger
      ? "0 0 32px rgba(239,68,68,0.08)"
      : purple
      ? "0 0 32px rgba(168,85,247,0.08)"
      : "0 0 32px rgba(0,229,255,0.07)"
    : "none";
  return (
    <div
      className={`rounded-2xl border p-5 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ background: bg, borderColor: border, boxShadow: shadow }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <span
    className="mb-1 inline-block text-xs font-semibold uppercase tracking-widest"
    style={{ color: T.cyan2 }}
  >
    {children}
  </span>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="mt-1 text-2xl font-black leading-tight sm:text-3xl"
    style={{ color: T.snow, fontFamily: "'Syne', sans-serif" }}
  >
    {children}
  </h2>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: T.mutedLt }}>
    {children}
  </p>
);

const Divider = () => (
  <div className="mx-auto my-0 h-px w-full" style={{ background: T.glassBorder }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// Floating Particles
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 22;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.8,
  color: i % 4 === 0 ? T.purple : T.cyan,
  dur: 4 + Math.random() * 5,
  delay: Math.random() * 5,
}));

const Particles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {particles.map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, background: p.color, opacity: 0.2 }}
        animate={{ y: [-14, 14, -14], opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section scroll wrapper
// ─────────────────────────────────────────────────────────────────────────────
const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE_OUT }}
      className={`mx-auto max-w-5xl px-4 ${className}`}
    >
      {children}
    </motion.section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO — Holographic Shield + Lock
// ─────────────────────────────────────────────────────────────────────────────
const HeroShield = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
    {/* Outer ring */}
    <motion.ellipse
      cx="60" cy="68" rx="56" ry="64"
      stroke={T.cyan} strokeWidth="1" strokeOpacity="0.18"
      animate={{ strokeOpacity: [0.1, 0.35, 0.1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Shield body */}
    <path
      d="M60 10 L104 30 L104 74 C104 100 60 128 60 128 C60 128 16 100 16 74 L16 30 Z"
      fill="rgba(0,229,255,0.05)"
      stroke={T.cyan}
      strokeWidth="1.5"
      strokeOpacity="0.5"
    />
    {/* Inner shield */}
    <path
      d="M60 22 L94 38 L94 72 C94 92 60 114 60 114 C60 114 26 92 26 72 L26 38 Z"
      fill="rgba(0,229,255,0.03)"
      stroke={T.cyan2}
      strokeWidth="1"
      strokeOpacity="0.3"
    />
    {/* Lock body */}
    <rect x="46" y="66" width="28" height="24" rx="4" fill={T.cyan} fillOpacity="0.12" stroke={T.cyan} strokeWidth="1.5" />
    {/* Lock shackle */}
    <path d="M50 66 L50 58 C50 50 70 50 70 58 L70 66" stroke={T.cyan3} strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Lock keyhole */}
    <circle cx="60" cy="76" r="3.5" fill={T.cyan} fillOpacity="0.7" />
    <rect x="58.5" y="77" width="3" height="5" rx="1" fill={T.cyan} fillOpacity="0.7" />
    {/* Pulse rings */}
    {[36, 48, 60].map((r, i) => (
      <motion.circle
        key={i}
        cx="60" cy="78"
        r={r}
        stroke={T.cyan}
        strokeWidth="0.8"
        strokeOpacity="0"
        fill="none"
        animate={{ strokeOpacity: [0, 0.25, 0], r: [r - 8, r, r + 8] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
      />
    ))}
    {/* Corner hex accents */}
    {[[14, 14], [106, 14], [14, 122], [106, 122]].map(([cx, cy], i) => (
      <motion.circle
        key={i} cx={cx} cy={cy} r="3"
        fill={i % 2 === 0 ? T.cyan : T.purple}
        fillOpacity="0.4"
        animate={{ fillOpacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
      />
    ))}
  </svg>
);

const Hero = () => (
  <div
    className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden text-center"
    style={{ background: `linear-gradient(to bottom, ${T.bg0} 0%, ${T.bg1} 100%)` }}
  >
    <Particles />
    {/* Radial glow */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)` }}
    />
    {/* Scan beam */}
    <motion.div
      className="pointer-events-none absolute left-0 right-0 h-px"
      style={{ background: `linear-gradient(to right, transparent, ${T.cyan}50, transparent)`, top: "50%" }}
      animate={{ top: ["20%", "80%", "20%"], opacity: [0, 0.6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.div {...fadeUp(0)} className="mb-6">
      <HeroShield />
    </motion.div>

    <motion.div {...fadeUp(0.18)}>
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
        style={{ background: "rgba(0,229,255,0.08)", border: `1px solid ${T.glassBorder}`, color: T.cyan3 }}
      >
        Threat Intelligence · Auth Security
      </span>
    </motion.div>

    <motion.h1
      {...fadeUp(0.3)}
      className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl"
      style={{ color: T.snow, fontFamily: "'Syne', sans-serif" }}
    >
      Passwords & MFA
      <br />
      <span style={{ color: T.cyan }}>Your Last Line of Defence</span>
    </motion.h1>

    <motion.p {...fadeUp(0.44)} className="mt-5 max-w-xl text-sm leading-relaxed" style={{ color: T.mutedLt }}>
      Credential attacks are the #1 breach vector. Understand how attackers break
      authentication — and exactly how to stop them.
    </motion.p>

    <motion.div {...fadeUp(0.56)} className="mt-8 flex flex-wrap justify-center gap-3">
      {[
        { v: "81%", l: "of breaches involve weak or stolen passwords", danger: true },
        { v: "15B+", l: "credentials available on dark web markets", danger: true },
        { v: "99.9%", l: "of attacks blocked by MFA", danger: false },
      ].map((s) => (
        <div
          key={s.v}
          className="rounded-xl px-4 py-3 text-center"
          style={{
            background: s.danger ? T.redGlass : "rgba(34,211,238,0.06)",
            border: `1px solid ${s.danger ? T.redBorder : T.glassBorder}`,
          }}
        >
          <div className="text-xl font-black" style={{ color: s.danger ? T.red : T.cyan }}>
            {s.v}
          </div>
          <div className="mt-0.5 max-w-[140px] text-xs" style={{ color: T.muted }}>
            {s.l}
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ATTACK CHAIN — Kill chain flow visualization
// ─────────────────────────────────────────────────────────────────────────────
const CHAIN = [
  { id: "01", icon: "🔑", label: "Weak Password", color: T.orange, desc: "Simple, reused, or dictionary-based credential" },
  { id: "02", icon: "💾", label: "Credential Leak", color: T.red, desc: "Exposed via data breach or dark web dump" },
  { id: "03", icon: "🤖", label: "Credential Stuffing", color: T.red, desc: "Automated testing across thousands of sites" },
  { id: "04", icon: "📱", label: "MFA Bypass Attempt", color: T.purple, desc: "OTP phishing, SIM swap, or push fatigue attack" },
  { id: "05", icon: "💀", label: "Account Compromise", color: "#ef4444", desc: "Full access — data theft, fraud, lateral movement" },
];

const AttackChain = () => (
  <Section className="py-16">
    <Label>Kill Chain</Label>
    <H2>How Accounts Get Compromised</H2>
    <Sub>Every credential attack follows this path. Break any link — and you break the chain.</Sub>

    <div className="mt-10 flex flex-col gap-3">
      {CHAIN.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: i * 0.11, duration: 0.55, ease: EASE_OUT }}
          className="flex items-start gap-4"
        >
          {/* Node */}
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
              style={{ background: `${step.color}18`, border: `1.5px solid ${step.color}60` }}
              whileHover={{ scale: 1.12 }}
              animate={i === 4 ? { boxShadow: [`0 0 0px ${step.color}00`, `0 0 20px ${step.color}80`, `0 0 0px ${step.color}00`] } : {}}
              transition={i === 4 ? { duration: 2, repeat: Infinity } : {}}
            >
              {step.icon}
            </motion.div>
            {i < CHAIN.length - 1 && (
              <div className="mt-1 h-5 w-px" style={{ background: `linear-gradient(to bottom, ${step.color}60, ${CHAIN[i + 1].color}40)` }} />
            )}
          </div>
          {/* Content */}
          <div
            className="mb-3 flex-1 rounded-xl border p-3"
            style={{ background: `${step.color}08`, borderColor: `${step.color}25` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-black" style={{ color: step.color }}>{step.id}</span>
              <span className="text-sm font-bold" style={{ color: T.snow }}>{step.label}</span>
            </div>
            <p className="mt-0.5 text-xs" style={{ color: T.mutedLt }}>{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// BRUTE FORCE SIMULATOR — animated password guessing visual
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$";
const TARGET = "p@ssw0rd";

const BruteForce = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef(0);

  const randomPass = (len: number) =>
    Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

  const start = useCallback(() => {
    if (running) return;
    setGuesses([]);
    setFound(false);
    countRef.current = 0;
    setRunning(true);

    intervalRef.current = setInterval(() => {
      countRef.current++;
      const guess = randomPass(TARGET.length);
      setGuesses((g) => [guess, ...g].slice(0, 9));

      if (countRef.current >= 38) {
        clearInterval(intervalRef.current!);
        setGuesses((g) => [TARGET, ...g].slice(0, 9));
        setFound(true);
        setRunning(false);
      }
    }, 90);
  }, [running]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <Section className="py-16">
      <Label>Attack Simulation</Label>
      <H2>Brute-Force in Real Time</H2>
      <Sub>Automated tools test millions of passwords per second. Common passwords crack in under 1 minute.</Sub>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Terminal */}
        <GlassCard danger={found} glow className="font-mono">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: found ? T.red : running ? T.green : T.muted }} />
            <span className="text-xs" style={{ color: T.muted }}>
              {found ? "TARGET CRACKED" : running ? "ATTACKING…" : "IDLE"}
            </span>
            {running && (
              <motion.span
                className="ml-auto text-xs"
                style={{ color: T.orange }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                ● LIVE
              </motion.span>
            )}
          </div>

          <div className="mb-2 text-xs" style={{ color: T.muted }}>
            target: <span style={{ color: found ? T.red : T.cyan }}>{"*".repeat(TARGET.length)}</span>
          </div>

          <div className="space-y-1">
            {guesses.length === 0 && (
              <div className="text-xs" style={{ color: T.muted }}>Press simulate to begin attack…</div>
            )}
            {guesses.map((g, i) => (
              <motion.div
                key={i + g}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs"
              >
                <span style={{ color: T.muted }}>›</span>
                <span style={{ color: i === 0 && found ? T.red : i === 0 ? T.cyan3 : T.muted }}>
                  {g}
                </span>
                {i === 0 && found && (
                  <span className="ml-auto font-bold" style={{ color: T.red }}>MATCH ✓</span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button
            className="mt-4 w-full rounded-lg py-2 text-xs font-bold uppercase tracking-wider"
            style={{ background: found ? T.redGlass : "rgba(0,229,255,0.08)", border: `1px solid ${found ? T.redBorder : T.glassBorder}`, color: found ? T.red : T.cyan }}
            onClick={start}
            disabled={running}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {found ? "↺ Simulate Again" : running ? "Attacking…" : "▶ Simulate Attack"}
          </motion.button>
        </GlassCard>

        {/* Stats panel */}
        <div className="flex flex-col gap-3">
          {[
            { label: "Password: \"password\"", time: "< 1 second", danger: true },
            { label: "Password: \"p@ssw0rd\"", time: "~3 minutes", danger: true },
            { label: "Password: \"correct-horse-battery\"", time: "~550 years", danger: false },
            { label: "Password: \"Tr0ub4dor&3!xK9\"", time: "~2 million years", danger: false },
          ].map((r) => (
            <GlassCard key={r.label} danger={r.danger} className="flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color: r.danger ? T.red : T.cyan3 }}>{r.label}</span>
              <span
                className="ml-3 shrink-0 rounded px-2 py-0.5 text-xs font-bold"
                style={{ background: r.danger ? T.redGlass : "rgba(34,197,94,0.1)", color: r.danger ? T.red : T.green }}
              >
                {r.time}
              </span>
            </GlassCard>
          ))}
          <p className="text-xs" style={{ color: T.muted }}>
            ↑ Estimated crack time at 10 billion guesses/second (modern GPU cluster)
          </p>
        </div>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CREDENTIAL STUFFING
// ─────────────────────────────────────────────────────────────────────────────
const CredentialStuffing = () => (
  <Section className="py-16">
    <Label>Automation Attack</Label>
    <H2>Credential Stuffing Explained</H2>
    <Sub>
      Attackers purchase breach dumps and test each email/password pair across hundreds of popular
      sites — fully automated, at scale.
    </Sub>

    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {[
        { step: "1", icon: "💿", title: "Breach Dump Acquired", body: "Attacker buys 500 million leaked credential pairs from dark web marketplace for ~$50.", color: T.orange },
        { step: "2", icon: "🤖", title: "Automated Bot Attack", body: "Tools like Sentry MBA or OpenBullet test credentials against banking, retail, streaming sites.", color: T.red },
        { step: "3", icon: "✅", title: "Valid Hit Monetised", body: "~0.1–2% success rate = thousands of live accounts. Sold, drained, or used for fraud.", color: T.purple },
      ].map((c, i) => (
        <motion.div
          key={c.step}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.13 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard glow className="h-full">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ background: `${c.color}15`, border: `1px solid ${c.color}35` }}>
              {c.icon}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.color }}>Step {c.step}</div>
            <div className="mt-1 text-sm font-bold" style={{ color: T.snow }}>{c.title}</div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: T.mutedLt }}>{c.body}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>

    <GlassCard danger glow className="mt-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl">⚠️</span>
        <div>
          <div className="text-sm font-bold" style={{ color: T.red }}>Why password reuse is catastrophic</div>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: T.mutedLt }}>
            If you use the same password across multiple sites, a single breach anywhere exposes
            everything everywhere. Credential stuffing is only possible because of reuse.
            <strong style={{ color: T.snow }}> One unique password per site. No exceptions.</strong>
          </p>
        </div>
      </div>
    </GlassCard>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// MFA BYPASS — interactive tab cards
// ─────────────────────────────────────────────────────────────────────────────
const MFA_ATTACKS = [
  {
    id: "otp",
    label: "OTP Phishing",
    icon: "📲",
    color: T.red,
    how: "Attacker creates a real-time proxy between victim and legitimate site. Victim enters OTP on fake portal — attacker immediately replays it on the real site before it expires.",
    example: "Adversary-in-the-Middle (AiTM) frameworks like Evilginx2 automate this in seconds.",
    defend: "Use hardware security keys (FIDO2/WebAuthn). These bind to the legitimate domain — proxies can't replay them.",
  },
  {
    id: "sim",
    label: "SIM Swap",
    icon: "📡",
    color: T.orange,
    how: "Attacker social-engineers your carrier into porting your phone number to a SIM they control. All SMS OTPs now go to them.",
    example: "Twitter CEO Jack Dorsey was SIM-swapped in 2019, losing access to his own account.",
    defend: "Never use SMS as your only MFA. Switch to authenticator apps (TOTP) or hardware keys. Add a carrier PIN/passcode.",
  },
  {
    id: "fatigue",
    label: "Push Fatigue",
    icon: "🔔",
    color: T.purple,
    how: "Attacker triggers dozens of MFA push notifications at 2am hoping the victim taps 'Approve' just to make them stop.",
    example: "Uber's 2022 breach began with an employee approving a fatigue-based MFA push after being messaged on WhatsApp.",
    defend: "Enable number matching on push MFA. Report unexpected pushes immediately. Use apps that require a code match, not just a tap.",
  },
  {
    id: "recovery",
    label: "Recovery Code Theft",
    icon: "🗝️",
    color: T.cyan2,
    how: "Backup recovery codes stored in notes, email, or cloud storage are stolen via malware or account compromise — bypassing MFA entirely.",
    example: "If your Google recovery codes are in a Gmail draft, compromising Gmail bypasses Gmail MFA.",
    defend: "Store recovery codes in a password manager or print offline. Never in email or cloud notes.",
  },
];

const MfaBypass = () => {
  const [active, setActive] = useState("otp");
  const item = MFA_ATTACKS.find((m) => m.id === active)!;

  return (
    <Section className="py-16">
      <Label>Authentication Bypass</Label>
      <H2>How MFA Gets Defeated</H2>
      <Sub>MFA isn't unbreakable — but each attack has a clear countermeasure.</Sub>

      <div className="mt-8 flex flex-wrap gap-2">
        {MFA_ATTACKS.map((m) => (
          <motion.button
            key={m.id}
            onClick={() => setActive(m.id)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all"
            style={{
              background: active === m.id ? `${m.color}18` : T.glass,
              border: `1px solid ${active === m.id ? m.color + "50" : T.glassBorder}`,
              color: active === m.id ? m.color : T.mutedLt,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>{m.icon}</span> {m.label}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard danger className="sm:col-span-2">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: item.color }}>
              How the attack works
            </div>
            <p className="text-sm leading-relaxed" style={{ color: T.mutedLt }}>{item.how}</p>
            <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${T.glassBorder}` }}>
              <span className="text-xs font-semibold" style={{ color: T.muted }}>Real example: </span>
              <span className="text-xs" style={{ color: T.mutedLt }}>{item.example}</span>
            </div>
          </GlassCard>
          <GlassCard purple glow>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: T.purple }}>
              🛡 Defence
            </div>
            <p className="text-sm leading-relaxed" style={{ color: T.mutedLt }}>{item.defend}</p>
          </GlassCard>
        </div>
      </motion.div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD STRENGTH INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────
const checkStrength = (pw: string): { score: number; label: string; color: string; tips: string[] } => {
  let score = 0;
  const tips: string[] = [];
  if (pw.length >= 12) score += 2; else tips.push("Use at least 12 characters");
  if (pw.length >= 20) score += 1;
  if (/[A-Z]/.test(pw)) score += 1; else tips.push("Add uppercase letters");
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1; else tips.push("Add numbers");
  if (/[^A-Za-z0-9]/.test(pw)) score += 2; else tips.push("Add symbols (!@#$...)");
  if (/(.)\1{2,}/.test(pw)) { score -= 2; tips.push("Avoid repeated characters"); }
  if (/^(password|qwerty|123456|admin|letmein)/i.test(pw)) { score = 0; tips.push("This is a known common password"); }

  const clamp = Math.max(0, Math.min(7, score));
  if (clamp <= 1) return { score: clamp, label: "Critical", color: T.red, tips };
  if (clamp <= 3) return { score: clamp, label: "Weak", color: T.orange, tips };
  if (clamp <= 5) return { score: clamp, label: "Moderate", color: "#eab308", tips };
  return { score: clamp, label: "Strong", color: T.green, tips };
};

const PasswordStrength = () => {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const result = checkStrength(pw);

  return (
    <Section className="py-16">
      <Label>Password Intelligence</Label>
      <H2>Analyse Your Password Strength</H2>
      <Sub>Test your password pattern here — no data is ever sent anywhere.</Sub>

      <GlassCard glow className="mt-8">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter a password to analyse…"
            className="w-full rounded-xl px-4 py-3 pr-12 text-sm font-mono outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${pw ? result.color + "60" : T.glassBorder}`, color: T.snow, caretColor: T.cyan }}
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: T.muted }}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>

        {pw.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            {/* Score bar */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs" style={{ color: T.muted }}>Strength</span>
              <span className="text-xs font-bold" style={{ color: result.color }}>{result.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: result.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(result.score / 7) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="mt-4 space-y-1.5">
                {result.tips.map((tip) => (
                  <div key={tip} className="flex items-center gap-2 text-xs" style={{ color: T.mutedLt }}>
                    <span style={{ color: T.orange }}>›</span> {tip}
                  </div>
                ))}
              </div>
            )}
            {result.tips.length === 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: T.green }}>
                <span>✓</span> Excellent password pattern
              </div>
            )}
          </motion.div>
        )}
      </GlassCard>

      {/* Advice grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { icon: "🎲", title: "Use a passphrase", body: "Four random words (e.g. correct-horse-battery-staple) are easier to remember and harder to crack than complex short passwords.", good: true },
          { icon: "🔐", title: "Use a password manager", body: "Tools like Bitwarden, 1Password, or KeePass generate and store unique passwords for every site — so you only remember one master password.", good: true },
          { icon: "♻️", title: "Never reuse passwords", body: "One breach exposes every account sharing that password. A password manager makes this effortless.", good: true },
          { icon: "📅", title: "Don't rotate unnecessarily", body: "Forced password changes often lead to weaker passwords (Password1 → Password2). Change only when compromise is suspected.", good: true },
        ].map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <GlassCard purple={false} glow>
              <div className="flex items-start gap-3">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: T.cyan3 }}>{c.title}</div>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: T.mutedLt }}>{c.body}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SAFE AUTH PRACTICES — interactive awareness tips
// ─────────────────────────────────────────────────────────────────────────────
const PRACTICES = [
  { icon: "🔑", title: "Enable MFA on every account", priority: "Critical", body: "Especially email, banking, and social media. If a site offers it — enable it now. Authenticator apps beat SMS.", color: T.red },
  { icon: "🛡️", title: "Use hardware security keys for high-value accounts", priority: "Recommended", body: "YubiKey or Google Titan keys provide phishing-resistant authentication. They only work on the genuine domain.", color: T.cyan },
  { icon: "🔍", title: "Check HaveIBeenPwned regularly", priority: "Good Practice", body: "Visit haveibeenpwned.com to see if your email has appeared in known data breaches. Act immediately on matches.", color: T.cyan2 },
  { icon: "📵", title: "Never approve unexpected MFA prompts", priority: "Critical", body: "An MFA push you didn't initiate means someone has your password. Deny, change password immediately, alert IT.", color: T.red },
  { icon: "📋", title: "Store recovery codes securely", priority: "Important", body: "Print and store offline, or save in your password manager. Never in email, cloud notes, or chat apps.", color: T.orange },
  { icon: "🌐", title: "Check URLs before entering credentials", priority: "Always", body: "Phishing domains mimic real ones (paypa1.com vs paypal.com). Look for HTTPS and the exact domain.", color: T.purple },
];

const SafePractices = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Section className="py-16">
      <Label>Defence Protocols</Label>
      <H2>Safe Authentication Practices</H2>
      <Sub>Tap each protocol to expand the full guidance.</Sub>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PRACTICES.map((p, i) => {
          const open = expanded === p.title;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard
                glow={open}
                onClick={() => setExpanded(open ? null : p.title)}
                className="cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: T.snow }}>{p.title}</div>
                    <span className="text-xs font-semibold" style={{ color: p.color }}>{p.priority}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    className="text-xs"
                    style={{ color: T.muted }}
                  >
                    ▼
                  </motion.span>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-xs leading-relaxed" style={{ color: T.mutedLt }}>{p.body}</p>
                </motion.div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREACH STATS — cyber facts
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { v: "81%", l: "of hacking breaches use stolen or weak credentials", danger: true },
  { v: "6hrs", l: "average time before a breached credential is used by attackers", danger: true },
  { v: "99.9%", l: "of automated attacks blocked by any form of MFA", danger: false },
  { v: "$4.9M", l: "average cost of a credential-related data breach (2024)", danger: true },
  { v: "30s", l: "is how fast FIDO2 hardware key defeats phishing in tests", danger: false },
  { v: "2FA", l: "reduces account takeover risk by over 99% per Google research", danger: false },
];

const BreachStats = () => (
  <Section className="py-16">
    <Label>Intelligence Brief</Label>
    <H2>By the Numbers</H2>

    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {STATS.map((s, i) => (
        <motion.div
          key={s.v}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.04 }}
        >
          <GlassCard danger={s.danger} glow className="text-center">
            <div className="text-2xl font-black sm:text-3xl" style={{ color: s.danger ? T.red : T.cyan, fontFamily: "'Syne', sans-serif" }}>
              {s.v}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: T.mutedLt }}>{s.l}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER CTA
// ─────────────────────────────────────────────────────────────────────────────
const FooterCta = () => (
  <div className="relative overflow-hidden py-24 text-center" style={{ background: T.bg1 }}>
    <div className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(ellipse 60% 70% at 50% 100%, rgba(0,229,255,0.06) 0%, transparent 70%)` }} />
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      {/* Animated shield pulse */}
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${T.cyan}`, opacity: 0 }}
            animate={{ scale: [1, 1 + ring * 0.4], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: ring * 0.5 }}
          />
        ))}
        <span className="text-3xl">🔐</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.cyan2 }}>
        Stay Protected
      </p>
      <h2 className="mt-2 text-2xl font-black sm:text-4xl" style={{ color: T.snow, fontFamily: "'Syne', sans-serif" }}>
        Lock It Down. Now.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: T.mutedLt }}>
        Enable MFA. Use a password manager. Check your breach exposure.
        Three actions. Dramatically reduced risk.
      </p>
      <div className="mx-auto mt-6 h-px w-16 rounded-full"
        style={{ background: `linear-gradient(to right, transparent, ${T.cyan}, transparent)` }} />
      <p className="mt-4 text-xs" style={{ color: `${T.muted}80` }}>
        TRUSTLAYERLABS · Cyber Awareness Series · Authentication Security
      </p>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function PasswordMfa() {
  return (
    <div className="min-h-screen" style={{ background: T.bg0, color: T.snow }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #334155; }
      `}</style>

      <Hero />

      <div
        className="mx-auto max-w-5xl px-0"
        style={{ borderLeft: `1px solid ${T.glassBorder}`, borderRight: `1px solid ${T.glassBorder}` }}
      >
        <AttackChain />
        <Divider />
        <BruteForce />
        <Divider />
        <CredentialStuffing />
        <Divider />
        <MfaBypass />
        <Divider />
        <PasswordStrength />
        <Divider />
        <SafePractices />
        <Divider />
        <BreachStats />
      </div>

      <FooterCta />
    </div>
  );
}