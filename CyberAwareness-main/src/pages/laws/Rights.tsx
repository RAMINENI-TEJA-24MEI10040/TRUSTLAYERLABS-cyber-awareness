import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import { useLawsPage } from "./useLawsPage";

export default function Rights() {
  const { t } = useTranslation();
  useLawsPage("rights");
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
          <Link className="active" to="/laws/rights">
            {t('cyberLawsPage.legacyNav.rights', 'Rights')}
          </Link>
          <Link to="/laws/awareness">{t('cyberLawsPage.legacyNav.awareness', 'Awareness')}</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.rights.eyebrow', 'Citizen rights layer')}</span>
        <h1>{t('cyberLawsPage.legacyPages.rights.title', 'Know Your Digital Rights')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.rights.lead', 'A practical rights console for cybercrime victims, students, employees, creators, and everyday internet users.')}
        </p>
      </section>

      <section className="section-block">
        <div className="card-grid">
          <article className="law-card">
            <span className="card-code">PRIVACY</span>
            <h3>{t('cyberLawsPage.legacyPages.rights.cards.privacy.title', 'Right to privacy')}</h3>
            <p>{t('cyberLawsPage.legacyPages.rights.cards.privacy.desc', 'You can object to unauthorized capture, publication, or misuse of private information and intimate images.')}</p>
          </article>
          <article className="law-card">
            <span className="card-code">EVIDENCE</span>
            <h3>{t('cyberLawsPage.legacyPages.rights.cards.evidence.title', 'Right to preserve proof')}</h3>
            <p>{t('cyberLawsPage.legacyPages.rights.cards.evidence.desc', 'You can document threats and fraud without engaging with the offender or destroying the trail.')}</p>
          </article>
          <article className="law-card">
            <span className="card-code">REPORT</span>
            <h3>{t('cyberLawsPage.legacyPages.rights.cards.report.title', 'Right to report')}</h3>
            <p>{t('cyberLawsPage.legacyPages.rights.cards.report.desc', 'Victims can approach cyber police, local police, helplines, portals, banks, platforms, and institutional authorities.')}</p>
          </article>
          <article className="law-card danger">
            <span className="card-code">SAFETY</span>
            <h3>{t('cyberLawsPage.legacyPages.rights.cards.safety.title', 'Right to protection')}</h3>
            <p>{t('cyberLawsPage.legacyPages.rights.cards.safety.desc', 'Threats, extortion, stalking, doxxing, and sexual harassment should be escalated quickly and safely.')}</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="accordion-list">
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Victim care</span>{t('cyberLawsPage.legacyPages.rights.accordions.avoid.title', 'What should I avoid after an incident?')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.rights.accordions.avoid.desc', 'Avoid paying extortion, deleting evidence, forwarding abusive content widely, or publicly naming suspects before formal reporting.')}
              </div>
            </div>
          </article>
          <article className="accordion" data-accordion>
            <button className="accordion-button">
              <span>Platforms</span>{t('cyberLawsPage.legacyPages.rights.accordions.takedown.title', 'Can I ask for takedown?')} <b className="accordion-icon">+</b>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                {t('cyberLawsPage.legacyPages.rights.accordions.takedown.desc', 'Yes. Use platform reporting tools for impersonation, abuse, non-consensual content, and fraud pages while keeping proof of the report.')}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
