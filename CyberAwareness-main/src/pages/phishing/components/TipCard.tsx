import { motion } from "framer-motion";
import type { Tip } from "../data";

export default function TipCard({ tip, delay = 0 }: { tip: Tip; delay?: number }) {
  const Icon = tip.Icon;
  return (
    <motion.article
      className="ph-card ph-tip-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.45 }}
    >
      <div className="ph-card-icon"><Icon size={22} /></div>
      <h3>{tip.title}</h3>
      <p>{tip.body}</p>
    </motion.article>
  );
}
