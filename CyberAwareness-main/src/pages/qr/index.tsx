import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';

export default function QRHome() {
  useQrPage(['./js/scams.js', './js/qr.js'], 'QR Threat Lab | CyberShield');

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
            <Link to="/qr" className="active">Dashboard</Link>
            <Link to="/qr/scanner">Scanner</Link>
            <Link to="/qr/challenge">Challenge</Link>
            <Link to="/qr/case-study">Case Study</Link>
            <Link to="/qr/awareness">Awareness</Link>
            <Link to="/qr/report">Report</Link>
          </div>
        </div>
      </nav>

      <main className="qr-shell">
        <section className="qr-hero">
          <div>
            <div className="qr-kicker">SOC module online</div>
            <h1 className="qr-title">QR Scam <span>Simulator</span></h1>
            <p className="qr-copy">Train against realistic QR payment fraud, fake UPI redirects, tampered stickers, and phishing pages. Inspect indicators, earn XP, and build a habit of verifying before paying.</p>
            <div className="qr-actions">
              <Link to="/qr/scanner" className="qr-button primary">Launch scanner</Link>
              <Link to="/qr/challenge" className="qr-button danger">Play Safe or Scam</Link>
            </div>
          </div>
          <div className="qr-terminal">
            <div className="qr-terminal-bar">
              <span className="qr-dot red"></span>
              <span className="qr-dot amber"></span>
              <span className="qr-dot green"></span>
              <span className="qr-chip">terminal / qr-intel</span>
            </div>
            <div className="qr-terminal-body">
              <div><span className="qr-log-cmd">$ scan --module qr-fraud</span></div>
              <div className="qr-log-ok">UPI redirect detector loaded</div>
              <div className="qr-log-warn">Public sticker tampering patterns indexed</div>
              <div className="qr-log-bad">Fake refund collect request signatures active</div>
              <div><span className="qr-log-cmd">$ xp --current</span> <span className="qr-xp" data-qr-xp>0</span></div>
            </div>
          </div>
        </section>

        <section className="qr-section">
          <div className="qr-grid">
            <article className="qr-card qr-stat">
              <div>
                <span className="qr-eyebrow">XP earned</span>
                <span className="qr-stat-value" data-qr-xp>0</span>
              </div>
              <span className="qr-chip">local profile</span>
            </article>
            <article className="qr-card qr-stat">
              <div>
                <span className="qr-eyebrow">Scans run</span>
                <span className="qr-stat-value" data-qr-scans>0</span>
              </div>
              <span className="qr-chip">simulated</span>
            </article>
            <article className="qr-card qr-stat">
              <div>
                <span className="qr-eyebrow">Scams detected</span>
                <span className="qr-stat-value" data-qr-detected>0</span>
              </div>
              <span className="qr-chip red">watchlist</span>
            </article>
          </div>
        </section>

        <section className="qr-section">
          <div className="qr-section-head">
            <div>
              <h2>Training routes</h2>
              <p className="qr-copy">Each route keeps the same neon SOC interface and reuses the QR score engine.</p>
            </div>
            <span className="qr-chip">progressive lab</span>
          </div>
          <div className="qr-grid">
            <Link to="/qr/scanner" className="qr-card">
              <span className="qr-chip red">simulation</span>
              <h3>Realistic QR scam simulator</h3>
              <p>Scan metro refunds, parking fines, charity posters, and cafe menus. Open indicators to learn what makes a QR dangerous.</p>
              <div className="qr-progress"><div className="qr-progress-fill" data-progress="72"></div></div>
            </Link>
            <Link to="/qr/challenge" className="qr-card">
              <span className="qr-chip">interactive</span>
              <h3>Safe or Scam challenge</h3>
              <p>Make rapid calls on UPI prompts and QR destinations. Final results show accuracy and readiness.</p>
              <div className="qr-progress"><div className="qr-progress-fill" data-progress="48"></div></div>
            </Link>
            <Link to="/qr/awareness" className="qr-card">
              <span className="qr-chip">law tips</span>
              <h3>Awareness and Indian cyber law</h3>
              <p>Learn how to report QR fraud, preserve evidence, and recognize IT Act sections commonly applied to online cheating.</p>
              <div className="qr-progress"><div className="qr-progress-fill" data-progress="64"></div></div>
            </Link>
            <Link to="/qr/case-study" className="qr-card">
              <span className="qr-chip">cases</span>
              <h3>QR fraud case study</h3>
              <p>Walk through a realistic incident timeline and practice spotting the decision points that matter.</p>
              <div className="qr-progress"><div className="qr-progress-fill" data-progress="54"></div></div>
            </Link>
            <Link to="/qr/report" className="qr-card">
              <span className="qr-chip red">response</span>
              <h3>Incident report guide</h3>
              <p>Collect transaction IDs, screenshots, URLs, and timestamps before escalation.</p>
              <div className="qr-progress"><div className="qr-progress-fill" data-progress="68"></div></div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="qr-footer">
        <div className="qr-shell">CyberShield QR module | Verify destination, payee, amount, and intent before approving.</div>
      </footer>
    </div>
  );
}
