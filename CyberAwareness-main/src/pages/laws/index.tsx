import { Link } from "react-router-dom";
import "./css/laws.css";
import "./js/laws.js";

export default function LawsDashboard() {
  return (
    <main className="law-shell">
      <nav className="law-nav" aria-label="Cyber law navigation">
        <Link className="brand-link" to="/laws/dashboard">
          <span className="brand-mark">CL</span>Cyber Law SOC
        </Link>
        <div className="law-links">
          <Link className="dashboard-link" to="/">
            Back to Dashboard
          </Link>
          <Link className="active" to="/laws/dashboard">
            Dashboard
          </Link>
          <Link to="/laws/ipc">IPC</Link>
          <Link to="/laws/bns">BNS</Link>
          <Link to="/laws/it-act">IT Act</Link>
          <Link to="/laws/reporting">Reporting</Link>
          <Link to="/laws/rights">Rights</Link>
          <Link to="/laws/awareness">Awareness</Link>
          <Link to="/laws/penalties">Penalties</Link>
          <Link to="/laws/case-study">Cases</Link>
        </div>
      </nav>

      <section className="hero-grid">
        <div className="hero-panel">
          <div>
            <span className="eyebrow">Legal threat intelligence online</span>
            <h1>Cyber Law Command Dashboard</h1>
            <p className="lead">
              Explore Indian cyber law pathways through a SOC-style interface with searchable sections, reporting workflows, penalties, rights,
              awareness tips, and case-response drills.
            </p>
            <div className="hero-actions">
              <Link className="law-btn primary" to="/laws/ipc">
                Explore sections
              </Link>
              <Link className="law-btn danger" to="/laws/reporting">
                Start report flow
              </Link>
            </div>
          </div>

          <div className="progress-panel">
            <strong>Training progress</strong>
            <div className="progress-track">
              <div className="progress-fill" data-progress-fill></div>
            </div>
            <span data-progress-text>0/9 modules</span>
          </div>
        </div>

        <aside className="soc-panel">
          <div className="soc-header">
            <h2>SOC Terminal</h2>
            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="terminal" aria-label="Cyber law terminal">
            <div className="terminal-line">&gt; loading legal response matrix...</div>
            <div className="terminal-line">&gt; IPC legacy references: <strong>indexed</strong></div>
            <div className="terminal-line">&gt; BNS updates: <strong>mapped</strong></div>
            <div className="terminal-line">&gt; IT Act controls: <strong>active</strong></div>
            <div className="terminal-line">&gt; citizen reporting mode: <strong>ready</strong></div>
          </div>
        </aside>
      </section>

      <section className="metric-grid" aria-label="Cyber law stats">
        <article className="metric-card">
          <span>Response target</span>
          <span className="metric-value" data-count="24" data-suffix="h">0h</span>
          <p>Report financial cyber fraud quickly for better fund tracing.</p>
        </article>
        <article className="metric-card">
          <span>Core tracks</span>
          <span className="metric-value" data-count="9">0</span>
          <p>Dashboard, IPC, BNS, IT Act, reporting, rights, cases, awareness, penalties.</p>
        </article>
        <article className="metric-card">
          <span>Evidence kit</span>
          <span className="metric-value" data-count="6">0</span>
          <p>URLs, screenshots, headers, transaction IDs, device logs, timelines.</p>
        </article>
        <article className="metric-card">
          <span>Risk zones</span>
          <span className="metric-value" data-count="7">0</span>
          <p>Fraud, stalking, identity theft, privacy breach, extortion, malware, data leak.</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <h2>Mission Modules</h2>
            <p>Choose a station and build a practical legal response map.</p>
          </div>
        </div>
        <div className="card-grid">
          <Link className="law-card" to="/laws/ipc">
            <span className="card-code">IPC</span>
            <h3>Legacy Section Explorer</h3>
            <p>Search key IPC provisions that still appear in older FIRs, references, and case materials.</p>
          </Link>
          <Link className="law-card" to="/laws/bns">
            <span className="card-code">BNS</span>
            <h3>New Code Mapping</h3>
            <p>Understand how modern cyber offences connect to the Bharatiya Nyaya Sanhita.</p>
          </Link>
          <Link className="law-card" to="/laws/it-act">
            <span className="card-code">IT</span>
            <h3>Information Technology Act</h3>
            <p>Review privacy, identity, obscene content, hacking, and intermediary duties.</p>
          </Link>
          <Link className="law-card danger" to="/laws/penalties">
            <span className="card-code">PENALTY</span>
            <h3>Punishment Cards</h3>
            <p>Scan offence types, consequences, and escalation triggers.</p>
          </Link>
          <Link className="law-card" to="/laws/rights">
            <span className="card-code">RIGHTS</span>
            <h3>Citizen Rights</h3>
            <p>Review practical rights, evidence preservation, and support options after a cyber incident.</p>
          </Link>
          <Link className="law-card" to="/laws/awareness">
            <span className="card-code">AWARE</span>
            <h3>Awareness Briefing</h3>
            <p>Learn everyday legal awareness habits for safer reporting, response, and online conduct.</p>
          </Link>
          <Link className="law-card" to="/laws/case-study">
            <span className="card-code">CASES</span>
            <h3>Case Response Drills</h3>
            <p>Practice choosing sections, evidence paths, and reporting steps from realistic incident stories.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
