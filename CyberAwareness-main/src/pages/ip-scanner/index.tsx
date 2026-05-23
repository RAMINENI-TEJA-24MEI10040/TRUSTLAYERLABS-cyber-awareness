import IPScanner from "../../components/scanner/IPScanner";

export default function IPScannerPage() {
  return (
    <div className="min-h-screen bg-[#0b1020] text-white pt-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            IP Reputation Scanner
          </h1>
          <p className="text-slate-400 text-lg">
            Lookup IP reputation and abuse reports.
          </p>
        </div>

        <IPScanner />
      </div>
    </div>
  );
}
