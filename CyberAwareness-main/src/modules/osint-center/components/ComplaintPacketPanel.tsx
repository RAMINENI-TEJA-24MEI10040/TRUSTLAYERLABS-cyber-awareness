import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ciwStore from '../store/ciwStore';
import evidenceStore from '../store/evidenceStore';
import timelineStore from '../store/timelineStore';
import { generateComplaintPacket } from '../services/complaintPacketService';
import exportIntelReport from '../utils/exportIntelReport';
import reportGenerator from '../services/reportGenerator';
import type { ComplaintPacket } from '../types/complaint.types';
import type { InvestigationSummary } from '../types/ciw.types';
import type { LegalCorrelation } from '../types/legal.types';

const ComplaintPacketPanel: React.FC = () => {
  const activeCaseId = ciwStore.getState().activeCaseId;
  const cases = ciwStore.getState().cases;
  const activeCase = cases.find(c => c.id === activeCaseId) ?? null;

  const evidence = evidenceStore.getState().items.filter(e => e.caseId === activeCaseId);
  const rawTimeline = timelineStore.getState().events.filter(ev => ev.caseId === activeCaseId);
  const timeline = rawTimeline.map((ev) => ({
    id: ev.id,
    caseId: ev.caseId,
    title: ev.title,
    description: ev.description,
    timestamp: ev.timestamp,
    severity: (ev.severity === 'critical' ? 'critical' : ev.severity === 'high' ? 'warning' : 'info') as 'info' | 'warning' | 'critical',
  }));
  const summary = (ciwStore.getState().lastSummary ?? null) as InvestigationSummary | null;
  const legal = (ciwStore.getState().lastLegalCorrelation ?? null) as LegalCorrelation | null;

  const [packet, setPacket] = useState<ComplaintPacket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportPDFReport = () => {
    if (!packet) return;
    const report = reportGenerator.generateComplaintReport({ caseTitle: activeCase?.title ?? 'Untitled Case', packet });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfGen = require('../services/pdfReportGenerator').default;
    if (pdfGen && typeof pdfGen.generateComplaintPDF === 'function') pdfGen.generateComplaintPDF(report);
  };

  const handleGenerate = async () => {
    if (!activeCase) { setError('Select a case'); return; }
    setLoading(true); setError(null);
    try {
      const p = await generateComplaintPacket({ caseInfo: activeCase, summary, timeline, evidence, legalCorrelation: legal });
      setPacket(p);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed');
    } finally { setLoading(false); }
  };

  const handleExportJSON = async () => {
    if (!packet) return;
    const payload = packet;
    try {
      const res = await exportIntelReport(payload as any as import('../utils/exportIntelReport').ExportPayload).catch(() => null);
      if (res && res.ok) {
        const filename = res.file ?? `${packet.id}.json`;
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {}
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${packet.id}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleExportPDFStructure = async () => {
    if (!packet) return;
    // Create a PDF-ready JSON structure (caller can convert to PDF)
    const pdfStruct = {
      title: `Complaint Packet - ${packet.caseId ?? packet.id}`,
      incidentSummary: packet.incidentSummary,
      timeline: packet.timeline,
      evidence: packet.evidence,
      legal: packet.legalCorrelation,
      recommendedActions: packet.recommendedActions,
      generatedAt: packet.generatedAt,
    };
    try {
      const res = await exportIntelReport(pdfStruct as any).catch(() => null);
      if (res && res.ok) {
        const filename = res.file ?? `${packet.id}-pdf-struct.json`;
        const blob = new Blob([JSON.stringify(pdfStruct, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {}

    const blob = new Blob([JSON.stringify(pdfStruct, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${packet.id}-pdf-struct.json`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 bg-[rgba(6,9,12,0.5)] backdrop-blur-md rounded-lg border border-cyan-800/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-cyan-200 font-semibold">Complaint Packet</h4>
        <div className="flex gap-2">
          <button className="text-sm bg-cyan-600/20 px-3 py-1 rounded" onClick={handleGenerate} disabled={loading || !activeCase}>{loading ? 'Generating...' : 'Generate'}</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportJSON} disabled={!packet}>Export JSON</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportPDFStructure} disabled={!packet}>Export PDF Structure</button>
          <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportPDFReport} disabled={!packet}>Export PDF</button>
        </div>
      </div>

      {!activeCase && <div className="text-xs text-slate-400">Select an active case to prepare a complaint packet.</div>}
      {error && <div className="text-sm text-rose-400">{error}</div>}

      {packet && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div>
            <div className="text-xs text-slate-400">Incident Summary</div>
            <div className="mt-1 text-sm text-cyan-100">{packet.incidentSummary ? packet.incidentSummary.executiveSummary : 'No summary'}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Timeline ({packet.timeline.length} events)</div>
            <div className="max-h-36 overflow-auto text-sm text-cyan-100">
              {packet.timeline.map(ev => <div key={ev.id} className="py-1">{new Date(ev.timestamp).toLocaleString()} - {ev.title}</div>)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Evidence ({packet.evidence.length})</div>
            <ul className="list-disc ml-4 text-sm text-cyan-100">
              {packet.evidence.map(e => <li key={e.id}>{e.title ?? e.source}</li>)}
            </ul>
          </div>

          <div>
            <div className="text-xs text-slate-400">Legal Suggestions</div>
            <div className="text-sm text-cyan-100">IPC: {packet.legalCorrelation?.ipcSections.map(s=>s.code).join(', ') || 'N/A'}</div>
            <div className="text-sm text-cyan-100">IT Act: {packet.legalCorrelation?.itActSections.map(s=>s.code).join(', ') || 'N/A'}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Recommended Actions</div>
            <ol className="list-decimal ml-4 text-sm text-cyan-100">{packet.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}</ol>
          </div>
        </motion.div>
      )}

      {!packet && !error && <div className="text-xs text-slate-400">No packet generated yet.</div>}
    </div>
  );
};

export default ComplaintPacketPanel;
