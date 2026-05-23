import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white flex items-center justify-center p-6 transition-colors duration-300">
      <div className="relative max-w-3xl w-full rounded-[2rem] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-10 shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_40%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(56,189,248,0.18),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-500 dark:text-cyan-400 mb-4">404 · Page not found</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4 relative">
            <span className="relative block">System breach detected</span>
            <span className="absolute left-0 top-0 text-cyan-400 opacity-60 translate-x-1 -translate-y-1">System breach detected</span>
            <span className="absolute left-0 top-0 text-fuchsia-400 opacity-50 -translate-x-1 translate-y-1">System breach detected</span>
          </h1>
          <p className="max-w-xl text-gray-600 dark:text-slate-400 leading-relaxed mb-8">
            The route you requested does not exist within this security grid. Return to the main dashboard and continue the cyber awareness mission.
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Return Home
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-10 top-24 h-24 w-24 rounded-full bg-cyan-500 blur-3xl" />
          <div className="absolute right-10 top-32 h-32 w-32 rounded-full bg-fuchsia-500 blur-3xl" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[linear-gradient(90deg,transparent,#22d3ee,transparent)] animate-pulse" />
      </div>
    </div>
  );
}
