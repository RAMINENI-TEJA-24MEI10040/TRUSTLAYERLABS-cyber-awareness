import React, { useState } from 'react';
import type { GeneratedReport } from '../services/reportGenerator';
import ReportExportPanel from './ReportExportPanel';
import pdfReportGenerator from '../services/pdfReportGenerator';

type Props = {
  report: GeneratedReport | null;
  onClose?: () => void;
};

const ReportPreviewModal: React.FC<Props> = ({ report, onClose }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [activeIndex, setActiveIndex] = useState(0);

  if (!report) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${mode === 'dark' ? 'bg-black/60' : 'bg-white/60'}`}>
      <div className={`w-full max-w-4xl h-[90vh] ${mode === 'dark' ? 'bg-[#06111a] text-cyan-100' : 'bg-white text-slate-900'} p-6 rounded-lg overflow-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{report.title}</h2>
          <div className="flex items-center gap-3">
            <ReportExportPanel report={report} filenamePrefix={report.title.replace(/\s+/g, '-')}/>
            <div className="flex gap-2">
              <button className="text-sm px-3 py-1 bg-cyan-600/20 rounded" onClick={() => { if (onClose) onClose(); }}>Close</button>
              <button className="text-sm px-3 py-1 bg-cyan-600/20 rounded" onClick={() => window.print()}>Print</button>
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs">Theme</label>
              <select className="bg-transparent border border-cyan-700 text-sm p-1 rounded" value={mode} onChange={(e) => setMode(e.target.value as 'dark' | 'light')}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <nav className="w-48 sticky top-6">
            <ul className="space-y-2">
              {report.sections.map((s, idx) => (
                <li key={idx}>
                  <button className={`w-full text-left p-2 rounded ${activeIndex === idx ? 'bg-cyan-800/30' : 'bg-transparent'}`} onClick={() => setActiveIndex(idx)}>{s.title}</button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="flex-1">
            {report.sections.map((s, idx) => (
              <section key={idx} style={{ display: idx === activeIndex ? 'block' : 'none' }} className={`p-3 rounded ${mode === 'dark' ? 'bg-[rgba(8,12,16,0.4)]' : 'bg-white/80'}`}>
                <h3 className="font-semibold text-cyan-200">{s.title}</h3>
                <div className="mt-2 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(s.content, null, 2)}</pre>
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
