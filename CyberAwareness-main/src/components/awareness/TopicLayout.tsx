import { Link } from 'react-router-dom';

interface TopicLayoutProps {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  children: React.ReactNode;
}

export default function TopicLayout({ icon, title, subtitle, accentColor, children }: TopicLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/awareness"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← Back to Awareness
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-400">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-7">
        {/* Hero header */}
        <div className="rounded-2xl p-7 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, ${accentColor}12 100%)`,
            border: `1px solid ${accentColor}28`,
          }}
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accentColor}18 0%, transparent 65%)` }} />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35` }}>
              {icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{title}</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">{children}</div>

        {/* Report CTA */}
        <div className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800">
          <p className="text-sm text-slate-500">🚨 Been targeted? Report immediately — every minute counts.</p>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:1930"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#b91c1c,#ef4444)' }}>
              📞 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}>
              cybercrime.gov.in ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
