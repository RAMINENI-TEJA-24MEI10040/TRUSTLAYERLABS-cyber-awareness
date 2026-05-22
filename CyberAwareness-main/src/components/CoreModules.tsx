import { Shield, Scale, Siren, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modules = [
  {
    icon: Shield,
    color: 'cyan',
    title: 'Cyber Awareness',
    description: 'Protect yourself against Phishing, UPI fraud, and Identity Theft with practical guides and real-world examples.',
    tag: 'Essential',
    href: '/awareness',
  },
  {
    icon: Scale,
    color: 'blue',
    title: 'Indian Cyber Law',
    description: 'Simplified IT Act overview, IPC/BNS sections, and the legal rights of victims — know your protection under Indian law.',
    tag: 'Legal',
    href: '/laws',
  },
  {
    icon: Siren,
    color: 'red',
    title: 'Incident Reporting',
    description: 'Step-by-step guidance for the National Cyber Crime Portal and evidence collection to maximize case success.',
    tag: 'Action',
    href: '/incident-reporting',
  },
  {
    icon: GraduationCap,
    color: 'teal',
    title: 'Interactive Learning',
    description: 'Engage with awareness challenges, quizzes, and simulated scam demonstrations to sharpen your digital instincts.',
    tag: 'Learning',
    href: '#learning',
  },
];

const colorMap: Record<string, { icon: string; glow: string; border: string; tag: string; badge: string }> = {
  cyan: {
    icon: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
    border: 'group-hover:border-cyan-500/40',
    tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badge: 'bg-cyan-500/10',
  },
  blue: {
    icon: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/10',
    border: 'group-hover:border-blue-500/40',
    tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    badge: 'bg-blue-500/10',
  },
  red: {
    icon: 'text-red-400',
    glow: 'group-hover:shadow-red-500/10',
    border: 'group-hover:border-red-500/40',
    tag: 'bg-red-500/10 text-red-400 border-red-500/20',
    badge: 'bg-red-500/10',
  },
  teal: {
    icon: 'text-teal-400',
    glow: 'group-hover:shadow-teal-500/10',
    border: 'group-hover:border-teal-500/40',
    tag: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    badge: 'bg-teal-500/10',
  },
};

export default function CoreModules() {
  const navigate = useNavigate();
  return (
    <section id="awareness" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Core Modules</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Stay Protected
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From awareness to legal recourse — our platform covers every aspect of digital safety for Indian citizens.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const c = colorMap[mod.color];
            const Icon = mod.icon;
            return (
              <a
                key={mod.title}
                href={mod.href}
                onClick={mod.href.startsWith('/') ? (e) => { e.preventDefault(); navigate(mod.href); } : undefined}
                className={`group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow} ${c.border} cursor-pointer`}
              >
                {/* Tag */}
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${c.tag}`}>
                  {mod.tag}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${c.badge} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${c.icon}`} strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{mod.description}</p>
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-1 text-sm font-semibold ${c.icon} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
