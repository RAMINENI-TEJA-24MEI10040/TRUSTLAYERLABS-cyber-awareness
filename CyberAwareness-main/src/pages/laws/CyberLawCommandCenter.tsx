import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type CrimeType =
  | "phishing"
  | "upi"
  | "deepfake"
  | "impersonation"
  | "qrscam"
  | "hacking"
  | "investment"
  | "identity";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CRIME_TIPS: Record<CrimeType, string[]> = {
  phishing: [
    "Do NOT click the link — it may install malware",
    "Forward the phishing SMS to 7726 (SPAM)",
    "Report the URL to Google Safe Browsing",
    "Check if credentials were entered on the fake site",
    "Change passwords immediately for affected accounts",
  ],
  upi: [
    "Immediately call your bank fraud line",
    "File complaint on NPCI portal (npci.org.in)",
    "Collect UTR/transaction ID from SMS",
    "Report the fraudulent UPI ID to your payment app",
    "Call 1930 within 1 hour for best recovery chances",
  ],
  deepfake: [
    "Record the suspicious call if possible",
    "Verify the identity through a separate known channel",
    "Never transfer money based on video/voice calls alone",
    "Report to cybercrime.gov.in with call recording",
    "Alert your contacts — attackers may impersonate you too",
  ],
  impersonation: [
    "Document all communications from the impersonator",
    "File complaint under IT Act Section 66D",
    "Contact the impersonated organization officially",
    "Request platform takedown of fraudulent profiles",
    "Collect all evidence before reporting to police",
  ],
  qrscam: [
    "Check bank statement for unauthorized debits",
    "Report the QR code location to local police",
    "Alert the merchant whose QR was replaced",
    "File UPI dispute with your payment app",
    "Collect transaction proof from app history",
  ],
  hacking: [
    "Immediately revoke all active sessions",
    "Enable 2FA on all compromised accounts",
    "Change passwords from a DIFFERENT device",
    "Check if email forwarding rules were added by attacker",
    "Review connected third-party app permissions",
  ],
  investment: [
    "Do NOT invest more money expecting recovery",
    "Collect all communication and payment receipts",
    "Report to SEBI at scores.sebi.gov.in",
    "File case under Section 420 (cheating)",
    "Alert your bank to flag any related accounts",
  ],
  identity: [
    "File complaint with UIDAI if Aadhaar misused",
    "Alert credit bureaus (CIBIL) about potential fraud",
    "Check form 26AS for unauthorized ITR filings",
    "Report to respective platform where identity was used",
    "File police FIR for identity theft",
  ],
};

const TIMELINE_STEPS = [
  {
    num: "01",
    icon: "🚨",
    title: "Incident Detected",
    status: "CRITICAL",
    statusType: "critical",
    desc: "You've identified a cyber attack, fraud attempt, or suspicious activity targeting your digital accounts or finances.",
    expand:
      "⚡ STAY CALM. Do not panic — panicking leads to mistakes. Note the exact time, platform, and nature of the incident. Do NOT delete any messages, calls, or transaction history yet. Take a screenshot immediately. Your next 60 seconds determine how much evidence you preserve.",
    danger: true,
  },
  {
    num: "02",
    icon: "🔐",
    title: "Secure Your Accounts",
    status: "IMMEDIATE",
    statusType: "active",
    desc: "Immediately change passwords for all critical accounts — banking, email, social media, UPI apps.",
    expand:
      "🔑 PRIORITY ORDER: 1) Email account (it's the master key) 2) Banking apps 3) UPI/Payment apps 4) Social media. Enable Two-Factor Authentication (2FA) on all accounts. If you suspect SIM swap, contact your telecom operator NOW. Log out of all active sessions from other devices.",
    danger: false,
  },
  {
    num: "03",
    icon: "📋",
    title: "Preserve All Evidence",
    status: "CRITICAL",
    statusType: "active",
    desc: "Document everything before attempting to undo the damage. Evidence is your most powerful legal asset.",
    expand:
      "📸 COLLECT: Screenshots of all suspicious messages/calls/transactions. Transaction IDs, UTR numbers, UPI IDs. Phone numbers, email addresses, website URLs used by attackers. Record approximate time and sequence of events. Save bank SMS alerts. Do NOT format your phone or computer yet.",
    danger: false,
  },
  {
    num: "04",
    icon: "🏦",
    title: "Contact Your Bank",
    status: "URGENT",
    statusType: "critical",
    desc: "For financial fraud, contact your bank's 24×7 fraud helpline within the first 4 hours to maximize recovery chances.",
    expand:
      "📞 CALL: Your bank's 24×7 fraud helpline immediately. Request a HOLD on the fraudulent transaction. File a formal Fraud Complaint in writing. Ask for the complaint reference number. The RBI directive requires banks to reverse unauthorized transactions reported within 3 days of notification.",
    danger: false,
  },
  {
    num: "05",
    icon: "📝",
    title: "Submit Cyber Complaint",
    status: "ACTION",
    statusType: "active",
    desc: "File an official complaint on the National Cybercrime Reporting Portal or call the helpline 1930.",
    expand:
      "🌐 FILE AT: cybercrime.gov.in — available 24×7. Call: 1930 (National Cybercrime Helpline). You'll receive a complaint acknowledgement number — save it. For financial fraud over ₹1 lakh, also file at your nearest police station. Attach all evidence you've collected.",
    danger: false,
  },
  {
    num: "06",
    icon: "🔍",
    title: "Follow Investigation",
    status: "ONGOING",
    statusType: "pending",
    desc: "Track your complaint, cooperate with investigators, and follow up regularly on the portal.",
    expand:
      "📊 TRACK: Visit cybercrime.gov.in/complaint/trackComplaint to track status. Keep all communication with bank and police in writing. Follow up every 7 days if no update. Engage a cybercrime lawyer if the amount exceeds ₹5 lakh. Document all follow-up interactions with reference numbers.",
    danger: false,
  },
];

const CRIME_CARDS = [
  { type: "phishing" as CrimeType, icon: "🎣", label: "Phishing Attack" },
  { type: "upi" as CrimeType, icon: "💸", label: "UPI / Payment Fraud" },
  { type: "deepfake" as CrimeType, icon: "🎭", label: "Deepfake / AI Fraud" },
  { type: "impersonation" as CrimeType, icon: "👤", label: "Impersonation" },
  { type: "qrscam" as CrimeType, icon: "📷", label: "QR Code Scam" },
  { type: "hacking" as CrimeType, icon: "💻", label: "Account Hacking" },
  { type: "investment" as CrimeType, icon: "📈", label: "Fake Investment" },
  { type: "identity" as CrimeType, icon: "🪪", label: "Identity Theft" },
];

