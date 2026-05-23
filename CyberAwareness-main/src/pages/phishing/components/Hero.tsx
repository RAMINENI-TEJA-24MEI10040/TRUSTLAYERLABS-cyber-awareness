import { motion } from "framer-motion";
import { ArrowRight, Play, Radar } from "lucide-react";
import { useEffect, useState } from "react";
import { typingPhrases } from "../data";

export default function Hero() {
  const [phrase, setPhrase] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const full = typingPhrases[phrase];
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setText(full.slice(0, i));
      if (i === full.length) {
        window.clearInterval(id);
        window.setTimeout(() => setPhrase((p) => (p + 1) % typingPhrases.length), 1400);
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [phrase]);

  return (
    <section id="top" className="ph-hero">
      <div className="ph-grid-bg" />
      <motion.div className="ph-hero-orbit" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="ph-shell ph-hero-inner">
        <div className="ph-kicker"><Radar size={16} /> Frontend threat lab online</div>
        <h1>Phishing Awareness Simulator</h1>
        <p className="ph-typing">{text}<span /></p>
        <p className="ph-hero-copy">Train with realistic emails, SMS alerts, QR traps, fake domains, refund lures, and social engineering pressure.</p>
        <div className="ph-actions">
          <a className="ph-btn ph-btn-primary" href="#simulator"><Play size={18} /> Start simulator</a>
          <a className="ph-btn ph-btn-ghost" href="#education">Learn signals <ArrowRight size={18} /></a>
        </div>
      </motion.div>
    </section>
  );
}
