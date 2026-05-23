import { Link } from "react-router-dom";
import "./css/laws.css";
import "./js/laws.js";

export default function Penalties() {
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
          <Link to="/laws/reporting">Reporting</Link>
          <Link className="active" to="/laws/penalties">
            Penalties
          </Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">Penalty intelligence</span>
        <h1>Punishment and Penalty Cards</h1>
        <p className="lead">
          Scan common cyber offence categories, likely legal tracks, and severity signals. Exact punishment depends on facts,
          applicable law, and investigation.
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder="Search fraud, identity, privacy, obscene, malware..."
            data-law-search="[data-penalty-card]"
          />
          <div className="chip-row">
            <Link className="chip" to="/laws/case-study">
              Practice cases
            </Link>
          </div>
        </div>

        <div className="penalty-grid">
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">66C</span>
            <h3>Identity theft</h3>
            <p>Fraudulent use of passwords, signatures, OTPs, or identity features. Preserve account logs and impersonation proof.</p>
          </article>
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">66D</span>
            <h3>Cheating by personation</h3>
            <p>Fake support, fake profiles, phishing, and deception through communication devices.</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">66E</span>
            <h3>Privacy violation</h3>
            <p>Capturing or sharing private images without consent. Escalate fast and request takedown.</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">67</span>
            <h3>Obscene content</h3>
            <p>Publication or transmission of obscene or sexually explicit material can trigger serious penalties.</p>
          </article>
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">43/66</span>
            <h3>Unauthorized access</h3>
            <p>Hacking, malware, account compromise, data extraction, or system damage.</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">BNS/IPC</span>
            <h3>Threat and extortion</h3>
            <p>Blackmail, doxxing threats, intimidation, and coercive demands may involve criminal intimidation and extortion tracks.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