const VAULT_SLOTS = [
  { icon: "📸", label: "Screenshots", desc: "Chat screenshots, fraud messages" },
  { icon: "🎥", label: "Video Evidence", desc: "Screen recordings, call recordings" },
  { icon: "💬", label: "Chat Logs", desc: "WhatsApp exports, Telegram chats" },
  { icon: "🧾", label: "Transaction Proof", desc: "Bank statements, UPI receipts" },
  { icon: "🔗", label: "URLs & Links", desc: "Suspicious websites, phishing links" },
  { icon: "📞", label: "Phone Numbers", desc: "Attacker contact details" },
];

const EMERGENCY_CARDS = [
  { icon: "🏦", title: "Freeze Bank Account", desc: "Immediately block all transactions on compromised accounts to prevent further unauthorized withdrawals.", action: "⚡ CALL BANK NOW →", urgent: true },
  { icon: "📞", title: "Contact Bank Fraud Cell", desc: "Report fraud to your bank's 24×7 emergency fraud helpline. Golden window: first 4 hours for transaction reversal.", action: "⚡ CALL 24×7 HELPLINE →", urgent: true },
  { icon: "📱", title: "Block SIM Card", desc: "If SIM swap is suspected, call your telecom operator immediately. BSNL: 1503, Airtel: 121, Jio: 199, Vi: 9889.", action: "⚡ BLOCK SIM →", urgent: true },
  { icon: "💳", title: "Report UPI Fraud", desc: "File UPI fraud complaint via NPCI portal or call 1800-120-1740. Also report to your payment app's fraud team.", action: "⚡ REPORT UPI FRAUD →", urgent: true },
  { icon: "🔑", title: "Change All Passwords", desc: "Immediately change passwords for email, banking, and social media. Use unique strong passwords for each account.", action: "🔐 SECURE ACCOUNTS →", urgent: false },
  { icon: "🛡️", title: "Enable MFA Everywhere", desc: "Turn on multi-factor authentication for all critical accounts. Use authenticator apps over SMS where possible.", action: "🔐 ENABLE 2FA →", urgent: false },
  { icon: "🌐", title: "National Cybercrime Portal", desc: "File official complaint at cybercrime.gov.in or call 1930. Required for police FIR and legal proceedings.", action: "📋 FILE COMPLAINT →", urgent: false },
  { icon: "📋", title: "File Police FIR", desc: "Visit nearest police station with all evidence for formal FIR. Mandatory for losses above ₹25,000 or identity theft.", action: "📋 GET FIR →", urgent: false },
];

const ALERT_CARDS = [
  { icon: "🎣", cat: "PHISHING", title: "Fake RBI/SBI KYC Phishing Campaign", desc: "Fraudsters are sending SMS messages mimicking RBI and SBI requesting urgent KYC update via malicious links. Clicking installs credential-stealing malware.", severity: "CRITICAL", area: "All states", count: "2,340+ reports" },
  { icon: "🎭", cat: "DEEPFAKE", title: "AI Voice Clone Fraud Calls", desc: "Highly convincing AI-cloned voice calls impersonating relatives or senior officials demanding immediate money transfer for emergencies. Verify independently.", severity: "CRITICAL", area: "Metro cities", count: "870+ reports" },
  { icon: "📷", cat: "QR SCAM", title: "QR Code Payment Swap Attack", desc: "Fraudsters physically replacing QR codes at shops and restaurants with their own. Customers scanning think they're paying the merchant but are paying attackers.", severity: "HIGH", area: "Delhi, Mumbai", count: "1,120+ reports" },
  { icon: "📈", cat: "INVESTMENT", title: "Fake Crypto/Stock Investment Platforms", desc: "Fraudulent investment apps showing fake returns encouraging victims to invest more before exit scamming. Uses fake celebrity endorsements and doctored SEBI approvals.", severity: "CRITICAL", area: "Nationwide", count: "₹450Cr+ lost" },
  { icon: "🚔", cat: "DIGITAL ARREST", title: '"Digital Arrest" Extortion Scam', desc: 'Callers posing as CBI/ED/Customs officers via video call claim you\'re under "digital arrest" for money laundering. No such thing exists in Indian law — it\'s fraud.', severity: "CRITICAL", area: "All states", count: "PM warned about this" },
  { icon: "💱", cat: "SIM SWAP", title: "Coordinated SIM Swap Banking Attacks", desc: "Fraudsters using insider telecom contacts to perform unauthorized SIM swaps, then emptying bank accounts via OTP interception before victims notice loss of signal.", severity: "HIGH", area: "Mumbai, Pune", count: "340+ reports" },
];

const TICKER_ITEMS = [
  { cat: "PHISHING", text: "Fake SBI KYC update links circulating via WhatsApp" },
  { cat: "UPI FRAUD", text: "Fake payment QR codes replacing merchant codes in Delhi NCR" },
  { cat: "DEEPFAKE", text: "AI-generated voice calls impersonating senior officials reported" },
  { cat: "INVESTMENT", text: "Fake crypto trading platforms with celebrity endorsements spreading" },
  { cat: "SIM SWAP", text: "Coordinated SIM swap attacks targeting Mumbai banking customers" },
  { cat: "DIGITAL ARREST", text: 'Fake ED/CBI calls demanding payment to avoid "digital arrest"' },
];

