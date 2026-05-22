import { ArrowRight, FileWarning, ShieldCheck, Globe as Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          India's Trusted Cyber Safety Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
          Empowering{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Digital India
          </span>{' '}
          with Cyber Awareness &amp; Legal Guidance
        </h1>

        {/* Subheadline */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Educating citizens on cyber threats, IPC/BNS laws, and safe digital practices — so every Indian can navigate the internet with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/laws" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/35 hover:-translate-y-0.5 text-base">
            Explore Cyber Laws
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/incident-reporting" className="flex items-center gap-2 bg-transparent hover:bg-slate-800 text-white font-semibold px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200 text-base">
            <FileWarning className="w-4 h-4 text-red-400" />
            Report an Incident
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[
            { icon: Globe2, value: '1.4B+', label: 'Citizens Protected' },
            { icon: ShieldCheck, value: '50K+', label: 'Incidents Reported' },
            { icon: FileWarning, value: '200+', label: 'Cyber Laws Covered' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
