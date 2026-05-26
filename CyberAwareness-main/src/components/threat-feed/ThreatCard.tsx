import React from 'react'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface ThreatCardProps {
  id?: string | number
  title: string
  description?: string
  source?: string
  type?: string
  severity?: Severity
  time?: string
  icon?: React.ReactNode
  className?: string
}

const severityStyles: Record<Severity, string> = {
  low: 'bg-green-600 text-white',
  medium: 'bg-yellow-400 text-yellow-900',
  high: 'bg-orange-600 text-orange-50',
  critical: 'bg-red-600 text-red-50',
}

const ThreatCard: React.FC<ThreatCardProps> = ({
  id,
  title,
  description,
  source = 'Unknown',
  type = 'Generic',
  severity = 'medium',
  time,
  icon,
  className = '',
}) => {
  return (
    <article
      data-id={id}
      className={
        `group relative w-full p-4 rounded-lg border border-gray-800 bg-gradient-to-b from-gray-900/60 to-gray-900/40 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ${className}`
      }
      aria-label={`Threat ${title}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-none w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center text-gray-200">
          {icon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4-4h.01M12 20h.01M6.18 6.18A9 9 0 1117.82 17.82 9 9 0 016.18 6.18z" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-100 truncate">{title}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${severityStyles[severity]}`}> {severity.toUpperCase()} </span>
            </div>
          </div>

          {description && (
            <p className="mt-2 text-xs sm:text-sm text-gray-300 line-clamp-3">{description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-2 bg-gray-800/50 px-2 py-1 rounded"> 
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <span className="truncate max-w-xs">{source}</span>
            </span>

            <span className="inline-flex items-center gap-2 bg-gray-800/50 px-2 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2v4a3 3 0 006 0v-4c0-1.105-1.343-2-3-2z" />
              </svg>
              <span>{type}</span>
            </span>

            {time && <span className="ml-auto text-xs text-gray-500">{time}</span>}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </article>
  )
}

export default ThreatCard