const CITIES: [number, number, string, number, number][] = [
  [450, 120, "Delhi", 1, 2340], [580, 140, "Lucknow", 2, 890], [650, 200, "Patna", 1, 1120],
  [700, 260, "Kolkata", 1, 1890], [520, 200, "Jaipur", 2, 670], [640, 300, "Ranchi", 2, 450],
  [380, 260, "Ahmedabad", 2, 780], [460, 320, "Bhopal", 2, 560], [580, 320, "Nagpur", 2, 430],
  [450, 420, "Hyderabad", 1, 1340], [380, 380, "Mumbai", 1, 2100], [480, 460, "Bengaluru", 1, 1560],
  [380, 480, "Kochi", 2, 340], [520, 500, "Chennai", 1, 1230], [700, 180, "Guwahati", 2, 290],
  [300, 200, "Jodhpur", 2, 210], [510, 150, "Chandigarh", 2, 430], [670, 340, "Bhubaneswar", 2, 380],
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PulseDot({ color }: { color: "red" | "cyan" | "amber" }) {
  const colors = { red: "bg-red-500 shadow-red-500", cyan: "bg-cyan-400 shadow-cyan-400", amber: "bg-amber-400 shadow-amber-400" };
  return (
    <motion.div
      className={`w-1.5 h-1.5 rounded-full ${colors[color]} shadow-md`}
      animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── NEURAL CANVAS ────────────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let frame = 0;
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const nodes: Node[] = [];
    let W = 0, H = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      nodes.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5 });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.globalAlpha = (1 - d / 150) * 0.15;
            ctx.strokeStyle = "rgba(0,229,255,0.05)";
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.2)"; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      frame++;
      const rings = [{ r: (frame * 0.8) % 300, col: "rgba(255,23,68,0.04)" }, { r: (frame * 0.5 + 150) % 300, col: "rgba(0,229,255,0.03)" }];
      for (const rg of rings) {
        ctx.beginPath(); ctx.arc(W * 0.7, H * 0.4, rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = rg.col; ctx.lineWidth = 1; ctx.stroke();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─── RADAR ────────────────────────────────────────────────────────────────────
function RadarDisplay() {
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full">
        <defs>
          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,229,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0)" />
          </radialGradient>
        </defs>
        {[65, 48, 30, 14].map((r) => (
          <circle key={r} cx="70" cy="70" r={r} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        ))}
        <line x1="5" y1="70" x2="135" y2="70" stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
        <line x1="70" y1="5" x2="70" y2="135" stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
        <line x1="24" y1="24" x2="116" y2="116" stroke="rgba(0,229,255,0.04)" strokeWidth="0.5" />
        <line x1="116" y1="24" x2="24" y2="116" stroke="rgba(0,229,255,0.04)" strokeWidth="0.5" />
        <motion.g style={{ originX: "70px", originY: "70px" }} animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <path d="M70 70 L70 5 A65 65 0 0 1 135 70 Z" fill="url(#radarGrad)" />
        </motion.g>
        {[{ cx: 40, cy: 35, r: 3, color: "#FF1744", dur: 1.5 }, { cx: 100, cy: 55, r: 2, color: "#FF1744", dur: 2 }, { cx: 85, cy: 100, r: 2.5, color: "#FFB300", dur: 1.8 }, { cx: 30, cy: 90, r: 2, color: "#00E5FF", dur: 2.5 }].map((b, i) => (
          <motion.circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} animate={{ opacity: [0.9, 0.1, 0.9] }} transition={{ duration: b.dur, repeat: Infinity }} />
        ))}
        <circle cx="70" cy="70" r="4" fill="none" stroke="rgba(0,229,255,0.8)" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="2" fill="rgba(0,229,255,0.9)" />
      </svg>
    </div>
  );
}

