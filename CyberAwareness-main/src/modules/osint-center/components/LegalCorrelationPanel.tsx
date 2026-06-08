import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ciwStore from '../store/ciwStore';
import evidenceStore from '../store/evidenceStore';
import timelineStore from '../store/timelineStore';
import { generateLegalCorrelation } from '../services/legalCorrelationService';
import type { LegalCorrelation } from '../types/legal.types';
import exportIntelReport from '../utils/exportIntelReport';

const LegalCorrelationPanel: React.FC = () => {
  const activeCaseId = ciwStore.getState().activeCaseId;
  const cases = ciwStore.getState().cases;
  const activeCase = cases.find((c) => c.id === activeCaseId) ?? null;

  const allEvidence = evidenceStore.getState().evidence.filter(e => e.caseId === activeCaseId);
  const events = timelineStore.getState().events.filter(ev => ev.caseId === activeCaseId);
  const intelligence = ciwStore.getState().lastResults ?? [];

  const [corr, setCorr] = useState<LegalCorrelation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const handleViewReport = () => {
    const report = reportGenerator.generateLegalReport({ caseTitle: activeCase?.title ?? 'Untitled Case', legal: corr });
    setPreviewReport(report);
  };

  const handleExportPDFReport = () => {
    const report = reportGenerator.generateLegalReport({ caseTitle: activeCase?.title ?? 'Untitled Case', legal: corr });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfGen = require('../services/pdfReportGenerator').default;
    if (pdfGen && typeof pdfGen.generateLegalPDF === 'function') pdfGen.generateLegalPDF(report);
  };

  const closePreview = () => setPreviewReport(null);

  const handleGenerate = async () => {
    if (!activeCase) { setError('No active case selected'); return; }
    setLoading(true); setError(null);
    try {
      const out = await generateLegalCorrelation({ caseInfo: activeCase, summary: null, intelligence, evidence: allEvidence, timeline: events });
      setCorr(out);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to generate legal correlation');
    } finally { setLoading(false); }
  };

  const handleExport = () => {
    if (!corr) return;
    const payload = { generatedAt: new Date().toISOString(), caseId: activeCaseId, correlation: corr };
    try {
      if (exportIntelReport && typeof exportIntelReport === 'function') {
        exportIntelReport(payload, `${activeCaseId ?? 'case'}-legal-correlation.json`);
        return;
      }
    } catch (e) { /* fallback */ }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${activeCaseId ?? 'case'}-legal-correlation.json`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 bg-[rgba(6,9,12,0.5)] backdrop-blur-md rounded-lg border border-cyan-800/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-cyan-200 font-semibold">Legal Correlation</h4>
        <div className="flex gap-2">
          <button className="text-sm bg-cyan-600/20 px-3 py-1 rounded" onClick={handleGenerate} disabled={loading || !activeCase}>{loading ? 'Generating...' : 'Generate'}</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExport} disabled={!corr}>Export JSON</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleViewReport} disabled={!corr}>View Report</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportPDFReport} disabled={!corr}>Export PDF</button>
        </div>
      </div>

      {!activeCase && <div className="text-xs text-slate-400">Select a case first.</div>}
      {error && <div className="text-sm text-rose-400">{error}</div>}

      {corr && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div>
            <div className="text-xs text-slate-400">Confidence</div>
            <div className="text-cyan-100 font-semibold">{Math.round(corr.confidence * 100)}%</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Suggested IPC Sections</div>
            <ul className="list-disc ml-4 text-sm text-cyan-100">
              {corr.ipcSections.map((s) => (
                <li key={s.code} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{s.code} - {s.title}</div>
                    <div className="text-xs text-slate-400">{s.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs text-slate-400">Suggested IT Act Sections</div>
            <ul className="list-disc ml-4 text-sm text-cyan-100">
              {corr.itActSections.map((s) => (
                <li key={s.code}>
                  <div className="font-semibold">{s.code} - {s.title}</div>
                  <div className="text-xs text-slate-400">{s.description}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs text-slate-400">Reasoning</div>
            <ol className="list-decimal ml-4 text-sm text-cyan-100">
              {corr.reasoning.map((r, idx) => <li key={idx}>{r}</li>)}
            </ol>
          </div>
        </motion.div>
      )}

      {!corr && !error && <div className="text-xs text-slate-400">No correlation generated yet.</div>}

      {previewReport && (
        <ReportPreviewModal report={previewReport} onClose={closePreview} />
      )}
    </div>
  );
};

export default LegalCorrelationPanel;
