import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';

export default function CaseStudy() {
  useQrPage(['./js/scams.js', './js/qr.js'], 'QR Fraud Case Study | CyberShield');

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
            <Link to="/qr/case-study" className="active">Case Study</Link>
            <Link to="/qr/awareness">Awareness</Link>
            <Link to="/qr/report">Report</Link>
          </div>
        </div>
      </nav>
      <main className="qr-shell">
        <section className="qr-page-intro">
          <div className="qr-kicker">incident review</div>
          <h1>Fake refund QR case</h1>
          <p className="qr-copy">A victim scans a public QR promising a wallet refund. The QR opens a UPI collect request, not a refund flow. The victim enters a PIN and money is debited.</p>
        </section>
        <section className="qr-grid two qr-section">
          <article className="qr-card">
            <span className="qr-chip red">attack chain</span>
            <h2>What happened</h2>
            <ul className="qr-list">
              <li>Fraudster placed a sticker over a legitimate QR at a payment counter.</li>
              <li>The landing page copied a known brand and showed a fake refund message.</li>
              <li>The UPI app displayed a collect request for INR 2,499.</li>
              <li>The victim approved with UPI PIN, causing an instant debit.</li>
            </ul>
          </article>
          <article className="qr-card">
            <span className="qr-chip">defense playbook</span>
            <h2>How to stop it</h2>
            <ul className="qr-list">
              <li>Inspect physical stickers for tampering, layering, or poor print quality.</li>
              <li>Read the payment screen slowly: payee, amount, and debit/collect wording.</li>
              <li>Never enter UPI PIN to receive money.</li>
              <li>Use official apps or typed URLs for refunds, fines, and government payments.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
