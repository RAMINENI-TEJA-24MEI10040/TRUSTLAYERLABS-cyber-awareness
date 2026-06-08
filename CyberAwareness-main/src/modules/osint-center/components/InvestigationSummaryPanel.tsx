import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ciwStore from '../store/ciwStore';
import evidenceStore from '../store/evidenceStore';
import timelineStore from '../store/timelineStore';
import { generateInvestigationSummary } from '../services/investigationSummaryService';
import exportIntelReport from '../utils/exportIntelReport';
import reportGenerator from '../services/reportGenerator';
import ReportPreviewModal from './ReportPreviewModal';
import ReportExportPanel from './ReportExportPanel';
import type { InvestigationSummary } from '../types/ciw.types';

const InvestigationSummaryPanel: React.FC = () => {
  const activeCaseId = ciwStore.getState().activeCaseId;
  const cases = ciwStore.getState().cases;
  const activeCase = cases.find((c) => c.id === activeCaseId) ?? null;

  const allEvidence = evidenceStore.getState().evidence.filter(e => e.caseId === activeCaseId);
  const events = timelineStore.getState().events.filter(ev => ev.caseId === activeCaseId);
  const intelligence = ciwStore.getState().lastResults ?? [];

  const [summary, setSummary] = useState<InvestigationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (!activeCase) {
      setError('No active case selected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const out = await generateInvestigationSummary({
        activeCase,
        evidence: allEvidence,
        timeline: events,
        intelligence,
      });
      setSummary(out);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // regenerate using current inputs
    void handleGenerate();
  };

  const handleExportJSON = () => {
    if (!summary) return;
    const payload = {
      generatedAt: new Date().toISOString(),
      case: activeCase,
      summary,
    };
    // use exportIntelReport util if available else fallback to download
    try {
      if (exportIntelReport && typeof exportIntelReport === 'function') {
        exportIntelReport(payload, `${activeCase?.id ?? 'ciw-summary'}-summary.json`);
        return;
      }
    } catch (e) {
      // fallback to download
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCase?.id ?? 'ciw-summary'}-summary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewReport = () => {
    const report = reportGenerator.generateInvestigationReport({
      caseTitle: activeCase?.title ?? 'Untitled Case',
      summary,
      evidenceCount: allEvidence.length,
      timelineCount: events.length,
      intelligenceCount: intelligence.length,
    });
    setPreviewReport(report);
  };

  const handleExportPDFReport = async () => {
    const report = reportGenerator.generateInvestigationReport({
      caseTitle: activeCase?.title ?? 'Untitled Case',
      summary,
      evidenceCount: allEvidence.length,
      timelineCount: events.length,
      intelligenceCount: intelligence.length,
    });

    try {
      const pdfModule = await import('../services/pdfReportGenerator');
      if (pdfModule && typeof pdfModule.generateInvestigationPDF === 'function') {
        await pdfModule.generateInvestigationPDF(report);
      }
    } catch (e) {
      console.error('Failed to generate PDF', e);
    }
  };

  const closePreview = () => setPreviewReport(null);

  return (
    <div className="p-3 bg-[rgba(6,9,12,0.5)] backdrop-blur-md rounded-lg border border-cyan-800/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-cyan-200 font-semibold">AI Investigation Summary</h4>
        <div className="flex gap-2">
          <button
            className="text-sm bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-100 px-3 py-1 rounded"
            onClick={handleGenerate}
            disabled={loading || !activeCase}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

          <button
            className="text-sm bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-100 px-3 py-1 rounded"
            onClick={handleRefresh}
            disabled={loading || !activeCase}
          >
            Refresh
          </button>

          <button
            className="text-sm bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-100 px-3 py-1 rounded"
            onClick={handleExportJSON}
            disabled={!summary}
          >
            Export JSON
          </button>

          <button
            className="text-sm bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-100 px-3 py-1 rounded"
            onClick={handleViewReport}
            disabled={!summary}
          >
            View Report
          </button>

          <button
            className="text-sm bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-100 px-3 py-1 rounded"
            onClick={handleExportPDFReport}
            disabled={!summary}
          >
            Export PDF
          </button>
        </div>
      </div>

      {!activeCase && (
        <div className="text-xs text-slate-400">Select or create a case to generate an AI summary.</div>
      )}

      {error && <div className="text-sm text-rose-400">{error}</div>}

      {summary && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-3">
          <div>
            <div className="text-xs text-slate-400">Executive Summary</div>
            <div className="mt-1 text-sm text-cyan-100">{summary.executiveSummary}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Key Findings</div>
            <ul className="list-disc ml-4 text-sm text-cyan-100">
              {summary.keyFindings.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs text-slate-400">Risk Assessment</div>
            <div className="mt-1 text-sm text-cyan-100">Score: {summary.riskScore}/100</div>
            <div className="text-xs text-slate-400">{summary.riskSummary}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Recommended Actions</div>
            <ol className="list-decimal ml-4 text-sm text-cyan-100">
              {summary.recommendedActions.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ol>
          </div>

          <div className="text-xs text-slate-400">Confidence: {(summary.confidence * 100).toFixed(0)}%</div>
        </motion.div>
      )}

      {!summary && !error && (
        <div className="text-xs text-slate-400 mt-2">No summary generated yet.</div>
      )}

      {previewReport && (
        <ReportPreviewModal report={previewReport} onClose={closePreview} />
      )}
    </div>
  );
};

export default InvestigationSummaryPanel;
