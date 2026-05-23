import { useEffect, useState } from "react";

export const caseFiles = [
  {
    title: "Voice-cloned CEO payment order",
    impact: "Finance team nearly wired emergency vendor funds.",
    signal: "Caller avoided video and pushed a 20-minute deadline.",
    response: "Verify through a second channel and require payment approval.",
  },
  {
    title: "Fake hiring interview kit",
    impact: "Applicants were asked to upload IDs to a cloned portal.",
    signal: "Interview video used looped nods and generic answers.",
    response: "Check company domain, recruiter identity, and offer sequence.",
  },
  {
    title: "Synthetic investment livestream",
    impact: "Viewers were routed to a crypto wallet deposit page.",
    signal: "Pinned comments repeated the same wallet pressure script.",
    response: "Pause, search official channels, and report the stream.",
  },
];

export const examples = [
  { label: "REAL", title: "Natural webcam recording", note: "Compression artifacts are consistent across face, hair, and background." },
  { label: "FAKE", title: "Face-swapped executive clip", note: "Edges around glasses shimmer during fast head movement." },
  { label: "FAKE", title: "AI voice ransom call", note: "Emotion is exaggerated but breath and room tone stay flat." },
];

export function useDeepfakeLab() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem("deepfakeLabXp") || 0));
  const [achievements, setAchievements] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("deepfakeLabAchievements") || "[]")
  );
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    localStorage.setItem("deepfakeLabXp", String(xp));
    localStorage.setItem("deepfakeLabAchievements", JSON.stringify(achievements));
  }, [xp, achievements]);

  const awardXp = (points: number, badge = "") => {
    setXp((current) => current + points);
    if (badge && !achievements.includes(badge)) {
      setAchievements((current) => [...current, badge]);
      setModal({
        title: "Achievement unlocked",
        body: `${badge} secured. +${points} XP added to your analyst profile.`,
      });
    }
  };

  return { xp, modal, setModal, awardXp };
}

export function XpDock({ xp }: { xp: number }) {
  return <div className="xp-dock">ANALYST XP {xp}</div>;
}

export function DeepfakeModal({
  modal,
  onClose,
}: {
  modal: { title: string; body: string } | null;
  onClose: () => void;
}) {
  return (
    <div className={`df-modal ${modal ? "show" : ""}`} onClick={onClose}>
      <div className="df-modal-box" onClick={(event) => event.stopPropagation()}>
        <h2>{modal?.title}</h2>
        <p>{modal?.body}</p>
        <button className="df-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
