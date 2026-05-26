import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    id: 1,
    missionType: "PHISHING DETECTION",
    threatLevel: "CRITICAL",
    scenario: "INCOMING TRANSMISSION",
    text: "Which of the following is a sign of a phishing email?",
    options: [
      { key: "A", text: "Personalized greeting with your full name", correct: false },
      { key: "B", text: "Sent from your company's verified domain", correct: false },
      { key: "C", text: "Urgent language plus a mismatched sender URL", correct: true },
      { key: "D", text: "Contains a calendar invite with correct details", correct: false },
    ],
    explanation: "Urgency combined with mismatched sender URLs is a classic phishing signal. Attackers create artificial time pressure to override rational thinking.",
    xp: 150,
  },
];

const CHALLENGES = [
  {
    id: 1,
    title: "Phishing Detection",
    missionType: "THREAT CLASSIFICATION",
    threatLevel: "CRITICAL",
    scenario: "A message says your bank account will be locked in 20 minutes and asks you to verify through bit.ly/bank-safe.",
    options: ["Safe notification", "Phishing attempt", "System update"],
    answer: "Phishing attempt",
    explanation: "Urgency + shortened URLs + credential requests = textbook phishing. Never click shortened links from unsolicited messages.",
    xp: 200,
  },
  {
    id: 2,
    title: "Password Strength Analysis",
    missionType: "SECURITY ASSESSMENT",
    threatLevel: "HIGH",
    scenario: "Which password is strongest for a new account?",
    options: ["Summer2026", "Aditi@123", "river-Quartz-91!vault"],
    answer: "river-Quartz-91!vault",
    explanation: "Length + randomness + mixed character classes = entropy. 'river-Quartz-91!vault' has superior entropy making it exponentially harder to crack.",
    xp: 175,
  },
  {
    id: 3,
    title: "Social Engineering Defense",
    missionType: "SOCIAL THREAT",
    threatLevel: "HIGH",
    scenario: "A caller claiming to be IT asks for your OTP to close an urgent ticket.",
    options: ["Share OTP", "Verify independently", "Install remote app"],
    answer: "Verify independently",
    explanation: "Legitimate IT never requests OTPs. Always verify caller identity through official channels before taking any action.",
    xp: 175,
  },
];

