import React, { useEffect, useState, memo } from 'react'

const fmtTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const fmtDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const LiveClock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className={`flex flex-col items-start sm:items-center bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-transparent p-3 sm:p-4 rounded-lg border border-slate-800/50 shadow-lg ${className}`}
      aria-live="polite"
      title="India Standard Time"
    >
      <div className="text-xs tracking-wider text-slate-400 uppercase">IST</div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="font-mono text-2xl sm:text-3xl md:text-4xl text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]">{fmtTime.format(now)}</span>
        <span className="hidden sm:inline text-sm text-slate-300/80">{fmtDate.format(now)}</span>
      </div>
      <div className="mt-2 text-xs text-slate-400">Realtime • auto-refresh every second</div>
    </div>
  )
}

export default memo(LiveClock)
