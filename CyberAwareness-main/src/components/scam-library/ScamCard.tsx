import { ScamType } from '../../data/scamDatabase';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScamCardProps {
  scam: ScamType;
}

const severityColors = {
  low: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  medium: { bg: 'rgba(250,204,21,0.1)', color: '#facc15', border: 'rgba(250,204,21,0.25)' },
  high: { bg: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'rgba(249,115,22,0.25)' },
  critical: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' }
};

export default function ScamCard({ scam }: ScamCardProps) {
  const severity = severityColors[scam.severity];
  
  return (
    <Link 
      to={`/scam-library/${scam.id}`}
      className="group block rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1.5 text-white group-hover:text-cyan-400 transition-colors">
            {scam.name}
          </h3>
          <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
            {scam.description}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full ml-3 flex-shrink-0"
          style={{ background: severity.bg, color: severity.color, border: `1px solid ${severity.border}` }}>
          {scam.severity.toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="w-3 h-3" />
          <span>{scam.commonIndicators.length} indicators</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-cyan-700 group-hover:text-cyan-400 transition-colors ml-auto">
          View details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
