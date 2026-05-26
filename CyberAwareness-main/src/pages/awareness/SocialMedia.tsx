import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Palette constants ────────────────────────────────────────────────────────
const C = {
  bg0: "#050816",
  bg1: "#070b1a",
  bg2: "#0a1020",
  cyan: "#00e5ff",
  cyan2: "#06b6d4",
  cyan3: "#22d3ee",
  purple: "#a78bfa",
  red: "#f87171",
  orange: "#fb923c",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ThreatCard { id: number; icon: string; title: string; tag: string; body: string; color: string; }
interface PsychTactic { label: string; desc: string; icon: string; }
interface FakeMsg { from: string; text: string; danger?: boolean; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const threatCards: ThreatCard[] = [
  { id: 1, icon: "💘", title: "Romance Scam", tag: "HIGH RISK", color: C.red,
    body: "Fake personas spend weeks building emotional intimacy before requesting money for emergencies, travel, or medical crises. Victims lose an average of ₹3.2L." },
  { id: 2, icon: "🌟", title: "Influencer Impersonation", tag: "WIDESPREAD", color: C.orange,
    body: "Clone accounts mimic celebrity handles with near-identical usernames and profile photos, promoting fake investment schemes, giveaways, and merchandise drops." },
  { id: 3, icon: "🎁", title: "Fake Giveaway Fraud", tag: "MASS SCALE", color: C.cyan,
    body: "'You've won! DM to claim' — account harvesting, phishing links, and wallet-draining requests disguised as brand promotions." },
  { id: 4, icon: "🤖", title: "AI-Generated Profiles", tag: "EMERGING", color: C.purple,
    body: "GAN-synthesized faces, LLM-crafted bios, and AI-driven conversation agents create undetectable fake identities at industrial scale." },
  { id: 5, icon: "🎭", title: "Deepfake Social Engineering", tag: "CRITICAL", color: C.red,
    body: "Video/voice deepfakes impersonate executives, family members, or influencers to demand wire transfers or extract credentials in real-time calls." },
  { id: 6, icon: "📩", title: "Malicious DM Campaigns", tag: "ACTIVE", color: C.orange,
    body: "Phishing links, malware installers, and credential harvesters delivered through DMs posing as collaboration offers, job opportunities, or exclusive content." },
];

const psychTactics: PsychTactic[] = [
  { icon: "⏱️", label: "Urgency & Scarcity", desc: "Limited time offers force split-second decisions before rational analysis kicks in." },
  { icon: "❤️", label: "Love Bombing", desc: "Rapid affection and validation creates emotional debt the victim feels compelled to repay." },
  { icon: "🔒", label: "Isolation", desc: "Gradually steering victim away from friends and family who might raise red flags." },
  { icon: "🪞", label: "Mirroring", desc: "AI profiles study your posts and mirror your interests, values, and communication style." },
  { icon: "🎯", label: "Authority Bias", desc: "Verified checkmarks, follower counts, and brand logos exploit implicit trust in perceived authority." },
  { icon: "😰", label: "Fear & Shame", desc: "Sextortion and blackmail use manufactured evidence to silence victims through humiliation." },
];

const fakeConversation: FakeMsg[] = [
  { from: "UNKNOWN", text: "Hey! I came across your profile and wow — you're genuinely impressive 😊" },
  { from: "YOU", text: "Thanks, do I know you?" },
  { from: "UNKNOWN", text: "Not yet! I'm Sarah, investment analyst based in Dubai. I feel like we have a real connection already 💙" },
  { from: "UNKNOWN", text: "I've been doing incredibly well with a crypto platform my mentor showed me. I'd love to share it with you ✨", danger: true },
  { from: "YOU", text: "What platform?" },
  { from: "UNKNOWN", text: "It's exclusive access only — I can guide you personally. You'd only need to start with ₹15,000 to see returns", danger: true },
];

const aiProfileSigns = [
  "Profile photo is suspiciously perfect — no candid shots, consistent lighting",
  "Account created within the past 90 days with thousands of followers",
  "Posts feel slightly off — grammatically correct but emotionally flat",
  "Consistent engagement rate across all posts (bots don't have bad days)",
  "Replies arrive at all hours across multiple time zones simultaneously",
  "Bio references high-status lifestyle: 'Dubai / NYC · Investor · Model'",
];

const attackFlow = [
  { step: "01", label: "Fake Profile Created", icon: "👤", detail: "AI face + stolen photos + crafted bio targeting a specific victim demographic" },
  { step: "02", label: "Follow & Engage", icon: "💬", detail: "Likes, comments, DMs — building parasocial familiarity before direct contact" },
  { step: "03", label: "Trust Building", icon: "🤝", detail: "Daily conversations, emotional investment, apparent vulnerability shared" },
  { step: "04", label: "Manipulation Hook", icon: "🪝", detail: "Investment opportunity, romantic escalation, or emergency introduced" },
  { step: "05", label: "Extraction", icon: "💸", detail: "Money transfer, credential hand-over, or intimate content obtained" },
  { step: "06", label: "Ghost & Repeat", icon: "👻", detail: "Account vanishes. Profile reactivated targeting the next victim within hours." },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.45, delay: i * 0.07 } }),
};

