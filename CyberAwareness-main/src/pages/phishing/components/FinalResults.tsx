import { RotateCcw } from "lucide-react";
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
  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const level = getLevel(accuracy);
  const LevelIcon = level.Icon;
  const earned = badges.filter((badge) => stats.earnedBadges.includes(badge.id));

  return (
    <section id="results" className={`ph-final ${accuracy >= 80 ? "celebrate" : ""}`}>
      <div className="ph-confetti" />
      <div className="ph-final-hero">
        <LevelIcon size={42} />
        <span>Final results</span>
        <h2>{level.title}</h2>
        <p>{level.description}</p>
      </div>
      <div className="ph-stats-grid">
        <div><strong>{stats.score}</strong><span>Score</span></div>
        <div><strong>{accuracy}%</strong><span>Accuracy</span></div>
        <div><strong>{stats.correct}/{stats.total}</strong><span>Correct</span></div>
        <div><strong>{stats.bestStreak}</strong><span>Best streak</span></div>
      </div>
      <div className="ph-level-grid">
        {levels.map((item) => <LevelCard key={item.title} level={item} active={item.title === level.title} />)}
      </div>
      <div className="ph-earned">
        <h3>Earned badges</h3>
        <div>
          {earned.length ? earned.map((badge) => {
            const Icon = badge.Icon;
            return <span key={badge.id}><Icon size={16} /> {badge.title}</span>;
          }) : <span>No badges yet. Try another run.</span>}
        </div>
      </div>
      <button className="ph-btn ph-btn-primary mx-auto" onClick={onRestart}><RotateCcw size={18} /> Restart simulator</button>
    </section>
  );
}
