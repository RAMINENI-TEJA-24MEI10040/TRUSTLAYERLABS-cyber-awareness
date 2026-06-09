import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/laws.css";
import { useLawsPage } from "./useLawsPage";

export default function Penalties() {
  const { t } = useTranslation();
  useLawsPage("penalties");
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
          <Link to="/laws/it-act">{t('cyberLawsPage.legacyNav.itAct', 'IT Act')}</Link>
          <Link to="/reporting">{t('cyberLawsPage.legacyNav.reporting', 'Reporting')}</Link>
          <Link className="active" to="/laws/penalties">
            {t('cyberLawsPage.legacyNav.penalties', 'Penalties')}
          </Link>
        </div>
      </nav>

      <section className="hero-panel">
        <span className="eyebrow">{t('cyberLawsPage.legacyPages.penalties.eyebrow', 'Penalty intelligence')}</span>
        <h1>{t('cyberLawsPage.legacyPages.penalties.title', 'Punishment and Penalty Cards')}</h1>
        <p className="lead">
          {t('cyberLawsPage.legacyPages.penalties.lead', 'Scan common cyber offence categories, likely legal tracks, and severity signals. Exact punishment depends on facts, applicable law, and investigation.')}
        </p>
      </section>

      <section className="section-block">
        <div className="search-panel">
          <input
            className="law-search"
            type="search"
            placeholder={t('cyberLawsPage.legacyPages.penalties.searchPlaceholder', 'Search fraud, identity, privacy, obscene, malware...')}
            data-law-search="[data-penalty-card]"
          />
          <div className="chip-row">
            <Link className="chip" to="/laws/case-study">
              {t('cyberLawsPage.legacyPages.penalties.chips.cases', 'Practice cases')}
            </Link>
          </div>
        </div>

        <div className="penalty-grid">
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">66C</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.identity.title', 'Identity theft')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.identity.desc', 'Fraudulent use of passwords, signatures, OTPs, or identity features. Preserve account logs and impersonation proof.')}</p>
          </article>
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">66D</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.personation.title', 'Cheating by personation')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.personation.desc', 'Fake support, fake profiles, phishing, and deception through communication devices.')}</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">66E</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.privacy.title', 'Privacy violation')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.privacy.desc', 'Capturing or sharing private images without consent. Escalate fast and request takedown.')}</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">67</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.obscene.title', 'Obscene content')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.obscene.desc', 'Publication or transmission of obscene or sexually explicit material can trigger serious penalties.')}</p>
          </article>
          <article className="penalty-card" data-penalty-card>
            <span className="card-code">43/66</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.unauthorized.title', 'Unauthorized access')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.unauthorized.desc', 'Hacking, malware, account compromise, data extraction, or system damage.')}</p>
          </article>
          <article className="penalty-card danger" data-penalty-card>
            <span className="card-code">BNS/IPC</span>
            <h3>{t('cyberLawsPage.legacyPages.penalties.cards.threat.title', 'Threat and extortion')}</h3>
            <p>{t('cyberLawsPage.legacyPages.penalties.cards.threat.desc', 'Blackmail, doxxing threats, intimidation, and coercive demands may involve criminal intimidation and extortion tracks.')}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
