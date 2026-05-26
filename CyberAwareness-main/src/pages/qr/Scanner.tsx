import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';
import './css/scanner.css';

export default function Scanner() {
  useQrPage(['./js/scams.js', './js/qr.js', './js/scanner.js'], 'QR Scanner Simulator | CyberShield', {
    'data-scanner-page': '',
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
            <Link to="/qr/scanner" className="active">Scanner</Link>
            <Link to="/qr/challenge">Challenge</Link>
            <Link to="/qr/case-study">Case Study</Link>
            <Link to="/qr/awareness">Awareness</Link>
            <Link to="/qr/report">Report</Link>
          </div>
        </div>
      </nav>

      <main className="qr-shell">
        <section className="qr-page-intro">
          <div className="qr-kicker">fake payment redirect detection</div>
          <h1>Scanner simulator</h1>
          <p className="qr-copy">Choose a QR scene, inspect the generated payment flow, then click indicators to understand the risk signals.</p>
        </section>

        <section className="scanner-layout">
          <div className="scanner-device">
            <div className="scanner-screen">
              <div className="fake-qr" data-fake-qr aria-label="Simulated QR pattern"></div>
            </div>
            <div className="scanner-controls">
              <h3>Scenario feed</h3>
              <div className="scenario-buttons">
                <button className="qr-button scenario-button danger" data-scenario-id="metro-refund">Metro refund QR</button>
                <button className="qr-button scenario-button" data-scenario-id="cafe-menu">Cafe table menu</button>
                <button className="qr-button scenario-button danger" data-scenario-id="parking-fine">Parking fine notice</button>
                <button className="qr-button scenario-button danger" data-scenario-id="charity-drive">Flood relief donation</button>
              </div>
            </div>
          </div>

          <div className="scan-result">
            <article className="qr-card">
              <div className="qr-section-head">
                <div>
                  <span className="qr-chip" data-scan-verdict>Awaiting scan</span>
                  <h2 data-scan-title>Scenario title</h2>
                </div>
                <span className="qr-xp">XP <span data-qr-xp>0</span></span>
              </div>
              <p><strong>Source:</strong> <span data-scan-source></span></p>
              <p><strong>Destination:</strong> <span className="qr-neon" data-scan-url></span></p>
              <div className="risk-meter">
                <div className="risk-value" data-risk-value>0%</div>
                <div className="qr-progress"><div className="qr-progress-fill" data-risk-fill></div></div>
              </div>
            </article>

            <article className="payment-phone">
              <div className="payment-header"><strong>UPI/payment preview</strong></div>
              <div className="payment-body">
                <p><strong>Merchant:</strong> <span data-payment-merchant></span></p>
                <p><strong>Amount:</strong> <span data-payment-amount></span></p>
                <div className="upi-alert" data-payment-alert></div>
              </div>
              <div className="payment-footer">Do not enter PIN until merchant, amount, and purpose are verified.</div>
            </article>

            <article className="qr-card">
              <h3>Clickable scam indicators</h3>
              <div className="indicator-grid" data-indicators></div>
            </article>
          </div>
        </section>
      </main>

      <div className="qr-modal" data-result-modal>
        <div className="qr-modal-card">
          <h2 data-modal-title></h2>
          <div data-modal-body></div>
          <div className="qr-modal-actions">
            <button className="qr-button" data-close-modal type="button">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