// ─── Neural Graph SVG (decorative) ───────────────────────────────────────────
function NeuralGraph() {
  const nodes = [
    { cx: 50, cy: 50 }, { cx: 200, cy: 30 }, { cx: 340, cy: 70 },
    { cx: 120, cy: 140 }, { cx: 270, cy: 155 }, { cx: 390, cy: 130 },
    { cx: 60, cy: 200 }, { cx: 310, cy: 220 },
  ];
  const edges = [[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,7]];
  return (
    <svg viewBox="0 0 440 260" className="w-full opacity-20 pointer-events-none" style={{ filter: "drop-shadow(0 0 8px #00e5ff44)" }}>
      {edges.map(([a, b], i) => (
        <motion.line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#00e5ff" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.2 }} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.cx} cy={n.cy} r="5" fill="#00e5ff"
          animate={{ r: [4, 7, 4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }} />
      ))}
    </svg>
  );
}

// ─── Particle Field ───────────────────────────────────────────────────────────
function Particles() {
  const pts = Array.from({ length: 30 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 1.8 + 0.6, d: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: C.cyan, opacity: 0.15 }}
          animate={{ opacity: [0.06, 0.3, 0.06], y: [0, -20, 0] }}
          transition={{ duration: 5 + p.d, repeat: Infinity, ease: "easeInOut" as const, delay: p.d }} />
      ))}
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase">{text}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
    </div>
  );
}

