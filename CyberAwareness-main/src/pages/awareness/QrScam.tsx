import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { EASE_OUT } from "../../lib/motion";

// ── Tokens ────────────────────────────────────────────────────────────────────
const C = {
  bg0: "#050816",
  bg1: "#070b1a",
  bg2: "#0a1020",
  cyan: "#00e5ff",
  cyan2: "#06b6d4",
  cyan3: "#22d3ee",
  purple: "#a855f7",
  red: "#ef4444",
  orange: "#f97316",
  muted: "#94a3b8",
  glass: "rgba(0,229,255,0.04)",
  glassBorder: "rgba(0,229,255,0.12)",
};

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: EASE_OUT },
});

const GlassCard = ({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) => (
  <div
    className={`rounded-2xl border p-5 ${className}`}
    style={{
      background: C.glass,
      borderColor: C.glassBorder,
      boxShadow: glow ? `0 0 28px rgba(0,229,255,0.08)` : "none",
    }}
  >
    {children}
  </div>
);

// ── Floating particle dots ────────────────────────────────────────────────────
const Particles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {[...Array(18)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 3 === 0 ? C.purple : C.cyan,
          opacity: 0.25,
        }}
        animate={{ y: [-12, 12, -12], opacity: [0.15, 0.4, 0.15] }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// ── Section wrapper with scroll-trigger ──────────────────────────────────────
const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className={`mx-auto max-w-5xl px-4 ${className}`}
    >
      {children}
    </motion.section>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => (
  <div
    className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden text-center"
    style={{ background: C.bg0 }}
  >
    <Particles />

    {/* radial glow behind title */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,229,255,0.07) 0%, transparent 70%)`,
      }}
    />

    {/* QR grid motif */}
    <motion.div
      className="mb-8 flex items-center justify-center"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      <QrIcon />
    </motion.div>

    <motion.div {...fadeUp(0.15)}>
      <span
        className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
        style={{
          background: "rgba(0,229,255,0.08)",
          border: `1px solid ${C.glassBorder}`,
          color: C.cyan3,
        }}
      >
        Threat Intelligence · QR Fraud
      </span>
    </motion.div>

    <motion.h1
      {...fadeUp(0.28)}
      className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl"
      style={{ color: "#e2f4ff", fontFamily: "'Syne', sans-serif" }}
    >
      QR Code Scams
      <br />
      <span style={{ color: C.cyan }}>The Invisible Trap</span>
    </motion.h1>

    <motion.p
      {...fadeUp(0.42)}
      className="mt-5 max-w-2xl text-base leading-relaxed"
      style={{ color: C.muted }}
    >
      One scan. One second. That's all it takes for attackers to redirect you
      into a credential harvest, malware drop, or financial theft. Learn to see
      what the code hides.
    </motion.p>

    <motion.div {...fadeUp(0.55)} className="mt-8 flex gap-3">
      <StatPill value="87%" label="rise in QR phishing since 2022" danger />
      <StatPill value="1 in 5" label="malicious QR codes undetected" />
    </motion.div>
  </div>
);

const QrIcon = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
    <rect
      x="2"
      y="2"
      width="92"
      height="92"
      rx="16"
      stroke={C.cyan}
      strokeWidth="1.5"
      strokeOpacity="0.3"
    />
    {/* top-left module */}
    {[
      [8, 8],
      [8, 18],
      [8, 28],
      [18, 8],
      [28, 8],
      [28, 18],
      [28, 28],
      [18, 18],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="8" rx="2" fill={C.cyan} />
    ))}
    {/* top-right module */}
    {[
      [60, 8],
      [60, 18],
      [60, 28],
      [70, 8],
      [80, 8],
      [80, 18],
      [80, 28],
      [70, 18],
    ].map(([x, y], i) => (
      <rect
        key={i}
        x={x}
        y={y}
        width="8"
        height="8"
        rx="2"
        fill={C.cyan2}
      />
    ))}
    {/* bottom-left module */}
    {[
      [8, 60],
      [8, 70],
      [8, 80],
      [18, 60],
      [28, 60],
      [28, 70],
      [28, 80],
      [18, 70],
    ].map(([x, y], i) => (
      <rect
        key={i}
        x={x}
        y={y}
        width="8"
        height="8"
        rx="2"
        fill={C.cyan3}
      />
    ))}
    {/* data dots */}
    {[
      [42, 8],
      [42, 20],
      [42, 32],
      [52, 14],
      [52, 26],
      [42, 44],
      [52, 44],
      [60, 44],
      [70, 44],
      [80, 44],
      [44, 60],
      [56, 56],
      [68, 64],
      [80, 56],
      [44, 74],
      [56, 80],
      [70, 80],
    ].map(([x, y], i) => (
      <rect
        key={i}
        x={x}
        y={y}
        width="6"
        height="6"
        rx="1"
        fill={C.cyan}
        fillOpacity="0.4"
      />
    ))}
    {/* warning cross overlay */}
    <line x1="36" y1="36" x2="60" y2="60" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
    <line x1="60" y1="36" x2="36" y2="60" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
  </svg>
);

const StatPill = ({
  value,
  label,
  danger = false,
}: {
  value: string;
  label: string;
  danger?: boolean;
}) => (
  <div
    className="rounded-xl px-4 py-3 text-center"
    style={{
      background: danger ? "rgba(239,68,68,0.08)" : C.glass,
      border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : C.glassBorder}`,
    }}
  >
    <div
      className="text-xl font-black"
      style={{ color: danger ? C.red : C.cyan }}
    >
      {value}
    </div>
    <div className="mt-0.5 text-xs" style={{ color: C.muted }}>
      {label}
    </div>
  </div>
);

