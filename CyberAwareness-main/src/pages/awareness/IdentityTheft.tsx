import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ATTACK_CHAIN = [
  { icon: "◈", label: "Data Leak", desc: "Personal records exposed via breached databases, phishing, or unsecured APIs." },
  { icon: "⬡", label: "Credential Collection", desc: "Leaked emails and passwords aggregated and tested across services via credential stuffing." },
  { icon: "◉", label: "SIM Swap", desc: "Attacker contacts carrier with stolen ID details to redirect victim's phone number." },
  { icon: "⊕", label: "OTP Interception", desc: "SMS-based two-factor codes now routed to attacker's device in real time." },
  { icon: "◎", label: "Account Takeover", desc: "Attacker resets passwords and locks victim out of banking, email, and social accounts." },
  { icon: "⟳", label: "Financial & Identity Abuse", desc: "Funds drained, fake loans taken, identity sold on dark web markets." },
];

const SCAM_EXAMPLES = [
  {
    tag: "KYC FRAUD",
    title: "Fake KYC Verification Portal",
    preview: "Your Aadhaar-linked account requires immediate re-verification. Upload your ID and selfie to avoid suspension.",
    flags: ["Document harvesting", "Biometric cloning risk", "Government impersonation"],
  },
  {
    tag: "SIM SWAP",
    title: "Carrier Impersonation Call",
    preview: "Hi, this is support from your mobile carrier. We're upgrading your SIM — please confirm your date of birth and last four digits of your ID.",
    flags: ["Social engineering", "Insider threat vector", "OTP bypass enablement"],
  },
  {
    tag: "DARK WEB",
    title: "Credential Leak Package",
    preview: "Databases containing 2.3M records — name, DOB, PAN, Aadhaar, email, password hash — listed for sale on underground forums.",
    flags: ["Mass identity exposure", "Cross-platform reuse", "Long-tail abuse window"],
  },
  {
    tag: "IMPERSONATION",
    title: "Cloned Social Profile",
    preview: "A duplicate LinkedIn/Facebook profile using your photos and details contacts your network requesting money or sensitive information.",
    flags: ["Digital identity cloning", "Trust exploitation", "Reputational damage"],
  },
];

const PREVENTION = [
  { icon: "◈", tip: "Freeze your credit with bureaus proactively — prevents fraudulent loan applications." },
  { icon: "⬡", tip: "Never share Aadhaar, PAN, or passport details over unverified calls, links, or portals." },
  { icon: "◉", tip: "Switch from SMS-based 2FA to hardware keys or authenticator apps to survive SIM swaps." },
  { icon: "⊕", tip: "Monitor HaveIBeenPwned and CERT-IN alerts to detect credential exposure early." },
  { icon: "◎", tip: "Use unique, strong passwords per service — a single breach should not cascade." },
  { icon: "⬡", tip: "Set a SIM lock PIN with your carrier to prevent unauthorized port-out requests." },
];

const FACTS = [
  "Identity theft is reported every 14 seconds globally — most victims discover it months later.",
  "SIM swap attacks increased 400% between 2020 and 2024 according to FBI IC3 data.",
  "Over 22 billion records were exposed in data breaches in 2023 alone.",
  "The average financial loss from account takeover fraud exceeds $12,000 per victim.",
];

const DARK_WEB_ITEMS = [
  { label: "Full Identity Pack", price: "$8–$25", risk: 98 },
  { label: "Bank Login Credentials", price: "$15–$80", risk: 92 },
  { label: "SIM Swap Service", price: "$150–$500", risk: 96 },
  { label: "Selfie + ID Combo (KYC)", price: "$30–$90", risk: 89 },
];

// ─── Micro components ─────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

function SectionLabel({ text }: { text: string }) {
  return <div className="text-[10px] tracking-[0.4em] font-mono mb-2" style={{ color: "rgba(0,229,255,0.45)" }}>{text}</div>;
}

function DangerBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest"
      style={{ border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", background: "rgba(239,68,68,0.08)" }}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      {label}
    </span>
  );
}

function RiskBar({ value }: { value: number }) {
  const color = value > 90 ? "#ef4444" : value > 75 ? "#f97316" : "#22d3ee";
  return (
    <div className="h-1 rounded-full bg-slate-800 overflow-hidden w-full">
      <motion.div className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        initial={{ width: 0 }} whileInView={{ width: `${value}%` }} transition={{ duration: 1, ease: "easeOut" }} />
    </div>
  );
}

// ─── Biometric scan overlay ───────────────────────────────────────────────────

