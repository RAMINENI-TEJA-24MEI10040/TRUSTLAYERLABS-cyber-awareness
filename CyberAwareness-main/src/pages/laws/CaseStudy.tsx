import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import "./js/case-study.js";
import { useLawsPage } from "./useLawsPage";

export default function CaseStudy() {
  const { t } = useTranslation();
  useLawsPage("case-study");
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
          <Link to="/reporting">{t('cyberLawsPage.legacyNav.reporting', 'Reporting')}</Link>
          <Link className="active" to="/laws/case-study">
            {t('cyberLawsPage.legacyNav.cases', 'Cases')}
          </Link>
          <Link to="/laws/penalties">{t('cyberLawsPage.legacyNav.penalties', 'Penalties')}</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.cases.eyebrow', 'Interactive case desk')}</span>
        <h1>{t('cyberLawsPage.legacyPages.cases.title', 'Choose the Legal Response Path')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.cases.lead', 'Work through realistic cyber incidents and select the safest evidence-first response.')}
        </p>
      </section>

      <section className="section-block case-console">
        <div className="progress-track">
          <div className="progress-fill" data-case-meter></div>
        </div>
        <div className="case-stage" data-case-stage></div>
        <div className="hero-actions">
          <button className="law-btn primary" data-next-case>
            {t('cyberLawsPage.legacyPages.cases.nextCase', 'Next case')}
          </button>
          <Link className="law-btn" to="/reporting">
            {t('cyberLawsPage.legacyPages.cases.openFlow', 'Open report flow')}
          </Link>
        </div>
      </section>
    </main>
  );
}
