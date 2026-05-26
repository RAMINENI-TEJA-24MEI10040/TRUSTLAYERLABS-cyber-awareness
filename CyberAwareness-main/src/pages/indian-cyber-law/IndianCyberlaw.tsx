/** @deprecated No route in App — kept for reference. Canonical laws UI: `/laws` → CyberLawCommandCenter. */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Scale, Search, ShieldAlert } from 'lucide-react';
import { jsPDF } from 'jspdf';

type LawEntry = {
  title: string;
  aliases: string[];
  sections: string[];
  punishment: string;
  penalty: string;
  evidence: string[];
};

const searchPlaceholders = [
  'phishing attack',
  'UPI scam',
  'identity theft',
  'data privacy',
  'personal data',
  'ransomware',
  'cyber stalking',
  'fake job scam',
];

const lawEntries: LawEntry[] = [
  {
    title: 'Digital Personal Data Protection Act, 2023',
    aliases: ['data privacy', 'personal data', 'privacy law', 'data breach', 'consent', 'dpdp act'],
    sections: ['Digital Personal Data Protection Act, 2023'],
    punishment:
      'The DPDP Act is primarily enforced through monetary penalties rather than jail terms for routine violations. The Data Protection Board can impose penalties depending on the nature and seriousness of the breach.',
    penalty:
      'For serious failures such as not taking reasonable security safeguards, penalties can go up to INR 250 crore. Other violations can attract separate penalty slabs under the Act, including breaches involving children or consent-related obligations.',
    evidence: ['Preserve breach emails, screenshots, and notice letters', 'Document which personal data was exposed or misused', 'Report the issue to the data fiduciary and keep copies of your complaint'],
  },
  {
    title: 'Phishing attack, fake payment link, or UPI scam',
    aliases: ['phishing', 'upi scam', 'upi fraud', 'qr scam', 'fake payment link', 'otp scam'],
    sections: ['IT Act Section 66D', 'IT Act Section 66C', 'IT Act Section 43'],
    punishment:
      'Section 66D covers cheating by personation through computer resources and can lead to imprisonment up to 3 years and a fine.',
    penalty:
      'Section 66C covers identity theft and can lead to imprisonment up to 3 years plus a fine up to INR 1 lakh. Section 43 can also support compensation for unauthorized access, data damage, or financial loss.',
    evidence: ['Save screenshots of the scam message, link, or QR code', 'Keep UPI transaction ID, phone number, and bank reference', 'Report immediately through the cybercrime portal and your bank'],
  },
  {
    title: 'Identity theft or OTP theft',
    aliases: ['identity theft', 'otp theft', 'sim swap', 'aadhar misuse', 'pan misuse'],
    sections: ['IT Act Section 66C', 'IT Act Section 66D'],
    punishment:
      'Identity theft under Section 66C can attract imprisonment up to 3 years and a fine.',
    penalty:
      'If the same conduct is used to impersonate a victim or obtain money, Section 66D may also apply with imprisonment up to 3 years and fine.',
    evidence: ['Change passwords and freeze linked accounts', 'Preserve call logs, SMS, and email alerts', 'Inform telecom provider and bank quickly'],
  },
  {
    title: 'Unauthorized access, hacking, or data theft',
    aliases: ['hacking', 'data theft', 'unauthorized access', 'system breach', 'database leak'],
    sections: ['IT Act Section 43', 'IT Act Section 66', 'IT Act Section 66B'],
    punishment:
      'Section 66 can apply where dishonest or fraudulent intent is proved; it can lead to imprisonment up to 3 years and a fine.',
    penalty:
      'Section 43 provides civil compensation for unauthorized access, copying, disruption, or damage to computer systems or data.',
    evidence: ['Preserve logs, emails, and access alerts', 'Do not wipe devices before forensic backup', 'Get incident details from your service provider'],
  },
  {
    title: 'Disclosure of information in breach of lawful contract',
    aliases: ['section 72a', 'confidentiality breach', 'privacy breach', 'employee data leak', 'misuse of information'],
    sections: ['IT Act Section 72A'],
    punishment:
      'Section 72A can apply when a person discloses personal information knowing it was collected under a lawful contract and without consent. It can lead to imprisonment up to 3 years and a fine.',
    penalty:
      'This provision is often used for confidential data leaks by service providers, employees, contractors, or vendors who misuse personal information.',
    evidence: ['Keep copies of the leaked material and where it appeared', 'Preserve employment, vendor, or service-contract records', 'Record who accessed the data and when the disclosure happened'],
  },
  {
    title: 'Cyber stalking or online harassment',
    aliases: ['cyber stalking', 'online harassment', 'abusive messages', 'fake profiles'],
    sections: ['IT Act Section 66E', 'IT Act Section 67', 'Relevant criminal law provisions'],
    punishment:
      'Depending on the facts, publication or transmission of private images and obscene content can lead to imprisonment and fine under the IT Act.',
    penalty:
      'Victims may also rely on other criminal-law provisions if threats, stalking, intimidation, or repeat harassment are involved.',
    evidence: ['Keep URLs, profile links, and chat exports', 'Report and block accounts immediately', 'Request platform takedown and police help if threats continue'],
  },
  {
    title: 'Obscene content or child sexual abuse material',
    aliases: ['obscene content', 'csam', 'child sexual abuse material', 'explicit content'],
    sections: ['IT Act Section 67', 'IT Act Section 67B'],
    punishment:
      'Section 67 and Section 67B can lead to imprisonment and fine for publishing or transmitting obscene or child sexual abuse material.',
    penalty:
      'The severity increases significantly when material involves minors or repeated distribution.',
    evidence: ['Report the content without re-sharing it', 'Collect the URL and platform details', 'Use emergency reporting channels if a child is involved'],
  },
  {
    title: 'Ransomware, extortion, or locked-device fraud',
    aliases: ['ransomware', 'extortion', 'device locked', 'file encryption', 'data hostage'],
    sections: ['IT Act Section 43', 'IT Act Section 66', 'Indian criminal law provisions'],
    punishment:
      'Unauthorized disruption and extortion-based cyber activity can attract imprisonment and fine, depending on the conduct and intent proved.',
    penalty:
      'Victims may seek compensation for loss of access, business interruption, and data damage.',
    evidence: ['Disconnect the affected device from the network', 'Preserve ransom notes and file hashes', 'Use backups and report the incident immediately'],
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function formatPdfLines(doc: jsPDF, text: string, width: number) {
  return doc.splitTextToSize(text, width);
}

export default function IndianCyberLawPage() {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((currentIndex) => (currentIndex + 1) % searchPlaceholders.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const filteredLaws = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return lawEntries;
    }

    return lawEntries.filter((entry) => {
      const searchableText = [entry.title, ...entry.aliases, ...entry.sections, entry.punishment, entry.penalty, ...entry.evidence]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  const downloadAllLaws = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = 56;

    const ensureSpace = (requiredHeight: number) => {
      if (cursorY + requiredHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Indian Cyber Crime Laws Reference', margin, cursorY);

    cursorY += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const introLines = formatPdfLines(
      doc,
      'Educational reference only. Verify exact sections and outcomes with a qualified lawyer or law-enforcement authority, because charges depend on the facts of each case.',
      contentWidth,
    );
    doc.text(introLines, margin, cursorY);
    cursorY += introLines.length * 13 + 8;

    lawEntries.forEach((entry, index) => {
      ensureSpace(90);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${index + 1}. ${entry.title}`, margin, cursorY);
      cursorY += 18;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      const sectionsLines = formatPdfLines(doc, `Sections: ${entry.sections.join(', ')}`, contentWidth);
      doc.text(sectionsLines, margin, cursorY);
      cursorY += sectionsLines.length * 13 + 2;

      const punishmentLines = formatPdfLines(doc, `Punishment: ${entry.punishment}`, contentWidth);
      doc.text(punishmentLines, margin, cursorY);
      cursorY += punishmentLines.length * 13 + 2;

      const penaltyLines = formatPdfLines(doc, `Penalty: ${entry.penalty}`, contentWidth);
      doc.text(penaltyLines, margin, cursorY);
      cursorY += penaltyLines.length * 13 + 2;

      const evidenceLines = formatPdfLines(doc, `Evidence tips: ${entry.evidence.join(' | ')}`, contentWidth);
      doc.text(evidenceLines, margin, cursorY);
      cursorY += evidenceLines.length * 13 + 14;
    });

    doc.save('indian-cyber-crime-laws.pdf');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="border-b border-gray-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← Back to Home
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-400">Indian Cyber Law Module</span>
        </div>
      </div>

      <main className="pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-[0.24em]">
                <Scale className="w-3.5 h-3.5" />
                Indian Cyber Law Modules
              </span>
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Search cyber crimes and see the legal punishment in India.
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Type examples such as phishing attack, UPI scam, identity theft, or ransomware to see the most relevant Indian cyber crime law, along with penalties, punishment, and evidence tips.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-cyan-950/20 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-cyan-600 dark:text-cyan-300 text-sm font-semibold uppercase tracking-[0.2em]">Search the law</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">Find the right section fast</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-full px-3 py-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Verified reference
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Try ${searchPlaceholders[placeholderIndex]}`}
                  className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 pl-11 pr-4 py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-slate-400">
                {searchPlaceholders.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={downloadAllLaws}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-3 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                Download all laws as PDF
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5">
            {filteredLaws.length > 0 ? (
              filteredLaws.map((entry) => (
                <article key={entry.title} className="rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 p-5 sm:p-6 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{entry.title}</h3>
                      <p className="text-gray-600 dark:text-slate-400 text-sm mt-2 max-w-3xl">
                        Search terms: {entry.aliases.join(', ')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.sections.map((section) => (
                        <span key={section} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
                        <FileText className="w-4 h-4" />
                        Punishment
                      </div>
                      <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{entry.punishment}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
                        <Scale className="w-4 h-4" />
                        Penalty
                      </div>
                      <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{entry.penalty}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 p-4 transition-colors duration-300">
                    <p className="text-gray-900 dark:text-white font-semibold mb-2">Evidence and next steps</p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {entry.evidence.map((item) => (
                        <li key={item} className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
                <p className="text-lg font-semibold text-white">No exact match found.</p>
                <p className="text-slate-400 mt-2">Try phishing attack, UPI scam, identity theft, ransomware, or cyber stalking.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
