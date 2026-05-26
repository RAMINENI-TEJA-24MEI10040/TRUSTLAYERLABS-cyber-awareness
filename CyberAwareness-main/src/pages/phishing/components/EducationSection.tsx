import { motion } from "framer-motion";
import { dailyTips, identifyTips, phishingTypes } from "../data";
import TipCard from "./TipCard";

export default function EducationSection() {
  return (
    <section id="education" className="ph-shell ph-section">
      <div className="ph-section-head">
        <span className="ph-kicker">Threat intelligence</span>
        <h2>Learn the signals attackers hope you miss.</h2>
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
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </motion.article>
          );
        })}
      </div>
      <div className="ph-tip-grid">
        {identifyTips.map((tip, i) => <TipCard key={tip.title} tip={tip} delay={i * 0.06} />)}
      </div>
      <div className="ph-marquee" aria-label="Daily phishing tips">
        <div>{[...dailyTips, ...dailyTips].map((tip, i) => <span key={`${tip}-${i}`}>{tip}</span>)}</div>
      </div>
    </section>
  );
}
