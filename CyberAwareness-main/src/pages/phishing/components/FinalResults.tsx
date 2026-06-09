import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { badges, getLevel, levels } from "../data";
import LevelCard from "./LevelCard";

export interface FinalStats {
  score: number;
  correct: number;
  total: number;
  bestStreak: number;
  earnedBadges: string[];
}

export default function FinalResults({ stats, onRestart }: { stats: FinalStats; onRestart: () => void }) {
  const { t } = useTranslation();
  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const level = getLevel(accuracy);
  const LevelIcon = level.Icon;
  const levelIndex = levels.findIndex((item) => item.title === level.title);
  const earned = badges.filter((badge) => stats.earnedBadges.includes(badge.id));

  return (
    <section id="results" className={`ph-final ${accuracy >= 80 ? "celebrate" : ""}`}>
      <div className="ph-confetti" />
      <div className="ph-final-hero">
        <LevelIcon size={42} />
        <span>{t("phishing.results.subtitle", "Final results")}</span>
        <h2>{t(`phishing.levels.${levelIndex}.title`, level.title)}</h2>
        <p>{t(`phishing.levels.${levelIndex}.description`, level.description)}</p>
      </div>
      <div className="ph-stats-grid">
        <div><strong>{stats.score}</strong><span>{t("phishing.simulator.score", "Score")}</span></div>
        <div><strong>{accuracy}%</strong><span>{t("phishing.simulator.accuracy", "Accuracy")}</span></div>
        <div><strong>{stats.correct}/{stats.total}</strong><span>{t("phishing.simulator.correct", "Correct")}</span></div>
        <div><strong>{stats.bestStreak}</strong><span>{t("phishing.simulator.bestStreak", "Best streak")}</span></div>
      </div>
      <div className="ph-level-grid">
        {levels.map((item, idx) => <LevelCard key={idx} level={item} index={idx} active={item.title === level.title} />)}
      </div>
      <div className="ph-earned">
        <h3>{t("phishing.results.earnedBadges", "Earned badges")}</h3>
        <div>
          {earned.length ? earned.map((badge) => {
            const Icon = badge.Icon;
            return <span key={badge.id}><Icon size={16} /> {t(`phishing.badges.${badge.id}.title`, badge.title)}</span>;
          }) : <span>{t("phishing.results.noBadges", "No badges yet. Try another run.")}</span>}
        </div>
      </div>
      <button className="ph-btn ph-btn-primary mx-auto" onClick={onRestart}><RotateCcw size={18} /> {t("phishing.results.restartBtn", "Restart simulator")}</button>
    </section>
  );
}
