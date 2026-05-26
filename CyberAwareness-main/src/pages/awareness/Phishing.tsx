import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────────

const ATTACK_STEPS = [
  { icon: "◈", label: "Lure Crafted", desc: "Attacker clones a trusted brand — bank, courier, cloud provider — with pixel-perfect spoofing." },
  { icon: "⬡", label: "Delivery", desc: "Malicious link or attachment sent via email, SMS (smishing), or voice call (vishing)." },
  { icon: "⊕", label: "Hook", desc: "Victim clicks and lands on a convincing fake login page or opens an infected document." },
  { icon: "◉", label: "Credential Capture", desc: "Credentials, OTPs, or financial data are silently harvested and relayed to the attacker." },
  { icon: "⟳", label: "Exploitation", desc: "Stolen access is monetized — account takeover, wire fraud, identity theft, or resale." },
];

const SCAM_EXAMPLES = [
  {
    tag: "EMAIL",
    title: "Urgent Account Suspension",
    preview: "Your account has been flagged for suspicious activity. Verify immediately or lose access within 24 hours.",
    flags: ["Urgency pressure", "Generic greeting", "Spoofed sender domain"],
  },
  {
    tag: "SMS",
    title: "Parcel Delivery Failed",
    preview: "Your package could not be delivered. Pay a £1.99 redelivery fee to release your shipment: trk-parcel[.]net",
    flags: ["Tiny fee to lower guard", "Lookalike domain", "Unexpected message"],
  },
  {
    tag: "VOICE",
    title: "Bank Security Call",
    preview: "This is your bank's fraud team. We've detected unusual activity. Please confirm your card number to secure your account.",
    flags: ["Caller ID spoofing", "Fear + authority", "Requests sensitive data"],
  },
];

const TIPS = [
  { icon: "◈", tip: "Hover over links before clicking — the real URL appears in your browser's status bar." },
  { icon: "⬡", tip: "Legitimate organizations never ask for passwords or OTPs via email or phone." },
  { icon: "◉", tip: "Enable multi-factor authentication on every account to limit credential theft impact." },
  { icon: "⊕", tip: "When in doubt, navigate directly to the site — never via a link in the message." },
  { icon: "◎", tip: "Report phishing attempts to your IT team or national cyber incident center." },
];

const FACTS = [
  "Phishing is responsible for over 80% of reported security incidents worldwide.",
  "The average time to click a phishing link is under 60 seconds after receipt.",
  "Business Email Compromise losses exceeded $2.9 billion in 2023 alone.",
  "One in every 99 emails received is a phishing attempt.",
];

// ─── Micro components ─────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

function GlowBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest"
      style={{ border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", background: "rgba(239,68,68,0.08)" }}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      {label}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <div className="text-[10px] tracking-[0.4em] font-mono mb-2" style={{ color: "rgba(0,229,255,0.45)" }}>{text}</div>;
}

function CyberCard({ children, glow = false }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div className="rounded border p-5 transition-colors"
      style={{ borderColor: glow ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.05)", background: glow ? "rgba(0,229,255,0.03)" : "rgba(255,255,255,0.02)" }}>
      {children}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show"
      className="relative text-center py-20 px-6 overflow-hidden">
      {/* Rings */}
      {[320, 480, 640].map((sz, i) => (
        <motion.div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: sz, height: sz, border: "1px solid rgba(0,229,255,0.04)" }}
          animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 5, delay: i * 1.2, repeat: Infinity }} />
      ))}
      <div className="relative z-10">
        <SectionLabel text="THREAT AWARENESS MODULE" />
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-white"
          style={{ textShadow: "0 0 40px rgba(0,229,255,0.12)" }}>
          PHISHING<br /><span style={{ color: "#00e5ff" }}>INTELLIGENCE</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
          Understanding how social-engineering attacks deceive victims is the most effective defense against credential theft, financial fraud, and identity compromise.
        </p>
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <GlowBadge label="HIGH THREAT" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest"
            style={{ border: "1px solid rgba(0,229,255,0.2)", color: "rgba(0,229,255,0.7)", background: "rgba(0,229,255,0.05)" }}>
            ◈ AWARENESS CLASSIFIED
          </span>
        </div>
      </div>
    </motion.section>
  );
}

