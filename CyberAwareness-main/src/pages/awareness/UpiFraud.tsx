import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScamCard {
  id: number;
  title: string;
  trigger: string;
  method: string;
  redFlag: string;
}

interface AttackStep {
  step: number;
  label: string;
  desc: string;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const attackSteps: AttackStep[] = [
  { step: 1, icon: "🎯", label: "Targeting", desc: "Attacker identifies victim via social media, marketplace listings, or data leaks." },
  { step: 2, icon: "🎭", label: "Social Engineering", desc: "Poses as buyer, seller, bank exec, or govt official to build trust." },
  { step: 3, icon: "📲", label: "Request Sent", desc: "Sends a UPI collect request instead of a payment, or a fake QR code." },
  { step: 4, icon: "🔑", label: "PIN Extracted", desc: "Tricks victim into entering MPIN, screen-sharing, or approving request." },
  { step: 5, icon: "💸", label: "Fund Transfer", desc: "Money exits account instantly. UPI transactions are irreversible." },
  { step: 6, icon: "👻", label: "Vanishes", desc: "Account deleted, SIM discarded. No trace left for recovery." },
];

const scamExamples: ScamCard[] = [
  {
    id: 1,
    title: "Refund / Cashback Scam",
    trigger: "You listed something on OLX or Quikr",
    method: "Fake buyer sends collect request saying 'Click to receive ₹500 cashback'",
    redFlag: "Entering PIN is ALWAYS payment — never receipt",
  },
  {
    id: 2,
    title: "Fake QR Code",
    trigger: "Scanning a QR at a shop or shared on WhatsApp",
    method: "Modified QR routes money to scammer's account silently",
    redFlag: "Verify recipient name before confirming any QR payment",
  },
  {
    id: 3,
    title: "Bank KYC Freeze",
    trigger: "Receive call: 'Your UPI will be blocked in 2 hours'",
    method: "Panic install AnyDesk/TeamViewer, give screen access, PIN captured",
    redFlag: "Banks NEVER ask for screen share or OTP over phone",
  },
  {
    id: 4,
    title: "Part Payment Fraud",
    trigger: "Freelancer or seller accepting advance payment",
    method: "Sends ₹1 then claims error, asks victim to 're-send' full amount",
    redFlag: "Always verify full credited amount before dispatching goods",
  },
];

const tips = [
  { icon: "🔐", text: "Your UPI PIN is a payment key — entering it always debits your account." },
  { icon: "🚫", text: "No legitimate refund, cashback, or reward requires you to enter your PIN." },
  { icon: "🧾", text: "Check the recipient's name on every transaction before confirming." },
  { icon: "📵", text: "Never screen-share during a 'bank call' — it's always a scam." },
  { icon: "⏸️", text: "Urgency is a weapon. Pause, verify, then decide." },
  { icon: "🔔", text: "Enable SMS + app notifications for every UPI transaction immediately." },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

const glowPulse = {
  animate: { boxShadow: ["0 0 8px #00e5ff30", "0 0 24px #00e5ff60", "0 0 8px #00e5ff30"] },
  transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function ParticleField() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-cyan-400"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, opacity: 0.18 }}
          animate={{ opacity: [0.08, 0.35, 0.08], y: [0, -18, 0] }}
          transition={{ duration: 5 + d.delay, repeat: Infinity, ease: "easeInOut" as const, delay: d.delay }}
        />
      ))}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase opacity-80">{text}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
    </div>
  );
}

function AttackFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-400/20 to-transparent" />
      <div className="space-y-3">
        {attackSteps.map((s, i) => (
          <motion.div
            key={s.step}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={i * 0.9}
            className="relative flex gap-4 items-start pl-3"
          >
            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#0a1828] border border-cyan-500/30 flex items-center justify-center text-lg flex-shrink-0"
              style={{ boxShadow: "0 0 12px #00e5ff18" }}>
              {s.icon}
            </div>
            <div className="bg-[#07111f] border border-white/5 rounded-xl p-3 flex-1 hover:border-cyan-500/30 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-500/60">STEP {s.step}</span>
                <span className="text-sm font-semibold text-white/90">{s.label}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScamExampleCard({ card, index }: { card: ScamCard; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={index * 0.8}
      onClick={() => setOpen(!open)}
      className="cursor-pointer bg-[#07111f] border border-white/5 rounded-2xl p-4 hover:border-cyan-500/25 transition-all duration-300 group"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white/85 group-hover:text-cyan-300 transition-colors">{card.title}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-cyan-500 text-lg font-light">+</motion.span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-3 space-y-2 text-xs">
          <div className="flex gap-2"><span className="text-cyan-500/70 font-mono w-14 flex-shrink-0">TRIGGER</span><span className="text-white/55">{card.trigger}</span></div>
          <div className="flex gap-2"><span className="text-cyan-500/70 font-mono w-14 flex-shrink-0">METHOD</span><span className="text-white/55">{card.method}</span></div>
          <div className="flex gap-2 mt-1 p-2 rounded-lg bg-red-500/8 border border-red-500/20">
            <span className="text-red-400 text-xs">⚠</span>
            <span className="text-red-300/80 text-xs">{card.redFlag}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UpiFraud() {
  return (
    <div className="min-h-screen text-white font-sans" style={{ background: "#050816" }}>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-20 pb-16">
        <ParticleField />

        {/* radial glow behind hero */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, #00e5ff0d 0%, transparent 70%)" }} />

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase
            bg-cyan-500/8 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Cyber Awareness · UPI Threat Intel
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight"
          style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
        >
          <span className="text-white">UPI</span>{" "}
          <span style={{ color: "#00e5ff", textShadow: "0 0 32px #00e5ff55" }}>Fraud</span>
          <br />
          <span className="text-white/70 text-3xl md:text-4xl font-semibold">Awareness Brief</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="max-w-xl text-white/45 text-sm md:text-base leading-relaxed mb-8"
        >
          India processes <strong className="text-cyan-400">14+ billion UPI transactions</strong> monthly.
          Fraudsters exploit speed, trust, and panic to drain accounts in seconds.
          Know the patterns. Break the chain.
        </motion.p>

        {/* Stat chips */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="flex flex-wrap gap-3 justify-center">
          {[
            ["₹2,145 Cr", "lost to UPI fraud in FY24"],
            ["7 sec", "avg time to drain an account"],
            ["0%", "recovery rate once transferred"],
          ].map(([val, label]) => (
            <motion.div key={val} {...glowPulse}
              className="bg-[#070b1a] border border-cyan-500/20 rounded-xl px-4 py-2 text-center">
              <div className="text-cyan-300 font-black text-lg">{val}</div>
              <div className="text-white/40 text-xs">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CONTENT GRID ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24 grid md:grid-cols-2 gap-6">

        {/* Attack Flow */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-[#06101c] border border-white/5 rounded-2xl p-6 md:col-span-1"
        >
          <SectionLabel text="Attack Flow" />
          <h2 className="text-lg font-bold text-white mb-5">How the scam unfolds</h2>
          <AttackFlow />
        </motion.section>

        {/* Tips */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2}
          className="bg-[#06101c] border border-white/5 rounded-2xl p-6"
        >
          <SectionLabel text="Prevention" />
          <h2 className="text-lg font-bold text-white mb-5">Rules that protect you</h2>
          <div className="space-y-3">
            {tips.map((t, i) => (
              <motion.div
                key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.7}
                className="flex gap-3 items-start p-3 rounded-xl bg-[#07131f] border border-white/4 hover:border-cyan-500/20 transition-colors duration-300"
              >
                <span className="text-base mt-0.5">{t.icon}</span>
                <p className="text-xs text-white/60 leading-relaxed">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scam Examples */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="md:col-span-2 bg-[#06101c] border border-white/5 rounded-2xl p-6"
        >
          <SectionLabel text="Real-world scams" />
          <h2 className="text-lg font-bold text-white mb-5">Known attack patterns — tap to expand</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {scamExamples.map((card, i) => (
              <ScamExampleCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Cyber Facts bar */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="md:col-span-2 rounded-2xl p-5 border border-purple-500/15 bg-[#08071a]"
          style={{ background: "linear-gradient(135deg, #08071a 0%, #0b0a1f 100%)" }}
        >
          <SectionLabel text="Intel Briefing" />
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              ["93%", "of UPI fraud cases involve social engineering — no hacking required"],
              ["3 of 4", "victims are tricked into entering PIN themselves"],
              ["72 hrs", "is the maximum window to file a complaint with NPCI for any chance of reversal"],
            ].map(([stat, note]) => (
              <div key={stat} className="p-3">
                <div className="text-2xl font-black mb-1" style={{ color: "#a78bfa" }}>{stat}</div>
                <div className="text-xs text-white/45 leading-relaxed">{note}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Emergency action card */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="md:col-span-2 rounded-2xl p-5 border border-red-500/20"
          style={{ background: "linear-gradient(135deg, #130a0a 0%, #0f0909 100%)" }}
        >
          <SectionLabel text="If You've Been Scammed" />
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { step: "01", action: "Block immediately", detail: "Call your bank's 24/7 helpline and freeze the UPI-linked account." },
              { step: "02", action: "File complaint", detail: "Report at cybercrime.gov.in or call 1930 (National Cyber Helpline) within 72 hours." },
              { step: "03", action: "Preserve evidence", detail: "Screenshot all chats, transaction IDs, and caller numbers before reporting." },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <span className="text-red-400 font-black font-mono text-xs mt-1 opacity-60">{item.step}</span>
                <div>
                  <div className="text-red-300 font-semibold text-sm mb-1">{item.action}</div>
                  <p className="text-white/45 text-xs leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ── FOOTER TAG ────────────────────────────────────────────────── */}
      <div className="text-center pb-10 text-xs text-white/20 font-mono tracking-wider">
        TRUSTLAYERLABS · CYBER AWARENESS DIVISION · UPI THREAT MODULE
      </div>
    </div>
  );
}