const CASE_STUDIES = [
  {
    id: 1,
    title: "Fake Job Offer Scam",
    category: "FINANCIAL FRAUD",
    threatLevel: "HIGH",
    body: "A candidate receives a premium-looking offer letter and is asked to pay a refundable equipment fee before their start date.",
    lesson: "Verify recruiter identity, company domain, and interview history. Legitimate employers never ask candidates to pay fees to receive a job offer.",
    indicators: ["Unsolicited offer", "Equipment fee demand", "Urgency to pay quickly"],
    xp: 125,
  },
  {
    id: 2,
    title: "UPI Refund Trap",
    category: "DIGITAL PAYMENT FRAUD",
    threatLevel: "CRITICAL",
    body: "A caller sends a QR code to receive money, but scanning it opens a collect request that prompts for your UPI PIN.",
    lesson: "Entering UPI PIN always authorizes a payment FROM your account. Refunds never require a PIN entry on your device.",
    indicators: ["QR code via message", "PIN request on receive", "Caller pressure"],
    xp: 150,
  },
  {
    id: 3,
    title: "Account Lock Phishing",
    category: "CREDENTIAL THEFT",
    threatLevel: "CRITICAL",
    body: "An email claims your account will be permanently closed today unless you sign in through a provided shortened link immediately.",
    lesson: "Urgency, shortened links, and credential requests are the highest-risk signals. Always navigate directly to the service's official website.",
    indicators: ["Artificial urgency", "Shortened link", "Threat of account loss"],
    xp: 125,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Nisha", xp: 4920, rank_title: "CYBER SENTINEL", badge: "◈" },
  { rank: 2, name: "Rahul", xp: 4510, rank_title: "THREAT ANALYST", badge: "◇" },
  { rank: 3, name: "Aditi", xp: 4180, rank_title: "THREAT ANALYST", badge: "◇" },
  { rank: 4, name: "Kabir", xp: 3950, rank_title: "NET DEFENDER", badge: "○" },
  { rank: 5, name: "Meera", xp: 3720, rank_title: "NET DEFENDER", badge: "○" },
];

const THREAT_LEVELS = {
  CRITICAL: { color: "#ff4444", glow: "rgba(255,68,68,0.4)", label: "CRITICAL" },
  HIGH: { color: "#ff8c00", glow: "rgba(255,140,0,0.4)", label: "HIGH" },
  MEDIUM: { color: "#00d4ff", glow: "rgba(0,212,255,0.4)", label: "MEDIUM" },
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --c-bg: #030712;
    --c-bg2: #060e1f;
    --c-bg3: #0a1628;
    --c-cyan: #00d4ff;
    --c-emerald: #00ff9d;
    --c-red: #ff4444;
    --c-amber: #ff8c00;
    --c-purple: #7c3aed;
    --c-muted: #334155;
    --c-text: #e2e8f0;
    --c-text2: #94a3b8;
    --font-display: 'Orbitron', monospace;
    --font-ui: 'Rajdhani', sans-serif;
    --font-mono: 'Share Tech Mono', monospace;
  }

  .cyber-root {
    min-height: 100vh;
    background: var(--c-bg);
    color: var(--c-text);
    font-family: var(--font-ui);
    overflow-x: hidden;
    position: relative;
  }

  .cyber-grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .scan-line {
    position: fixed;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.15), rgba(0,212,255,0.4), rgba(0,212,255,0.15), transparent);
    z-index: 1;
    animation: scanMove 8s linear infinite;
    pointer-events: none;
  }
  @keyframes scanMove {
    0% { top: -2px; }
    100% { top: 100vh; }
  }

  .glow-pulse {
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: pulseDrift 12s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  .glow-pulse2 {
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,157,0.03) 0%, transparent 70%);
    bottom: -100px; right: -50px;
    animation: pulseDrift2 15s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  @keyframes pulseDrift {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(60px, 40px) scale(1.1); }
  }
  @keyframes pulseDrift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-50px, -30px) scale(1.08); }
  }

  .content-wrap {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* NAV */
  .cyber-nav {
    border-bottom: 1px solid rgba(0,212,255,0.1);
    background: rgba(3,7,18,0.9);
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .cyber-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 32px;
    height: 64px;
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--c-cyan);
    letter-spacing: 0.1em;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--c-cyan);
    box-shadow: 0 0 12px var(--c-cyan);
    animation: logoPulse 2s ease-in-out infinite;
  }
  @keyframes logoPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .nav-tabs {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .nav-tab {
    padding: 6px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    border: 1px solid transparent;
    background: transparent;
    color: var(--c-text2);
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }
  .nav-tab:hover {
    color: var(--c-cyan);
    border-color: rgba(0,212,255,0.2);
    background: rgba(0,212,255,0.05);
  }
  .nav-tab.active {
    color: var(--c-cyan);
    border-color: rgba(0,212,255,0.4);
    background: rgba(0,212,255,0.1);
  }
  .nav-tab.active::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: var(--c-cyan);
    box-shadow: 0 0 8px var(--c-cyan);
  }
  .nav-status {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--c-emerald);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--c-emerald);
    box-shadow: 0 0 8px var(--c-emerald);
    animation: logoPulse 1.5s ease-in-out infinite;
  }

  /* PANEL / GLASSMORPHISM */
  .glass-panel {
    background: rgba(6,14,31,0.7);
    border: 1px solid rgba(0,212,255,0.12);
    border-radius: 8px;
    backdrop-filter: blur(16px);
    position: relative;
    overflow: hidden;
  }
  .glass-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
  }
  .glass-panel-danger {
    border-color: rgba(255,68,68,0.25);
  }
  .glass-panel-danger::before {
    background: linear-gradient(90deg, transparent, rgba(255,68,68,0.4), transparent);
  }
  .glass-panel-success {
    border-color: rgba(0,255,157,0.25);
  }
  .glass-panel-success::before {
    background: linear-gradient(90deg, transparent, rgba(0,255,157,0.4), transparent);
  }

  /* CORNER BRACKETS */
  .bracket-corner {
    position: absolute;
    width: 16px; height: 16px;
  }
  .bracket-corner.tl { top: 0; left: 0; border-top: 2px solid var(--c-cyan); border-left: 2px solid var(--c-cyan); }
  .bracket-corner.tr { top: 0; right: 0; border-top: 2px solid var(--c-cyan); border-right: 2px solid var(--c-cyan); }
  .bracket-corner.bl { bottom: 0; left: 0; border-bottom: 2px solid var(--c-cyan); border-left: 2px solid var(--c-cyan); }
  .bracket-corner.br { bottom: 0; right: 0; border-bottom: 2px solid var(--c-cyan); border-right: 2px solid var(--c-cyan); }
  .bracket-danger .tl, .bracket-danger .tr, .bracket-danger .bl, .bracket-danger .br {
    border-color: var(--c-red) !important;
  }
  .bracket-success .tl, .bracket-success .tr, .bracket-success .bl, .bracket-success .br {
    border-color: var(--c-emerald) !important;
  }

  /* BADGES & CHIPS */
  .threat-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    padding: 3px 10px;
    border-radius: 2px;
    border: 1px solid;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .threat-badge.critical { color: var(--c-red); border-color: rgba(255,68,68,0.4); background: rgba(255,68,68,0.08); }
  .threat-badge.high { color: var(--c-amber); border-color: rgba(255,140,0,0.4); background: rgba(255,140,0,0.08); }
  .threat-badge.medium { color: var(--c-cyan); border-color: rgba(0,212,255,0.4); background: rgba(0,212,255,0.08); }
  .threat-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: logoPulse 1s ease-in-out infinite; }

  .mission-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--c-cyan);
    opacity: 0.7;
    padding: 2px 0;
  }

  /* QUESTION / OPTION BUTTONS */
  .option-btn {
    width: 100%;
    padding: 16px 20px;
    text-align: left;
    background: rgba(10,22,40,0.6);
    border: 1px solid rgba(0,212,255,0.12);
    border-radius: 6px;
    color: var(--c-text);
    font-family: var(--font-ui);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }
  .option-btn::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0;
    background: rgba(0,212,255,0.06);
    transition: width 0.3s ease;
  }
  .option-btn:hover:not(:disabled)::before { width: 100%; }
  .option-btn:hover:not(:disabled) {
    border-color: rgba(0,212,255,0.4);
    color: #fff;
    transform: translateX(2px);
  }
  .option-btn:disabled { cursor: not-allowed; }
  .option-btn.correct {
    border-color: rgba(0,255,157,0.5);
    background: rgba(0,255,157,0.06);
    color: var(--c-emerald);
  }
  .option-btn.wrong {
    border-color: rgba(255,68,68,0.5);
    background: rgba(255,68,68,0.06);
    color: var(--c-red);
  }
  .option-btn.dim { opacity: 0.4; }

  .key-badge {
    width: 32px; height: 32px;
    min-width: 32px;
    border: 1px solid rgba(0,212,255,0.3);
    border-radius: 4px;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--c-cyan);
    background: rgba(0,212,255,0.05);
    transition: all 0.2s;
  }
  .option-btn.correct .key-badge { border-color: var(--c-emerald); color: var(--c-emerald); background: rgba(0,255,157,0.1); }
  .option-btn.wrong .key-badge { border-color: var(--c-red); color: var(--c-red); background: rgba(255,68,68,0.1); }

  /* CTA BUTTONS */
  .cyber-btn {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.15em;
    padding: 12px 28px;
    border: 1px solid rgba(0,212,255,0.4);
    background: rgba(0,212,255,0.08);
    color: var(--c-cyan);
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .cyber-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,212,255,0.1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s;
  }
  .cyber-btn:hover::after { transform: scaleX(1); }
  .cyber-btn:hover {
    border-color: var(--c-cyan);
    color: #fff;
    box-shadow: 0 0 20px rgba(0,212,255,0.2);
  }
  .cyber-btn.primary {
    border-color: var(--c-emerald);
    background: rgba(0,255,157,0.08);
    color: var(--c-emerald);
  }
  .cyber-btn.primary::after { background: rgba(0,255,157,0.1); }
  .cyber-btn.primary:hover { border-color: var(--c-emerald); box-shadow: 0 0 20px rgba(0,255,157,0.2); }
  .cyber-btn.danger {
    border-color: rgba(255,68,68,0.4);
    background: rgba(255,68,68,0.08);
    color: var(--c-red);
  }
  .cyber-btn.danger:hover { box-shadow: 0 0 20px rgba(255,68,68,0.2); }

  /* XP BAR */
  .xp-bar-wrap {
    height: 4px;
    background: rgba(0,212,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .xp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--c-cyan), var(--c-emerald));
    border-radius: 2px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 0 8px rgba(0,212,255,0.6);
  }

  /* FEEDBACK CARD */
  .feedback-panel {
    padding: 20px;
    border-radius: 6px;
    margin-top: 20px;
    border: 1px solid;
    animation: fadeSlideUp 0.4s ease;
  }
  .feedback-panel.correct { border-color: rgba(0,255,157,0.3); background: rgba(0,255,157,0.05); }
  .feedback-panel.wrong { border-color: rgba(255,68,68,0.3); background: rgba(255,68,68,0.05); }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* HOME GRID */
  .module-card {
    padding: 28px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
  }
  .module-card:hover {
    border-color: rgba(0,212,255,0.35);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,212,255,0.05);
  }
  .module-icon {
    width: 52px; height: 52px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    font-size: 22px;
    margin-bottom: 16px;
    border: 1px solid;
  }

  /* RADAR */
  .radar-wrap {
    position: relative;
    width: 140px; height: 140px;
  }
  .radar-svg { position: absolute; inset: 0; }
  .radar-sweep {
    transform-origin: 70px 70px;
    animation: radarSpin 4s linear infinite;
  }
  @keyframes radarSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .radar-ping {
    animation: radarPing 4s ease-out infinite;
  }
  @keyframes radarPing {
    0% { opacity: 0; r: 4; }
    20% { opacity: 1; }
    100% { opacity: 0; r: 20; }
  }

  /* LEADERBOARD */
  .lb-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border: 1px solid rgba(0,212,255,0.08);
    border-radius: 6px;
    background: rgba(10,22,40,0.4);
    transition: all 0.2s;
  }
  .lb-row:hover {
    border-color: rgba(0,212,255,0.25);
    background: rgba(10,22,40,0.8);
    transform: translateX(3px);
  }
  .lb-rank {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 900;
    color: rgba(0,212,255,0.4);
    min-width: 28px;
  }
  .lb-rank.gold { color: #ffd700; text-shadow: 0 0 12px rgba(255,215,0,0.5); }
  .lb-rank.silver { color: #c0c0c0; text-shadow: 0 0 12px rgba(192,192,192,0.4); }
  .lb-rank.bronze { color: #cd7f32; text-shadow: 0 0 12px rgba(205,127,50,0.4); }

  /* SCAN ANIMATION */
  .scan-container {
    position: relative;
    overflow: hidden;
  }
  .scan-anim {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent);
    animation: scanAnim 2s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes scanAnim {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  /* TYPEWRITER */
  .typewriter {
    overflow: hidden;
    white-space: nowrap;
    animation: typeIn 1.2s steps(40, end) both;
  }
  @keyframes typeIn {
    from { width: 0; }
    to { width: 100%; }
  }

  /* MISC */
  .section-header {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--c-cyan);
    opacity: 0.6;
    margin-bottom: 6px;
  }
  .big-title {
    font-family: var(--font-display);
    font-weight: 900;
  }
  .mono { font-family: var(--font-mono); }
  .fade-in { animation: fadeSlideUp 0.5s ease both; }
  .fade-in-delay { animation: fadeSlideUp 0.5s ease 0.15s both; }
  .fade-in-delay2 { animation: fadeSlideUp 0.5s ease 0.3s both; }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent);
    margin: 24px 0;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--c-bg); }
  ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 2px; }

  /* CASE STUDY */
  .indicator-chip {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 2px;
    border: 1px solid rgba(255,68,68,0.3);
    color: var(--c-red);
    background: rgba(255,68,68,0.05);
    letter-spacing: 0.1em;
  }

  .progress-node {
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 1px solid rgba(0,212,255,0.3);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
  }
  .progress-node.active {
    background: var(--c-cyan);
    border-color: var(--c-cyan);
    box-shadow: 0 0 8px rgba(0,212,255,0.6);
  }
  .progress-node.done {
    background: rgba(0,212,255,0.3);
    border-color: rgba(0,212,255,0.5);
  }

  @media (max-width: 768px) {
    .nav-tabs { gap: 2px; }
    .nav-tab { padding: 5px 10px; font-size: 10px; }
    .big-title { font-size: clamp(20px, 5vw, 40px) !important; }
  }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function RadarWidget() {
  return (
    <div className="radar-wrap">
      <svg className="radar-svg" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="70" r="65" stroke="rgba(0,212,255,0.08)" strokeWidth="1"/>
        <circle cx="70" cy="70" r="48" stroke="rgba(0,212,255,0.1)" strokeWidth="1"/>
        <circle cx="70" cy="70" r="32" stroke="rgba(0,212,255,0.12)" strokeWidth="1"/>
        <circle cx="70" cy="70" r="16" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
        <line x1="5" y1="70" x2="135" y2="70" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5"/>
        <line x1="70" y1="5" x2="70" y2="135" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5"/>
        <g className="radar-sweep">
          <path d="M70 70 L70 5 A65 65 0 0 1 135 70 Z" fill="url(#sweep)" opacity="0.4"/>
          <line x1="70" y1="70" x2="70" y2="5" stroke="rgba(0,212,255,0.8)" strokeWidth="1.5"/>
        </g>
        <defs>
          <radialGradient id="sweep" cx="70" cy="70" r="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,212,255,0.3)"/>
            <stop offset="100%" stopColor="rgba(0,212,255,0)"/>
          </radialGradient>
        </defs>
        <circle cx="95" cy="45" r="3" fill="var(--c-red)" style={{filter:"drop-shadow(0 0 4px #ff4444)"}}>
          <animate attributeName="opacity" values="1;0.2;1" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="85" r="2.5" fill="var(--c-amber)" style={{filter:"drop-shadow(0 0 4px #ff8c00)"}}>
          <animate attributeName="opacity" values="1;0.2;1" dur="3.1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="105" cy="90" r="2" fill="var(--c-emerald)" style={{filter:"drop-shadow(0 0 4px #00ff9d)"}}>
          <animate attributeName="opacity" values="1;0.2;1" dur="1.7s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}

function BracketCorners({ variant = "default" }) {
  return (
    <>
      <span className={`bracket-corner tl ${variant === "danger" ? "bracket-danger" : variant === "success" ? "bracket-success" : ""}`}/>
      <span className={`bracket-corner tr ${variant === "danger" ? "bracket-danger" : variant === "success" ? "bracket-success" : ""}`}/>
      <span className={`bracket-corner bl ${variant === "danger" ? "bracket-danger" : variant === "success" ? "bracket-success" : ""}`}/>
      <span className={`bracket-corner br ${variant === "danger" ? "bracket-danger" : variant === "success" ? "bracket-success" : ""}`}/>
    </>
  );
}

function ThreatBadge({ level }) {
  const cls = level?.toLowerCase() === "critical" ? "critical" : level?.toLowerCase() === "high" ? "high" : "medium";
  return (
    <span className={`threat-badge ${cls}`}>
      <span className="threat-dot"/>
      {level}
    </span>
  );
}

function XPPopup({ xp, show }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
      zIndex: 9999, pointerEvents: "none",
      fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 900,
      color: "var(--c-emerald)", textShadow: "0 0 40px rgba(0,255,157,0.8)",
      animation: "xpFloat 1.5s ease-out forwards",
    }}>
      +{xp} XP
      <style>{`@keyframes xpFloat { from{opacity:1;transform:translate(-50%,-50%) scale(0.5)} 50%{opacity:1;transform:translate(-50%,-80%) scale(1.2)} to{opacity:0;transform:translate(-50%,-130%) scale(1)} }`}</style>
    </div>
  );
}

