import React from 'react'

type Cell = {
  id: string
  intensity: number // 0-100
  label?: string
}

type Props = {
  gridSize?: number // square grid
  data?: Cell[]
}

const rand = (n: number) => Math.floor(Math.random() * n)

const genData = (size: number) => {
  const out: Cell[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const score = Math.min(100, Math.max(0, Math.round((Math.sin(x * 0.7) + Math.cos(y * 0.5)) * 50 + rand(40))))
      out.push({ id: `${x}-${y}`, intensity: score, label: `S${score}` })
    }
  }
  return out
}

const palette = (v: number) => {
  if (v > 80) return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
  if (v > 60) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.32)]'
  if (v > 40) return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.28)]'
  if (v > 20) return 'bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.2)]'
  return 'bg-sky-600/40'
}

export default function CyberHeatmap({ gridSize = 8, data }: Props) {
  const cells = React.useMemo(() => data ?? genData(gridSize), [data, gridSize])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 rounded-lg bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Cyber Heatmap</h3>
          <p className="text-xs text-slate-400">Live attack intensity — SOC overview</p>
        </div>
        <div className="text-xs text-slate-400">Updated: now</div>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))` }}>
        {cells.map((c) => (
          <div
            key={c.id}
            className={`relative rounded-md aspect-square overflow-hidden flex items-center justify-center ${palette(c.intensity)} transition-transform duration-300 transform hover:scale-105`}
            title={`${c.label ?? c.id} — ${c.intensity}%`}
          >
            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* pulse indicator for high intensity */}
            {c.intensity > 60 && (
              <span className="absolute -bottom-2 right-2 w-3 h-3 rounded-full bg-white/90 animate-ping-fast" />
            )}

            {/* core dot */}
            <div className="relative z-10 text-[10px] font-mono text-slate-900/90 px-1 py-0.5 rounded-sm bg-white/80">
              {c.intensity}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .animate-ping-fast{animation: ping 1.2s cubic-bezier(.4,0,.6,1) infinite}
        @media (max-width:640px){ .aspect-square{padding-top:100%} }
      `}</style>
    </div>
  )
}
