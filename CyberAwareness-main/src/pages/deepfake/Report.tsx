import "./css/deepfake.css";
import { DeepfakeModal, useDeepfakeLab, XpDock } from "./deepfakeReact";

export default function Report() {
  const { xp, modal, setModal } = useDeepfakeLab();

  return (
    <div className="deepfake-shell">
      <main className="df-page">
        <section className="df-section">
          <span className="df-kicker">Incident Response</span>
          <h1>Reporting Guide</h1>
          <p className="df-lead">
            Capture useful evidence quickly and send it to the right place without spreading
            the manipulated media further.
          </p>
        </section>

        <section className="df-grid cols-3">
          <article className="df-card">
            <span className="df-badge">Step 01</span>
            <h3>Preserve</h3>
            <ul className="df-list">
              <li>Save URLs, usernames, timestamps, and screenshots.</li>
              <li>Do not edit the original file if you can avoid it.</li>
              <li>Record payment handles, phone numbers, or wallet addresses.</li>
            </ul>
          </article>
          <article className="df-card">
            <span className="df-badge red">Step 02</span>
            <h3>Contain</h3>
            <ul className="df-list">
              <li>Warn impacted people through trusted channels.</li>
              <li>Freeze risky payments or account changes.</li>
              <li>Limit resharing to evidence handlers only.</li>
            </ul>
          </article>
          <article className="df-card">
            <span className="df-badge">Step 03</span>
            <h3>Report</h3>
            <ul className="df-list">
              <li>Use platform report tools for impersonation or abuse.</li>
              <li>Contact bank or payment provider for financial scams.</li>
              <li>Escalate to your cyber/security team or local cybercrime portal.</li>
            </ul>
          </article>
        </section>

        <section className="df-section df-panel" style={{ marginTop: 18 }}>
          <h2>Report template</h2>
          <div className="df-terminal">
            <span className="df-terminal-line">
              What happened: suspicious AI-generated media impersonating ...
            </span>
            <span className="df-terminal-line">
              Where found: URL, app, account, phone number, email ...
            </span>
            <span className="df-terminal-line">
              Evidence attached: screenshots, file hash, timestamps, payment details ...
            </span>
            <span className="df-terminal-line">
              Action requested: takedown, account lock, transaction review, investigation ...
            </span>
          </div>
        </section>
      </main>

      <XpDock xp={xp} />
      <DeepfakeModal modal={modal} onClose={() => setModal(null)} />

      <footer className="df-footer">
        For urgent financial loss, contact your bank and cybercrime authority immediately.
      </footer>
    </div>
  );
}
