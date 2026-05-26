import { motion } from "framer-motion";
import { Activity, Crosshair, Flame, Gauge } from "lucide-react";
import { useMemo, useState } from "react";
import { badges, phishingScenarios, type Badge } from "../data";
import BadgeUnlock from "./BadgeUnlock";
import EmailCard from "./EmailCard";
import FinalResults, { type FinalStats } from "./FinalResults";
import ProgressBar from "./ProgressBar";
import ResultModal from "./ResultModal";
import ScorePopup from "./ScorePopup";

const initialStats: FinalStats = { score: 0, correct: 0, total: phishingScenarios.length, bestStreak: 0, earnedBadges: [] };

export default function Simulator() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [finished, setFinished] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [toast, setToast] = useState<Badge | null>(null);

  const scenario = phishingScenarios[index];
  const progress = (index / phishingScenarios.length) * 100;
  const accuracy = index ? Math.round((correctCount / index) * 100) : 0;

  const stats = useMemo<FinalStats>(() => ({
    score,
    correct: correctCount,
    total: phishingScenarios.length,
    bestStreak,
    earnedBadges,
  }), [bestStreak, correctCount, earnedBadges, score]);

  const unlock = (ids: string[]) => {
    const next = ids.find((id) => !earnedBadges.includes(id));
    if (!next) return;
    setEarnedBadges((prev) => [...prev, next]);
    setToast(badges.find((badge) => badge.id === next) ?? null);
  };

  const answer = (isPhishing: boolean) => {
    if (answered) return;
    const isCorrect = isPhishing === scenario.isPhishing;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextBest = Math.max(bestStreak, nextStreak);
    const nextScore = Math.max(0, score + (isCorrect ? 10 + Math.max(0, nextStreak - 1) * 2 : -5));
    const ids = [];

    if (isCorrect) ids.push("first-catch");
    if (nextStreak >= 3) ids.push("streak-3");
    if (isCorrect && scenario.category === "Banking") ids.push("banking");
    if (isCorrect && scenario.type === "qr") ids.push("qr");
    if (index === phishingScenarios.length - 1 && nextCorrect === phishingScenarios.length) ids.push("perfect");

    setChoice(isPhishing);
    setAnswered(true);
    setScore(nextScore);
    setCorrectCount(nextCorrect);
    setStreak(nextStreak);
    setBestStreak(nextBest);
    unlock(ids);
    setShowPopup(true);
    window.setTimeout(() => setShowPopup(false), 650);
    window.setTimeout(() => setShowModal(true), 420);
  };

  const next = () => {
    setShowModal(false);
    if (index === phishingScenarios.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(false);
    setChoice(null);
  };

  const restart = () => {
    setIndex(0);
    setScore(initialStats.score);
    setCorrectCount(initialStats.correct);
    setStreak(0);
    setBestStreak(0);
    setChoice(null);
    setAnswered(false);
    setShowModal(false);
    setFinished(false);
    setEarnedBadges([]);
    setToast(null);
  };

  if (finished) return <FinalResults stats={stats} onRestart={restart} />;

  return (
    <section id="simulator" className="ph-shell ph-section">
      <div className="ph-section-head">
        <span className="ph-kicker">Interactive simulator</span>
        <h2>Safe or phishing?</h2>
      </div>
      <div className="ph-sim-grid">
        <motion.div className="ph-panel" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <ProgressBar value={progress} label={`Scenario ${index + 1} of ${phishingScenarios.length}`} />
          <div className="ph-metrics">
            <div><Activity size={18} /><strong>{score}</strong><span>Score</span></div>
            <div><Flame size={18} /><strong>{streak}</strong><span>Streak</span></div>
            <div><Gauge size={18} /><strong>{accuracy}%</strong><span>Accuracy</span></div>
            <div><Crosshair size={18} /><strong>{correctCount}</strong><span>Correct</span></div>
          </div>
        </motion.div>
        <EmailCard scenario={scenario} answered={answered} choice={choice} onAnswer={answer} />
      </div>
      <ScorePopup show={showPopup} correct={choice === scenario.isPhishing} streak={streak} />
      <ResultModal open={showModal} correct={choice === scenario.isPhishing} scenario={scenario} onNext={next} isLast={index === phishingScenarios.length - 1} />
      <BadgeUnlock badge={toast} onClose={() => setToast(null)} />
    </section>
  );
}
