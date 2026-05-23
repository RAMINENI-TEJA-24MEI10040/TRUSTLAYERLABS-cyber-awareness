import BreachChecker from "../../components/scanner/BreachChecker";

export default function BreachCheckerPage() {
  return (
    <div className="min-h-screen bg-[#0b1020] text-white pt-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Breach Checker
          </h1>
          <p className="text-slate-400 text-lg">
            Check if an email appears in known breaches (mocked for demo).
          </p>
        </div>

        <BreachChecker />
      </div>
    </div>
  );
}
