import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── CSS INJECTION ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  html { scroll-behavior: smooth; }
  body { cursor: crosshair; }
  body::-webkit-scrollbar { width: 4px; }
  body::-webkit-scrollbar-track { background: #020b18; }
  body::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 2px; }
  @keyframes clc-ripple { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(3); opacity: 0; } }
  @keyframes clc-scan { 0% { top: -4px; } 100% { top: 100%; } }
  .clc-scanlines::before { content: ''; position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px); pointer-events: none; z-index: 9999; }
  .clc-tl-dot-ripple::after { content: ''; position: absolute; width: 60px; height: 60px; border: 1px solid rgba(0,229,255,0.2); border-radius: 50%; top: 50%; left: 50%; animation: clc-ripple 2s linear infinite; transform: translate(-50%,-50%); }
  .clc-scan-line { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #00e5ff, transparent); opacity: 0.3; animation: clc-scan 4s linear infinite; }
  .clc-law-card-hover::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, #00e5ff); transition: left 0.5s; }
  .clc-law-card-hover:hover::before { left: 100%; }
  .clc-matrix-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 0%, rgba(0,229,255,0.03) 100%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
  .clc-matrix-card:hover::after { opacity: 1; }
`;

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const C = {
  bg: "#020b18",
  surface: "#041525",
  card: "#071e35",
  border: "#0a3a5c",
  cyan: "#00e5ff",
  cyanDim: "#00b8cc",
  emerald: "#00ff87",
  emeraldDim: "#00cc6a",
  electric: "#4d9fff",
  alert: "#ff3b5c",
  warning: "#ffb700",
  textPrimary: "#e0f4ff",
  textSecondary: "#7eb8d4",
  textMuted: "#3a6a8a",
  mono: "'JetBrains Mono', monospace",
  sans: "'Inter', sans-serif",
} as const;

// ─── DATA ──────────────────────────────────────────────────────────────────────
const LAWS = [
  { sec: "Section 66", cat: "it-act", name: "Computer Related Offences", desc: "Hacking, data theft, unauthorized access to computer systems", penalty: "Up to 3 years imprisonment or ₹5 lakh fine", severity: "high", tags: ["Hacking", "Data Theft", "Unauthorized Access"] },
  { sec: "Section 66C", cat: "it-act", name: "Identity Theft", desc: "Fraudulently using electronic signature, password or unique identification feature", penalty: "Up to 3 years imprisonment and ₹1 lakh fine", severity: "high", tags: ["Identity", "Fraud", "Electronic Signature"] },
  { sec: "Section 66D", cat: "it-act", name: "Cheating by Impersonation", desc: "Cheating using communication device or computer resource while impersonating another person", penalty: "Up to 3 years imprisonment and ₹1 lakh fine", severity: "high", tags: ["Impersonation", "Cheating", "Online Fraud"] },
  { sec: "Section 66E", cat: "it-act", name: "Privacy Violation", desc: "Capturing, publishing or transmitting image of private areas of any person without consent", penalty: "Up to 3 years imprisonment or ₹2 lakh fine", severity: "high", tags: ["Privacy", "Image", "Non-Consensual"] },
  { sec: "Section 66F", cat: "it-act", name: "Cyber Terrorism", desc: "Acts threatening unity, integrity, sovereignty of India or creating terror through cyberspace", penalty: "Life imprisonment", severity: "high", tags: ["Terrorism", "National Security", "Critical Infrastructure"] },
  { sec: "Section 67", cat: "it-act", name: "Publishing Obscene Material", desc: "Publishing or transmitting obscene material in electronic form", penalty: "First conviction: 3 years, ₹5 lakh. Subsequent: 5 years, ₹10 lakh", severity: "high", tags: ["Obscenity", "Online Content"] },
  { sec: "Section 67A", cat: "it-act", name: "Sexually Explicit Content", desc: "Publishing or transmitting material containing sexually explicit act in electronic form", penalty: "First conviction: 5 years, ₹10 lakh. Subsequent: 7 years, ₹10 lakh", severity: "high", tags: ["Explicit Content", "CSAM Prevention"] },
  { sec: "Section 67B", cat: "it-act", name: "Child Pornography", desc: "Publishing sexually explicit content involving children in electronic form", penalty: "First conviction: 5 years, ₹10 lakh. Subsequent: 7 years, ₹10 lakh", severity: "high", tags: ["Child Protection", "POCSO"] },
  { sec: "Section 43", cat: "it-act", name: "Unauthorized Access/Damage", desc: "Accessing, downloading, introducing viruses, denying service to computer systems without permission", penalty: "Compensation up to ₹1 crore", severity: "med", tags: ["Civil Liability", "Hacking", "DOS"] },
  { sec: "Section 72", cat: "it-act", name: "Breach of Confidentiality", desc: "Disclosure of information in breach of lawful contract by authorized persons", penalty: "Up to 2 years imprisonment or ₹1 lakh fine", severity: "med", tags: ["Confidentiality", "Data Breach"] },
  { sec: "BNS 318", cat: "bns", name: "Cheating", desc: "Fraudulently inducing delivery of property or causing damage. Covers online fraud, UPI fraud", penalty: "Up to 7 years imprisonment and fine", severity: "high", tags: ["Fraud", "Online Scam", "UPI"] },
  { sec: "BNS 319", cat: "bns", name: "Cheating by Impersonation", desc: "Cheating by pretending to be another person online or offline", penalty: "Up to 3 years imprisonment and fine", severity: "med", tags: ["Impersonation", "Catfishing"] },
  { sec: "BNS 351", cat: "bns", name: "Criminal Intimidation", desc: "Threats via electronic messages, email, social media to cause alarm", penalty: "Up to 2 years imprisonment or fine or both", severity: "med", tags: ["Threats", "Online Harassment"] },
  { sec: "BNS 74", cat: "bns", name: "Assault/Sexual Harassment Online", desc: "Sexual harassment via electronic communication including unsolicited messages", penalty: "Up to 3 years imprisonment and fine", severity: "high", tags: ["Sexual Harassment", "Online Abuse"] },
  { sec: "Section 420 IPC", cat: "ipc", name: "Cheating & Dishonest Inducement", desc: "Legacy IPC section for cheating — still applicable for pre-2024 cases, now covered under BNS 318", penalty: "Up to 7 years imprisonment and fine", severity: "high", tags: ["Legacy", "Fraud", "Cheating"] },
  { sec: "DPDP 2023", cat: "rights", name: "Digital Personal Data Protection", desc: "Right to information about data processing, correction, erasure of personal data. Data Principal rights", penalty: "Penalty on non-compliance up to ₹250 crore", severity: "med", tags: ["Privacy", "Data Rights", "Consent"] },
  { sec: "IT Rules 2021", cat: "rights", name: "Intermediary Liability Rules", desc: "Social media platforms must remove harmful content within 24-36 hours of complaint. Grievance officer required", penalty: "Platform loses safe harbour protection", severity: "low", tags: ["Platform Accountability", "Content Removal"] },
];

const CRIMES = [
  { icon: "🎣", color: C.alert, title: "Phishing Fraud", sub: "Email / Link Scam", laws: ["IT Act Sec 66D", "BNS 318 - Cheating", "BNS 319 - Impersonation"], penalty: "3–7 years + ₹1–5 lakh fine", threat: 85 },
  { icon: "📱", color: C.warning, title: "UPI Fraud", sub: "Digital Payment Scam", laws: ["IT Act Sec 66D", "BNS 318", "RBI Guidelines"], penalty: "Up to 7 years + fine", threat: 90 },
  { icon: "📷", color: C.alert, title: "QR Code Scam", sub: "Fake Payment QR", laws: ["IT Act Sec 66", "BNS 318 - Cheating", "Payment Act"], penalty: "Up to 7 years imprisonment", threat: 75 },
  { icon: "🪪", color: C.alert, title: "Identity Theft", sub: "Digital ID Misuse", laws: ["IT Act Sec 66C", "BNS 319", "DPDP 2023"], penalty: "3 years + ₹1 lakh fine", threat: 80 },
  { icon: "🎭", color: C.electric, title: "Deepfake Crime", sub: "AI-Generated Abuse", laws: ["IT Act Sec 66E", "IT Act Sec 67", "BNS 74"], penalty: "3–5 years + ₹2–10 lakh fine", threat: 95 },
  { icon: "💬", color: C.cyan, title: "Cyberbullying", sub: "Online Harassment", laws: ["IT Act Sec 66A*", "BNS 351", "BNS 74"], penalty: "2–3 years + fine", threat: 70 },
  { icon: "💾", color: C.alert, title: "Data Theft", sub: "Corporate Espionage", laws: ["IT Act Sec 43", "IT Act Sec 66", "DPDP 2023"], penalty: "3 years + ₹1 crore compensation", threat: 85 },
  { icon: "📧", color: C.warning, title: "Online Harassment", sub: "Stalking / Threats", laws: ["BNS 351", "BNS 78 Stalking", "IT Act Sec 66E"], penalty: "1–3 years + fine", threat: 72 },
  { icon: "💰", color: C.alert, title: "Fake Investment Fraud", sub: "Stock / Crypto Scam", laws: ["BNS 318", "SEBI Act", "IT Act Sec 66D"], penalty: "7+ years + full fine", threat: 92 },
];

const PENALTIES = [
  { law: "IT Act 66F", title: "Cyber Terrorism", imprisonment: "Life", fine: "Unlimited", severity: 100, color: C.alert },
  { law: "IT Act 67A", title: "Explicit Content Publishing", imprisonment: "7 Years", fine: "₹10 Lakh", severity: 88, color: C.alert },
  { law: "BNS 318", title: "Online Fraud / Cheating", imprisonment: "7 Years", fine: "+ Fine", severity: 85, color: C.warning },
  { law: "IT Act 66", title: "Computer Hacking", imprisonment: "3 Years", fine: "₹5 Lakh", severity: 70, color: C.warning },
  { law: "IT Act 66C", title: "Identity Theft", imprisonment: "3 Years", fine: "₹1 Lakh", severity: 68, color: C.warning },
  { law: "DPDP Violation", title: "Data Privacy Breach", imprisonment: "N/A", fine: "₹250 Crore", severity: 80, color: C.electric },
  { law: "IT Act 66E", title: "Privacy Violation", imprisonment: "3 Years", fine: "₹2 Lakh", severity: 65, color: C.cyan },
  { law: "BNS 351", title: "Criminal Intimidation", imprisonment: "2 Years", fine: "+ Fine", severity: 55, color: C.emerald },
];

const RIGHTS = [
  { icon: "📋", title: "Right to File FIR", desc: "You have the absolute right to file a First Information Report (FIR) at any police station for cybercrime. Police cannot refuse to register an FIR for cognizable offences under IT Act.", color: C.cyan },
  { icon: "🔒", title: "Right to Privacy", desc: "Under DPDP Act 2023, you have the right to know how your data is processed, correct inaccurate data, and request erasure of personal data held by digital platforms.", color: C.emerald },
  { icon: "💾", title: "Right to Evidence Preservation", desc: "Courts recognize digital evidence. You must preserve screenshots, call recordings, emails, and transaction IDs. Request police to seize digital devices for forensic analysis.", color: C.electric },
  { icon: "🏦", title: "Bank Fraud Recovery Right", desc: "RBI mandates zero liability for unauthorized transactions reported within 3 working days. Report immediately to both bank and cyber police. Call 1930 helpline.", color: C.warning },
  { icon: "🌐", title: "Cyber Complaint Rights", desc: "You can file complaints at cybercrime.gov.in, call National Cyber Crime Helpline 1930, or visit the nearest cyber crime cell. Anonymous reporting is available.", color: C.cyan },
  { icon: "⚖", title: "Legal Aid Rights", desc: "Under the Legal Services Authorities Act, cybercrime victims can access free legal aid if they cannot afford a lawyer. State Legal Services Authorities provide this service.", color: C.emerald },
  { icon: "🛡", title: "Right Against Re-victimization", desc: "Courts and investigating agencies cannot publicly disclose victim identity in sexual cybercrime cases. Victim protection provisions apply under IPC and IT Act.", color: C.electric },
  { icon: "📱", title: "Platform Accountability Rights", desc: "Under IT Rules 2021, social media platforms must remove harmful content within 24 hours of complaint. You can escalate to Appellate Committee if unresolved.", color: C.warning },
  { icon: "🔍", title: "Right to Investigation Status", desc: "You can demand investigation status updates from investigating officers. Courts can issue directions to police for speedy investigation under CrPC Section 154.", color: C.cyan },
];

const TIMELINE_STEPS = [
  { n: 1, step: "STEP 01", title: "Collect Digital Evidence", desc: "Screenshot everything. Save URLs, timestamps, transaction IDs, email headers, chat logs. Do not delete anything.", emergency: false },
  { n: 2, step: "STEP 02", title: "Secure Your Accounts", desc: "Immediately change passwords, enable 2FA on all accounts. Revoke access to suspicious third-party apps.", emergency: false },
  { n: 3, step: "STEP 03", title: "Contact Your Bank", desc: "For financial fraud: call bank immediately, request transaction reversal, freeze compromised accounts within 3 hours.", emergency: true },
  { n: 4, step: "STEP 04", title: "File Cyber Complaint", desc: "Visit cybercrime.gov.in or call 1930. File online complaint with evidence. Note your complaint ID for tracking.", emergency: false },
  { n: 5, step: "STEP 05", title: "Visit Cyber Cell", desc: "Visit nearest cyber crime police station with printed evidence and complaint ID. Request FIR under relevant IT Act sections.", emergency: false },
  { n: 6, step: "STEP 06", title: "Legal Escalation", desc: "If police fail to act, approach Magistrate under Section 156(3) CrPC. Contact State Cyber Crime Unit or CERT-In.", emergency: false },
];

const AI_CAPS = [
  { icon: "🔍", title: "Scam Category Identification", sub: "AI maps your incident to applicable law sections and reporting channels", active: true },
  { icon: "⚠", title: "Legal Risk Awareness", sub: "Understand what laws apply and what penalties the perpetrator faces", active: true },
  { icon: "📚", title: "Simplified Legal Explanations", sub: "Complex legal language translated to plain, actionable awareness", active: true },
  { icon: "🗺", title: "Reporting Path Navigator", sub: "Step-by-step guidance for your specific cybercrime type", active: true },
  { icon: "🛡", title: "Victim Rights Briefing", sub: "Know exactly which rights apply to your situation", active: true },
  { icon: "📊", title: "Case Precedent Analysis", sub: "Awareness of similar cases and typical judicial outcomes", active: false },
];

const MAP_HOTSPOTS = [
  { city: "Delhi", x: 42, y: 28, level: 95, color: C.alert },
  { city: "Mumbai", x: 28, y: 55, level: 90, color: C.alert },
  { city: "Bangalore", x: 33, y: 75, level: 82, color: C.warning },
  { city: "Hyderabad", x: 37, y: 65, level: 78, color: C.warning },
  { city: "Jamtara", x: 55, y: 42, level: 88, color: C.alert },
  { city: "Chennai", x: 38, y: 80, level: 72, color: C.warning },
  { city: "Kolkata", x: 60, y: 48, level: 70, color: C.cyan },
  { city: "Pune", x: 28, y: 58, level: 75, color: C.warning },
  { city: "Ahmedabad", x: 22, y: 42, level: 68, color: C.cyan },
  { city: "Jaipur", x: 32, y: 32, level: 65, color: C.cyan },
];

const CASES = [
  { id: "CYB-2023-001", title: "Jamtara Phishing Network", desc: "Organized gang operating large-scale phishing operations targeting bank customers across 12 states using spoofed bank websites and fake KYC calls.", law: "IT Act Sec 66D, BNS 318, IT Act Sec 43", outcome: "Multiple convictions — 7 years imprisonment, ₹12 lakh fine recovered", lesson: "Never share OTP. Banks never ask for it.", status: "PROSECUTED" },
  { id: "CYB-2022-087", title: "Deepfake Extortion Case", desc: "Perpetrator used AI-generated deepfake videos of victim to extort money via social media threats. Victim received threatening messages with morphed content.", law: "IT Act Sec 66E, Sec 67, BNS 351", outcome: "Accused arrested, 3 years rigorous imprisonment, ₹2 lakh fine", lesson: "Report deepfakes immediately — evidence preservation is critical.", status: "PROSECUTED" },
  { id: "CYB-2023-156", title: "Crypto Investment Fraud", desc: "Fraudulent trading platform promised 40% monthly returns. ₹45 crore collected from 800+ victims via social media investment groups before platform vanished.", law: "BNS 318, SEBI Act, IT Act Sec 66D", outcome: "ED investigation ongoing, assets frozen, 3 masterminds arrested", lesson: "No genuine investment guarantees fixed returns. Verify SEBI registration.", status: "UNDER TRIAL" },
  { id: "CYB-2022-203", title: "Corporate Data Theft", desc: "Disgruntled employee exfiltrated confidential customer database of 2 lakh records before resignation. Data was sold to competitor.", law: "IT Act Sec 43, Sec 66, Sec 72, Trade Secrets Act", outcome: "Civil liability of ₹80 lakh + criminal prosecution, 2 years sentence", lesson: "Implement least-privilege access and audit logs.", status: "PROSECUTED" },
  { id: "CYB-2023-344", title: "SIM Swap Bank Fraud", desc: "Criminal colluded with telecom insiders to port victim SIM, intercepting OTPs to drain bank accounts of ₹23 lakhs overnight.", law: "IT Act Sec 66, Sec 66D, BNS 318, Telecom Act", outcome: "₹18 lakh recovered, telecom employee dismissed and prosecuted", lesson: "Enable SIM lock and use authenticator apps, not SMS OTP.", status: "PROSECUTED" },
  { id: "CYB-2023-421", title: "Sextortion Campaign", desc: "Pan-India gang created fake female profiles, lured victims via video calls, recorded and threatened to share unless money was paid.", law: "IT Act Sec 66E, Sec 67, BNS 74, 351", outcome: "Gang dismantled across 6 states, 11 arrested, victims supported", lesson: "Report immediately without paying. Payment escalates demands.", status: "PROSECUTED" },
];

const ORBIT_NODES = [
  { label: "IT Act\nSec 66", color: C.cyan, style: { top: 10, left: "50%", transform: "translateX(-50%)" }, delay: 0 },
  { label: "BNS\n319-320", color: C.emerald, style: { top: "50%", right: 10, transform: "translateY(-50%)" }, delay: 0.5 },
  { label: "DPDP\n2023", color: C.electric, style: { bottom: 10, left: "50%", transform: "translateX(-50%)" }, delay: 1.0 },
  { label: "IPC\n420", color: C.warning, style: { top: "50%", left: 10, transform: "translateY(-50%)" }, delay: 1.5 },
  { label: "Cert-In\nRules", color: C.alert, style: { top: "25%", right: "20%" }, delay: 0.25 },
  { label: "POCSO\nAct", color: C.cyan, style: { bottom: "25%", left: "20%" }, delay: 0.75 },
];

// ─── NEURAL CANVAS ─────────────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.4)";
        ctx.fill();
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.15 * (1 - d / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.3 }}
    />
  );
}

// ─── SECTION WRAPPER WITH FADE-IN ─────────────────────────────────────────────
function FadeSection({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: C.mono, fontSize: 9, color: C.cyan, letterSpacing: 3, textTransform: "uppercase", marginBottom: "1rem" }}>
        <span style={{ width: 20, height: 1, background: C.cyan, display: "inline-block" }} />
        {label}
      </div>
      <h2 style={{ fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 800, letterSpacing: -0.5, marginBottom: "0.5rem", color: C.textPrimary }}>{title}</h2>
      {sub && <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, maxWidth: 560, marginBottom: "3rem", fontWeight: 300 }}>{sub}</p>}
    </>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(2,11,24,0.9)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${C.cyan},${C.electric})`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: "#000", letterSpacing: -0.5 }}>TLL</div>
        <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: C.cyan, letterSpacing: 2, textTransform: "uppercase" }}>TrustLayerLabs</div>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {[["law-explorer", "Laws"], ["matrix", "Matrix"], ["rights", "Rights"], ["reporting", "Report"], ["cases", "Cases"]].map(([id, label]) => (
          <span key={id} onClick={() => scrollTo(id)} style={{ fontFamily: C.mono, fontSize: 10, color: C.textSecondary, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.cyan)} onMouseLeave={e => (e.currentTarget.style.color = C.textSecondary)}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: C.mono, fontSize: 9, color: C.emerald, letterSpacing: 1 }}>
        <motion.span style={{ width: 6, height: 6, background: C.emerald, borderRadius: "50%", display: "inline-block" }} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        INTEL GRID ACTIVE
      </div>
    </nav>
  );
}

