import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';

export default function Report() {
  useQrPage(['./js/scams.js', './js/qr.js'], 'QR Training Report | CyberShield');

  return (
    <div className="qr-body">
      <div className="qr-scanline"></div>
      <nav className="qr-nav">
        <div className="qr-shell qr-nav-inner">
          <Link to="/qr" className="qr-brand">
            <span className="qr-brand-mark">QR</span>
            <span>QR Threat Lab</span>
          </Link>
          <div className="qr-nav-links">
            <Link to="/" className="dashboard-link">Back to Dashboard</Link>
            <Link to="/qr">Dashboard</Link>
            <Link to="/qr/scanner">Scanner</Link>
            <Link to="/qr/challenge">Challenge</Link>
            <Link to="/qr/case-study">Case Study</Link>
            <Link to="/qr/awareness">Awareness</Link>
            <Link to="/qr/report" className="active">Report</Link>
          </div>
        </div>
      </nav>
      <main className="qr-shell">
        <section className="qr-page-intro">
          <div className="qr-kicker">learner report</div>
          <h1>QR readiness report</h1>
          <p className="qr-copy">Your browser stores local module progress for this demo. Use the scanner and challenge pages to update the report.</p>
        </section>
        <section className="qr-grid qr-section">
          <article className="qr-card">
            <span className="qr-eyebrow">Total XP</span>
            <span className="qr-stat-value" data-qr-xp>0</span>
            <div className="qr-progress"><div className="qr-progress-fill" data-progress="78"></div></div>
          </article>
          <article className="qr-card">
            <span className="qr-eyebrow">Scans completed</span>
            <span className="qr-stat-value" data-qr-scans>0</span>
            <div className="qr-progress"><div className="qr-progress-fill" data-progress="56"></div></div>
          </article>
          <article className="qr-card">
            <span className="qr-eyebrow">Correct calls</span>
            <span className="qr-stat-value" data-qr-correct>0</span>
            <div className="qr-progress"><div className="qr-progress-fill" data-progress="64"></div></div>
          </article>
        </section>
        <section className="qr-grid two qr-section">
          <article className="qr-card">
            <h2>Recommended next drills</h2>
            <ul className="qr-list">
              <li>Run the fake refund and parking fine scenarios again.</li>
              <li>Practice reading UPI collect, pay, and mandate screens slowly.</li>
              <li>Review the awareness page before approving any QR payment in public spaces.</li>
            </ul>
          </article>
          <article className="qr-card">
            <h2>Readiness status</h2>
            <p className="qr-copy">A strong QR habit is simple: scan, pause, verify, then approve only when payee, amount, source, and purpose all match.</p>
            <div className="qr-actions">
              <Link to="/qr/challenge" className="qr-button primary">Improve score</Link>
              <Link to="/qr/scanner" className="qr-button">Run scanner</Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
