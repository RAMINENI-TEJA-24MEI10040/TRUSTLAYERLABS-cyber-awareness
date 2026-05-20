import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const modules = [
  { title: 'Phishing Awareness',  href: '/awareness/phishing',       icon: '🎣', desc: 'Recognize fake emails, SMS, and websites trying to steal your credentials and OTPs.', tag: 'Most Common', tagBg: 'rgba(248,113,113,0.1)', tagColor: '#f87171', tagBorder: 'rgba(248,113,113,0.25)' },
  { title: 'UPI Fraud',           href: '/awareness/upi-fraud',      icon: '💸', desc: 'Stay safe from fake collect requests, screen-sharing scams, and PIN theft.',           tag: 'High Risk',    tagBg: 'rgba(249,115,22,0.1)',  tagColor: '#f97316', tagBorder: 'rgba(249,115,22,0.25)'  },
  { title: 'QR Code Scam',        href: '/awareness/qr-scam',        icon: '📷', desc: 'Learn how scammers weaponize QR codes to silently drain your bank account.',           tag: 'Rising Threat',tagBg: 'rgba(234,179,8,0.1)',   tagColor: '#eab308', tagBorder: 'rgba(234,179,8,0.25)'   },
  { title: 'Social Media Scams',  href: '/awareness/social-media',   icon: '📱', desc: 'Identify fake profiles, lottery fraud, and investment scams on WhatsApp & Instagram.', tag: 'Widespread',   tagBg: 'rgba(96,165,250,0.1)',  tagColor: '#60a5fa', tagBorder: 'rgba(96,165,250,0.25)'  },
  { title: 'Deepfake Awareness',  href: '/awareness/deepfake',       icon: '🎭', desc: 'Understand AI-generated fake videos used for blackmail, fraud, and misinformation.',   tag: 'AI Threat',    tagBg: 'rgba(34,211,238,0.1)',  tagColor: '#22d3ee', tagBorder: 'rgba(34,211,238,0.25)'  },
  { title: 'Identity Theft',      href: '/awareness/identity-theft', icon: '🪪', desc: 'Protect your Aadhaar, PAN, and personal data from being stolen and misused.',          tag: 'Critical',     tagBg: 'rgba(248,113,113,0.1)', tagColor: '#f87171', tagBorder: 'rgba(248,113,113,0.25)' },
  { title: 'Password & MFA',      href: '/awareness/password-mfa',   icon: '🔐', desc: 'Build strong passwords and enable multi-factor authentication on all accounts.',        tag: 'Essential',    tagBg: 'rgba(74,222,128,0.1)',  tagColor: '#4ade80', tagBorder: 'rgba(74,222,128,0.25)'  },
];

const stats = [
  { value: '₹1,750 Cr+', label: 'Lost to cybercrime (2023)' },
  { value: '15.9 Lakh',  label: 'Complaints filed' },
  { value: '1930',       label: 'National Helpline' },
  { value: '7 Topics',   label: 'In this module' },
];

export default function AwarenessIndex() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← Back to Home
          </a>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-400">Cyber Awareness Module</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden px-8 py-16 text-center"
          style={{ background: 'linear-gradient(160deg, #0f172a 0%, #0c1a2e 50%, #0f172a 100%)', border: '1px solid #1e293b' }}>
          <div className="absolute -top-16 left-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-16 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.09) 0%, transparent 65%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7 uppercase tracking-wider"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee' }}>
              <Shield className="w-3.5 h-3.5" /> Cyber Awareness Module
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
              Stay Safe in the{' '}
              <span style={{ background: 'linear-gradient(90deg,#22d3ee,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Digital World
              </span>
            </h1>
            <p className="text-sm max-w-lg mx-auto mb-9 text-slate-500">
              Learn to identify cyber threats, protect your identity, and report cybercrime — all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/awareness/phishing"
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:brightness-110 text-slate-950"
                style={{ background: 'linear-gradient(135deg,#0e7490,#22d3ee)' }}>
                Start Learning →
              </Link>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
                className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 text-slate-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b' }}>
                Report Cybercrime ↗
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
              <div className="text-xl font-bold mb-1 text-cyan-400">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-base font-bold text-slate-200">📚 Awareness Modules</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
              7 Topics
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <Link key={m.href} to={m.href}
                className="group block rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)' }}>
                    {m.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: m.tagBg, color: m.tagColor, border: `1px solid ${m.tagBorder}` }}>
                    {m.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1.5 text-white group-hover:text-cyan-400 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">{m.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-700 group-hover:text-cyan-400 transition-colors">
                  Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Helpline banner */}
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, rgba(14,116,144,0.18) 100%)', border: '1px solid rgba(34,211,238,0.18)' }}>
          <div>
            <div className="font-bold text-base text-white mb-1">🚨 Victim of Cybercrime?</div>
            <p className="text-sm text-slate-500">Report immediately at the National Cyber Crime Portal or call the helpline.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:1930"
              className="px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#b91c1c,#ef4444)' }}>
              📞 Call 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}>
              Report Online
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
