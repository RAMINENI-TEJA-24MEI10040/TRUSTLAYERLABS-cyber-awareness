import { Link } from "react-router-dom";
import "./css/laws.css";
import "./js/laws.js";

export default function Awareness() {
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
          <Link to="/laws/dashboard">Dashboard</Link>
          <Link to="/laws/rights">Rights</Link>
          <Link className="active" to="/laws/awareness">
            Awareness
          </Link>
          <Link to="/laws/reporting">Reporting</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">Awareness shield</span>
        <h1>Prevention Tips With Legal Readiness</h1>
        <p className="lead">
          Good cyber hygiene is also good evidence hygiene. These tips help reduce risk and keep response options open.
        </p>
      </section>

      <section className="section-block">
        <div className="tips-grid">
          <article className="law-card">
            <span className="card-code">OTP</span>
            <h3>Never share OTPs</h3>
            <p>No bank, police, delivery agent, or support desk should ask for OTPs, PINs, or screen-share access.</p>
          </article>
          <article className="law-card">
            <span className="card-code">LOGS</span>
            <h3>Keep the trail</h3>
            <p>Do not delete messages, call logs, emails, app names, or URLs after a cyber incident.</p>
          </article>
          <article className="law-card">
            <span className="card-code">VERIFY</span>
            <h3>Verify channels</h3>
            <p>Use official websites, verified app stores, known customer care numbers, and direct institution portals.</p>
          </article>
          <article className="law-card danger">
            <span className="card-code">EXTORTION</span>
            <h3>Do not negotiate alone</h3>
            <p>For blackmail, intimate image threats, or doxxing, preserve evidence and involve trusted support quickly.</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="timeline">
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>Before</h3>
              <p>Use password managers, MFA, privacy settings, and trusted contacts for account recovery.</p>
            </div>
          </article>
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>During</h3>
              <p>Stop interaction, capture proof, isolate accounts, and notify banks or platforms immediately.</p>
            </div>
          </article>
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>After</h3>
              <p>File reports, monitor accounts, update evidence, and seek institutional or legal support where needed.</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
