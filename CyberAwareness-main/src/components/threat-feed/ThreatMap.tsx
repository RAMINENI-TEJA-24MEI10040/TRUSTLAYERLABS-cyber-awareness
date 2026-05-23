type Hotspot = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  description?: string
  x: number
  y: number
}

const severityColor = (s: Hotspot['severity']) => {
  switch (s) {
    case 'high':
      return 'bg-red-400/90 ring-red-400'
    case 'medium':
      return 'bg-yellow-400/90 ring-yellow-400'
    default:
      return 'bg-green-400/90 ring-green-400'
  }
}

const defaultHotspots: Hotspot[] = [
  { id: '1', title: 'Suspicious C2', severity: 'high', x: 0.72, y: 0.38, description: 'Large botnet activity' },
  { id: '2', title: 'Phishing Wave', severity: 'medium', x: 0.28, y: 0.44, description: 'Mass phishing emails' },
  { id: '3', title: 'Ransomware', severity: 'high', x: 0.5, y: 0.7, description: 'Encrypted endpoints' },
]

export default function ThreatMap({ hotspots = defaultHotspots }: { hotspots?: Hotspot[] }) {
  return (
    <section className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="relative flex-1 min-h-[320px] lg:min-h-[420px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
            <svg viewBox="0 0 1000 520" className="w-full h-full opacity-60 mix-blend-screen">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#0ea5a4" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#g)" />
              <path d="M50,300 C120,220 220,200 320,240 C420,280 540,260 640,200 C720,160 840,140 940,180 L940,360 C840,320 740,340 640,360 C540,380 420,420 320,400 C220,380 120,340 50,300 Z" fill="#0f172a" opacity="0.45" />
            </svg>

            <div className="absolute inset-0">
              {hotspots.map(h => (
                <div
                  key={h.id}
                  style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%`, transform: 'translate(-50%,-50%)' }}
                  className="absolute pointer-events-auto"
                >
                  <span className={`relative flex items-center justify-center w-4 h-4 rounded-full ${severityColor(h.severity)} ring-4 ring-opacity-30`}></span>
                  <span className={`absolute w-6 h-6 rounded-full opacity-60 animate-ping ${h.severity === 'high' ? 'bg-red-400/30' : h.severity === 'medium' ? 'bg-yellow-400/30' : 'bg-green-400/30'}`}></span>
                </div>
              ))}
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-200">Threat Map</div>
                <div className="text-[11px] text-slate-400">Live detections • SOC View</div>
              </div>
              <div className="flex items-center gap-2">
                <LegendDot color="bg-red-400" label="High" />
                <LegendDot color="bg-yellow-400" label="Medium" />
                <LegendDot color="bg-green-400" label="Low" />
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-96 p-4 border-l border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-200 font-semibold">Attack Hotspots</h3>
              <div className="text-xs text-slate-400">{hotspots.length} active</div>
            </div>

            <ul className="space-y-3">
              {hotspots.map(h => (
                <li key={h.id} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 hover:translate-y-0.5 transition-transform">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex-none w-3 h-3 rounded-full mt-1 ${severityColor(h.severity)}`}></div>
                      <div>
                        <div className="text-sm font-medium text-slate-100">{h.title}</div>
                        <div className="text-xs text-slate-400">{h.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Severity</div>
                      <div className="text-sm text-slate-100 font-semibold capitalize">{h.severity}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>Last updated: <span className="text-slate-300">just now</span></div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded text-xs">Refresh</button>
              <button className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded text-xs">Investigate</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${color} w-3 h-3 rounded-full block ring-2 ring-slate-700`} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}
