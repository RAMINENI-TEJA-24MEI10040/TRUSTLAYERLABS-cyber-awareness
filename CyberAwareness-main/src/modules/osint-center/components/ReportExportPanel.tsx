import React from 'react';
import reportGenerator from '../services/reportGenerator';
import exportIntelReport from '../utils/exportIntelReport';
import type { GeneratedReport } from '../services/reportGenerator';

type Props = {
  report: GeneratedReport | null;
  filenamePrefix?: string;
};

const ReportExportPanel: React.FC<Props> = ({ report, filenamePrefix = 'report' }) => {
  if (!report) return null;

  const handleExportJSON = () => {
    const payload = report;
    try { if (exportIntelReport && typeof exportIntelReport === 'function') { exportIntelReport(payload, `${filenamePrefix}.json`); return; } } catch (e) {}
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${filenamePrefix}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const md = ['# ' + report.title, '', `Generated: ${report.generatedAt}`, ''];
    report.sections.forEach(s => {
      md.push('## ' + s.title);
      md.push('');
      // wrap JSON in a fenced code block (escape any existing ``` sequences)
      const safe = JSON.stringify(s.content, null, 2).replace(/```/g, '``\`');
      md.push('```json\n' + safe + '\n```');
      md.push('');
    });
    const blob = new Blob([md.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${filenamePrefix}.md`; a.click(); URL.revokeObjectURL(url);
  };

  const handleExportPDFStruct = () => {
    const pdfStruct = report;
    try { if (exportIntelReport && typeof exportIntelReport === 'function') { exportIntelReport(pdfStruct, `${filenamePrefix}-pdf-struct.json`); return; } } catch (e) {}
    const blob = new Blob([JSON.stringify(pdfStruct, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${filenamePrefix}-pdf-struct.json`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button className="text-sm bg-cyan-600/20 px-3 py-1 rounded" onClick={handleExportJSON}>Export JSON</button>
      <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportMarkdown}>Export MD</button>
      <button className="text-sm bg-cyan-600/10 px-3 py-1 rounded" onClick={handleExportPDFStruct}>Export PDF Struct</button>
    </div>
  );
};

export default ReportExportPanel;
