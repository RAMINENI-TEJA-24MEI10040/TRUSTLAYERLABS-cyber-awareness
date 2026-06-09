import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import "./css/ipc.css";
import { SectionExplorer } from "./js/ipc.js";
import { useLawsPage } from "./useLawsPage";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `law-tab ${isActive ? "law-tab-active" : "law-tab-inactive"}`;

export default function Ipc() {
  const { t } = useTranslation();
  useLawsPage("ipc");
  useEffect(() => {
    try { SectionExplorer.init(); } catch { /* optional */ }
  }, []);
  return (
    <main className="law-shell">
      <nav className="law-nav" aria-label="Cyber law navigation">
        <Link className="brand-link" to="/laws/dashboard">
          <span className="brand-mark">CL</span>{t('cyberLawsPage.legacyNav.brand', 'Cyber Law SOC')}
        </Link>
        <div className="law-links">
          <Link className="dashboard-link" to="/">
            {t('cyberLawsPage.legacyNav.backDashboard', 'Back to Dashboard')}
          </Link>
          <NavLink to="/laws/ipc" className={tabLinkClass}>
            {t('cyberLawsPage.legacyNav.ipc', 'IPC')}
          </NavLink>
          <NavLink to="/laws/bns" className={tabLinkClass}>
            {t('cyberLawsPage.legacyNav.bns', 'BNS')}
          </NavLink>
          <NavLink to="/laws/it-act" className={tabLinkClass}>
            {t('cyberLawsPage.legacyNav.itAct', 'IT Act')}
          </NavLink>
          <NavLink to="/reporting" className={tabLinkClass}>
            {t('cyberLawsPage.legacyNav.reporting', 'Reporting')}
          </NavLink>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.ipc.eyebrow', 'IPC legacy explorer')}</span>
        <h1>{t('cyberLawsPage.legacyPages.ipc.title', 'Indian Penal Code Cyber Links')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.ipc.lead', 'Use this searchable explorer for older references, FIR language, and cyber-adjacent offences such as cheating, forgery, defamation, intimidation, and obscenity.')}
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder={t('cyberLawsPage.legacyPages.ipc.searchPlaceholder', 'Search IPC section, offence, keyword...')}
            data-law-search="[data-section-card], [data-accordion]"
            data-empty-target="#ipc-empty"
          />
          <div className="chip-row" data-filter-group="[data-section-card]">
            <button className="chip active" data-filter="all">
              {t('cyberLawsPage.legacyPages.ipc.chips.all', 'All')}
            </button>
            <button className="chip" data-filter="fraud">
              {t('cyberLawsPage.legacyPages.ipc.chips.fraud', 'Fraud')}
            </button>
            <button className="chip" data-filter="speech">
              {t('cyberLawsPage.legacyPages.ipc.chips.speech', 'Speech')}
            </button>
            <button className="chip" data-filter="safety">
              {t('cyberLawsPage.legacyPages.ipc.chips.safety', 'Safety')}
            </button>
          </div>
        </div>
        <p id="ipc-empty" hidden>
          {t('cyberLawsPage.legacyPages.ipc.empty', 'No matching IPC signal found.')}
        </p>

        <div className="explorer-layout">
          <div className="section-map">
            <button className="section-node" data-category="fraud" data-section-card="ipc-420">
              <strong>{t('cyberLawsPage.legacyPages.ipc.map.ipc420.title', 'IPC 420')}</strong>
              <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc420.desc', 'Cheating and dishonestly inducing delivery of property.')}</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="ipc-468">
              <strong>{t('cyberLawsPage.legacyPages.ipc.map.ipc468.title', 'IPC 468')}</strong>
              <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc468.desc', 'Forgery for purpose of cheating.')}</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="ipc-471">
              <strong>{t('cyberLawsPage.legacyPages.ipc.map.ipc471.title', 'IPC 471')}</strong>
              <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc471.desc', 'Using forged electronic or physical records as genuine.')}</span>
            </button>
            <button className="section-node" data-category="speech" data-section-card="ipc-499">
              <strong>{t('cyberLawsPage.legacyPages.ipc.map.ipc499.title', 'IPC 499/500')}</strong>
              <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc499.desc', 'Defamation through harmful publication.')}</span>
            </button>
            <button className="section-node" data-category="safety" data-section-card="ipc-503">
              <strong>{t('cyberLawsPage.legacyPages.ipc.map.ipc503.title', 'IPC 503/506')}</strong>
              <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc503.desc', 'Criminal intimidation, threats, extortion pressure.')}</span>
            </button>
          </div>

          <div className="accordion-list">
            <article className="accordion" id="ipc-420" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc420.title', 'IPC 420')}</span>{t('cyberLawsPage.legacyPages.ipc.accordions.ipc420.title', 'Cheating online')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.ipc.accordions.ipc420.desc', 'Commonly referenced for cyber fraud, marketplace scams, fake investment portals, and social engineering that causes wrongful loss.')}
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 420">
                      {t('cyberLawsPage.legacyPages.ipc.accordions.copyBtn', 'Copy section')}
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-468" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc468.title', 'IPC 468')}</span>{t('cyberLawsPage.legacyPages.ipc.accordions.ipc468.title', 'Forgery for cheating')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.ipc.accordions.ipc468.desc', 'Applies when forged documents, identities, screenshots, emails, or records are created to deceive a victim or organization.')}
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 468">
                      {t('cyberLawsPage.legacyPages.ipc.accordions.copyBtn', 'Copy section')}
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-471" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc471.title', 'IPC 471')}</span>{t('cyberLawsPage.legacyPages.ipc.accordions.ipc471.title', 'Using forged records')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.ipc.accordions.ipc471.desc', 'Useful when a forged record is presented as genuine, including fake KYC, payment proof, or doctored communication.')}
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 471">
                      {t('cyberLawsPage.legacyPages.ipc.accordions.copyBtn', 'Copy section')}
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-499" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc499.title', 'IPC 499/500')}</span>{t('cyberLawsPage.legacyPages.ipc.accordions.ipc499.title', 'Defamation')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.ipc.accordions.ipc499.desc', 'May arise in reputational attacks, false posts, impersonation campaigns, or targeted harmful publication.')}
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 499/500">
                      {t('cyberLawsPage.legacyPages.ipc.accordions.copyBtn', 'Copy section')}
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="accordion" id="ipc-503" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyPages.ipc.map.ipc503.title', 'IPC 503/506')}</span>{t('cyberLawsPage.legacyPages.ipc.accordions.ipc503.title', 'Threats and intimidation')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.ipc.accordions.ipc503.desc', 'Relevant to extortion threats, doxxing threats, blackmail messages, and coercive online intimidation.')}
                  <div className="copy-row">
                    <button className="law-btn" data-copy-section="IPC 503/506">
                      {t('cyberLawsPage.legacyPages.ipc.accordions.copyBtn', 'Copy section')}
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
