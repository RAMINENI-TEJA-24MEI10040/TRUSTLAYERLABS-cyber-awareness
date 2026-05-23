import React, {useEffect} from 'react'

type Severity = 'low'|'medium'|'high'|'critical'

interface ThreatModalProps {
  open: boolean
  onClose: ()=>void
  title: string
  severity: Severity
  source?: string
  type?: string
  recommendations?: string[]
}

const severityClasses: Record<Severity,string> = {
  low: 'bg-green-600 text-green-50',
  medium: 'bg-yellow-500 text-yellow-900',
  high: 'bg-orange-600 text-orange-50',
  critical: 'bg-red-600 text-red-50'
}

export default function ThreatModal({open, onClose, title, severity, source, type, recommendations}: ThreatModalProps){
  useEffect(()=>{
    if(!open) return
    const onKey = (e: KeyboardEvent)=>{ if(e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[open,onClose])

  if(!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-[min(96vw,800px)] mx-4">
        <div className="transform transition-all duration-300 ease-backdrop origin-center scale-100 opacity-100">
          <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-semibold text-cyan-300">{title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityClasses[severity]}`}>{severity.toUpperCase()}</span>
                  {source && <span className="opacity-80">Source: {source}</span>}
                </div>
              </div>

              <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-white p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase text-slate-500">Type</span>
                <span className="text-sm text-slate-200 bg-slate-800 px-2 py-1 rounded">{type ?? 'N/A'}</span>
              </div>

              <div>
                <h4 className="text-sm text-slate-400 uppercase">Recommendations</h4>
                {recommendations && recommendations.length>0 ? (
                  <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300">
                    {recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-500">No recommendations provided.</p>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
              <button onClick={onClose} className="bg-transparent text-slate-300 hover:bg-slate-800/50 px-3 py-2 rounded-md">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