// ─── Fake DM Window ───────────────────────────────────────────────────────────
function FakeDMWindow() {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => Math.min(v + 1, fakeConversation.length)), 1200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#060e1c] border border-cyan-500/15 rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 0 30px #00e5ff0a" }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#07111f]">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs font-mono text-white/30">DM · @sarah.invest.dubai ⚠</span>
        <span className="ml-auto text-[10px] text-red-400 font-mono">UNVERIFIED ACCOUNT</span>
      </div>
      <div className="p-4 space-y-3 min-h-[220px]">
        <AnimatePresence>
          {fakeConversation.slice(0, visible).map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === "YOU" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-xl px-3 py-2 text-xs leading-relaxed
                ${msg.from === "YOU"
                  ? "bg-cyan-500/15 text-cyan-100 border border-cyan-500/20"
                  : msg.danger
                    ? "bg-red-900/30 text-red-200 border border-red-500/30"
                    : "bg-white/5 text-white/65 border border-white/8"}`}>
                {msg.danger && <span className="text-red-400 text-[10px] font-mono block mb-1">⚠ MANIPULATION DETECTED</span>}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Threat Card ──────────────────────────────────────────────────────────────
function TCard({ card, index }: { card: ThreatCard; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true }} custom={index * 0.6}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="relative bg-[#07111f] border rounded-2xl p-4 cursor-default overflow-hidden transition-all duration-300"
      style={{ borderColor: hover ? card.color + "44" : "rgba(255,255,255,0.05)", boxShadow: hover ? `0 0 20px ${card.color}18` : "none" }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${card.color}12 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{card.icon}</span>
        <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full border"
          style={{ color: card.color, borderColor: card.color + "40", background: card.color + "10" }}>{card.tag}</span>
      </div>
      <h3 className="font-bold text-white/90 text-sm mb-2">{card.title}</h3>
      <p className="text-white/45 text-xs leading-relaxed">{card.body}</p>
    </motion.div>
  );
}

// ─── Attack Flow ──────────────────────────────────────────────────────────────
function AttackFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-6 top-6 bottom-6 w-px"
        style={{ background: "linear-gradient(to bottom, #00e5ff50, #00e5ff10, transparent)" }} />
      <div className="space-y-3">
        {attackFlow.map((s, i) => (
          <motion.div key={s.step} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={i}
            className="flex gap-4 items-start pl-3">
            <div className="relative z-10 w-12 h-12 rounded-xl bg-[#0a1828] border border-cyan-500/25
              flex flex-col items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 0 12px #00e5ff14" }}>
              <span className="text-[8px] font-mono text-cyan-500/50">{s.step}</span>
              <span className="text-base">{s.icon}</span>
            </div>
            <div className="bg-[#06101c] border border-white/5 rounded-xl p-3 flex-1
              hover:border-cyan-500/20 transition-colors duration-300">
              <div className="text-sm font-semibold text-white/85 mb-1">{s.label}</div>
              <p className="text-xs text-white/40 leading-relaxed">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SocialMedia() {
  return (
    <div className="min-h-screen text-white" style={{ background: C.bg0, fontFamily: "'DM Sans', 'Syne', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-12 overflow-hidden">
        <Particles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 38%, #00e5ff0b 0%, transparent 68%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #050816, transparent)" }} />

        {/* Neural graph behind hero */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="w-full max-w-2xl"><NeuralGraph /></div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="relative z-10">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase
            bg-cyan-500/8 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            Social Threat Intelligence · TRUSTLAYERLABS
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="relative z-10 text-4xl md:text-[3.8rem] font-black tracking-tight leading-[1.05] mb-5"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="text-white/90">Social Media</span><br />
          <span style={{ color: C.cyan, textShadow: `0 0 40px ${C.cyan}55` }}>Manipulation</span>{" "}
          <span className="text-white/70 text-3xl md:text-4xl">Atlas</span>
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="relative z-10 max-w-lg text-white/40 text-sm md:text-[0.95rem] leading-relaxed mb-8">
          Every follow. Every DM. Every reaction. Threat actors weaponize social platforms to build
          fake trust, harvest emotions, and extract money or identity at scale.{" "}
          <strong className="text-cyan-400">Learn the patterns before they reach you.</strong>
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="relative z-10 flex flex-wrap gap-3 justify-center">
          {[
            ["₹5,800 Cr", "lost to social scams FY24"],
            ["67%", "victims met scammer on social media"],
            ["23 days", "avg trust-building before extraction"],
          ].map(([v, l]) => (
            <motion.div key={v}
              className="bg-[#070b1a] border border-cyan-500/20 rounded-xl px-4 py-2.5 text-center"
              animate={{ boxShadow: ["0 0 8px #00e5ff20", "0 0 20px #00e5ff40", "0 0 8px #00e5ff20"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}>
              <div className="text-cyan-300 font-black text-base">{v}</div>
              <div className="text-white/35 text-[11px]">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-6">

        {/* Threat cards grid */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-[#06101c] border border-white/5 rounded-2xl p-6">
          <SLabel text="Threat Taxonomy" />
          <h2 className="text-lg font-bold text-white mb-5">Active social threat vectors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {threatCards.map((c, i) => <TCard key={c.id} card={c} index={i} />)}
          </div>
        </motion.section>

        {/* Attack flow + DM window */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="bg-[#06101c] border border-white/5 rounded-2xl p-6">
            <SLabel text="Attack Sequence" />
            <h2 className="text-lg font-bold text-white mb-5">How trust becomes a weapon</h2>
            <AttackFlow />
          </motion.section>

          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2}
            className="bg-[#06101c] border border-white/5 rounded-2xl p-6">
            <SLabel text="Live Simulation" />
            <h2 className="text-lg font-bold text-white mb-4">Romance scam DM — annotated</h2>
            <FakeDMWindow />
            <p className="text-[11px] text-white/30 mt-3 leading-relaxed font-mono">
              ↑ Simulated conversation. Red annotations indicate manipulation markers detected in real scam transcripts.
            </p>
          </motion.section>
        </div>

        {/* AI Profile Detection */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-[#06101c] border border-white/5 rounded-2xl p-6">
          <SLabel text="AI Profile Detection" />
          <h2 className="text-lg font-bold text-white mb-2">How to spot a synthetic identity</h2>
          <p className="text-white/40 text-xs mb-5 max-w-2xl">
            Generative AI now produces photorealistic faces, coherent bios, and consistent posting histories
            — indistinguishable to the untrained eye. These are the technical and behavioural tells.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiProfileSigns.map((sign, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="flex gap-3 items-start p-3 rounded-xl bg-[#08142a] border border-purple-500/15
                  hover:border-purple-400/30 transition-colors duration-300">
                <motion.span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.purple }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                <p className="text-xs text-white/55 leading-relaxed">{sign}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Psychology Grid */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-[#06101c] border border-white/5 rounded-2xl p-6">
          <SLabel text="Psychology of Manipulation" />
          <h2 className="text-lg font-bold text-white mb-5">Six cognitive exploits used against you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {psychTactics.map((t, i) => (
              <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="p-4 rounded-xl bg-[#07111f] border border-white/5 hover:border-cyan-500/20 transition-all duration-300 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-sm font-semibold text-white/80 group-hover:text-cyan-300 transition-colors">{t.label}</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Deepfake + Giveaway row */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl p-5 border border-red-500/15"
            style={{ background: "linear-gradient(135deg, #130a0a 0%, #0f0909 100%)" }}>
            <SLabel text="Deepfake Threat" />
            <h3 className="font-bold text-red-300 text-base mb-3">🎭 When your eyes lie to you</h3>
            <div className="space-y-2 text-xs text-white/50 leading-relaxed">
              <p>Real-time deepfake tools can clone a voice from 30 seconds of audio and a face from 5 photos. A "video call" from your CEO, family member, or celebrity idol may be entirely synthetic.</p>
              <div className="mt-3 space-y-1.5">
                {["Watch for unnatural blinking or jaw movement", "Audio lag often precedes voice synthesis", "Hang up and call back on a known number", "Verify any urgent money request through a second channel"].map((tip, i) => (
                  <div key={i} className="flex gap-2"><span className="text-red-400">›</span><span>{tip}</span></div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.15}
            className="rounded-2xl p-5 border border-yellow-500/15"
            style={{ background: "linear-gradient(135deg, #0f0e07 0%, #100d05 100%)" }}>
            <SLabel text="Giveaway Scam" />
            <h3 className="font-bold text-yellow-200 text-base mb-3">🎁 The prize that costs you everything</h3>
            <div className="space-y-2 text-xs text-white/50 leading-relaxed">
              <p>Fake brand / influencer accounts announce giveaways requiring you to follow, share, and DM. The "prize claim" link harvests your data, credentials, or UPI details.</p>
              <div className="mt-3 space-y-1.5 text-yellow-100/50">
                {["Verify via the brand's official verified account", "Legitimate giveaways never require your bank PIN", "Check if the account existed before 90 days ago", "No genuine prize requires you to 'pay tax first'"].map((tip, i) => (
                  <div key={i} className="flex gap-2"><span className="text-yellow-400">›</span><span>{tip}</span></div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Intel facts bar */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="rounded-2xl p-5 border border-purple-500/15"
          style={{ background: "linear-gradient(135deg, #08071a 0%, #0b0a1f 100%)" }}>
          <SLabel text="Intelligence Brief" />
          <div className="grid sm:grid-cols-4 gap-4 text-center">
            {[
              ["1.4B", "fake accounts removed by Meta in a single quarter"],
              ["82%", "romance scam victims say scammer contacted them first"],
              ["$1.3B", "global losses to social media fraud in 2023"],
              ["18–34", "age group most targeted by investment scams on Instagram"],
            ].map(([stat, note]) => (
              <div key={stat} className="p-2">
                <div className="text-xl font-black mb-1" style={{ color: C.purple }}>{stat}</div>
                <div className="text-[11px] text-white/40 leading-relaxed">{note}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Verification checklist */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-[#06101c] border border-cyan-500/10 rounded-2xl p-6">
          <SLabel text="Verification Protocol" />
          <h2 className="text-base font-bold text-white mb-4">Before you trust any account — run this check</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Does the profile photo return other results on reverse image search?",
              "Is the account older than 6 months with consistent post history?",
              "Does the username have subtle substitutions (0 for O, 1 for l)?",
              "Do follower counts make sense relative to engagement?",
              "Has any unsolicited investment or romantic interest been expressed?",
              "Does clicking 'About' reveal a real website or empty fields?",
              "Is the verification badge from the platform, not copied as emoji in bio?",
              "Would you give this person your home address after one week of chatting?",
            ].map((q, i) => (
              <div key={i} className="flex gap-3 items-start p-2.5 rounded-lg bg-[#07111f] border border-white/4">
                <span className="text-cyan-500 font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-xs text-white/55 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <div className="text-center pb-10 text-[10px] text-white/18 font-mono tracking-widest">
        TRUSTLAYERLABS · SOCIAL THREAT INTELLIGENCE · AWARENESS MODULE v2
      </div>
    </div>
  );
}