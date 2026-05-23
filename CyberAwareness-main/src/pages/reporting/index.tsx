import Hero from './components/Hero';
import ReportingSteps from './components/ReportingSteps';
import EvidenceChecklist from './components/EvidenceChecklist';
import EmergencyActions from './components/EmergencyActions';
import HelplineCard from './components/HelplineCard';
import SafetyTips from './components/SafetyTips';

export default function ReportingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <Hero />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReportingSteps />
            <EvidenceChecklist />
            <SafetyTips />
          </div>

          <aside className="space-y-6">
            <HelplineCard />
            <EmergencyActions />
          </aside>
        </div>
      </main>
    </div>
  );
}
