export default function LoadingScreen() {
  return (
    <div role="status" aria-busy="true" className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-gray-900 dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="relative max-w-xl w-full rounded-[2rem] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-10 shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_35%)] pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-950 shadow-[0_0_40px_rgba(14,165,233,0.18)]">
            <div className="h-14 w-14 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          </div>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300 mb-3">Booting security layer</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Loading threat intelligence</h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-400">
              A microbundle is being assembled for the selected cybersecurity module. This loader keeps the shell fast while page assets stream in.
            </p>
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
