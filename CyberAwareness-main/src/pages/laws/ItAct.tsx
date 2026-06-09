import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import { SectionExplorer } from "./js/ipc.js";
import { useLawsPage } from "./useLawsPage";

export default function ItAct() {
  const { t } = useTranslation();
  useLawsPage("it-act");
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
          <Link to="/laws/ipc">{t('cyberLawsPage.legacyNav.ipc', 'IPC')}</Link>
          <Link to="/laws/bns">{t('cyberLawsPage.legacyNav.bns', 'BNS')}</Link>
          <Link className="active" to="/laws/it-act">
            {t('cyberLawsPage.legacyNav.itAct', 'IT Act')}
          </Link>
          <Link to="/reporting">{t('cyberLawsPage.legacyNav.reporting', 'Reporting')}</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.itAct.eyebrow', 'IT Act control layer')}</span>
        <h1>{t('cyberLawsPage.legacyPages.itAct.title', 'Information Technology Act Matrix')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.itAct.lead', 'Search practical IT Act anchors for unauthorized access, identity theft, privacy breach, obscene material, protected systems, and intermediary response.')}
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder={t('cyberLawsPage.legacyPages.itAct.searchPlaceholder', 'Search section, offence, evidence...')}
            data-law-search="[data-accordion]"
          />
          <div className="chip-row">
            <Link className="chip" to="/reporting">
              {t('cyberLawsPage.legacyPages.itAct.chips.report', 'Report incident')}
            </Link>
            <Link className="chip" to="/laws/penalties">
              {t('cyberLawsPage.legacyPages.itAct.chips.penalties', 'See penalties')}
            </Link>
          </div>
        </div>

        <div className="accordion-list">
          <article className="accordion open" data-accordion>
            <button className="accordion-button">
              <span>Sec 43 / 66</span>{t('cyberLawsPage.legacyPages.itAct.accordions.sec43.title', 'Unauthorized access and damage')} <b className="accordion-icon">-</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.itAct.accordions.sec43.desc', 'Use for unauthorized access, data extraction, malware, denial of service, account compromise, and system damage. Preserve logs, IP traces, device images, and timestamps.')}
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66C</span>{t('cyberLawsPage.legacyPages.itAct.accordions.sec66C.title', 'Identity theft')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.itAct.accordions.sec66C.desc', 'Applies to fraudulent use of passwords, digital signatures, usernames, OTPs, or other unique identification features.')}
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66D</span>{t('cyberLawsPage.legacyPages.itAct.accordions.sec66D.title', 'Cheating by personation')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.itAct.accordions.sec66D.desc', 'Relevant for fake support agents, spoofed profiles, romance scams, job scams, marketplace impersonation, and payment redirection.')}
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 66E</span>{t('cyberLawsPage.legacyPages.itAct.accordions.sec66E.title', 'Privacy violation')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.itAct.accordions.sec66E.desc', 'Covers capture, publication, or transmission of private images in violation of privacy expectations.')}
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Sec 67 series</span>{t('cyberLawsPage.legacyPages.itAct.accordions.sec67.title', 'Obscene and sexually explicit material')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.itAct.accordions.sec67.desc', 'Used for publication or transmission of obscene, sexually explicit, or child sexual abuse material, with serious escalation requirements.')}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