// ─── VIEWS ───────────────────────────────────────────────────────────────────

function HomeView({ onNav, totalXP }) {
  const modules = [
    { view: "quiz", icon: "⬡", label: "CYBER AWARENESS", desc: "Phishing, social engineering, and digital hygiene scenarios", color: "#00d4ff", bgColor: "rgba(0,212,255,0.1)" },
    { view: "challenge", icon: "⚠", label: "SCAM SIMULATOR", desc: "Classify real threats under pressure — build instant decision confidence", color: "#ff8c00", bgColor: "rgba(255,140,0,0.1)" },
    { view: "casestudy", icon: "◈", label: "CASE STUDIES", desc: "Analyze confirmed incidents and master response patterns", color: "#a855f7", bgColor: "rgba(168,85,247,0.1)" },
    { view: "leaderboard", icon: "▲", label: "LEADERBOARD", desc: "Track XP, cyber rank, and training progress against peers", color: "#00ff9d", bgColor: "rgba(0,255,157,0.1)" },
  ];

  return (
    <div className="content-wrap" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px" }} className="fade-in">
          <div className="section-header">// AI CYBER AWARENESS COMMAND CENTER</div>
          <h1 className="big-title" style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05, marginBottom: 20, marginTop: 8 }}>
            <span style={{ color: "var(--c-cyan)" }}>CYBER</span>
            <br/>
            <span style={{ color: "#fff" }}>TRAINING</span>
            <br/>
            <span style={{ color: "var(--c-emerald)" }}>MISSION</span>
          </h1>
          <p style={{ color: "var(--c-text2)", fontSize: 17, lineHeight: 1.7, maxWidth: 460, fontFamily: "var(--font-ui)" }}>
            You are now connected to the cyber threat intelligence grid. Complete awareness missions, analyze real threats, and build your digital defense profile.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["THREATS ACTIVE", "247"], ["OPERATORS ONLINE", "1,842"], ["YOUR XP", totalXP.toLocaleString()]].map(([label, val]) => (
              <div key={label}>
                <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.15em", marginBottom: 4 }}>{label}</div>
                <div className="big-title" style={{ fontSize: 24, color: label.includes("XP") ? "var(--c-emerald)" : "var(--c-cyan)" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fade-in-delay" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <RadarWidget/>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.15em" }}>THREAT RADAR — LIVE</div>
        </div>
      </div>

      <div className="divider" style={{ marginTop: 48 }}/>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {modules.map((mod, i) => (
          <div
            key={mod.view}
            className={`glass-panel module-card fade-in`}
            style={{ animationDelay: `${i * 0.08}s` }}
            onClick={() => onNav(mod.view)}
          >
            <BracketCorners/>
            <div className="module-icon" style={{ color: mod.color, borderColor: `${mod.color}33`, background: mod.bgColor, fontSize: 20 }}>
              {mod.icon}
            </div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: mod.color, marginBottom: 8 }}>{mod.label}</div>
            <p style={{ color: "var(--c-text2)", fontSize: 14, lineHeight: 1.6 }}>{mod.desc}</p>
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: mod.color, fontSize: 12, fontFamily: "var(--font-mono)" }}>
              ENTER MISSION <span style={{ fontSize: 16 }}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizView({ onXP }) {
  const [selected, setSelected] = useState(null);
  const [showXP, setShowXP] = useState(false);
  const q = QUIZ_QUESTIONS[0];

  const choose = (key) => {
    if (selected) return;
    setSelected(key);
    const opt = q.options.find(o => o.key === key);
    if (opt?.correct) {
      setTimeout(() => { setShowXP(true); onXP(q.xp); }, 300);
      setTimeout(() => setShowXP(false), 1600);
    }
  };

  const answered = selected !== null;
  const correct = answered && q.options.find(o => o.key === selected)?.correct;

  return (
    <div className="content-wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <XPPopup xp={q.xp} show={showXP}/>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }} className="fade-in">
          <div>
            <div className="section-header">// ACTIVE MISSION</div>
            <div className="big-title" style={{ fontSize: 22, color: "#fff", marginTop: 4 }}>CYBER AWARENESS QUIZ</div>
          </div>
          <ThreatBadge level={q.threatLevel}/>
        </div>

        <div className={`glass-panel scan-container fade-in-delay`} style={{ padding: "32px 32px 28px" }}>
          <div className="scan-anim"/>
          <BracketCorners variant={answered ? (correct ? "success" : "danger") : "default"}/>

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <div className="mission-tag">{q.missionType}</div>
            <div style={{ flex: 1, height: 1, background: "rgba(0,212,255,0.1)" }}/>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)" }}>{q.scenario}</div>
          </div>

          <h2 style={{ fontSize: "clamp(17px, 2.5vw, 22px)", fontWeight: 600, lineHeight: 1.5, color: "#fff", marginBottom: 28, fontFamily: "var(--font-ui)" }}>
            {q.text}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt) => {
              let cls = "option-btn";
              if (answered) {
                if (opt.correct) cls += " correct";
                else if (opt.key === selected) cls += " wrong";
                else cls += " dim";
              }
              return (
                <button key={opt.key} className={cls} disabled={answered} onClick={() => choose(opt.key)}>
                  <span className="key-badge">{opt.key}</span>
                  <span>{opt.text}</span>
                  {answered && opt.correct && <span style={{ marginLeft: "auto", color: "var(--c-emerald)", fontSize: 18 }}>✓</span>}
                  {answered && opt.key === selected && !opt.correct && <span style={{ marginLeft: "auto", color: "var(--c-red)", fontSize: 18 }}>✗</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`feedback-panel ${correct ? "correct" : "wrong"}`}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", marginBottom: 8, color: correct ? "var(--c-emerald)" : "var(--c-red)" }}>
                {correct ? "// THREAT IDENTIFIED — CORRECT ANALYSIS" : "// ANALYSIS ERROR — REVIEW REQUIRED"}
              </div>
              <p style={{ color: "var(--c-text)", fontSize: 15, lineHeight: 1.6, fontFamily: "var(--font-ui)" }}>{q.explanation}</p>
              {correct && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--c-emerald)" }}>+{q.xp} XP AWARDED</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }} className="glass-panel fade-in-delay2">
          <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.12em" }}>AI ANALYSIS</div>
          <div style={{ flex: 1, fontSize: 13, color: "var(--c-text2)", fontFamily: "var(--font-ui)" }}>
            {answered
              ? correct
                ? "Excellent situational awareness. You identified the core phishing signal pattern."
                : "Review threat vectors: urgency signals combined with URL mismatch are primary indicators."
              : "Analyze the scenario carefully. Look for social engineering patterns and URL anomalies."}
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--c-cyan)", boxShadow: "0 0 8px var(--c-cyan)", animation: "logoPulse 1.5s ease-in-out infinite" }}/>
        </div>
      </div>
    </div>
  );
}

