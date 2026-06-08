import React, { useMemo, useState } from 'react';
import CIWSidebar from '../components/CIWSidebar';
import CIWSearchBar from '../components/CIWSearchBar';
import CIWResultsGrid from '../components/CIWResultsGrid';
import InvestigationExplorer from '../components/InvestigationExplorer';
import { motion } from 'framer-motion';
import timelineStore from '../store/timelineStore';
import ciwStore from '../store/ciwStore';
import ThreatFeedPanel from '../components/ThreatFeedPanel';
import SystemHealthWidget from '../components/SystemHealthWidget';
import ActiveCasesConsole from '../components/ActiveCasesConsole';
import InvestigationStatsWidget from '../components/InvestigationStatsWidget';
import WorkspaceDashboard from '../components/WorkspaceDashboard';
import CaseDashboard from '../components/CaseDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

type DashboardTab = 'investigation' | 'workspaces' | 'cases';

const CIWDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('investigation');
  const activeCaseId = ciwStore.getState().activeCaseId;
  
  // Memoize event filtering and sorting to prevent unnecessary recalculations
  const events = useMemo(() => {
    return timelineStore.getState().events
      .filter(e => e.caseId === activeCaseId)
      .slice(0, 10)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activeCaseId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspaces':
        return (
          <ErrorBoundary>
            <WorkspaceDashboard />
          </ErrorBoundary>
        );
      case 'cases':
        return (
          <ErrorBoundary>
            <CaseDashboard />
          </ErrorBoundary>
        );
      case 'investigation':
      default:
        return (
          <div className="min-h-screen bg-black text-cyan-100">
            <div className="max-w-full mx-auto p-4">
              <div className="grid grid-cols-12 gap-4">
                <aside className="col-span-2">
                  <CIWSidebar />
                </aside>

                <main className="col-span-7 space-y-4">
                  <InvestigationStatsWidget />

                  <div className="bg-black/40 p-3 rounded border border-cyan-800/20">
                    <header className="mb-2">
                      <motion.h1 className="text-xl font-bold text-cyan-200">Cyber Investigation Workspace</motion.h1>
                      <div className="mt-2"><CIWSearchBar /></div>
                    </header>

                    <div className="grid grid-cols-1 gap-4">
                      <section className="bg-black/30 rounded p-3">
                        <CIWResultsGrid />
                      </section>

                      <section className="bg-black/30 rounded p-3">
                        <ErrorBoundary>
                          <InvestigationExplorer />
                        </ErrorBoundary>
                      </section>
                    </div>
                  </div>
                </main>

                <aside className="col-span-3 space-y-4">
                  <SystemHealthWidget />
                  <div className="p-0">
                    <div className="bg-black/40 p-3 rounded border border-cyan-800/20">
                      <h4 className="text-cyan-200 text-sm mb-2">Latest Timeline</h4>
                      <div className="max-h-48 overflow-auto text-xs font-mono">
                        {events.map(ev => (
                          <div key={ev.id} className="flex items-start justify-between p-2 border-b border-cyan-900/10">
                            <div>
                              <div className="text-[11px] text-slate-400">{new Date(ev.timestamp).toLocaleString()}</div>
                              <div className="text-sm text-cyan-100">{ev.title}</div>
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded ${ev.severity === 'high' ? 'bg-rose-700/40' : 'bg-cyan-900/20'}`}>{ev.severity}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-right"><button className="text-xs px-2 py-1 border border-cyan-800 rounded">View Full Timeline</button></div>
                    </div>
                  </div>

                  <ThreatFeedPanel />
                  <ActiveCasesConsole />
                </aside>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100">
      {/* Tab Navigation */}
      <div className="border-b border-cyan-800/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveTab('investigation')}
            className={`px-4 py-2 rounded border transition ${
              activeTab === 'investigation'
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'border-gray-700/50 text-gray-400 hover:text-cyan-300'
            }`}
          >
            Investigation
          </button>
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`px-4 py-2 rounded border transition ${
              activeTab === 'workspaces'
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'border-gray-700/50 text-gray-400 hover:text-cyan-300'
            }`}
          >
            Workspaces
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded border transition ${
              activeTab === 'cases'
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'border-gray-700/50 text-gray-400 hover:text-cyan-300'
            }`}
          >
            Cases
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default CIWDashboard;