// ── Threat Overview ───────────────────────────────────────────────────────────
const threats = [
  {
    icon: "🎯",
    title: "Quishing",
    desc: "QR phishing — embedded in emails, PDFs, or print media — bypasses text-based filters entirely.",
    color: C.red,
  },
  {
    icon: "🏧",
    title: "ATM / Meter Overlays",
    desc: "Physical stickers placed over legitimate QR codes on parking meters, restaurants, and public kiosks.",
    color: C.orange,
  },
  {
    icon: "📦",
    title: "Package Delivery Fraud",
    desc: "Fake delivery notices with QR codes linking to credential-harvesting 'tracking' portals.",
    color: C.cyan2,
  },
  {
    icon: "🏥",
    title: "Healthcare / Gov Spoofs",
    desc: "Malicious codes posing as vaccine verification, tax portals, or hospital check-in systems.",
    color: C.purple,
  },
];

const ThreatOverview = () => (
  <Section className="py-16">
    <SectionHeader
      label="Threat Landscape"
      title="How QR Attacks Operate"
      sub="Attackers exploit the implicit trust users place in QR codes — no visible URL, no obvious warning sign."
    />
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {threats.map((t, i) => (
        <motion.div
          key={t.title}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.1, duration: 0.55 }}
          whileHover={{ scale: 1.02 }}
        >
          <GlassCard className="flex gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}
            >
              {t.icon}
            </div>
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: t.color }}
              >
                {t.title}
              </div>
              <div className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>
                {t.desc}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </Section>
);

// ── Attack Flow ───────────────────────────────────────────────────────────────
const flow = [
  { step: "01", label: "Lure", desc: "Attacker places / sends malicious QR in email, SMS, print, or overlay." },
  { step: "02", label: "Scan", desc: "Victim scans without checking the destination URL." },
  { step: "03", label: "Redirect", desc: "Short-link chain obscures the real destination domain." },
  { step: "04", label: "Harvest", desc: "Fake login page captures credentials, payment data, or installs malware." },
  { step: "05", label: "Exfil", desc: "Data silently sent to attacker-controlled server within seconds." },
];

