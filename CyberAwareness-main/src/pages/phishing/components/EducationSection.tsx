import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { dailyTips, identifyTips, phishingTypes } from "../data";
import TipCard from "./TipCard";

export default function EducationSection() {
  const { t } = useTranslation();
  return (
    <section id="education" className="ph-shell ph-section">
      <div className="ph-section-head">
        <span className="ph-kicker">{t("phishing.edu.kicker", "Threat intelligence")}</span>
        <h2>{t("phishing.edu.title", "Learn the signals attackers hope you miss.")}</h2>
      </div>
      <div className="ph-edu-grid">
        {phishingTypes.map((item, i) => {
          const Icon = item.Icon;
          return (
            <motion.article
              key={item.title}
              className="ph-card ph-edu-card"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Icon size={26} />
              <h3>{t(`phishing.types.${i}.title`, item.title)}</h3>
              <p>{t(`phishing.types.${i}.body`, item.body)}</p>
            </motion.article>
          );
        })}
      </div>
      <div className="ph-tip-grid">
        {identifyTips.map((tip, i) => <TipCard key={tip.title} tip={tip} index={i} delay={i * 0.06} />)}
      </div>
      <div className="ph-marquee" aria-label="Daily phishing tips">
        <div>{[...dailyTips, ...dailyTips].map((tip, i) => <span key={`${tip}-${i}`}>{t(`phishing.dailyTips.${i % dailyTips.length}`, tip)}</span>)}</div>
      </div>
    </section>
  );
}
