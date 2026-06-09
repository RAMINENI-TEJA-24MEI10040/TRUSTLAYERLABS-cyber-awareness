import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PhishingScenario } from "../data";

interface Props {
  open: boolean;
  correct: boolean;
  scenario: PhishingScenario;
  index: number;
  onNext: () => void;
  isLast: boolean;
}

export default function ResultModal({ open, correct, scenario, index, onNext, isLast }: Props) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="ph-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="ph-modal" initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}>
            <div className={correct ? "ph-result good" : "ph-result bad"}>
              {correct ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              <div>
                <h3>{correct ? t("phishing.simulator.correctCall", "Correct call") : t("phishing.simulator.missedSignal", "Missed signal")}</h3>
                <p>{scenario.isPhishing ? t("phishing.simulator.wasPhishing", "This scenario was phishing.") : t("phishing.simulator.wasSafe", "This scenario was safe.")}</p>
              </div>
            </div>
            <p>{t(`phishing.scenarios.${index}.explanation`, scenario.explanation)}</p>
            <div className="ph-indicators">
              {scenario.indicators.map((item, j) => (
                <span key={j} className={`sev-${item.severity}`}>
                  {t(`phishing.scenarios.${index}.indicators.${j}.label`, item.label)}: {t(`phishing.scenarios.${index}.indicators.${j}.detail`, item.detail)}
                </span>
              ))}
            </div>
            <div className="ph-lesson">{t(`phishing.scenarios.${index}.lesson`, scenario.lesson)}</div>
            <button className="ph-btn ph-btn-primary w-full justify-center" onClick={onNext}>
              {isLast ? t("phishing.simulator.viewResults", "View final results") : t("phishing.simulator.nextScenario", "Next scenario")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