function BiometricScan() {
  return (
    <div className="relative w-36 h-36 mx-auto">
      {/* Face outline */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <ellipse cx="50" cy="42" rx="22" ry="26" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="0.8" />
        <line x1="8" y1="20" x2="20" y2="20" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="8" y1="20" x2="8" y2="32" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="92" y1="20" x2="80" y2="20" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="92" y1="20" x2="92" y2="32" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="8" y1="80" x2="20" y2="80" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="8" y1="80" x2="8" y2="68" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="92" y1="80" x2="80" y2="80" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        <line x1="92" y1="80" x2="92" y2="68" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8" />
        {[...Array(6)].map((_, i) => (
          <line key={i} x1="28" y1={28 + i * 6} x2="72" y2={28 + i * 6} stroke={`rgba(0,229,255,${0.04 + (i % 2) * 0.03})`} strokeWidth="0.4" />
        ))}
      </svg>
      {/* Scan beam */}
      <motion.div className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,229,255,0.7),transparent)" }}
        animate={{ top: ["20%", "80%", "20%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-[10px] font-mono tracking-widest mt-16"
          style={{ color: "rgba(0,229,255,0.5)" }}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          SCANNING
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show" className="relative text-center py-20 px-6 overflow-hidden">
      {[300, 460, 620].map((sz, i) => (
        <motion.div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: sz, height: sz, border: "1px solid rgba(0,229,255,0.04)" }}
          animate={{ scale: [1, 1.025, 1] }} transition={{ duration: 5, delay: i * 1.3, repeat: Infinity }} />
      ))}
      <div className="relative z-10">
        <SectionLabel text="THREAT AWARENESS MODULE" />
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-white" style={{ textShadow: "0 0 40px rgba(0,229,255,0.12)" }}>
          IDENTITY<br /><span style={{ color: "#00e5ff" }}>BREACH INTELLIGENCE</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed font-light mb-8">
          Your digital identity is a high-value target. Understand how attackers steal, clone, and weaponize personal data — from Aadhaar misuse to SIM swap fraud and dark web resale.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mb-10">
          <DangerBadge label="CRITICAL THREAT" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest"
            style={{ border: "1px solid rgba(139,92,246,0.3)", color: "rgba(167,139,250,0.8)", background: "rgba(139,92,246,0.07)" }}>
            ◉ AI-CLASSIFIED
          </span>
        </div>
        <BiometricScan />
      </div>
    </motion.section>
  );
}

