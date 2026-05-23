import { type CSSProperties, useState } from "react";
import "./css/deepfake.css";
import "./css/challenge.css";
import { DeepfakeModal, useDeepfakeLab, XpDock } from "./deepfakeReact";

const rounds = [
  {
    title: "Executive video statement",
    type: "FAKE",
    risk: 86,
    clue: "Blink cadence is too regular and the jaw shadow slides independently.",
    details: ["Unnatural teeth edges", "Repeated background noise", "Skin texture is over-smoothed"],
  },
  {
    title: "Customer support voice note",
    type: "FAKE",
    risk: 78,
    clue: "The voice has flat room tone and odd pauses before account numbers.",
    details: ["No natural breath profile", "Robotic sibilance", "Urgent payment request"],
  },
  {
    title: "Recorded campus interview",
    type: "REAL",
    risk: 22,
    clue: "Lighting, micro-expression timing, and compression artifacts remain consistent.",
    details: ["Natural head motion", "Stable reflections", "Organic background chatter"],
  },
  {
    title: "Celebrity giveaway livestream",
    type: "FAKE",
    risk: 91,
    clue: "The face patch is sharper than the hairline and the offer demands crypto transfer.",
    details: ["High-pressure CTA", "Mouth shape mismatch", "Suspicious channel history"],
  },
];

export default function Challenge() {
  const { xp, modal, setModal, awardXp } = useDeepfakeLab();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const round = rounds[index];

  const answer = (value: string) => {
    if (choice) return;
    const correct = value === round.type;
    setChoice(value);
    if (correct) {
      const nextStreak = streak + 1;
      setScore((current) => current + 100);
      setStreak(nextStreak);
      awardXp(25, nextStreak >= 3 ? "Pattern Hunter" : "");
    } else {
      setStreak(0);
    }
  };

  const nextRound = () => {
    if (index + 1 >= rounds.length) {
      const finalScore = score + (choice === round.type ? 100 : 0);
      const accuracy = Math.round((finalScore / (rounds.length * 100)) * 100);
      awardXp(50, "Challenge Complete");
      setModal({
        title: "Final investigation result",
        body: `Score ${finalScore}. Accuracy ${accuracy}%. Review the evidence cards, then rerun the challenge to sharpen your detection instincts.`,
      });
      setIndex(0);
      setScore(0);
      setStreak(0);
    } else {
      setIndex((current) => current + 1);
    }
    setChoice(null);
  };

  return (
    <div className="deepfake-shell">
      <main className="df-page">
        <section className="df-section">
          <span className="df-kicker hot">Decision Drill</span>
          <h1>Fake vs Real Challenge</h1>
          <p className="df-lead">
            Classify each media incident, study the clues, and build analyst XP through fast
            but careful decisions.
          </p>
        </section>

        <section className="challenge-layout">
          <div className="df-panel">
            <span className="df-badge">Round <span>{index + 1}/{rounds.length}</span></span>
            <h2>{round.title}</h2>
            <div className="df-visual challenge-media">
              <div className="scanner-ring"></div>
              <div className="face-grid"></div>
              <div className="scanner-beam"></div>
            </div>
            <div className="meter-label">
              <span>Estimated AI risk</span>
              <strong>{round.risk}%</strong>
            </div>
            <div className="meter">
              <span style={{ "--value": `${round.risk}%` } as CSSProperties}></span>
            </div>
            <div className="challenge-options">
              <button
                className={`choice-button ${choice && round.type === "REAL" ? "correct" : ""} ${choice === "REAL" && round.type !== "REAL" ? "wrong" : ""}`}
                disabled={Boolean(choice)}
                onClick={() => answer("REAL")}
              >
                Real
              </button>
              <button
                className={`choice-button ${choice && round.type === "FAKE" ? "correct" : ""} ${choice === "FAKE" && round.type !== "FAKE" ? "wrong" : ""}`}
                disabled={Boolean(choice)}
                onClick={() => answer("FAKE")}
              >
                Fake
              </button>
            </div>
            <div className={`feedback-panel ${choice ? "show" : ""}`}>
              {choice ? `${choice === round.type ? "Correct." : "Missed signal."} ${round.clue}` : ""}
            </div>
            <div className="df-actions">
              <button className="df-button" onClick={nextRound}>
                Next Case
              </button>
            </div>
          </div>

          <aside className="df-panel scoreboard">
            <article className="df-metric">
              <span>Score</span>
              <strong>{score}</strong>
            </article>
            <article className="df-metric">
              <span>Streak</span>
              <strong>{streak}</strong>
            </article>
            <div>
              <h3>Evidence hints</h3>
              <div className="clue-stack">
                {round.details.map((detail) => (
                  <div className="clue" key={detail}>{detail}</div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <XpDock xp={xp} />
      <DeepfakeModal modal={modal} onClose={() => setModal(null)} />

      <footer className="df-footer">
        Challenge mode rewards evidence-first thinking, not speed alone.
      </footer>
    </div>
  );
}
