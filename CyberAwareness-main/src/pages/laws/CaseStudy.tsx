import { Link } from "react-router-dom";
import "./css/laws.css";
import "./js/laws.js";
import "./js/case-study.js";

export default function CaseStudy() {
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
          <Link to="/laws/reporting">Reporting</Link>
          <Link className="active" to="/laws/case-study">
            Cases
          </Link>
          <Link to="/laws/penalties">Penalties</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">Interactive case desk</span>
        <h1>Choose the Legal Response Path</h1>
        <p className="lead">
          Work through realistic cyber incidents and select the safest evidence-first response.
        </p>
      </section>

      <section className="section-block case-console">
        <div className="progress-track">
          <div className="progress-fill" data-case-meter></div>
        </div>
        <div className="case-stage" data-case-stage></div>
        <div className="hero-actions">
          <button className="law-btn primary" data-next-case>
            Next case
          </button>
          <Link className="law-btn" to="/laws/reporting">
            Open report flow
          </Link>
        </div>
      </section>
    </main>
  );
}
