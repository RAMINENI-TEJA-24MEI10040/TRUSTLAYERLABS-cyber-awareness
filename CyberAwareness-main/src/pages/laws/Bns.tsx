import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/laws.css";
import "./css/ipc.css";
import { LawsUI } from "./js/laws.js";
import { SectionExplorer } from "./js/ipc.js";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `law-tab ${isActive ? "law-tab-active" : "law-tab-inactive"}`;

export default function Bns() {
  useEffect(() => {
    LawsUI.init();
    SectionExplorer.init();
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
        <span className="eyebrow">BNS active map</span>
        <h1>Bharatiya Nyaya Sanhita Explorer</h1>
        <p className="lead">
          Map cyber incidents to modern offence families: cheating, forgery, criminal intimidation, organized crime,
          sexual harassment, and identity-linked misconduct.
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder="Search BNS topic, harm, section family..."
            data-law-search="[data-section-card], [data-accordion]"
          />
          <div className="chip-row" data-filter-group="[data-section-card]">
            <button className="chip active" data-filter="all">
              All
            </button>
            <button className="chip" data-filter="fraud">
              Fraud
            </button>
            <button className="chip" data-filter="harassment">
              Harassment
            </button>
            <button className="chip" data-filter="threat">
              Threat
            </button>
          </div>
        </div>

        <div className="explorer-layout">
          <div className="section-map">
            <button className="section-node" data-category="fraud" data-section-card="bns-cheat">
              <strong>Cheating family</strong>
              <span>Online deception, fake platforms, payment traps.</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="bns-forgery">
              <strong>Forgery family</strong>
              <span>Fake records, fabricated proof, identity documents.</span>
            </button>
            <button className="section-node" data-category="threat" data-section-card="bns-threat">
              <strong>Intimidation family</strong>
              <span>Cyber blackmail, doxxing threats, coercion.</span>
            </button>
            <button className="section-node" data-category="harassment" data-section-card="bns-harass">
              <strong>Harassment and stalking contexts</strong>
              <span>Sexual harassment, stalking, image abuse contexts.</span>
            </button>
          </div>

          <div className="accordion-list">
            <article className="accordion" id="bns-cheat" data-accordion>
              <button className="accordion-button">
                <span>BNS</span>Cheating through digital channels <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Use for dishonest inducement in online investments, job scams, marketplace fraud, support impersonation, and payment manipulation.
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-forgery" data-accordion>
              <button className="accordion-button">
                <span>BNS</span>Forgery and false records <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Relevant when screenshots, IDs, signatures, invoices, certificates, or electronic records are fabricated or used as genuine.
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-threat" data-accordion>
              <button className="accordion-button">
                <span>BNS</span>Criminal intimidation <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Covers threats to reputation, body, property, family, or livelihood delivered through chats, calls, posts, and emails.
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-harass" data-accordion>
              <button className="accordion-button">
                <span>BNS</span>Harassment and stalking contexts <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  Useful for repeated unwanted contact, sexualized threats, and stalking behavior alongside IT Act provisions.
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
