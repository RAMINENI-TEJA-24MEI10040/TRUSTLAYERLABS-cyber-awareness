import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';
import './css/challenge.css';

export default function Challenge() {
  useQrPage(['./js/scams.js', './js/qr.js', './js/challenge.js'], 'Safe or Scam Challenge | CyberShield', {
    'data-challenge-page': '',
  });

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
            <Link to="/qr/challenge" className="active">Challenge</Link>
            <Link to="/qr/case-study">Case Study</Link>
            <Link to="/qr/awareness">Awareness</Link>
            <Link to="/qr/report">Report</Link>
          </div>
        </div>
      </nav>

      <main className="qr-shell">
        <section className="qr-page-intro">
          <div className="qr-kicker">Safe or Scam?</div>
          <h1>Decision challenge</h1>
          <p className="qr-copy">Judge QR payment flows under pressure. Correct decisions award XP, streak bonuses, achievements, and a final readiness modal.</p>
        </section>

        <section className="challenge-layout">
          <article className="qr-card challenge-stage">
            <div className="qr-section-head">
              <span className="qr-chip">Question <span data-question-number>1</span>/<span data-question-total>5</span></span>
              <span className="qr-xp">XP <span data-qr-xp>0</span></span>
            </div>
            <div className="qr-progress"><div className="qr-progress-fill" data-challenge-progress></div></div>
            <div className="scenario-card">
              <div className="scenario-preview">
                <div className="scenario-meta">
                  <span className="qr-chip red">QR flow</span>
                  <span className="qr-chip">UPI awareness</span>
                </div>
                <h2 data-question-title></h2>
                <p data-question-context></p>
              </div>
              <div className="choice-row">
                <button className="qr-button choice-button safe" data-answer="safe">Safe</button>
                <button className="qr-button choice-button scam" data-answer="scam">Scam</button>
              </div>
              <div className="feedback-panel" data-feedback></div>
              <div className="qr-actions">
                <button className="qr-button primary" data-next-question>Next signal</button>
                <button className="qr-button" data-restart-challenge>Restart</button>
              </div>
            </div>
          </article>

          <aside className="challenge-side">
            <article className="qr-card">
              <h3>Score system</h3>
              <div className="score-stack">
                <div className="mini-stat"><span>Score</span><strong data-score>0</strong></div>
                <div className="mini-stat"><span>Streak</span><strong data-streak>0</strong></div>
                <div className="mini-stat"><span>Accuracy</span><strong data-accuracy>0%</strong></div>
                <div className="mini-stat"><span>Total XP</span><strong data-qr-xp>0</strong></div>
              </div>
            </article>
            <article className="qr-card law-tip">
              <h3>Indian cyber law tip</h3>
              <p data-law-tip></p>
            </article>
          </aside>
        </section>
      </main>

      <div className="qr-modal" data-result-modal>
        <div className="qr-modal-card">
          <h2 data-modal-title>Final results</h2>
          <div data-modal-body></div>
          <div className="qr-modal-actions">
            <button className="qr-button primary" data-close-modal type="button">Continue training</button>
          </div>
        </div>
      </div>
    </div>
  );
}
