import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/laws.css";
import "./css/ipc.css";
import { SectionExplorer } from "./js/ipc.js";
import { useLawsPage } from "./useLawsPage";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `law-tab ${isActive ? "law-tab-active" : "law-tab-inactive"}`;

export default function Ipc() {
  useLawsPage("ipc");
  useEffect(() => {
    try { SectionExplorer.init(); } catch { /* optional */ }
  }, []);
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
          <NavLink to="/laws/ipc" className={tabLinkClass}>
            IPC
          </NavLink>
          <NavLink to="/laws/bns" className={tabLinkClass}>
            BNS
          </NavLink>
          <NavLink to="/laws/it-act" className={tabLinkClass}>
            IT Act
          </NavLink>
          <NavLink to="/laws/reporting" className={tabLinkClass}>
            Reporting
          </NavLink>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">IPC legacy explorer</span>
        <h1>Indian Penal Code Cyber Links</h1>
        <p className="lead">
          Use this searchable explorer for older references, FIR language, and cyber-adjacent offences such as cheating, forgery,
          defamation, intimidation, and obscenity.
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder="Search IPC section, offence, keyword..."
            data-law-search="[data-section-card], [data-accordion]"
            data-empty-target="#ipc-empty"
          />
          <div className="chip-row" data-filter-group="[data-section-card]">
            <button className="chip active" data-filter="all">
              All
            </button>
            <button className="chip" data-filter="fraud">
              Fraud
            </button>
            <button className="chip" data-filter="speech">
              Speech
            </button>
            <button className="chip" data-filter="safety">
              Safety
            </button>
          </div>
        </div>
        <p id="ipc-empty" hidden>
          No matching IPC signal found.
        </p>

        <div className="explorer-layout">
          <div className="section-map">
            <button className="section-node" data-category="fraud" data-section-card="ipc-420">
              <strong>IPC 420</strong>
              <span>Cheating and dishonestly inducing delivery of property.</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="ipc-468">
              <strong>IPC 468</strong>
              <span>Forgery for purpose of cheating.</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="ipc-471">
              <strong>IPC 471</strong>
              <span>Using forged electronic or physical records as genuine.</span>
            </button>
            <button className="section-node" data-category="speech" data-section-card="ipc-499">
              <strong>IPC 499/500</strong>
              <span>Defamation through harmful publication.</span>
            </button>
            <button className="section-node" data-category="safety" data-section-card="ipc-503">
              <strong>IPC 503/506</strong>
              <span>Criminal intimidation, threats, extortion pressure.</span>
            </button>
          </div>

          <div className="accordion-list">
            <article className="accordion" id="ipc-420" data-accordion>
              <button className="accordion-button">
                <span>IPC 420</span>Cheating online <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Commonly referenced for cyber fraud, marketplace scams, fake investment portals, and social engineering that causes wrongful loss.
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 420">
                      Copy section
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-468" data-accordion>
              <button className="accordion-button">
                <span>IPC 468</span>Forgery for cheating <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Applies when forged documents, identities, screenshots, emails, or records are created to deceive a victim or organization.
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 468">
                      Copy section
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-471" data-accordion>
              <button className="accordion-button">
                <span>IPC 471</span>Using forged records <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Useful when a forged record is presented as genuine, including fake KYC, payment proof, or doctored communication.
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 471">
                      Copy section
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-499" data-accordion>
              <button className="accordion-button">
                <span>IPC 499/500</span>Defamation <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  May arise in reputational attacks, false posts, impersonation campaigns, or targeted harmful publication.
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 499/500">
                      Copy section
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-503" data-accordion>
              <button className="accordion-button">
                <span>IPC 503/506</span>Threats and intimidation <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Relevant to extortion threats, doxxing threats, blackmail messages, and coercive online intimidation.
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 503/506">
                      Copy section
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