function ChallengeView({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showXP, setShowXP] = useState(false);
  const [completedAll, setCompletedAll] = useState(false);
  const ch = CHALLENGES[idx];

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === ch.answer) {
      setScore(s => s + ch.xp);
      onXP(ch.xp);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1600);
    }
  };

  const next = () => {
    if (idx + 1 >= CHALLENGES.length) { setCompletedAll(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  if (completedAll) {
    return (
      <div className="content-wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }} className="fade-in">
          <div className="glass-panel" style={{ padding: 48 }}>
            <BracketCorners variant="success"/>
            <div style={{ fontSize: 48, marginBottom: 20 }}>◈</div>
            <div className="big-title" style={{ fontSize: 32, color: "var(--c-emerald)", marginBottom: 12 }}>MISSION COMPLETE</div>
            <div className="mono" style={{ fontSize: 14, color: "var(--c-text2)", marginBottom: 24 }}>ALL CHALLENGES CLEARED</div>
            <div className="big-title" style={{ fontSize: 48, color: "var(--c-cyan)" }}>{score.toLocaleString()}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--c-text2)", marginTop: 4, marginBottom: 32 }}>TOTAL XP EARNED</div>
            <button className="cyber-btn primary" onClick={() => { setIdx(0); setSelected(null); setScore(0); setCompletedAll(false); }}>
              RESTART MISSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answered = selected !== null;
  const correct = answered && selected === ch.answer;

  return (
    <div className="content-wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <XPPopup xp={ch.xp} show={showXP}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, alignItems: "start" }} className="fade-in">

        <div className={`glass-panel scan-container`} style={{ padding: "32px" }}>
          <div className="scan-anim"/>
          <BracketCorners variant={answered ? (correct ? "success" : "danger") : "default"}/>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <div className="mission-tag">{ch.missionType}</div>
            <div style={{ flex: 1, height: 1, background: "rgba(0,212,255,0.08)" }}/>
            <ThreatBadge level={ch.threatLevel}/>
          </div>

          <h2 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#fff", marginBottom: 20, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
            {ch.title}
          </h2>

          <div style={{
            padding: "16px 20px",
            background: "rgba(0,212,255,0.04)",
            border: "1px solid rgba(0,212,255,0.1)",
            borderRadius: 6,
            marginBottom: 24,
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--c-text)",
            fontFamily: "var(--font-ui)",
          }}>
            {ch.scenario}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ch.options.map(opt => {
              let cls = "option-btn";
              if (answered) {
                if (opt === ch.answer) cls += " correct";
                else if (opt === selected) cls += " wrong";
                else cls += " dim";
              }
              return (
                <button key={opt} className={cls} disabled={answered} onClick={() => choose(opt)}>
                  <span>{opt}</span>
                  {answered && opt === ch.answer && <span style={{ marginLeft: "auto", color: "var(--c-emerald)" }}>✓</span>}
                  {answered && opt === selected && opt !== ch.answer && <span style={{ marginLeft: "auto", color: "var(--c-red)" }}>✗</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`feedback-panel ${correct ? "correct" : "wrong"}`}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", marginBottom: 8, color: correct ? "var(--c-emerald)" : "var(--c-red)" }}>
                {correct ? "// CORRECT CLASSIFICATION" : "// RECLASSIFICATION REQUIRED"}
              </div>
              <p style={{ color: "var(--c-text)", fontSize: 14, lineHeight: 1.6 }}>{ch.explanation}</p>
              <div style={{ marginTop: 16 }}>
                <button className={`cyber-btn ${correct ? "primary" : "danger"}`} onClick={next}>
                  {idx + 1 >= CHALLENGES.length ? "COMPLETE MISSION" : "NEXT CHALLENGE →"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <BracketCorners/>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.15em", marginBottom: 12 }}>MISSION SCORE</div>
            <div className="big-title" style={{ fontSize: 40, color: "var(--c-cyan)" }}>{score.toLocaleString()}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", marginTop: 4 }}>XP EARNED</div>
            <div className="divider"/>
            <div style={{ display: "flex", gap: 6 }}>
              {CHALLENGES.map((_, i) => (
                <div
                  key={i}
                  className={`progress-node ${i < idx ? "done" : i === idx ? "active" : ""}`}
                />
              ))}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", marginTop: 10 }}>
              {idx + 1} / {CHALLENGES.length} MISSIONS
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <RadarWidget/>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", marginTop: 8, letterSpacing: "0.12em", textAlign: "center" }}>ACTIVE THREATS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudyView({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const cs = CASE_STUDIES[idx];

  const handleReveal = () => {
    if (!revealed) { setRevealed(true); onXP(cs.xp); }
  };

  const goto = (i) => { setIdx(i); setRevealed(false); };

  return (
    <div className="content-wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }} className="fade-in">
          <div>
            <div className="section-header">// INTELLIGENCE CASE FILES</div>
            <div className="big-title" style={{ fontSize: 22, color: "#fff", marginTop: 4 }}>INCIDENT ANALYSIS</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {CASE_STUDIES.map((c, i) => (
              <button key={i} className="progress-node" onClick={() => goto(i)}
                style={{ width: 32, height: 32, borderRadius: 4, border: `1px solid ${i === idx ? "var(--c-cyan)" : "rgba(0,212,255,0.15)"}`,
                  background: i === idx ? "rgba(0,212,255,0.1)" : "transparent",
                  color: i === idx ? "var(--c-cyan)" : "var(--c-text2)",
                  fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}>
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel scan-container fade-in-delay" style={{ padding: "36px 32px" }}>
          <div className="scan-anim"/>
          <BracketCorners variant="danger"/>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <div className="mission-tag">{cs.category}</div>
            <div style={{ flex: 1, height: 1, background: "rgba(0,212,255,0.08)" }}/>
            <ThreatBadge level={cs.threatLevel}/>
          </div>

          <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#fff", marginBottom: 20, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
            {cs.title}
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--c-text)", marginBottom: 24, fontFamily: "var(--font-ui)" }}>
            {cs.body}
          </p>

          <div style={{ marginBottom: 28 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--c-red)", letterSpacing: "0.15em", marginBottom: 12 }}>THREAT INDICATORS</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {cs.indicators.map(ind => (
                <span key={ind} className="indicator-chip">{ind}</span>
              ))}
            </div>
          </div>

          {!revealed ? (
            <button className="cyber-btn" onClick={handleReveal} style={{ position: "relative", overflow: "hidden" }}>
              DECRYPT INTELLIGENCE FILE — +{cs.xp} XP
            </button>
          ) : (
            <div className="fade-in" style={{
              padding: "20px 24px",
              background: "rgba(0,255,157,0.04)",
              border: "1px solid rgba(0,255,157,0.2)",
              borderRadius: 6,
            }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--c-emerald)", letterSpacing: "0.2em", marginBottom: 12 }}>
                // DEFENSE PROTOCOL DECRYPTED
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--c-text)", fontFamily: "var(--font-ui)" }}>{cs.lesson}</p>
              <div className="mono" style={{ fontSize: 11, color: "var(--c-emerald)", marginTop: 12 }}>+{cs.xp} XP AWARDED</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {idx > 0 && <button className="cyber-btn" onClick={() => goto(idx - 1)}>← PREV CASE</button>}
          {idx < CASE_STUDIES.length - 1 && <button className="cyber-btn primary" onClick={() => goto(idx + 1)}>NEXT CASE →</button>}
        </div>
      </div>
    </div>
  );
}

function LeaderboardView({ totalXP }) {
  const userRank = { rank: "?", name: "YOU", xp: totalXP, rank_title: "RECRUIT", badge: "△" };
  const allEntries = [...LEADERBOARD, { ...userRank, isUser: true }].sort((a, b) => b.xp - a.xp);

  return (
    <div className="content-wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, flexWrap: "wrap" }} className="fade-in">
          <div>
            <div className="section-header">// GLOBAL RANKING MATRIX</div>
            <div className="big-title" style={{ fontSize: 26, color: "#fff", marginTop: 4 }}>OPERATOR LEADERBOARD</div>
          </div>
          <RadarWidget/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allEntries.map((entry, i) => {
            const rankColors = ["gold", "silver", "bronze", "", ""];
            const rc = rankColors[i] || "";
            return (
              <div
                key={entry.name}
                className={`lb-row fade-in glass-panel ${entry.isUser ? "" : ""}`}
                style={{
                  animationDelay: `${i * 0.06}s`,
                  border: entry.isUser ? "1px solid rgba(0,255,157,0.3)" : undefined,
                  background: entry.isUser ? "rgba(0,255,157,0.04)" : undefined,
                }}
              >
                <div className={`lb-rank ${rc}`} style={{ fontFamily: "var(--font-display)", fontSize: 14 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 6,
                  border: `1px solid ${entry.isUser ? "rgba(0,255,157,0.3)" : "rgba(0,212,255,0.2)"}`,
                  background: entry.isUser ? "rgba(0,255,157,0.08)" : "rgba(0,212,255,0.05)",
                  display: "grid", placeItems: "center",
                  fontSize: 18, color: entry.isUser ? "var(--c-emerald)" : "var(--c-cyan)"
                }}>
                  {entry.badge}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: entry.isUser ? "var(--c-emerald)" : "#fff", fontFamily: "var(--font-ui)" }}>
                    {entry.name} {entry.isUser && <span className="mono" style={{ fontSize: 10, color: "var(--c-emerald)", marginLeft: 6 }}>[YOU]</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.12em" }}>{entry.rank_title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="big-title" style={{ fontSize: 18, color: entry.isUser ? "var(--c-emerald)" : "var(--c-cyan)" }}>
                    {entry.xp.toLocaleString()}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)" }}>XP</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-panel fade-in" style={{ padding: 20, marginTop: 24 }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[["TOTAL OPERATORS", "1,842"], ["MISSIONS COMPLETED TODAY", "3,241"], ["YOUR SESSION XP", totalXP.toLocaleString()]].map(([label, val]) => (
              <div key={label}>
                <div className="mono" style={{ fontSize: 10, color: "var(--c-text2)", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</div>
                <div className="big-title" style={{ fontSize: 22, color: label.includes("SESSION") ? "var(--c-emerald)" : "var(--c-cyan)" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function CyberAwarenessCommandCenter({ initialView = "home" }) {
  const [view, setView] = useState(initialView);
  const [totalXP, setTotalXP] = useState(0);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const addXP = useCallback((xp) => setTotalXP(x => x + xp), []);

  const tabs = [
    { id: "home", label: "COMMAND" },
    { id: "quiz", label: "QUIZ" },
    { id: "challenge", label: "CHALLENGE" },
    { id: "casestudy", label: "CASES" },
    { id: "leaderboard", label: "LEADERBOARD" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="cyber-root">
        <div className="cyber-grid-bg"/>
        <div className="scan-line"/>
        <div className="glow-pulse"/>
        <div className="glow-pulse2"/>

        <nav className="cyber-nav">
          <div className="cyber-nav-inner">
            <div className="nav-logo">
              <div className="logo-dot"/>
              CYBRSHLD
            </div>
            <div className="nav-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-tab ${view === tab.id ? "active" : ""}`}
                  onClick={() => setView(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, minWidth: 0 }}>
              <div className="nav-status">
                <div className="status-dot"/>
                SYSTEMS ONLINE
              </div>
              <div className="mono" style={{ fontSize: 9, color: "var(--c-text2)", letterSpacing: "0.08em" }}>
                {timeStr}
              </div>
            </div>
          </div>
        </nav>

        {view === "home" && <HomeView onNav={setView} totalXP={totalXP}/>}
        {view === "quiz" && <QuizView onXP={addXP}/>}
        {view === "challenge" && <ChallengeView onXP={addXP}/>}
        {view === "casestudy" && <CaseStudyView onXP={addXP}/>}
        {view === "leaderboard" && <LeaderboardView totalXP={totalXP}/>}
      </div>
    </>
  );
}