const AttackFlow = () => (
  <Section className="py-16">
    <SectionHeader
      label="Attack Chain"
      title="Five Steps to Compromise"
      sub="Every QR attack follows the same kill chain. Knowing it helps you break it."
    />
    <div className="relative mt-10">
      {/* connector line */}
      <div
        className="absolute left-[22px] top-6 hidden w-0.5 sm:block"
        style={{
          height: "calc(100% - 48px)",
          background: `linear-gradient(to bottom, ${C.cyan}60, transparent)`,
        }}
      />
      <div className="flex flex-col gap-4">
        {flow.map((f, i) => (
          <motion.div
            key={f.step}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.12 }}
            className="flex gap-5"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-black"
              style={{
                background: C.bg2,
                border: `1.5px solid ${C.cyan}50`,
                color: C.cyan,
                zIndex: 1,
              }}
            >
              {f.step}
            </div>
            <GlassCard className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: C.cyan3 }}>
                  {f.label}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>
                {f.desc}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

// ── Real-World Examples ───────────────────────────────────────────────────────
const examples = [
  {
    year: "2023",
    title: "FTC Parking Meter Warning",
    body: "US Federal Trade Commission alerted the public to QR sticker overlays on city parking meters redirecting to payment-harvesting sites.",
  },
  {
    year: "2023",
    title: "Microsoft Quishing Wave",
    body: "Large-scale phishing campaign used QR codes inside PNG email attachments to bypass enterprise email security scanning.",
  },
  {
    year: "2024",
    title: "UK Royal Mail Spoofs",
    body: "Victims received SMS messages with QR codes mimicking Royal Mail package notifications, leading to banking credential theft.",
  },
];

const RealExamples = () => (
  <Section className="py-16">
    <SectionHeader
      label="Case Files"
      title="Real-World Incidents"
      sub="These attacks happened. They're happening now."
    />
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {examples.map((e, i) => (
        <motion.div
          key={e.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard glow className="h-full">
            <span
              className="inline-block rounded px-2 py-0.5 text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.12)", color: C.red }}
            >
              {e.year}
            </span>
            <div
              className="mt-3 text-sm font-bold leading-snug"
              style={{ color: "#e2f4ff" }}
            >
              {e.title}
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: C.muted }}>
              {e.body}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </Section>
);

// ── Awareness Tips (interactive cards) ───────────────────────────────────────
const tips = [
  {
    icon: "🔍",
    title: "Preview before you proceed",
    detail:
      "Most phone cameras show the destination URL before opening. Always read it. If it's a shortened link, do not scan.",
  },
  {
    icon: "🖨️",
    title: "Inspect physical QR codes",
    detail:
      "Check for sticker overlays on menus, posters, or meters. If a QR code looks slightly raised or misaligned — it may be fake.",
  },
  {
    icon: "🔒",
    title: "Verify the domain manually",
    detail:
      "Type trusted URLs directly rather than relying on any QR code, especially for banking, healthcare, or government services.",
  },
  {
    icon: "📵",
    title: "Never enter credentials via QR",
    detail:
      "Legitimate services rarely demand logins through QR-initiated flows. Treat any such request as a red flag.",
  },
  {
    icon: "🛡️",
    title: "Use a QR scanner app",
    detail:
      "Dedicated scanners like Kaspersky QR Scanner or Trend Micro check URLs against threat databases before opening them.",
  },
  {
    icon: "📢",
    title: "Report suspicious codes",
    detail:
      "If you spot a suspicious QR code in a public space, report it to the venue and your national cyber agency (e.g., NCSC, CISA).",
  },
];

