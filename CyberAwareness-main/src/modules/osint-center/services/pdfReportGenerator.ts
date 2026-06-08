import type { GeneratedReport } from './reportGenerator';

async function loadJsPdf() {
  const mod = await import('jspdf');
  // handle ESM / CJS default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).jsPDF ?? (mod as any).default ?? mod;
}

function addCover(doc: any, title: string) {
  doc.setFillColor(2, 12, 20);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
  doc.setFontSize(22);
  doc.setTextColor(6, 201, 255);
  doc.text('TrustLayerLabs', 20, 40);
  doc.setFontSize(16);
  doc.setTextColor(200);
  doc.text(title, 20, 60);
  doc.setFontSize(10);
  doc.setTextColor(180);
  doc.text(`Generated: ${new Date().toISOString()}`, 20, 75);
  doc.addPage();
}

function addSection(doc: jsPDF, title: string, content: string) {
  doc.setFontSize(14);
  doc.setTextColor(6, 201, 255);
  doc.text(title, 20, doc.internal.pageSize.getHeight() === 0 ? 20 : doc.previousAutoTable ? 20 : 20);
  doc.setFontSize(10);
  doc.setTextColor(220);

  const lines = doc.splitTextToSize(content, doc.internal.pageSize.getWidth() - 40);
  let y = doc.getCursor ? doc.getCursor().y + 10 : 30; // fallback
  // simple paging
  let offset = y;
  lines.forEach((line) => {
    if (offset > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      offset = 20;
    }
    doc.text(line, 20, offset);
    offset += 6;
  });
  doc.addPage();
}

export async function generatePDF(report: GeneratedReport, filename = 'report.pdf') {
  const jsPdfCtor = await loadJsPdf();
  const doc = new jsPdfCtor({ unit: 'pt' });

  // Cover
  addCover(doc, report.title);

  // Sections
  report.sections.forEach((s) => {
    const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content, null, 2);
    addSection(doc, s.title, content);
  });

  doc.save(filename);
}

export async function generateInvestigationPDF(report: GeneratedReport) {
  await generatePDF(report, 'Investigation_Report.pdf');
}
export async function generateLegalPDF(report: GeneratedReport) {
  await generatePDF(report, 'Legal_Report.pdf');
}
export async function generateComplaintPDF(report: GeneratedReport) {
  await generatePDF(report, 'Complaint_Packet.pdf');
}

export default { generateInvestigationPDF, generateLegalPDF, generateComplaintPDF } as const;
