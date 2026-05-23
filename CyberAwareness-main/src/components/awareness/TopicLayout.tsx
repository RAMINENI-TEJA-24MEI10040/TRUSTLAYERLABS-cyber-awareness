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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/awareness"
            className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-slate-400 hover:text-cyan-400 transition-colors">
            ← Back to Awareness
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-xs text-slate-400">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-7">
        {/* Hero header */}
        <div className="rounded-2xl p-7 relative overflow-hidden bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 transition-colors duration-300"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(248,250,252,0.96) 0%, ${accentColor}12 100%)`,
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
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{title}</h1>
              <p className="text-sm text-gray-700 dark:text-slate-400 leading-relaxed max-w-2xl">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">{children}</div>

        {/* Report CTA */}
        <div className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-slate-400">🚨 Been targeted? Report immediately — every minute counts.</p>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:1930"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105 bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/20">
              📞 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 text-cyan-700 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-500/20">
              cybercrime.gov.in ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
