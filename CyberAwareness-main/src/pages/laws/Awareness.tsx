import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import { useLawsPage } from "./useLawsPage";

export default function Awareness() {
  const { t } = useTranslation();
  useLawsPage("awareness");
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
          <Link to="/laws/dashboard">{t('cyberLawsPage.legacyNav.dashboard', 'Dashboard')}</Link>
          <Link to="/laws/rights">{t('cyberLawsPage.legacyNav.rights', 'Rights')}</Link>
          <Link className="active" to="/laws/awareness">
            {t('cyberLawsPage.legacyNav.awareness', 'Awareness')}
          </Link>
          <Link to="/reporting">{t('cyberLawsPage.legacyNav.reporting', 'Reporting')}</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.awareness.eyebrow', 'Awareness shield')}</span>
        <h1>{t('cyberLawsPage.legacyPages.awareness.title', 'Prevention Tips With Legal Readiness')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.awareness.lead', 'Good cyber hygiene is also good evidence hygiene. These tips help reduce risk and keep response options open.')}
        </p>
      </section>

      <section className="section-block">
        <div className="tips-grid">
          <article className="law-card">
            <span className="card-code">OTP</span>
            <h3>{t('cyberLawsPage.legacyPages.awareness.cards.otp.title', 'Never share OTPs')}</h3>
            <p>{t('cyberLawsPage.legacyPages.awareness.cards.otp.desc', 'No bank, police, delivery agent, or support desk should ask for OTPs, PINs, or screen-share access.')}</p>
          </article>
          <article className="law-card">
            <span className="card-code">LOGS</span>
            <h3>{t('cyberLawsPage.legacyPages.awareness.cards.logs.title', 'Keep the trail')}</h3>
            <p>{t('cyberLawsPage.legacyPages.awareness.cards.logs.desc', 'Do not delete messages, call logs, emails, app names, or URLs after a cyber incident.')}</p>
          </article>
          <article className="law-card">
            <span className="card-code">VERIFY</span>
            <h3>{t('cyberLawsPage.legacyPages.awareness.cards.verify.title', 'Verify channels')}</h3>
            <p>{t('cyberLawsPage.legacyPages.awareness.cards.verify.desc', 'Use official websites, verified app stores, known customer care numbers, and direct institution portals.')}</p>
          </article>
          <article className="law-card danger">
            <span className="card-code">EXTORTION</span>
            <h3>{t('cyberLawsPage.legacyPages.awareness.cards.extortion.title', 'Do not negotiate alone')}</h3>
            <p>{t('cyberLawsPage.legacyPages.awareness.cards.extortion.desc', 'For blackmail, intimate image threats, or doxxing, preserve evidence and involve trusted support quickly.')}</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="timeline">
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>{t('cyberLawsPage.legacyPages.awareness.timeline.before.title', 'Before')}</h3>
              <p>{t('cyberLawsPage.legacyPages.awareness.timeline.before.desc', 'Use password managers, MFA, privacy settings, and trusted contacts for account recovery.')}</p>
            </div>
          </article>
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>{t('cyberLawsPage.legacyPages.awareness.timeline.during.title', 'During')}</h3>
              <p>{t('cyberLawsPage.legacyPages.awareness.timeline.during.desc', 'Stop interaction, capture proof, isolate accounts, and notify banks or platforms immediately.')}</p>
            </div>
          </article>
          <article className="timeline-item">
            <span className="timeline-dot"></span>
            <div>
              <h3>{t('cyberLawsPage.legacyPages.awareness.timeline.after.title', 'After')}</h3>
              <p>{t('cyberLawsPage.legacyPages.awareness.timeline.after.desc', 'File reports, monitor accounts, update evidence, and seek institutional or legal support where needed.')}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
