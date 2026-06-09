import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Tip } from "../data";

export default function TipCard({ tip, index, delay = 0 }: { tip: Tip; index: number; delay?: number }) {
  const { t } = useTranslation();
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
      <h3>{t(`phishing.identifyTips.${index}.title`, tip.title)}</h3>
      <p>{t(`phishing.identifyTips.${index}.body`, tip.body)}</p>
    </motion.article>
  );
}
