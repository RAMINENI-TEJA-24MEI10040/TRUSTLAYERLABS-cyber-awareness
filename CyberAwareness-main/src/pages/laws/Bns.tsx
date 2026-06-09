import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import "./css/ipc.css";
import { SectionExplorer } from "./js/ipc.js";
import { useLawsPage } from "./useLawsPage";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `law-tab ${isActive ? "law-tab-active" : "law-tab-inactive"}`;

export default function Bns() {
  const { t } = useTranslation();
  useLawsPage("bns");
  useEffect(() => {
    try { SectionExplorer.init(); } catch { /* optional */ }
  }, []);

  return (
    <main className="law-shell">
      <nav className="law-nav">
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
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.bns.eyebrow', 'BNS active map')}</span>
        <h1>{t('cyberLawsPage.legacyPages.bns.title', 'Bharatiya Nyaya Sanhita Explorer')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.bns.lead', 'Map cyber incidents to modern offence families: cheating, forgery, criminal intimidation, organized crime, sexual harassment, and identity-linked misconduct.')}
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder={t('cyberLawsPage.legacyPages.bns.searchPlaceholder', 'Search BNS topic, harm, section family...')}
            data-law-search="[data-section-card], [data-accordion]"
          />
          <div className="chip-row" data-filter-group="[data-section-card]">
            <button className="chip active" data-filter="all">
              {t('cyberLawsPage.legacyPages.bns.chips.all', 'All')}
            </button>
            <button className="chip" data-filter="fraud">
              {t('cyberLawsPage.legacyPages.bns.chips.fraud', 'Fraud')}
            </button>
            <button className="chip" data-filter="harassment">
              {t('cyberLawsPage.legacyPages.bns.chips.harassment', 'Harassment')}
            </button>
            <button className="chip" data-filter="threat">
              {t('cyberLawsPage.legacyPages.bns.chips.threat', 'Threat')}
            </button>
          </div>
        </div>

        <div className="explorer-layout">
          <div className="section-map">
            <button className="section-node" data-category="fraud" data-section-card="bns-cheat">
              <strong>{t('cyberLawsPage.legacyPages.bns.map.cheat.title', 'Cheating family')}</strong>
              <span>{t('cyberLawsPage.legacyPages.bns.map.cheat.desc', 'Online deception, fake platforms, payment traps.')}</span>
            </button>
            <button className="section-node" data-category="fraud" data-section-card="bns-forgery">
              <strong>{t('cyberLawsPage.legacyPages.bns.map.forgery.title', 'Forgery family')}</strong>
              <span>{t('cyberLawsPage.legacyPages.bns.map.forgery.desc', 'Fake records, fabricated proof, identity documents.')}</span>
            </button>
            <button className="section-node" data-category="threat" data-section-card="bns-threat">
              <strong>{t('cyberLawsPage.legacyPages.bns.map.threat.title', 'Intimidation family')}</strong>
              <span>{t('cyberLawsPage.legacyPages.bns.map.threat.desc', 'Cyber blackmail, doxxing threats, coercion.')}</span>
            </button>
            <button className="section-node" data-category="harassment" data-section-card="bns-harass">
              <strong>{t('cyberLawsPage.legacyPages.bns.map.harass.title', 'Harassment and stalking contexts')}</strong>
              <span>{t('cyberLawsPage.legacyPages.bns.map.harass.desc', 'Sexual harassment, stalking, image abuse contexts.')}</span>
            </button>
          </div>

          <div className="accordion-list">
            <article className="accordion" id="bns-cheat" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyNav.bns', 'BNS')}</span>{t('cyberLawsPage.legacyPages.bns.accordions.cheat.title', 'Cheating through digital channels')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.bns.accordions.cheat.desc', 'Use for dishonest inducement in online investments, job scams, marketplace fraud, support impersonation, and payment manipulation.')}
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-forgery" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyNav.bns', 'BNS')}</span>{t('cyberLawsPage.legacyPages.bns.accordions.forgery.title', 'Forgery and false records')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.bns.accordions.forgery.desc', 'Relevant when screenshots, IDs, signatures, invoices, certificates, or electronic records are fabricated or used as genuine.')}
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-threat" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyNav.bns', 'BNS')}</span>{t('cyberLawsPage.legacyPages.bns.accordions.threat.title', 'Criminal intimidation')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.bns.accordions.threat.desc', 'Covers threats to reputation, body, property, family, or livelihood delivered through chats, calls, posts, and emails.')}
                </div>
              </div>
            </article>
            <article className="accordion" id="bns-harass" data-accordion>
              <button className="accordion-button">
                <span>{t('cyberLawsPage.legacyNav.bns', 'BNS')}</span>{t('cyberLawsPage.legacyPages.bns.accordions.harass.title', 'Harassment and stalking contexts')} <b className="accordion-icon">+</b>
              </button>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  {t('cyberLawsPage.legacyPages.bns.accordions.harass.desc', 'Useful for repeated unwanted contact, sexualized threats, and stalking behavior alongside IT Act provisions.')}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
