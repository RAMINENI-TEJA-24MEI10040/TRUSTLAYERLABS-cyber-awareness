import React, { useEffect, useState } from 'react'

type Stat = {
  id: string
  label: string
  value: number
  suffix?: string
  tone?: 'normal' | 'critical' | 'safe'
}

type Props = {
  stats?: Stat[]
  className?: string
}

const DEFAULT_STATS: Stat[] = [
  { id: 'active', label: 'Active Threats', value: 128, tone: 'normal' },
  { id: 'critical', label: 'Critical Alerts', value: 12, tone: 'critical' },
  { id: 'phish', label: 'Phishing Domains', value: 342, tone: 'normal' },
  { id: 'safe', label: 'Safe Status', value: 98, suffix: '%', tone: 'safe' },
]

const toneStyles: Record<string, string> = {
  normal: 'from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.08)]',
  critical: 'from-pink-500 to-red-500 shadow-[0_0_20px_rgba(255,80,80,0.12)]',
  safe: 'from-emerald-400 to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.08)]',
}

function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = 0
    const diff = target - from
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setValue(Math.floor(from + diff * p))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function ThreatStats({ stats = DEFAULT_STATS, className = '' }: Props) {
  return (
    <section className={"p-4 sm:p-6 bg-[#0b1020] text-slate-100 rounded-lg " + className}>
      <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">SOC Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ stat }: { stat: Stat }) {
  const animated = useAnimatedNumber(stat.value)
  const tone = stat.tone || 'normal'
  return (
    <div
      className={
        'relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-transparent to-[rgba(255,255,255,0.02)] border border-transparent ' +
        'backdrop-blur-sm ' +
        'hover:scale-[1.01] transition-transform duration-200'
      }
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
    >
      <div
        className={
          `absolute -inset-px rounded-xl blur-[18px] opacity-60 bg-gradient-to-r ${toneStyles[tone]}`
        }
        aria-hidden
      />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-300 font-medium">{stat.label}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-bold leading-none text-white">
              {animated}
              <span className="text-sm text-slate-300 ml-1">{stat.suffix ?? ''}</span>
            </div>
            <div className="ml-2 text-xs text-slate-400">{stat.id}</div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <MiniIcon tone={tone} />
          <div className="text-xs text-slate-400 mt-2">Live</div>
        </div>
      </div>
    </div>
  )
}

function MiniIcon({ tone }: { tone: string }) {
  const color = tone === 'critical' ? 'text-red-400' : tone === 'safe' ? 'text-emerald-300' : 'text-cyan-300'
  return (
    <div className={"w-10 h-10 rounded-md flex items-center justify-center bg-white/5 " + color}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-95">
        <path d="M12 2L15 8l6 1-4.5 4 1 6L12 17l-5.5 3 1-6L3 9l6-1 3-6z" stroke="currentColor" strokeWidth="0" fill="currentColor" />
      </svg>
    </div>
  )
}