// ─── HERO HOLOGRAM ─────────────────────────────────────────────────────────────
function HeroHologram() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", width: 480, height: 480 }}>
        {/* Scan line */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="clc-scan-line" />
        </div>
        {/* Rings */}
        {[
          { size: 440, color: "rgba(0,229,255,0.3)", dur: 30, rev: false, dashed: false },
          { size: 360, color: "rgba(0,255,135,0.2)", dur: 20, rev: true, dashed: true },
          { size: 280, color: "rgba(77,159,255,0.3)", dur: 15, rev: false, dashed: false },
          { size: 200, color: "rgba(0,229,255,0.5)", dur: 10, rev: true, dashed: false },
        ].map((r, i) => (
          <motion.div key={i} style={{ position: "absolute", borderRadius: "50%", border: `1px ${r.dashed ? "dashed" : "solid"} ${r.color}`, width: r.size, height: r.size, top: "50%", left: "50%", marginTop: -r.size / 2, marginLeft: -r.size / 2 }}
            animate={{ rotate: r.rev ? -360 : 360 }} transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }} />
        ))}
        {/* Orbit nodes */}
        {ORBIT_NODES.map((n, i) => (
          <motion.div key={i} style={{ position: "absolute", width: 36, height: 36, background: C.card, border: `1px solid ${n.color}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontSize: 7, fontWeight: 600, textAlign: "center", lineHeight: 1.2, textTransform: "uppercase", letterSpacing: 0.5, color: n.color, whiteSpace: "pre-line", ...n.style }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 3, delay: n.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        {/* Core */}
        <motion.div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,229,255,0.05)", border: `1px solid ${C.cyan}`, borderRadius: "50%" }}
          animate={{ boxShadow: [`0 0 10px rgba(0,229,255,0.3)`, `0 0 30px rgba(0,229,255,0.7), 0 0 60px rgba(0,229,255,0.3)`, `0 0 10px rgba(0,229,255,0.3)`] }} transition={{ duration: 2, repeat: Infinity }}>
          <svg viewBox="0 0 50 50" width="50" height="50" fill="none">
            <circle cx="25" cy="25" r="20" stroke={C.cyan} strokeWidth="1" strokeDasharray="4 2" />
            <polygon points="25,10 35,30 15,30" fill="none" stroke={C.cyan} strokeWidth="1.5" />
            <circle cx="25" cy="25" r="4" fill={C.cyan} opacity="0.6" />
            <line x1="25" y1="5" x2="25" y2="15" stroke={C.emerald} strokeWidth="0.5" />
            <line x1="25" y1="35" x2="25" y2="45" stroke={C.emerald} strokeWidth="0.5" />
            <line x1="5" y1="25" x2="15" y2="25" stroke={C.emerald} strokeWidth="0.5" />
            <line x1="35" y1="25" x2="45" y2="25" stroke={C.emerald} strokeWidth="0.5" />
          </svg>
        </motion.div>
        {/* Data panels */}
        {[
          { style: { top: 60, left: 20 }, color: C.cyan, label: "ACTIVE SECTIONS", value: "47", delay: 0.3 },
          { style: { bottom: 60, right: 20 }, color: C.emerald, label: "LEGAL DATABASE", value: "LIVE", delay: 1.2 },
          { style: { top: 200, right: 0 }, color: C.alert, label: "THREAT LEVEL", value: "HIGH", delay: 0.7 },
        ].map((p, i) => (
          <motion.div key={i} style={{ position: "absolute", background: "rgba(4,21,37,0.95)", border: `1px solid ${C.border}`, borderRadius: 2, padding: "8px 12px", fontFamily: C.mono, fontSize: 8, ...p.style }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 4, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}>
            <div style={{ color: C.textMuted, fontSize: 7, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{p.label}</div>
            <div style={{ fontWeight: 700, fontSize: 11, color: p.color }}>{p.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: 56, position: "relative", overflow: "hidden" }}>
      <motion.div style={{ padding: "4rem 3rem 4rem 4rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
        initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 2, padding: "6px 12px", fontFamily: C.mono, fontSize: 9, color: C.cyan, letterSpacing: 2, textTransform: "uppercase", marginBottom: "1.5rem", width: "fit-content" }}>
          <motion.span style={{ width: 6, height: 6, background: C.emerald, borderRadius: "50%", display: "inline-block" }} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          CLASSIFICATION: ACTIVE INTELLIGENCE
        </div>
        <h1 style={{ fontSize: "clamp(28px,3.5vw,52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -1, marginBottom: "1rem" }}>
          <span style={{ color: C.textPrimary }}>NATIONAL CYBER</span><br />
          <span style={{ color: C.cyan }}>LEGAL INTELLIGENCE</span><br />
          <span style={{ color: C.emerald }}>GRID</span>
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 420, fontWeight: 300 }}>
          Understand Indian cyber laws, digital rights, penalties, and cybercrime reporting. An AI-powered intelligence system for the digital age.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "2.5rem" }}>
          {[
            { label: "IT ACT INTELLIGENCE", color: C.cyan },
            { label: "IPC/BNS ANALYSIS", color: C.emerald },
            { label: "VICTIM RIGHTS", color: C.electric },
            { label: "LEGAL AWARENESS", color: C.warning },
          ].map((item) => (
            <motion.div key={item.label} style={{ background: "rgba(7,30,53,0.8)", border: `1px solid ${C.border}`, borderRadius: 2, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, fontFamily: C.mono, fontSize: 9, color: C.textSecondary, letterSpacing: 1, textTransform: "uppercase", cursor: "default" }}
              whileHover={{ borderColor: C.cyan, color: C.cyan, background: "rgba(0,229,255,0.05)" }} transition={{ duration: 0.3 }}>
              <div style={{ width: 14, height: 14, background: item.color, borderRadius: 2, flexShrink: 0, opacity: 0.8 }} />
              {item.label}
            </motion.div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <motion.button onClick={() => scrollTo("law-explorer")} style={{ background: C.cyan, color: "#000", border: "none", padding: "12px 24px", fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}
            animate={{ boxShadow: ["0 0 10px rgba(0,229,255,0.3)", "0 0 30px rgba(0,229,255,0.7), 0 0 60px rgba(0,229,255,0.3)", "0 0 10px rgba(0,229,255,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ background: C.emerald, y: -2 }}>
            EXPLORE CYBER LAWS
          </motion.button>
          <motion.button onClick={() => scrollTo("reporting")} style={{ background: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, padding: "12px 24px", fontFamily: C.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}
            whileHover={{ background: "rgba(0,229,255,0.1)", y: -2 }} transition={{ duration: 0.3 }}>
            EMERGENCY GUIDANCE
          </motion.button>
        </div>
      </motion.div>
      <motion.div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <HeroHologram />
      </motion.div>
    </section>
  );
}

// ─── LAW EXPLORER ─────────────────────────────────────────────────────────────
function LawExplorer() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openCard, setOpenCard] = useState<string | null>(null);

  const filtered = useMemo(() => LAWS.filter(l => {
    const catMatch = filter === "all" || l.cat === filter;
    const s = search.toLowerCase();
    const searchMatch = !s || l.name.toLowerCase().includes(s) || l.desc.toLowerCase().includes(s) || l.sec.toLowerCase().includes(s);
    return catMatch && searchMatch;
  }), [filter, search]);

  const sevStyle = (sev: string) => {
    if (sev === "high") return { background: "rgba(255,59,92,0.15)", color: C.alert, border: "1px solid rgba(255,59,92,0.3)" };
    if (sev === "med") return { background: "rgba(255,183,0,0.15)", color: C.warning, border: "1px solid rgba(255,183,0,0.3)" };
    return { background: "rgba(0,229,255,0.1)", color: C.cyan, border: "1px solid rgba(0,229,255,0.3)" };
  };

  return (
    <section id="law-explorer" style={{ padding: "5rem 4rem", background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <FadeSection>
        <SectionHeader label="LAW INTELLIGENCE ARCHIVE" title="Interactive Law Explorer" sub="Search and navigate India's cyber legal framework. Click any law entry to expand intelligence briefing." />
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden", transition: "border-color 0.3s" }}
          onFocus={e => e.currentTarget.style.borderColor = C.cyan} onBlur={e => e.currentTarget.style.borderColor = C.border}>
          <span style={{ fontFamily: C.mono, fontSize: 12, color: C.cyan, letterSpacing: 1 }}>&gt;_</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IT Act sections, crimes, penalties..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: C.mono, fontSize: 13, color: C.textPrimary, caretColor: C.cyan }} />
          <span style={{ fontFamily: C.mono, fontSize: 9, color: C.emerald, border: "1px solid rgba(0,255,135,0.3)", padding: "2px 8px", borderRadius: 1, letterSpacing: 1, textTransform: "uppercase" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: "2rem", flexWrap: "wrap" }}>
          {[["all", "ALL LAWS"], ["it-act", "IT ACT 2000"], ["bns", "BNS 2023"], ["ipc", "IPC SECTIONS"], ["rights", "DIGITAL RIGHTS"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2, padding: "6px 14px", cursor: "pointer", border: `1px solid ${filter === val ? C.cyan : C.border}`, background: filter === val ? "rgba(0,229,255,0.08)" : "transparent", color: filter === val ? C.cyan : C.textSecondary, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 1, background: C.border }}>
          {filtered.map((l) => (
            <motion.div key={l.sec} onClick={() => setOpenCard(openCard === l.sec ? null : l.sec)}
              className="clc-law-card-hover"
              style={{ background: C.card, padding: "1.25rem", cursor: "pointer", position: "relative", overflow: "hidden" }}
              whileHover={{ background: "rgba(7,30,53,0.95)" }} transition={{ duration: 0.3 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.cyan, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{l.sec}</span>
                <span style={{ fontFamily: C.mono, fontSize: 8, borderRadius: 1, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase", ...sevStyle(l.severity) }}>{l.severity.toUpperCase()}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 6, lineHeight: 1.3 }}>{l.name}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, marginBottom: "0.75rem", fontWeight: 300 }}>{l.desc}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {l.tags.map(t => <span key={t} style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: 0.5, color: C.textMuted, border: "1px solid rgba(58,106,138,0.4)", padding: "2px 6px", borderRadius: 1 }}>{t}</span>)}
              </div>
              <AnimatePresence>
                {openCard === l.sec && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                    style={{ paddingTop: "0.75rem", marginTop: "0.75rem", borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
                    <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textSecondary, lineHeight: 1.6, marginBottom: 6 }}>
                      <span style={{ color: C.textMuted }}>PENALTY: </span>
                      <span style={{ color: C.alert, fontWeight: 600 }}>{l.penalty}</span>
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted }}>▼ CLICK TO COLLAPSE</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

// ─── CRIME MATRIX ──────────────────────────────────────────────────────────────
function CrimeMatrix() {
  return (
    <section id="matrix" style={{ padding: "5rem 4rem" }}>
      <SectionHeader label="THREAT-LAW MAPPING ENGINE" title="Cyber Crime Law Matrix" sub="Comprehensive intelligence mapping of cybercrime categories to applicable legal sections and penalties." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1.5rem" }}>
        {CRIMES.map((c, i) => (
          <FadeSection key={c.title}>
            <motion.div className="clc-matrix-card"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: "1.5rem", cursor: "pointer", position: "relative", overflow: "hidden" }}
              whileHover={{ borderColor: C.cyan, y: -4, boxShadow: "0 0 30px rgba(0,229,255,0.1)" }} transition={{ duration: 0.4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: "1rem", border: `1px solid ${c.color}40`, background: `${c.color}15` }}>{c.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: C.textPrimary }}>{c.title}</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "1rem" }}>{c.sub}</div>
              <div style={{ marginBottom: "1rem" }}>
                {c.laws.map(l => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontFamily: C.mono, fontSize: 10, color: C.textSecondary }}>
                    <span style={{ fontSize: 6, color: C.cyan }}>▶</span> {l}
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,59,92,0.05)", border: "1px solid rgba(255,59,92,0.15)", borderRadius: 2, padding: 10, marginBottom: "1rem" }}>
                <div style={{ fontFamily: C.mono, fontSize: 8, color: C.alert, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>⚠ LEGAL CONSEQUENCE</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{c.penalty}</div>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden" }}>
                <motion.div style={{ height: "100%", borderRadius: 1, background: c.threat > 85 ? C.alert : c.threat > 70 ? C.warning : C.cyan }}
                  initial={{ width: 0 }} whileInView={{ width: `${c.threat}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.05 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: C.mono, fontSize: 8, color: C.textMuted }}>
                <span>THREAT LEVEL</span>
                <span style={{ color: c.threat > 85 ? C.alert : c.threat > 70 ? C.warning : C.cyan }}>{c.threat}%</span>
              </div>
            </motion.div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── PENALTY VISUALIZATION ─────────────────────────────────────────────────────
function PenaltyViz() {
  return (
    <section id="penalties" style={{ padding: "5rem 4rem", background: C.surface }}>
      <SectionHeader label="LEGAL IMPACT ASSESSMENT" title="Penalty Visualization" sub="Classified briefing on legal consequences under India's cyber law framework." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "1.5rem" }}>
        {PENALTIES.map((p) => {
          const r = 48, circ = 2 * Math.PI * r, dash = circ * (p.severity / 100);
          return (
            <FadeSection key={p.law}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: "1.5rem", textAlign: "center" }}>
                <div style={{ width: 100, height: 100, margin: "0 auto 1rem", position: "relative" }}>
                  <svg viewBox="0 0 110 110" width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="55" cy="55" r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="6" fill="none" />
                    <motion.circle cx="55" cy="55" r={r} stroke={p.color} strokeWidth="6" fill="none"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circ}` }} whileInView={{ strokeDasharray: `${dash} ${circ}` }}
                      viewport={{ once: true }} transition={{ duration: 1.5 }} />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: C.mono, fontWeight: 700, fontSize: 18, color: p.color }}>{p.severity}</div>
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.cyan, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{p.law}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.5 }}>
                  <span style={{ color: C.textMuted }}>Prison:</span> <strong>{p.imprisonment}</strong><br />
                  <span style={{ color: C.textMuted }}>Fine:</span> <strong>{p.fine}</strong>
                </div>
              </div>
            </FadeSection>
          );
        })}
      </div>
    </section>
  );
}

// ─── RIGHTS CENTER ─────────────────────────────────────────────────────────────
function RightsCenter() {
  return (
    <section id="rights" style={{ padding: "5rem 4rem" }}>
      <SectionHeader label="VICTIM INTELLIGENCE MODULE" title="Victim Rights Center" sub="Know your legal rights. Every cybercrime victim is protected by law. Here is your intelligence briefing." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "1.5rem" }}>
        {RIGHTS.map((r) => (
          <FadeSection key={r.title}>
            <motion.div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${r.color}`, padding: "1.5rem", cursor: "default" }}
              whileHover={{ background: "rgba(0,229,255,0.03)", borderColor: "rgba(0,229,255,0.4)" }} transition={{ duration: 0.3 }}>
              <div style={{ fontSize: 24, marginBottom: "0.75rem" }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6, fontWeight: 300 }}>{r.desc}</div>
            </motion.div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── REPORTING TIMELINE ────────────────────────────────────────────────────────
function ReportingTimeline() {
  return (
    <section id="reporting" style={{ padding: "5rem 4rem", background: C.surface }}>
      <SectionHeader label="RESPONSE PROTOCOL SYSTEM" title="Reporting Protocol Timeline" sub="Follow this intelligence-grade incident response protocol to maximize legal protection and recovery." />
      <div style={{ position: "relative", padding: "0 2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${C.cyanDim}, ${C.emeraldDim}, transparent)`, transform: "translateX(-50%)" }} />
        {TIMELINE_STEPS.map((s, i) => {
          const isLeft = i % 2 === 0;
          return (
            <FadeSection key={s.n}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", marginBottom: "3rem", alignItems: "center" }}>
                <div style={{ padding: "1.5rem", order: isLeft ? 1 : 3 }}>
                  {isLeft && (
                    <motion.div style={{ background: C.card, border: `1px solid ${s.emergency ? C.alert : C.border}`, borderRadius: 2, padding: "1rem" }}
                      animate={s.emergency ? { boxShadow: ["0 0 10px rgba(255,59,92,0.3)", "0 0 30px rgba(255,59,92,0.7)", "0 0 10px rgba(255,59,92,0.3)"] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}>
                      <div style={{ fontFamily: C.mono, fontSize: 9, color: s.emergency ? C.alert : C.cyan, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.step}{s.emergency ? " ⚡ PRIORITY" : ""}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{s.desc}</div>
                    </motion.div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", order: 2 }}>
                  <div className="clc-tl-dot-ripple" style={{ width: 40, height: 40, background: C.card, border: `2px solid ${C.cyan}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontWeight: 700, fontSize: 13, color: C.cyan, position: "relative", zIndex: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{s.step}</div>
                </div>
                <div style={{ padding: "1.5rem", order: isLeft ? 3 : 1 }}>
                  {!isLeft && (
                    <motion.div style={{ background: C.card, border: `1px solid ${s.emergency ? C.alert : C.border}`, borderRadius: 2, padding: "1rem" }}
                      animate={s.emergency ? { boxShadow: ["0 0 10px rgba(255,59,92,0.3)", "0 0 30px rgba(255,59,92,0.7)", "0 0 10px rgba(255,59,92,0.3)"] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}>
                      <div style={{ fontFamily: C.mono, fontSize: 9, color: s.emergency ? C.alert : C.cyan, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.step}{s.emergency ? " ⚡ PRIORITY" : ""}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{s.desc}</div>
                    </motion.div>
                  )}
                </div>
              </div>
            </FadeSection>
          );
        })}
      </div>
    </section>
  );
}

// ─── AI PANEL ──────────────────────────────────────────────────────────────────
function AIPanel() {
  return (
    <section id="ai-panel" style={{ padding: "5rem 4rem", background: `linear-gradient(180deg, ${C.bg} 0%, rgba(0,229,255,0.02) 50%, ${C.bg} 100%)`, borderTop: `1px solid ${C.border}` }}>
      <SectionHeader label="NEURAL LEGAL INTELLIGENCE" title="AI Legal Assistance Panel" sub="Awareness-first AI guidance for navigating India's cyber legal landscape." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
        <div>
          <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 2rem" }}>
            <motion.div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(0,229,255,0.3)" }} animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
            <motion.div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "1px dashed rgba(0,255,135,0.2)" }} animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
            <motion.div style={{ position: "absolute", inset: 30, background: "rgba(0,229,255,0.05)", border: `1px solid ${C.cyan}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
              animate={{ boxShadow: ["0 0 10px rgba(0,229,255,0.3)", "0 0 30px rgba(0,229,255,0.7)", "0 0 10px rgba(0,229,255,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}>
              <div style={{ fontFamily: C.mono, fontSize: 40, color: C.cyan, opacity: 0.8 }}>⚖</div>
            </motion.div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.cyan, letterSpacing: 2, marginBottom: 4 }}>NEURAL LAW ENGINE</div>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>AWARENESS MODE ACTIVE</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {AI_CAPS.map((cap) => (
            <motion.div key={cap.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12, cursor: "default" }}
              whileHover={{ borderColor: C.emerald, background: "rgba(0,255,135,0.03)" }} transition={{ duration: 0.3 }}>
              <div style={{ width: 32, height: 32, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{cap.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.textPrimary, marginBottom: 2 }}>{cap.title}</div>
                <div style={{ fontSize: 11, color: C.textSecondary, fontWeight: 300 }}>{cap.sub}</div>
              </div>
              <div style={{ fontFamily: C.mono, fontSize: 8, color: cap.active ? C.emerald : C.textMuted, letterSpacing: 1 }}>{cap.active ? "● ACTIVE" : "○ COMING"}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INDIA MAP ─────────────────────────────────────────────────────────────────
function IntelMap() {
  return (
    <section id="intel-map" style={{ padding: "5rem 4rem", background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <SectionHeader label="NATIONAL INTELLIGENCE GRID" title="Cyber Crime Intelligence Map" sub="Live cyber awareness visualization across Indian states. Hotspot intelligence and legal response indicators." />
      <div style={{ position: "relative", background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, height: 400, overflow: "hidden", marginBottom: "2rem" }}>
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        {/* India outline suggestion */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ width: "55%", height: "85%", border: "1px solid rgba(0,229,255,0.06)", borderRadius: "30% 20% 40% 30% / 20% 30% 50% 40%", background: "rgba(0,229,255,0.02)" }} />
        </div>
        {MAP_HOTSPOTS.map((h) => (
          <div key={h.city} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%` }}>
            <motion.div style={{ position: "absolute", borderRadius: "50%", border: `1px solid ${h.color}50`, background: `${h.color}20`, width: h.level / 3, height: h.level / 3, transform: "translate(-50%,-50%)" }}
              animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
            <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: h.color, boxShadow: `0 0 10px ${h.color}`, transform: "translate(-50%,-50%)" }} />
            <div style={{ position: "absolute", fontFamily: C.mono, fontSize: 8, letterSpacing: 1, color: h.color, transform: "translate(-50%, -200%)", whiteSpace: "nowrap", textTransform: "uppercase", paddingBottom: 4 }}>{h.city}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
        {[
          { color: C.alert, label: "HIGH RISK ZONE (Active Hotspot)" },
          { color: C.warning, label: "MEDIUM RISK ZONE (Alert Level)" },
          { color: C.cyan, label: "MONITORED ZONE (Awareness Level)" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: C.mono, fontSize: 10, color: C.textSecondary }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CASE STUDIES ──────────────────────────────────────────────────────────────
function CaseStudies() {
  return (
    <section id="cases" style={{ padding: "5rem 4rem", background: C.surface }}>
      <SectionHeader label="FORENSIC INTELLIGENCE ARCHIVE" title="Case Study Archive" sub="Real-world cyber incidents, applicable laws, and judicial outcomes. Intelligence briefings for awareness." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: "1.5rem" }}>
        {CASES.map((c) => (
          <FadeSection key={c.id}>
            <motion.div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden", cursor: "pointer" }}
              whileHover={{ borderColor: C.cyan, y: -2 }} transition={{ duration: 0.3 }}>
              <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>{c.id}</span>
                <span style={{ fontFamily: C.mono, fontSize: 8, padding: "2px 8px", borderRadius: 1, letterSpacing: 1, textTransform: "uppercase", background: "rgba(0,255,135,0.1)", color: C.emerald, border: "1px solid rgba(0,255,135,0.2)" }}>{c.status}</span>
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, fontWeight: 300, marginBottom: "1rem" }}>{c.desc}</div>
                <div style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 2, padding: 10, marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.cyan, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>JUDICIAL OUTCOME</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{c.outcome}</div>
                </div>
                <div style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.2)", borderRadius: 2, padding: 10, marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.emerald, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>LAWS APPLIED</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: C.textSecondary }}>{c.law}</div>
                </div>
                <div style={{ fontSize: 11, color: C.emerald, fontStyle: "italic", borderLeft: `2px solid ${C.emerald}`, paddingLeft: 8 }}>💡 {c.lesson}</div>
              </div>
            </motion.div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="cta" style={{ position: "relative", padding: "8rem 4rem", textAlign: "center", overflow: "hidden", background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      <FadeSection>
        <h2 style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: "1.5rem", position: "relative", color: C.textPrimary }}>
          KNOW THE LAW.<br /><span style={{ color: C.cyan }}>DEFEND YOUR DIGITAL RIGHTS.</span>
        </h2>
        <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 500, margin: "0 auto 3rem", lineHeight: 1.6, fontWeight: 300, position: "relative" }}>
          India's cyber legal framework protects every digital citizen. Understanding your rights is the first line of defense.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <motion.button onClick={() => scrollTo("law-explorer")} style={{ background: C.cyan, color: "#000", border: "none", padding: "12px 24px", fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}
            animate={{ boxShadow: ["0 0 10px rgba(0,229,255,0.3)", "0 0 30px rgba(0,229,255,0.7)", "0 0 10px rgba(0,229,255,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ background: C.emerald, y: -2 }}>
            EXPLORE CYBER SAFETY
          </motion.button>
          <motion.button onClick={() => scrollTo("matrix")} style={{ background: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, padding: "12px 24px", fontFamily: C.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}
            whileHover={{ background: "rgba(0,229,255,0.1)", y: -2 }} transition={{ duration: 0.3 }}>
            LAUNCH SCAM ANALYSIS
          </motion.button>
        </div>
      </FadeSection>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "2rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>TRUSTLAYERLABS — NATIONAL CYBER LEGAL INTELLIGENCE GRID</div>
        <div style={{ fontFamily: C.mono, fontSize: 8, color: C.textMuted, marginTop: 4, letterSpacing: 1 }}>FOR EDUCATIONAL AND AWARENESS PURPOSES ONLY — NOT LEGAL ADVICE</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted }}>CONSULT A QUALIFIED LAWYER FOR LEGAL MATTERS</div>
        <div style={{ fontFamily: C.mono, fontSize: 9, color: C.textMuted, marginTop: 4 }}>CYBER HELPLINE: 1930 | CYBERCRIME.GOV.IN</div>
      </div>
    </footer>
  );
}

// ─── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function ReportingCommandCenter() {
  useEffect(() => {
    // Inject global styles once
    const id = "clc-global-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = GLOBAL_STYLES;
      document.head.appendChild(tag);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="clc-scanlines" style={{ background: C.bg, color: C.textPrimary, fontFamily: C.sans, overflowX: "hidden", lineHeight: 1.6 }}>
      <NeuralCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <LawExplorer />
        <CrimeMatrix />
        <PenaltyViz />
        <RightsCenter />
        <ReportingTimeline />
        <AIPanel />
        <IntelMap />
        <CaseStudies />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}