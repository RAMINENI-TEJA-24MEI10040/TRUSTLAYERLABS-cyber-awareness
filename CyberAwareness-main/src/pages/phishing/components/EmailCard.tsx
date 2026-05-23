import { AlertTriangle, CheckCircle2, Link2, Paperclip, QrCode, ShieldCheck } from "lucide-react";
import type { PhishingScenario } from "../data";

interface Props {
  scenario: PhishingScenario;
  answered: boolean;
  choice: boolean | null;
  onAnswer: (isPhishing: boolean) => void;
}

const typeLabel = { email: "Email", sms: "SMS", qr: "QR" };

export default function EmailCard({ scenario, answered, choice, onAnswer }: Props) {
  const correct = answered && choice === scenario.isPhishing;
  const TypeIcon = scenario.type === "qr" ? QrCode : scenario.type === "sms" ? AlertTriangle : ShieldCheck;

  return (
    <article className={`ph-email-card ${answered ? (correct ? "correct" : "wrong") : ""}`}>
      <div className="ph-email-top">
        <span><TypeIcon size={16} /> {typeLabel[scenario.type]}</span>
        <span>{scenario.category}</span>
        <span>{scenario.difficulty}</span>
      </div>
      <div className="ph-email-head">
        <div className="ph-avatar">{scenario.sender.charAt(0)}</div>
        <div>
          <strong>{scenario.sender}</strong>
          <span>{scenario.senderEmail}</span>
        </div>
      </div>
      <h3>{scenario.subject}</h3>
      <p className="ph-message">{scenario.body}</p>
      {scenario.link && <div className="ph-link-chip"><Link2 size={14} /> {scenario.link}</div>}
      {scenario.attachment && <div className="ph-link-chip"><Paperclip size={14} /> {scenario.attachment}</div>}
      {answered && (
        <div className="ph-answer-state">
          {correct ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          {correct ? "You classified this correctly." : "Review the indicators before continuing."}
        </div>
      )}
      <div className="ph-choice-row">
        <button disabled={answered} className="ph-choice safe" onClick={() => onAnswer(false)}>
          <ShieldCheck size={19} /> Safe
        </button>
        <button disabled={answered} className="ph-choice danger" onClick={() => onAnswer(true)}>
          <AlertTriangle size={19} /> Phishing
        </button>
      </div>
    </article>
  );
}
