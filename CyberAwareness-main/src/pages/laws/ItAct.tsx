import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/laws.css";
import { LawsUI } from "./js/laws.js";
import { SectionExplorer } from "./js/ipc.js";

export default function ItAct() {
  useEffect(() => {
    try { LawsUI.init(); } catch (e) {}
    try { SectionExplorer.init(); } catch (e) {}
  }, []);
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
          <Link to="/laws/ipc">IPC</Link>
          <Link to="/laws/bns">BNS</Link>
          <Link className="active" to="/laws/it-act">
            IT Act
          </Link>
          <Link to="/laws/reporting">Reporting</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">IT Act control layer</span>
        <h1>Information Technology Act Matrix</h1>
        <p className="lead">
          Search practical IT Act anchors for unauthorized access, identity theft, privacy breach, obscene material,
          protected systems, and intermediary response.
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder="Search section, offence, evidence..."
            data-law-search="[data-accordion]"
          />
          <div className="chip-row">
            <Link className="chip" to="/laws/reporting">
              Report incident
            </Link>
            <Link className="chip" to="/laws/penalties">
              See penalties
            </Link>
          </div>
        </div>

        <div className="accordion-list">
          <article className="accordion open" data-accordion>
            <button className="accordion-button">
              <span>Sec 43 / 66</span>Unauthorized access and damage <b className="accordion-icon">-</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Use for unauthorized access, data extraction, malware, denial of service, account compromise, and system damage.
                Preserve logs, IP traces, device images, and timestamps.
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66C</span>Identity theft <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Applies to fraudulent use of passwords, digital signatures, usernames, OTPs, or other unique identification features.
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66D</span>Cheating by personation <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Relevant for fake support agents, spoofed profiles, romance scams, job scams, marketplace impersonation, and payment redirection.
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66E</span>Privacy violation <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Covers capture, publication, or transmission of private images in violation of privacy expectations.
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 67 series</span>Obscene and sexually explicit material <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                Used for publication or transmission of obscene, sexually explicit, or child sexual abuse material,
                with serious escalation requirements.
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