// ─── INDIA MAP CANVAS ─────────────────────────────────────────────────────────
function IndiaMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;
    const W = 900, H = 500;
    const routes: [number, number, number, number][] = [[450, 120, 380, 260], [380, 260, 380, 380], [450, 120, 650, 200], [650, 200, 700, 260], [580, 320, 450, 420]];

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,229,255,0.05)"; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const cx = 450, cy = 280, maxR = 280;
      const angle = t * 0.015;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, maxR, -0.5, 0); ctx.closePath();
      const sweepFill = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      sweepFill.addColorStop(0, "rgba(0,229,255,0.12)"); sweepFill.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = sweepFill; ctx.fill(); ctx.restore();

      for (let r = 60; r <= maxR; r += 60) {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${0.04 + 0.02 * (r / maxR)})`; ctx.lineWidth = 0.5; ctx.stroke();
      }

      ctx.setLineDash([3, 6]); ctx.lineWidth = 0.8;
      routes.forEach(([x1, y1, x2, y2]) => {
        const progress = (Math.sin(t * 0.02) + 1) / 2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
        ctx.strokeStyle = "rgba(255,23,68,0.2)"; ctx.stroke();
      });
      ctx.setLineDash([]);

      CITIES.forEach(([x, y, name, type, count]) => {
        const pulse = (Math.sin(t * 0.05 + x * 0.01) + 1) / 2;
        const color = type === 1 ? "#FF1744" : "#FFB300";
        const size = type === 1 ? 6 : 4;
        ctx.beginPath(); ctx.arc(x, y, size + 8 + pulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = type === 1 ? `rgba(255,23,68,${0.08 + pulse * 0.08})` : `rgba(255,179,0,${0.06 + pulse * 0.06})`;
        ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(232,244,255,0.85)"; ctx.font = 'bold 9px "JetBrains Mono", monospace'; ctx.fillText(name, x + 10, y - 4);
        ctx.fillStyle = type === 1 ? "rgba(255,23,68,0.8)" : "rgba(255,179,0,0.7)"; ctx.font = '8px "JetBrains Mono", monospace'; ctx.fillText(count.toLocaleString(), x + 10, y + 6);
      });
      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div className="relative bg-[#050A14] border border-cyan-900/40 rounded-lg overflow-hidden p-8">
      <canvas ref={canvasRef} width={900} height={500} className="w-full h-auto block" />
      <div className="absolute top-6 right-6 bg-[rgba(5,15,35,0.85)] border border-white/10 rounded p-4 min-w-[160px]">
        <div className="font-mono text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-3">LEGEND</div>
        {[{ color: "bg-red-500 shadow-red-500", label: "HIGH THREAT" }, { color: "bg-amber-400 shadow-amber-400", label: "MEDIUM" }, { color: "bg-cyan-400 shadow-cyan-400", label: "RESPONSE NODE" }].map((l) => (
          <div key={l.label} className="flex items-center gap-2 font-mono text-[10px] text-slate-400 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color} shadow-md`} />{l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────
function Waveform() {
  const bars = Array.from({ length: 40 }, (_, i) => ({
    delay: (i / 40) * 1.2,
    height: Math.random() * 40 + 10,
    color: i / 40 < 0.33 ? "#FF1744" : i / 40 < 0.66 ? "#FFB300" : "#00E5FF",
  }));
  return (
    <div className="flex items-center gap-0.5 h-12 mb-3">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-sm flex-shrink-0"
          style={{ background: b.color, height: b.height }}
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── HERO DASHBOARD ───────────────────────────────────────────────────────────
function HeroDashboard({ clock }: { clock: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="hidden lg:block">
      <div className="border border-cyan-900/40 rounded-md bg-[rgba(5,15,35,0.85)] backdrop-blur-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(0,229,255,0.04), transparent 60%)" }} />
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-cyan-950/10">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-cyan-400 tracking-widest uppercase">
            <PulseDot color="cyan" />COMMAND DASHBOARD — LIVE
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
          {/* RADAR */}
          <div className="bg-[#050A14] p-4">
            <div className="font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-2">ACTIVE THREAT RADAR</div>
            <RadarDisplay />
            <div className="flex gap-4 mt-2 justify-center">
              {[{ color: "bg-red-500", label: "THREAT" }, { color: "bg-amber-400", label: "WARNING" }, { color: "bg-cyan-400", label: "SAFE" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full ${l.color}`} />{l.label}
                </div>
              ))}
            </div>
          </div>
          {/* WAVEFORM */}
          <div className="bg-[#050A14] p-4">
            <div className="font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-2">THREAT SIGNAL ANALYSIS</div>
            <Waveform />
            {[{ label: "PHISHING", val: "▲ 34%", width: "74%", barColor: "bg-red-500", txtColor: "text-red-500" }, { label: "UPI FRAUD", val: "▲ 18%", width: "52%", barColor: "bg-amber-400", txtColor: "text-amber-400" }, { label: "DEEPFAKE", val: "▲ 61%", width: "61%", barColor: "bg-cyan-400", txtColor: "text-cyan-400" }].map((s) => (
              <div key={s.label} className="mb-1.5">
                <div className="flex justify-between font-mono text-[10px] mb-0.5">
                  <span className="text-slate-500">{s.label}</span>
                  <span className={s.txtColor}>{s.val}</span>
                </div>
                <div className="bg-white/[0.04] rounded-sm overflow-hidden h-[3px]">
                  <div className={`h-full ${s.barColor} rounded-sm`} style={{ width: s.width }} />
                </div>
              </div>
            ))}
          </div>
          {/* ALERT FEED */}
          <div className="bg-[#050A14] p-4">
            <div className="font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-2">LIVE INCIDENT FEED</div>
            <div className="flex flex-col gap-2">
              {[["Fake RBI SMS — Mumbai", "red"], ["UPI QR Scam — Delhi NCR", "red"], ["Investment Fraud Alert", "amber"], ["Deepfake Loan Call", "red"], ["SIM Swap Attempt", "red"]].map(([text, c], i) => (
                <motion.div key={i} className="flex items-center gap-2 px-2.5 py-1.5 border-l-2 rounded-r font-mono text-[10px] text-slate-400"
                  style={{ borderColor: c === "red" ? "#FF1744" : "#FFB300", background: c === "red" ? "rgba(255,23,68,0.06)" : "rgba(255,179,0,0.06)" }}
                  animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }}>
                  <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c === "red" ? "#FF1744" : "#FFB300" }}
                    animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  {text}
                </motion.div>
              ))}
            </div>
          </div>
          {/* NODES */}
          <div className="bg-[#050A14] p-4">
            <div className="font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-2">RESPONSE NETWORK</div>
            <div className="flex flex-wrap gap-2 items-center justify-center p-2">
              {[{ icon: "🛡", label: "CERT-IN", type: "active" }, { icon: "🏛", label: "Cybercrime Portal", type: "active" }, { icon: "💳", label: "Banking Alert", type: "warn" }, { icon: "📡", label: "TRAI Monitor", type: "active" }, { icon: "⚠", label: "I4C Active", type: "alert" }, { icon: "🔐", label: "MHA Cyber", type: "active" }].map((n) => {
                const colors = { active: { border: "border-cyan-400", text: "text-cyan-400", ring: "border-cyan-400", glow: "shadow-cyan-400/30" }, warn: { border: "border-amber-400", text: "text-amber-400", ring: "border-amber-400", glow: "shadow-amber-400/30" }, alert: { border: "border-red-500", text: "text-red-500", ring: "border-red-500", glow: "shadow-red-500/30" } }[n.type]!;
                return (
                  <div key={n.label} className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className={`relative w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center text-sm ${colors.border} ${colors.text} shadow-md ${colors.glow} transition-transform group-hover:scale-110`}>
                      {n.icon}
                      <motion.div className={`absolute inset-[-3px] rounded-full border ${colors.ring} opacity-30`} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                    </div>
                    <div className="font-mono text-[8px] text-slate-500 text-center leading-tight max-w-[40px]">{n.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-4 py-2.5 bg-black/50 border-t border-white/[0.06] flex items-center justify-between gap-4">
          {[["SYSTEM STATUS", "OPERATIONAL", "text-green-400"], ["RESPONSE TIME", "~4.2min", "text-cyan-400"], ["SECURE CHANNEL", "ACTIVE", "text-green-400"]].map(([k, v, c]) => (
            <div key={k} className="font-mono text-[9px] text-slate-500">{k}: <span className={c}>{v}</span></div>
          ))}
          <div className="font-mono text-[9px] text-cyan-400">{clock}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CyberLawCommandCenter() {
  const [clock, setClock] = useState("");
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [selectedCrime, setSelectedCrime] = useState<CrimeType | null>(null);
  const [tips, setTips] = useState(CRIME_TIPS.phishing);

  // clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-IN", { hour12: false }) + " IST");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleCrimeSelect = useCallback((type: CrimeType) => {
    setSelectedCrime(type);
    setTips(CRIME_TIPS[type]);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-[#020409] text-[#E8F4FF] font-sans overflow-x-hidden min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050A14; }
        ::-webkit-scrollbar-thumb { background: #006064; border-radius: 2px; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .holo-scan::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#00E5FF,transparent); animation:scan-h 3s linear infinite; }
        @keyframes scan-h { 0%{opacity:0;transform:translateX(-100%)} 50%{opacity:1} 100%{opacity:0;transform:translateX(100%)} }
        .vault-scan-line { position:absolute; top:0; left:0; right:0; height:2px; background:#00E5FF; opacity:0; }
        .vault-slot:hover .vault-scan-line { animation: vault-scan 3s ease-in-out infinite; }
        @keyframes vault-scan { 0%{top:0;opacity:0} 20%{opacity:0.8} 80%{opacity:0.8} 100%{top:100%;opacity:0} }
        .ticker-inner { animation: ticker-scroll 40s linear infinite; }
        @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>

      {/* NEURAL BACKGROUND */}
      <NeuralCanvas />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-3.5 bg-[rgba(2,4,9,0.9)] backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-[1.5px] border-red-500 rounded flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(255,23,68,0.2),transparent)" }}>
            <div className="w-3.5 h-3.5 border-[1.5px] border-red-500 rounded-full relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            </div>
          </div>
          <div>
            <div className="font-mono text-xs font-bold tracking-[0.15em] text-[#E8F4FF]">TRUSTLAYERLABS</div>
            <div className="font-mono text-[9px] text-slate-400 tracking-[0.1em]">CYBER EMERGENCY RESPONSE COMMAND CENTER</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            {[{ dot: "red" as const, label: "THREAT LEVEL: ELEVATED" }, { dot: "cyan" as const, label: "MONITORING ACTIVE" }, { dot: "amber" as const, label: "23 INCIDENTS/24H" }].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-[0.08em]">
                <PulseDot color={s.dot} />{s.label}
              </div>
            ))}
          </div>
          <button onClick={() => scrollTo("reporting")} className="font-mono text-[10px] font-bold tracking-[0.1em] px-5 py-2 rounded border border-red-500 text-red-500 bg-red-500/10 uppercase hover:bg-red-500 hover:text-white transition-all">
            REPORT INCIDENT
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-12 items-center px-16 pt-28 pb-16 max-w-[1600px] mx-auto">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] px-4 py-1.5 border border-red-500 text-red-500 bg-red-500/10 rounded-sm mb-6 uppercase">
            <PulseDot color="red" />EMERGENCY RESPONSE — LEVEL ALPHA
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-red-500 block">CYBER EMERGENCY</span>
            <span className="text-cyan-400 block">RESPONSE COMMAND</span>
            CENTER
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#7B9BB8] text-base leading-relaxed max-w-xl mb-8">
            Rapid response to cybercrime, digital fraud, phishing, identity theft, and online scams. Protecting India's digital citizens with AI-powered intelligence and 24×7 emergency guidance.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-10">
            {[{ icon: "🛡️", label: "Incident Response", desc: "Rapid triage & action" }, { icon: "🔒", label: "Evidence Protection", desc: "Forensic-grade vault" }, { icon: "🤖", label: "AI Guidance", desc: "Real-time intelligence" }, { icon: "🌐", label: "National Cyber Awareness", desc: "Policy & legal support" }].map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-cyan-950/10 border border-cyan-900/30 rounded">
                <div className="w-7 h-7 rounded bg-cyan-950/20 border border-cyan-900/30 flex items-center justify-center text-sm flex-shrink-0">{t.icon}</div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">{t.label}</span>
                  <span className="text-[11px] text-slate-400">{t.desc}</span>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex gap-4">
            <button onClick={() => scrollTo("reporting")}
              className="font-mono text-xs font-bold tracking-widest px-8 py-3.5 rounded bg-red-500 border border-red-500 text-white uppercase hover:shadow-[0_0_30px_rgba(255,23,68,0.5)] transition-all">
              ⚠ REPORT INCIDENT
            </button>
            <button onClick={() => scrollTo("awareness")}
              className="font-mono text-xs font-bold tracking-widest px-8 py-3.5 rounded bg-transparent border border-cyan-900/40 text-cyan-400 uppercase hover:bg-cyan-950/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all">
              EMERGENCY GUIDANCE
            </button>
          </motion.div>
        </div>
        <HeroDashboard clock={clock} />
      </section>

      {/* ── TICKER ── */}
      <div className="relative z-10 bg-red-500/5 border-y border-red-500/25 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-6 bg-red-500 font-mono text-[10px] font-bold tracking-widest text-white whitespace-nowrap">
          ⚠ LIVE THREAT ALERTS
        </div>
        <div className="overflow-hidden py-3 pl-40">
          <div className="ticker-inner flex gap-16 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-slate-400 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-red-500 font-bold mr-1">{item.cat}:</span>{item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <section id="timeline" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">INCIDENT RESPONSE PROTOCOL</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Emergency Response Timeline</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Follow this sequence immediately after a cyber incident. Time is critical — every minute matters for preserving evidence and limiting damage.</p></RevealSection>
          <RevealSection>
            <div className="flex flex-col gap-px bg-white/[0.06] border border-white/[0.06] rounded-md overflow-hidden">
              {TIMELINE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const statusColors = { critical: "text-red-500 bg-red-500/10 border-red-500/30", active: "text-cyan-400 bg-cyan-950/20 border-cyan-900/30", pending: "text-slate-500 bg-white/[0.03] border-white/[0.06]" };
                return (
                  <motion.div key={idx} onClick={() => setActiveStep(isActive ? null : idx)}
                    className={`bg-[#050A14] grid gap-6 items-start p-6 cursor-pointer transition-all border-l-4 ${isActive ? (step.danger ? "bg-red-950/5 border-l-red-500" : "bg-cyan-950/5 border-l-cyan-400") : "border-l-transparent hover:bg-cyan-950/5"}`}
                    style={{ gridTemplateColumns: "auto 1fr auto" }}>
                    <div className="font-mono text-[10px] font-bold text-slate-500 min-w-[24px] pt-0.5">{step.num}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-10 h-10 rounded border flex items-center justify-center text-xl flex-shrink-0 ${step.danger ? "border-red-500/30 bg-red-500/10" : "border-cyan-900/30 bg-cyan-950/10"}`}>{step.icon}</div>
                        <span className="font-bold text-base">{step.title}</span>
                        <span className={`font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase ${statusColors[step.statusType as keyof typeof statusColors]}`}>{step.status}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mt-1">{step.desc}</p>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                            className="overflow-hidden">
                            <div className="mt-3 px-3 py-3 bg-cyan-950/10 border border-cyan-900/30 rounded text-[13px] text-slate-300 leading-relaxed font-mono text-[11px]">
                              {step.expand}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.div className="text-slate-500 text-sm mt-1" animate={{ rotate: isActive ? 180 : 0 }}>▾</motion.div>
                  </motion.div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── REPORTING CENTER ── */}
      <section id="reporting" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">INCIDENT CLASSIFICATION SYSTEM</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Reporting Command Center</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-10">Select the type of cybercrime you've experienced. Our AI guidance system will adapt its recommendations based on your incident category.</p></RevealSection>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div>
              <RevealSection>
                <div className="font-mono text-[9px] font-bold text-slate-500 tracking-[0.15em] uppercase mb-3">SELECT INCIDENT CATEGORY</div>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {CRIME_CARDS.map((card) => (
                    <motion.div key={card.type} onClick={() => handleCrimeSelect(card.type)} whileHover={{ scale: 1.02 }}
                      className={`p-4 bg-[#050A14] border rounded cursor-pointer transition-all text-center relative overflow-hidden ${selectedCrime === card.type ? "border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.1)] bg-cyan-950/10" : "border-white/[0.06] hover:border-cyan-900/50"}`}>
                      <span className="text-2xl block mb-2">{card.icon}</span>
                      <div className={`font-mono text-[9px] font-bold tracking-wider uppercase leading-tight ${selectedCrime === card.type ? "text-cyan-400" : "text-slate-400"}`}>{card.label}</div>
                    </motion.div>
                  ))}
                </div>
              </RevealSection>
              <RevealSection>
                <div className="relative overflow-hidden bg-[rgba(5,15,35,0.85)] border border-cyan-900/40 rounded-md p-6 holo-scan">
                  <div className="font-mono text-[9px] font-bold text-slate-500 tracking-[0.15em] uppercase mb-4">INCIDENT DETAILS</div>
                  <div className="grid grid-cols-2 gap-3.5 mb-3">
                    <div>
                      <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Full Name</label>
                      <input type="text" placeholder="Your name" className="w-full bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] font-mono text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all" />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Contact Number</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] font-mono text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Incident Description</label>
                    <textarea placeholder="Describe what happened in detail — include dates, times, amounts, platforms used by the attacker..." className="w-full h-24 bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all resize-y" />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5 mb-3">
                    <div>
                      <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Approximate Loss (₹)</label>
                      <input type="number" placeholder="0" className="w-full bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] font-mono text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all" />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Incident Date</label>
                      <input type="date" className="w-full bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] font-mono text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Attacker's Contact / URL / UPI ID</label>
                    <input type="text" placeholder="Phone number, URL, email, or UPI ID used by attacker" className="w-full bg-black/50 border border-white/[0.1] rounded px-3.5 py-2.5 text-[#E8F4FF] font-mono text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all" />
                  </div>
                  <motion.button whileHover={{ boxShadow: "0 0 30px rgba(255,23,68,0.5)" }} className="w-full font-mono text-xs font-bold tracking-widest py-3.5 rounded bg-red-500 border border-red-500 text-white uppercase transition-all">
                    ⚡ SUBMIT INCIDENT REPORT
                  </motion.button>
                </div>
              </RevealSection>
            </div>

            {/* AI PANEL */}
            <RevealSection>
              <div className="bg-[rgba(5,15,35,0.85)] border border-red-500/30 rounded-md overflow-hidden sticky top-20">
                <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/25 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center text-base">🤖</div>
                  <div>
                    <div className="font-mono text-[11px] font-bold text-red-500 tracking-widest uppercase">AI RESPONSE SYSTEM</div>
                    <div className="text-[10px] text-slate-500">Real-time guidance engine</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-cyan-950/10 border border-cyan-900/30 rounded font-mono text-[10px] text-cyan-400 mb-4">
                    <PulseDot color="cyan" />ANALYZING THREAT PROFILE...
                  </div>
                  <div className="font-mono text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-3">IMMEDIATE ACTIONS REQUIRED</div>
                  <div className="flex flex-col gap-3 mb-6">
                    {tips.map((tip, i) => (
                      <motion.div key={`${selectedCrime}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex gap-2.5 p-3 bg-red-500/5 border-l-2 border-red-500 rounded-r">
                        <div className="font-mono text-[10px] font-bold text-red-500 flex-shrink-0 min-w-[18px]">{String(i + 1).padStart(2, "0")}</div>
                        <div className="text-[12px] text-slate-400 leading-relaxed">{tip}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/[0.06]">
                    <div className="font-mono text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-3">EMERGENCY NUMBERS</div>
                    {[{ label: "Cybercrime Helpline", num: "1930", color: "text-cyan-400" }, { label: "Police Emergency", num: "100", color: "text-red-500" }, { label: "Banking Ombudsman", num: "14448", color: "text-amber-400" }].map((n) => (
                      <div key={n.label} className="flex justify-between font-mono text-[12px] mb-2">
                        <span className="text-slate-400">{n.label}</span>
                        <span className={`${n.color} font-bold`}>{n.num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── EVIDENCE VAULT ── */}
      <section id="vault" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">FORENSIC EVIDENCE MANAGEMENT</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Evidence Vault</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Securely submit digital evidence for forensic analysis. All uploads are encrypted with AES-256 and stored in isolated secure containers.</p></RevealSection>
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {VAULT_SLOTS.map((slot) => (
                <motion.div key={slot.label} whileHover={{ scale: 1.02 }}
                  className="vault-slot relative border border-dashed border-cyan-900/40 rounded p-6 text-center cursor-pointer bg-cyan-950/5 overflow-hidden hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.08)] transition-all group">
                  <div className="vault-scan-line" />
                  <span className="text-3xl block mb-3">{slot.icon}</span>
                  <div className="font-mono text-[10px] font-bold text-cyan-400 tracking-wider uppercase mb-1">{slot.label}</div>
                  <div className="text-[11px] text-slate-500">{slot.desc}</div>
                </motion.div>
              ))}
            </div>
          </RevealSection>
          <RevealSection>
            <div className="flex items-center gap-4 px-5 py-4 bg-cyan-950/10 border border-cyan-900/30 rounded">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="font-mono text-[10px] font-bold text-cyan-400 tracking-wider mb-1">VAULT SECURITY PROTOCOL</div>
                <div className="text-[13px] text-slate-400 leading-relaxed">All evidence is encrypted with AES-256 before transmission. Files are stored in isolated forensic containers with chain-of-custody logging. Your data is never shared without your explicit consent and is only accessible to authorized cybercrime investigators.</div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 bg-cyan-950/20 border border-cyan-900/30 px-3 py-1.5 rounded whitespace-nowrap flex-shrink-0">🔒 AES-256 ENCRYPTED</div>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── EMERGENCY ACTIONS ── */}
      <section id="actions" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">IMMEDIATE RESPONSE PROTOCOLS</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Emergency Action Center</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Execute these critical actions immediately after a cyber incident. Speed is your greatest advantage — act within the first 4 hours.</p></RevealSection>
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {EMERGENCY_CARDS.map((card) => (
                <motion.div key={card.title} whileHover={{ y: -3 }}
                  className={`bg-[#050A14] border border-white/[0.06] rounded-md p-5 cursor-pointer transition-all relative overflow-hidden ${card.urgent ? "hover:border-red-500 hover:shadow-[0_8px_40px_rgba(255,23,68,0.15)]" : "hover:border-cyan-400 hover:shadow-[0_8px_40px_rgba(0,229,255,0.1)]"}`}>
                  <motion.div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${card.urgent ? "bg-red-500 shadow-red-500" : "bg-cyan-400 shadow-cyan-400"} shadow-md`}
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-3xl block mb-3">{card.icon}</span>
                  <div className="font-bold text-[15px] mb-1.5">{card.title}</div>
                  <div className="text-[12px] text-slate-400 leading-relaxed mb-4">{card.desc}</div>
                  <div className={`font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${card.urgent ? "text-red-500" : "text-cyan-400"}`}>{card.action}</div>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── LIVE ALERTS ── */}
      <section id="alerts" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">INTELLIGENCE BROADCAST SYSTEM</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Live Cyber Threat Alerts</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Active threat campaigns identified by our intelligence network. Stay informed and share these warnings with your community.</p></RevealSection>
          <RevealSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALERT_CARDS.map((card) => (
                <motion.div key={card.title} whileHover={{ y: -2, borderColor: "#FF1744", boxShadow: "0 8px 30px rgba(255,23,68,0.1)" }}
                  className="bg-[#050A14] border border-white/[0.06] rounded-md overflow-hidden cursor-pointer transition-all">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{card.icon}</span>
                      <span className="font-mono text-[10px] font-bold text-slate-500">{card.cat}</span>
                    </div>
                    <span className={`font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase ${card.severity === "CRITICAL" ? "text-red-500 bg-red-500/10 border-red-500/30" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}>{card.severity}</span>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-[14px] mb-1.5">{card.title}</div>
                    <div className="text-[12px] text-slate-400 leading-relaxed mb-3">{card.desc}</div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-red-500"><PulseDot color="red" />LIVE</span>
                      <span>{card.area}</span>
                      <span>⚠ {card.count}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── SUPPORT HUB ── */}
      <section id="support" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">OFFICIAL RESOURCES & CONTACTS</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">National Cyber Support Hub</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Official channels, emergency contacts, and legal resources for cybercrime victims in India.</p></RevealSection>
          <RevealSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: "🆘", title: "Cybercrime Helpline", badge: "24×7 NATIONAL", info: "National cybercrime helpline operated by the Ministry of Home Affairs. Report financial cybercrime, phishing, and online fraud. Available round the clock.", contact: "1930", contactStyle: "font-mono text-2xl font-bold text-cyan-400" },
                { icon: "🌐", title: "National Cyber Crime Portal", badge: "OFFICIAL GOV PORTAL", info: "Official government portal for filing cybercrime complaints online. Mandatory for FIR registration and tracking investigation status. Available 24×7.", link: "cybercrime.gov.in", href: "https://cybercrime.gov.in" },
                { icon: "🏦", title: "Banking Emergency Contacts", badge: "FINANCIAL FRAUD", info: "SBI: 1800 11 2211 | HDFC: 1800 202 6161 | ICICI: 1800 1080 | Axis: 1800 419 5959 | RBI Ombudsman: 14448", contact: "14448 — RBI Ombudsman", contactStyle: "font-mono text-base font-bold text-cyan-400" },
                { icon: "🚫", title: "Digital Arrest Awareness", badge: "SCAM ALERT", info: '"Digital Arrest" does not exist in Indian law. No government agency ever demands payment over video call. Hang up immediately and call 1930 to report.', warn: "NO SUCH THING AS DIGITAL ARREST" },
                { icon: "⚖️", title: "Legal Rights Guidance", badge: "IT ACT 2000", info: "Under IT Act Section 66C (identity theft) and 66D (cheating by impersonation), cybercriminals face up to 3 years imprisonment and ₹1 lakh fine. You have legal protection.", tag: "IT Act 2000 — Section 66C/66D" },
                { icon: "🛡️", title: "CERT-In Emergency", badge: "CERT-IN GOV.IN", info: "Indian Computer Emergency Response Team — handles critical cyber incidents. For major security breaches affecting organizations or critical infrastructure.", link: "cert-in.org.in", href: "https://cert-in.org.in" },
              ].map((card) => (
                <motion.div key={card.title} whileHover={{ y: -2, borderColor: "#00E5FF", boxShadow: "0 4px 30px rgba(0,229,255,0.08)" }}
                  className="bg-[#050A14] border border-white/[0.06] rounded-md p-6 cursor-pointer transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded bg-cyan-950/10 border border-cyan-900/30 flex items-center justify-center text-2xl">{card.icon}</div>
                    <div>
                      <div className="font-bold text-[15px]">{card.title}</div>
                      <div className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest">{card.badge}</div>
                    </div>
                  </div>
                  <div className="text-[13px] text-slate-400 leading-relaxed mb-4">{card.info}</div>
                  {card.contact && <div className={card.contactStyle}>{card.contact}</div>}
                  {card.link && <a href={card.href} className="font-mono text-[11px] text-cyan-400 flex items-center gap-1 hover:underline">{card.link} ↗</a>}
                  {card.warn && <div className="font-mono text-[12px] text-red-500 font-bold">{card.warn}</div>}
                  {card.tag && <div className="font-mono text-[11px] text-cyan-400">{card.tag}</div>}
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── AWARENESS ── */}
      <section id="awareness" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">CLASSIFIED INTELLIGENCE BRIEFING</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">Cyber Awareness Protocol</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Critical behavioral intelligence to protect yourself and minimize damage during a cyber incident.</p></RevealSection>
          <RevealSection>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  iconBg: "bg-green-400/10 border-green-400/20", icon: "✅", title: "What To Do Immediately",
                  sub: "CORRECT RESPONSE PROTOCOL", subColor: "text-green-400/70",
                  items: ["Stay calm and think clearly before taking any action", "Screenshot everything — messages, transaction details, URLs", "Disconnect the compromised device from the internet", "Call your bank's fraud helpline within 60 minutes", "File complaint at cybercrime.gov.in with all evidence", "Inform family and trusted contacts about the incident"],
                  bulletStyle: "bg-green-400/15 text-green-400", bulletChar: "✓",
                },
                {
                  iconBg: "bg-red-500/10 border-red-500/30", icon: "🚫", title: "What NOT To Do",
                  sub: "CRITICAL MISTAKES TO AVOID", subColor: "text-red-500/70",
                  items: ["Do NOT transfer money even if told it will be recovered", "Do NOT share OTPs with anyone — ever — including 'bank officials'", "Do NOT install apps suggested by unknown callers", "Do NOT delete messages, call logs, or transaction records", "Do NOT format your phone or computer before evidence collection", "Do NOT engage further with the attacker — block and report"],
                  bulletStyle: "bg-red-500/15 text-red-500", bulletChar: "✗",
                },
                {
                  iconBg: "bg-amber-400/10 border-amber-400/20", icon: "⚠️", title: "Emotional Manipulation Warning",
                  sub: "PSYCHOLOGICAL ATTACK PATTERNS", subColor: "text-amber-400/70",
                  items: ["Urgency pressure: 'Act now or lose everything' is a manipulation tactic", "Fear induction: Fake arrest threats, legal action, account closure", "Authority impersonation: Fake RBI/CBI/ED/police officer claims", "Greed exploitation: 'You've won a prize' or 'guaranteed returns'", "Isolation tactics: 'Don't tell anyone or you'll be arrested'", "Love/relationship scams targeting loneliness or grief"],
                  bulletStyle: "bg-amber-400/15 text-amber-400", bulletChar: "!",
                },
                {
                  iconBg: "bg-cyan-950/20 border-cyan-900/30", icon: "🔍", title: "Preserving Digital Evidence",
                  sub: "FORENSIC COLLECTION GUIDE", subColor: "text-slate-500",
                  items: ["Export full chat history — not just selected screenshots", "Save bank SMS alerts and email confirmations", "Note call logs with timestamps and call duration", "Record full URLs — not just domain names", "Back up all evidence to a secure cloud or separate device", "Write a chronological account of events with exact times"],
                  bulletStyle: "bg-cyan-950/20 text-cyan-400", bulletChar: "→",
                },
              ].map((panel) => (
                <div key={panel.title} className="bg-[#050A14] border border-white/[0.06] rounded-md overflow-hidden">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.06]">
                    <div className={`w-9 h-9 rounded flex items-center justify-center text-lg border ${panel.iconBg}`}>{panel.icon}</div>
                    <div>
                      <div className="font-bold text-[15px]">{panel.title}</div>
                      <div className={`text-[10px] ${panel.subColor}`}>{panel.sub}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    {panel.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 mb-3 text-[13px] text-slate-400 leading-relaxed">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${panel.bulletStyle}`}>{panel.bulletChar}</div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── MAP ── */}
      <section id="map" className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-16 py-20">
          <RevealSection><div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">NATIONAL THREAT INTELLIGENCE</div></RevealSection>
          <RevealSection><h2 className="text-4xl font-extrabold tracking-tight mb-4">India Cyber Incident Map</h2></RevealSection>
          <RevealSection><p className="text-[#7B9BB8] text-base leading-relaxed max-w-2xl mb-8">Real-time visualization of cyber threat activity across India's major cities. Data sourced from national cybercrime reporting infrastructure.</p></RevealSection>
          <RevealSection><IndiaMapCanvas /></RevealSection>
        </div>
      </section>

      <div className="mx-16 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

      {/* ── CTA ── */}
      <section className="relative z-10 overflow-hidden text-center">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <CTACanvas />
        </div>
        <div className="relative z-10 px-16 py-28">
          <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-4">EMERGENCY RESPONSE SYSTEM ACTIVE</div>
          <RevealSection>
            <h2 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              RESPOND FAST.<br />
              <span className="text-cyan-400">PRESERVE EVIDENCE.</span><br />
              <span className="text-red-500">DEFEND YOUR DIGITAL IDENTITY.</span>
            </h2>
          </RevealSection>
          <RevealSection>
            <p className="text-[#7B9BB8] text-base leading-relaxed max-w-xl mx-auto mb-10">Every second counts after a cyber incident. Our emergency response system is active 24×7 to guide you through crisis, protect your evidence, and connect you with national law enforcement.</p>
          </RevealSection>
          <RevealSection>
            <div className="flex gap-5 justify-center">
              <motion.button whileHover={{ boxShadow: "0 0 30px rgba(255,23,68,0.5)" }} onClick={() => scrollTo("reporting")}
                className="font-mono text-xs font-bold tracking-widest px-8 py-4 rounded bg-red-500 border border-red-500 text-white uppercase transition-all">
                ⚡ LAUNCH INCIDENT REPORT
              </motion.button>
              <motion.button whileHover={{ boxShadow: "0 0 20px rgba(0,229,255,0.2)" }} onClick={() => scrollTo("awareness")}
                className="font-mono text-xs font-bold tracking-widest px-8 py-4 rounded bg-transparent border border-cyan-900/40 text-cyan-400 uppercase transition-all">
                EXPLORE CYBER AWARENESS
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-16 py-10 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-[11px] text-slate-500 tracking-widest">TRUSTLAYERLABS © 2025 — CYBER EMERGENCY RESPONSE COMMAND CENTER</div>
        <div className="flex gap-8">
          {["Privacy Policy", "Legal Notice", "About", "Contact"].map((l) => (
            <a key={l} href="#" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors">{l}</a>
          ))}
        </div>
        <div className="font-mono text-[10px] text-slate-500">SYSTEM STATUS: OPERATIONAL | UPTIME: 99.97%</div>
      </footer>
    </div>
  );
}

// ─── CTA CANVAS ───────────────────────────────────────────────────────────────
function CTACanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 3; i++) {
        ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(t * 0.003 * (i + 1) * 0.5);
        ctx.beginPath(); ctx.arc(0, 0, 200 + i * 80, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,23,68,${0.04 - i * 0.01})`; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      }
      for (let i = 0; i < 2; i++) {
        ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-t * 0.002 * (i + 1) * 0.7);
        ctx.beginPath(); ctx.arc(0, 0, 150 + i * 100, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,229,255,0.03)"; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = "rgba(0,229,255,0.04)";
      for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) ctx.fillRect(x, y, 1, 1);
      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}