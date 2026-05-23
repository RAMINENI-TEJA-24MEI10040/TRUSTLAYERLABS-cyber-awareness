import { Link } from "react-router-dom";
import "./css/laws.css";
import "./js/laws.js";

export default function Rights() {
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
          <Link className="active" to="/laws/rights">
            Rights
          </Link>
          <Link to="/laws/awareness">Awareness</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">Citizen rights layer</span>
        <h1>Know Your Digital Rights</h1>
        <p className="lead">
          A practical rights console for cybercrime victims, students, employees, creators, and everyday internet users.
        </p>
      </section>

      <section className="section-block">
        <div className="card-grid">
          <article className="law-card">
            <span className="card-code">PRIVACY</span>
            <h3>Right to privacy</h3>
            <p>You can object to unauthorized capture, publication, or misuse of private information and intimate images.</p>
          </article>
          <article className="law-card">
            <span className="card-code">EVIDENCE</span>
            <h3>Right to preserve proof</h3>
            <p>You can document threats and fraud without engaging with the offender or destroying the trail.</p>
          </article>
          <article className="law-card">
            <span className="card-code">REPORT</span>
            <h3>Right to report</h3>
            <p>Victims can approach cyber police, local police, helplines, portals, banks, platforms, and institutional authorities.</p>
          </article>
          <article className="law-card danger">
            <span className="card-code">SAFETY</span>
            <h3>Right to protection</h3>
            <p>Threats, extortion, stalking, doxxing, and sexual harassment should be escalated quickly and safely.</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="accordion-list">
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Victim care</span>What should I avoid after an incident? <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Avoid paying extortion, deleting evidence, forwarding abusive content widely, or publicly naming suspects before formal reporting.
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Platforms</span>Can I ask for takedown? <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Yes. Use platform reporting tools for impersonation, abuse, non-consensual content, and fraud pages while keeping proof of the report.
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