function BreachVisualization() {
  const [fact, setFact] = useState(0);
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-12 max-w-3xl mx-auto">
      <SectionLabel text="BREACH OVERVIEW" />
      <h2 className="text-xl font-light text-white mb-5 tracking-wide">The Identity Attack Surface</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded border p-5 space-y-3" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
          <p className="text-sm text-slate-400 leading-relaxed">
            Digital identity theft occurs when adversaries acquire enough personal data — name, ID numbers, biometrics, device access — to impersonate a victim across financial, government, and social platforms.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Unlike password theft, identity compromise often persists for years and requires legal intervention to resolve — long after the initial breach.
          </p>
        </div>
        {/* Rotating fact card */}
        <div className="rounded border p-5" style={{ borderColor: "rgba(0,229,255,0.18)", background: "rgba(0,229,255,0.03)" }}>
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: "rgba(0,229,255,0.5)" }}>◉ INTELLIGENCE SIGNAL</div>
          <AnimatePresence mode="wait">
            <motion.p key={fact} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="text-sm leading-relaxed min-h-[64px]" style={{ color: "rgba(207,250,254,0.8)" }}>
              {FACTS[fact]}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-1.5 mt-4">
            {FACTS.map((_, i) => (
              <button key={i} onClick={() => setFact(i)} className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === fact ? "#00e5ff" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AttackChain() {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-14 max-w-3xl mx-auto">
      <SectionLabel text="ATTACK CHAIN" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Identity Takeover Kill Chain</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          {ATTACK_CHAIN.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div className="w-9 h-9 rounded border flex items-center justify-center text-sm flex-shrink-0"
                  style={{ borderColor: "rgba(0,229,255,0.25)", background: "rgba(0,229,255,0.05)", color: "#00e5ff" }}
                  whileInView={{ boxShadow: ["0 0 0px #00e5ff", "0 0 10px rgba(0,229,255,0.35)", "0 0 0px #00e5ff"] }}
                  transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}>
                  {step.icon}
                </motion.div>
                {i < ATTACK_CHAIN.length - 1 && (
                  <motion.div className="w-px my-1" style={{ background: "rgba(0,229,255,0.14)" }}
                    initial={{ height: 0 }} whileInView={{ height: 32 }} transition={{ delay: i * 0.1 + 0.2 }} />
                )}
              </div>
              <div className="pb-6">
                <div className="text-sm font-mono text-white tracking-wide">{step.label}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* AI insight panel */}
        <div className="rounded border p-5 sticky top-6" style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.04)" }}>
          <div className="flex items-center gap-2 mb-3">
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ color: "#a78bfa" }}>◉</motion.span>
            <span className="text-[10px] font-mono tracking-widest" style={{ color: "rgba(167,139,250,0.6)" }}>AI THREAT ANALYSIS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            SIM swap attacks represent the most dangerous convergence point in identity theft — they neutralize SMS-based 2FA and grant real-time account access across every service linked to a phone number.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Attacker dwell time between SIM swap and first fraudulent transaction averages under <span className="text-orange-400">4 minutes</span> — far below detection thresholds for most financial institutions.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function DarkWebLeaks() {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-14 max-w-3xl mx-auto">
      <SectionLabel text="DARK WEB INTELLIGENCE" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Identity Markets</h2>
      <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-3 border-b flex gap-4 text-[10px] font-mono tracking-widest text-slate-600"
          style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
          <span className="flex-1">ITEM</span><span className="w-28 text-right">MARKET PRICE</span><span className="w-28 text-right">RISK INDEX</span>
        </div>
        {DARK_WEB_ITEMS.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
            className="px-5 py-4 border-b flex items-center gap-4"
            style={{ borderColor: "rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
            <span className="flex-1 text-sm font-mono text-slate-300">{item.label}</span>
            <span className="w-28 text-right text-xs font-mono text-orange-400">{item.price}</span>
            <div className="w-28 flex items-center gap-2">
              <RiskBar value={item.risk} />
              <span className="text-[10px] font-mono w-8 text-right" style={{ color: item.risk > 90 ? "#ef4444" : "#f97316" }}>{item.risk}%</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] font-mono text-slate-600 mt-3">Simulated market data for educational purposes only. Reflects documented dark web pricing patterns.</p>
    </motion.section>
  );
}

function ScamExamples() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-14 max-w-3xl mx-auto">
      <SectionLabel text="REAL-WORLD PATTERNS" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Known Attack Scenarios</h2>
      <div className="space-y-3">
        {SCAM_EXAMPLES.map((ex, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} viewport={{ once: true }}
            className="rounded border cursor-pointer transition-all"
            style={{ borderColor: active === i ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)", background: active === i ? "rgba(249,115,22,0.04)" : "rgba(255,255,255,0.02)" }}
            onClick={() => setActive(active === i ? null : i)}>
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded flex-shrink-0"
                style={{ border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c", background: "rgba(249,115,22,0.08)" }}>
                {ex.tag}
              </span>
              <span className="text-sm font-mono text-white flex-1">{ex.title}</span>
              <motion.span className="text-slate-500 text-xs" animate={{ rotate: active === i ? 90 : 0 }}>▶</motion.span>
            </div>
            <AnimatePresence>
              {active === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(249,115,22,0.15)" }}>
                    <p className="text-xs text-orange-200/70 italic leading-relaxed mt-3 mb-3">"{ex.preview}"</p>
                    <div className="flex flex-wrap gap-2">
                      {ex.flags.map((f, j) => (
                        <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{ border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", background: "rgba(239,68,68,0.07)" }}>
                          ⚠ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function Prevention() {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-16 max-w-3xl mx-auto">
      <SectionLabel text="DEFENSE PROTOCOLS" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Identity Protection Strategies</h2>
      <div className="space-y-2">
        {PREVENTION.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }} viewport={{ once: true }}
            className="flex items-start gap-4 px-5 py-3 rounded border transition-all group cursor-default"
            style={{ borderColor: "rgba(0,229,255,0.08)", background: "rgba(0,229,255,0.02)" }}
            whileHover={{ borderColor: "rgba(0,229,255,0.25)", backgroundColor: "rgba(0,229,255,0.04)" } as never}>
            <span className="text-cyan-400/60 mt-0.5 flex-shrink-0 text-sm">{t.icon}</span>
            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{t.tip}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IdentityTheft() {
  return (
    <div className="min-h-screen font-mono" style={{ background: "#050816", color: "#e2e8f0" }}>
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${(i * 41 + 13) % 100}%`, top: `${(i * 57 + 9) % 100}%`, width: 1 + (i % 2), height: 1 + (i % 2), background: i % 5 === 0 ? "rgba(139,92,246,0.4)" : "rgba(0,229,255,0.3)" }}
            animate={{ y: [-18, 18, -18], opacity: [0.15, 0.65, 0.15] }}
            transition={{ duration: 8 + i * 0.35, delay: i * 0.28, repeat: Infinity }} />
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="relative z-10 border-b px-6 py-3 text-[10px] font-mono tracking-widest flex items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(0,229,255,0.4)" }}>
        <span>TRUSTLAYERLABS</span><span className="text-slate-700">/</span>
        <span>AWARENESS</span><span className="text-slate-700">/</span>
        <span style={{ color: "rgba(0,229,255,0.75)" }}>IDENTITY THEFT</span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <Hero />
        <div className="border-t mx-6" style={{ borderColor: "rgba(255,255,255,0.04)" }} />
        <div className="py-4" />
        <BreachVisualization />
        <AttackChain />
        <DarkWebLeaks />
        <ScamExamples />
        <Prevention />
      </div>

      <footer className="relative z-10 border-t py-6 text-center text-[10px] font-mono tracking-widest"
        style={{ borderColor: "rgba(255,255,255,0.04)", color: "rgba(100,116,139,0.6)" }}>
        TRUSTLAYERLABS — IDENTITY THEFT AWARENESS MODULE &nbsp;◈&nbsp; EDUCATIONAL USE ONLY
      </footer>
    </div>
  );
}