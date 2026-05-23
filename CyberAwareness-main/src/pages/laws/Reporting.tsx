import { Link } from "react-router-dom";
import "./css/laws.css";
import "./css/reporting.css";
import "./js/laws.js";
import "./js/reporting.js";

export default function Reporting() {
  return (
    <main className="law-shell">
      <nav className="law-nav">
        <Link className="brand-link" to="/laws/dashboard">
          <span className="brand-mark">CL</span>Cyber Law SOC
        </Link>
        <div className="law-links">
          <Link className="dashboard-link" to="/">
            Back to Dashboard
          </Link>
          <Link to="/laws/it-act">IT Act</Link>
          <Link className="active" to="/laws/reporting">
            Reporting
          </Link>
          <Link to="/laws/rights">Rights</Link>
          <Link to="/laws/case-study">Cases</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">Incident response flow</span>
        <h1>Report Cybercrime Without Losing Evidence</h1>
        <p className="lead">
          Follow a clean reporting sequence: stabilize harm, preserve proof, notify banks or platforms,
          submit official reports, and track escalation.
        </p>
      </section>

      <section className="section-block">
        <div className="flow-grid">
          <article className="flow-step" data-flow-step>
            <strong>1</strong>
            <h3>Freeze exposure</h3>
            <p>Disconnect suspicious sessions, change passwords, block cards, and stop further transfer.</p>
          </article>
          <article className="flow-step" data-flow-step>
            <strong>2</strong>
            <h3>Capture evidence</h3>
            <p>Save screenshots, URLs, transaction IDs, caller numbers, emails, and timestamps.</p>
          </article>
          <article className="flow-step" data-flow-step>
            <strong>3</strong>
            <h3>Notify channel</h3>
            <p>Contact bank, wallet, platform, employer, or school depending on the incident.</p>
          </article>
          <article className="flow-step" data-flow-step>
            <strong>4</strong>
            <h3>File report</h3>
            <p>Use the national cybercrime portal or local cyber police station with your evidence kit.</p>
          </article>
          <article className="flow-step" data-flow-step>
            <strong>5</strong>
            <h3>Track and update</h3>
            <p>Record complaint IDs, add new evidence, and follow official escalation routes.</p>
          </article>
        </div>
      </section>

      <section className="section-block report-kit">
        <div className="progress-panel">
          <h2>Evidence Readiness</h2>
          <div className="progress-track">
            <div className="progress-fill" data-report-fill></div>
          </div>
          <p data-report-score>0/6 ready</p>
          <div className="checklist">
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Screenshot or screen recording with visible date, handle, URL, or transaction detail.</span>
            </label>
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Phone numbers, email IDs, profile links, UPI IDs, wallet IDs, or bank references.</span>
            </label>
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Transaction ID, amount, account, card, wallet, or merchant reference.</span>
            </label>
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Short incident timeline from first contact to latest action.</span>
            </label>
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Device logs, app names, downloaded files, or suspicious links.</span>
            </label>
            <label className="check-item">
              <input type="checkbox" data-report-check />
              <span>Complaint ID and acknowledgement after submission.</span>
            </label>
          </div>
        </div>

        <aside className="hotline-card">
          <strong>1930</strong>
          <p>
            Emergency helpline for financial cyber fraud in India. For other incidents, use the national cybercrime portal and local police channels.
          </p>
          <Link className="law-btn primary" to="/laws/penalties">
            Review offence severity
          </Link>
        </aside>
      </section>
    </main>
  );
}
