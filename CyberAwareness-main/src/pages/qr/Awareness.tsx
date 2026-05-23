import { Link } from 'react-router-dom';
import { useQrPage } from './qrUtils';
import './css/qr.css';

export default function Awareness() {
  useQrPage(['./js/scams.js', './js/qr.js'], 'QR Awareness Tips | CyberShield');

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
            <Link to="/qr/awareness" className="active">Awareness</Link>
            <Link to="/qr/report">Report</Link>
          </div>
        </div>
      </nav>
      <main className="qr-shell">
        <section className="qr-page-intro">
          <div className="qr-kicker">awareness and Indian cyber law</div>
          <h1>Verify before you pay</h1>
          <p className="qr-copy">QR codes are only shortcuts. Treat the destination screen as the real security checkpoint.</p>
        </section>
        <section className="qr-grid qr-section">
          <article className="qr-card">
            <span className="qr-chip red">UPI rule</span>
            <h3>PIN means debit risk</h3>
            <p>If an app asks for UPI PIN, assume money can leave your account. Refunds and prize credits do not need your PIN.</p>
          </article>
          <article className="qr-card">
            <span className="qr-chip">domain check</span>
            <h3>Look beyond the logo</h3>
            <p>Fake pages can copy brand colors. Check HTTPS, domain spelling, official suffixes, and whether the page asks for OTP or card data.</p>
          </article>
          <article className="qr-card">
            <span className="qr-chip red">physical tampering</span>
            <h3>Public stickers are risky</h3>
            <p>Parking meters, fuel pumps, cafes, and counters can be relabeled. Ask staff or use the official app when the sticker looks altered.</p>
          </article>
        </section>
        <section className="qr-grid two qr-section">
          <article className="qr-card">
            <h2>Indian reporting tips</h2>
            <ul className="qr-list">
              <li>Call 1930 quickly for financial cyber fraud assistance.</li>
              <li>File a complaint at cybercrime.gov.in with screenshots and UTR numbers.</li>
              <li>Share the VPA, phone number, URL, timestamp, bank, and transaction ID.</li>
              <li>Ask your bank or UPI app to block/freeze the transaction trail immediately.</li>
            </ul>
          </article>
          <article className="qr-card">
            <h2>Law awareness</h2>
            <ul className="qr-list">
              <li>IT Act Section 66C relates to identity theft and credential misuse.</li>
              <li>IT Act Section 66D relates to cheating by personation using computer resources.</li>
              <li>IPC/BNS cheating provisions may also be relevant depending on the complaint.</li>
              <li data-law-tip></li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