function ThreatOverview() {
  const [fact, setFact] = useState(0);
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-12 max-w-3xl mx-auto">
      <SectionLabel text="THREAT OVERVIEW" />
      <h2 className="text-xl font-light text-white mb-5 tracking-wide">What is Phishing?</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <CyberCard>
          <p className="text-sm text-slate-400 leading-relaxed">
            Phishing is a social-engineering attack where adversaries impersonate trusted entities to manipulate victims into surrendering credentials, financial data, or installing malware. It exploits human psychology — not technical vulnerabilities.
          </p>
        </CyberCard>
        {/* Rotating fact */}
        <CyberCard glow>
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: "rgba(0,229,255,0.5)" }}>◉ INTELLIGENCE SIGNAL</div>
          <AnimatePresence mode="wait">
            <motion.p key={fact} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="text-sm text-cyan-100/80 leading-relaxed min-h-[60px]">
              {FACTS[fact]}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-1.5 mt-4">
            {FACTS.map((_, i) => (
              <button key={i} onClick={() => setFact(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === fact ? "#00e5ff" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
        </CyberCard>
      </div>
    </motion.section>
  );
}

function AttackFlow() {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-14 max-w-3xl mx-auto">
      <SectionLabel text="ATTACK CHAIN" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Phishing Kill Chain</h2>
      <div className="space-y-0">
        {ATTACK_STEPS.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div className="w-9 h-9 rounded border flex items-center justify-center text-sm flex-shrink-0 font-mono"
                style={{ borderColor: "rgba(0,229,255,0.25)", background: "rgba(0,229,255,0.05)", color: "#00e5ff" }}
                whileInView={{ boxShadow: ["0 0 0px #00e5ff", "0 0 10px rgba(0,229,255,0.4)", "0 0 0px #00e5ff"] }}
                transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}>
                {step.icon}
              </motion.div>
              {i < ATTACK_STEPS.length - 1 && (
                <motion.div className="w-px my-1" style={{ background: "rgba(0,229,255,0.15)" }}
                  initial={{ height: 0 }} whileInView={{ height: 36 }} transition={{ delay: i * 0.1 + 0.2 }} />
              )}
            </div>
            <div className="pb-7">
              <div className="text-sm font-mono text-white tracking-wide">{step.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function ScamExamples() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-14 max-w-3xl mx-auto">
      <SectionLabel text="REAL-WORLD EXAMPLES" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Known Scam Patterns</h2>
      <div className="grid gap-3">
        {SCAM_EXAMPLES.map((ex, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            className="rounded border cursor-pointer transition-all"
            style={{ borderColor: active === i ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)", background: active === i ? "rgba(249,115,22,0.04)" : "rgba(255,255,255,0.02)" }}
            onClick={() => setActive(active === i ? null : i)}>
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c", background: "rgba(249,115,22,0.08)" }}>
                {ex.tag}
              </span>
              <span className="text-sm font-mono text-white flex-1">{ex.title}</span>
              <motion.span className="text-slate-500 text-xs" animate={{ rotate: active === i ? 90 : 0 }}>▶</motion.span>
            </div>
            <AnimatePresence>
              {active === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
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

function PreventionTips() {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="px-6 pb-16 max-w-3xl mx-auto">
      <SectionLabel text="PREVENTION PROTOCOLS" />
      <h2 className="text-xl font-light text-white mb-6 tracking-wide">Defense Awareness</h2>
      <div className="space-y-2">
        {TIPS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }} viewport={{ once: true }}
            className="flex items-start gap-4 px-5 py-3 rounded border transition-colors group"
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

export default function Phishing() {
  return (
    <div className="min-h-screen font-mono" style={{ background: "#050816", color: "#e2e8f0" }}>
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 18 }, (_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%`, width: 1 + (i % 2), height: 1 + (i % 2), background: "rgba(0,229,255,0.35)" }}
            animate={{ y: [-15, 15, -15], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 7 + i * 0.4, delay: i * 0.3, repeat: Infinity }} />
        ))}
      </div>

      {/* Nav breadcrumb */}
      <div className="relative z-10 border-b px-6 py-3 text-[10px] font-mono tracking-widest flex items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(0,229,255,0.4)" }}>
        <span>TRUSTLAYERLABS</span><span className="text-slate-700">/</span>
        <span>AWARENESS</span><span className="text-slate-700">/</span>
        <span style={{ color: "rgba(0,229,255,0.75)" }}>PHISHING</span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <Hero />
        <div className="border-t mx-6" style={{ borderColor: "rgba(255,255,255,0.04)" }} />
        <div className="py-4" />
        <ThreatOverview />
        <AttackFlow />
        <ScamExamples />
        <PreventionTips />
      </div>

      <footer className="relative z-10 border-t py-6 text-center text-[10px] font-mono tracking-widest"
        style={{ borderColor: "rgba(255,255,255,0.04)", color: "rgba(100,116,139,0.6)" }}>
        TRUSTLAYERLABS — PHISHING AWARENESS MODULE &nbsp;◈&nbsp; EDUCATIONAL USE ONLY
      </footer>
    </div>
  );
}