const AwarenessTips = () => {
  const [active, setActive] = useState<number | null>(null);
  return (
    <Section className="py-16">
      <SectionHeader
        label="Defence Protocols"
        title="How to Stay Safe"
        sub="Tap a card to reveal the full protection detail."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((t, i) => (
          <motion.button
            key={t.title}
            onClick={() => setActive(active === i ? null : i)}
            className="text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="rounded-2xl border p-4 transition-colors duration-200"
              style={{
                background: active === i ? "rgba(0,229,255,0.07)" : C.glass,
                borderColor: active === i ? `${C.cyan}50` : C.glassBorder,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: active === i ? C.cyan : "#c7dde8" }}
                >
                  {t.title}
                </span>
              </div>
              <motion.div
                initial={false}
                animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p
                  className="mt-3 text-xs leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {t.detail}
                </p>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>
    </Section>
  );
};

// ── Cyber Facts ───────────────────────────────────────────────────────────────
const facts = [
  { stat: "22%", detail: "of all phishing campaigns in 2024 contained QR codes" },
  { stat: "3s", detail: "average time for a victim to scan and submit credentials" },
  { stat: "$8.8B", detail: "in total losses from phishing-related fraud globally (2022)" },
  { stat: "0%", detail: "of standard email filters inspect QR image content by default" },
];

const CyberFacts = () => (
  <Section className="py-16">
    <SectionHeader label="Intelligence Brief" title="By the Numbers" />
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {facts.map((f, i) => (
        <motion.div
          key={f.stat}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <GlassCard className="text-center" glow>
            <div
              className="text-3xl font-black"
              style={{ color: C.cyan, fontFamily: "'Syne', sans-serif" }}
            >
              {f.stat}
            </div>
            <div className="mt-2 text-xs leading-relaxed" style={{ color: C.muted }}>
              {f.detail}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </Section>
);

// ── Shared Section Header ─────────────────────────────────────────────────────
const SectionHeader = ({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub?: string;
}) => (
  <div className="mb-2">
    <span
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: C.cyan2 }}
    >
      {label}
    </span>
    <h2
      className="mt-1 text-2xl font-black sm:text-3xl"
      style={{ color: "#e2f4ff", fontFamily: "'Syne', sans-serif" }}
    >
      {title}
    </h2>
    {sub && (
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: C.muted }}>
        {sub}
      </p>
    )}
  </div>
);

// ── Footer CTA ────────────────────────────────────────────────────────────────
const FooterCta = () => (
  <div
    className="relative mt-8 overflow-hidden py-20 text-center"
    style={{ background: C.bg1 }}
  >
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,229,255,0.06) 0%, transparent 70%)`,
      }}
    />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: C.cyan2 }}
      >
        Stay Vigilant
      </p>
      <h2
        className="mt-2 text-2xl font-black sm:text-4xl"
        style={{ color: "#e2f4ff", fontFamily: "'Syne', sans-serif" }}
      >
        Think Before You Scan
      </h2>
      <p
        className="mx-auto mt-4 max-w-md text-sm leading-relaxed"
        style={{ color: C.muted }}
      >
        Every QR code is a doorway. You have the right to check where it leads
        before stepping through.
      </p>
      <div
        className="mx-auto mt-6 h-0.5 w-16 rounded-full"
        style={{ background: `linear-gradient(to right, transparent, ${C.cyan}, transparent)` }}
      />
      <p className="mt-4 text-xs" style={{ color: `${C.muted}80` }}>
        TRUSTLAYERLABS · Cyber Awareness Series
      </p>
    </motion.div>
  </div>
);

// ── Page Root ─────────────────────────────────────────────────────────────────
export default function QrScam() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: C.bg0, color: "#e2f4ff" }}
    >
      {/* Google Font via @import — works in Vite without extra config */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap'); body { font-family: 'DM Sans', sans-serif; }`}</style>

      <Hero />

      <div
        className="mx-auto max-w-5xl px-4"
        style={{ borderLeft: `1px solid ${C.glassBorder}`, borderRight: `1px solid ${C.glassBorder}` }}
      >
        <ThreatOverview />
        <div className="mx-4 h-px" style={{ background: C.glassBorder }} />
        <AttackFlow />
        <div className="mx-4 h-px" style={{ background: C.glassBorder }} />
        <RealExamples />
        <div className="mx-4 h-px" style={{ background: C.glassBorder }} />
        <AwarenessTips />
        <div className="mx-4 h-px" style={{ background: C.glassBorder }} />
        <CyberFacts />
      </div>

      <FooterCta />
    </div>
  );
}