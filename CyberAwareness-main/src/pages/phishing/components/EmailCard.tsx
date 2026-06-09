import { AlertTriangle, CheckCircle2, Link2, Paperclip, QrCode, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PhishingScenario } from "../data";

interface Props {
  scenario: PhishingScenario;
  index: number;
  answered: boolean;
  choice: boolean | null;
  onAnswer: (isPhishing: boolean) => void;
}

const typeLabel = { email: "Email", sms: "SMS", qr: "QR" };

export default function EmailCard({ scenario, index, answered, choice, onAnswer }: Props) {
  const { t } = useTranslation();
  const correct = answered && choice === scenario.isPhishing;
  const TypeIcon = scenario.type === "qr" ? QrCode : scenario.type === "sms" ? AlertTriangle : ShieldCheck;

  const translatedSender = t(`phishing.scenarios.${index}.sender`, scenario.sender);

  return (
    <article className={`ph-email-card ${answered ? (correct ? "correct" : "wrong") : ""}`}>
      <div className="ph-email-top">
        <span><TypeIcon size={16} /> {t(`phishing.typeLabels.${scenario.type}`, typeLabel[scenario.type])}</span>
        <span>{t(`phishing.category.${scenario.category}`, scenario.category)}</span>
        <span>{t(`phishing.difficulty.${scenario.difficulty}`, scenario.difficulty)}</span>
      </div>
      <div className="ph-email-head">
        <div className="ph-avatar">{translatedSender.charAt(0)}</div>
        <div>
          <strong>{translatedSender}</strong>
          <span>{scenario.senderEmail}</span>
        </div>
      </div>
      <h3>{t(`phishing.scenarios.${index}.subject`, scenario.subject)}</h3>
      <p className="ph-message">{t(`phishing.scenarios.${index}.body`, scenario.body)}</p>
      {scenario.link && <div className="ph-link-chip"><Link2 size={14} /> {scenario.link}</div>}
      {scenario.attachment && <div className="ph-link-chip"><Paperclip size={14} /> {scenario.attachment}</div>}
      {answered && (
        <div className="ph-answer-state">
          {correct ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          {correct ? t("phishing.simulator.correctFeedback", "You classified this correctly.") : t("phishing.simulator.incorrectFeedback", "Review the indicators before continuing.")}
        </div>
      )}
      <div className="ph-choice-row">
        <button disabled={answered} className="ph-choice safe" onClick={() => onAnswer(false)}>
          <ShieldCheck size={19} /> {t("phishing.simulator.safeBtn", "Safe")}
        </button>
        <button disabled={answered} className="ph-choice danger" onClick={() => onAnswer(true)}>
          <AlertTriangle size={19} /> {t("phishing.simulator.phishBtn", "Phishing")}
        </button>
      </div>
    </article>
  );
}
