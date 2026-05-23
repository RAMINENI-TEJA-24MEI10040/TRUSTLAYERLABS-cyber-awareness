import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { PhishingScenario } from "../data";

interface Props {
  open: boolean;
  correct: boolean;
  scenario: PhishingScenario;
  onNext: () => void;
  isLast: boolean;
}

export default function ResultModal({ open, correct, scenario, onNext, isLast }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="ph-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="ph-modal" initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}>
            <div className={correct ? "ph-result good" : "ph-result bad"}>
              {correct ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              <div>
                <h3>{correct ? "Correct call" : "Missed signal"}</h3>
                <p>{scenario.isPhishing ? "This scenario was phishing." : "This scenario was safe."}</p>
              </div>
            </div>
            <p>{scenario.explanation}</p>
            <div className="ph-indicators">
              {scenario.indicators.map((item) => (
                <span key={item.label} className={`sev-${item.severity}`}>{item.label}: {item.detail}</span>
              ))}
            </div>
            <div className="ph-lesson">{scenario.lesson}</div>
            <button className="ph-btn ph-btn-primary w-full justify-center" onClick={onNext}>
              {isLast ? "View final results" : "Next scenario"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
