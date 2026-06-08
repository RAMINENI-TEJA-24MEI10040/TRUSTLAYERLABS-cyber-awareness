import React, { useState, useEffect, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// Integration Imports
import { useConversationStore } from './stores/conversationStore';
import { questionEngine } from './engines/questionEngine';
import { evidenceRecommendationEngine } from './engines/evidenceRecommendationEngine';
import { timelineSuggestionEngine } from './engines/timelineSuggestionEngine';
import { lawExplanationLayer } from './layers/lawExplanationLayer';
import { ReviewCenter } from './components/ReviewCenter';
import { complaintPacketAdapter } from './adapters/complaintPacketAdapter';
import { complaintPacketPdf } from './adapters/complaintPacketPdf';

/**
 * CyberJusticeConversationUI
 * Integrates: conversationStore, questionEngine, evidenceRecommendationEngine,
 * timelineSuggestionEngine, and lawExplanationLayer.
 */

interface SuggestedQuestion {
  text: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface EvidenceInfo {
  recommended: {
    name: string;
    confidence: number;
  }[];
  missing: string[];
}

interface TimelineEvent {
  id: string;
  description: string;
  timestamp: string;
  impact?: 'High' | 'Medium' | 'Low';
}

interface LawInsight {
  lawName: string;
  applicationLogic: string;
  requiredEvidence: {
    label: string;
    description: string;
  }[];
}

// 1. Chat Interface Component
const ChatInterface: React.FC<{ messages: any[], isTyping: boolean, onSend: (text: string) => void }> = ({ messages, isTyping, onSend }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#1a1c1e] border border-[#2d2f31] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-[#3b82f6] text-white rounded-br-none' 
                : 'bg-[#2d2f31] text-[#e1e3e6] rounded-bl-none border border-[#3e4042]'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[#2d2f31] text-[#9ba1a6] px-4 py-2 rounded-2xl text-xs italic">
              AI is analyzing your case...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-[#212327] border-t border-[#2d2f31]">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-[#1a1c1e] border border-[#3e4042] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all"
            placeholder="Discuss your case details..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (onSend(input), setInput(''))}
          />
          <button 
            onClick={() => { onSend(input); setInput(''); }}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Suggested Questions Panel
const SuggestedQuestionsPanel: React.FC<{ questions: SuggestedQuestion[] }> = ({ questions }) => (
  <section className="bg-[#212327] rounded-xl p-5 border border-[#2d2f31]">
    <h3 className="text-sm font-bold text-[#9ba1a6] uppercase tracking-widest mb-4 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Suggested Questions
    </h3>
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="group p-3 bg-[#1a1c1e] hover:bg-[#25282c] rounded-lg border border-[#2d2f31] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-semibold text-[#3b82f6] group-hover:text-white transition-colors">{q.text}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              q.priority === 'High' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
            }`}>{q.priority}</span>
          </div>
          <p className="text-xs text-[#9ba1a6] leading-snug">Reason: {q.reason}</p>
        </div>
      ))}
    </div>
  </section>
);

// 3. Evidence Suggestions Panel
const EvidenceSuggestionsPanel: React.FC<{ evidence: EvidenceInfo }> = ({ evidence }) => {
  const colorScale = scaleLinear<string>()
    .domain([0, 0.7, 1])
    .range(['#ef4444', '#f59e0b', '#10b981']);

  const chartData = evidence.recommended.map(e => ({
    name: e.name,
    confidence: Math.round(e.confidence * 100),
    color: colorScale(e.confidence)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c1e] border border-[#3e4042] p-2 rounded shadow-xl text-[10px]">
          <p className="text-white font-bold mb-1">{payload[0].payload.name}</p>
          <p style={{ color: payload[0].payload.color }}>Confidence: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-[#212327] rounded-xl p-5 border border-[#2d2f31]">
      <h3 className="text-sm font-bold text-[#9ba1a6] uppercase tracking-widest mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div> Evidence Engine
      </h3>
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-[#5c6269] uppercase mb-4">Recommended</p>
          <div className="h-[140px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={110} 
                  tick={{ fill: '#ccd0d5', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="confidence" radius={[0, 4, 4, 0]} barSize={10} isAnimationActive={true} animationDuration={1000}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#5c6269] uppercase text-red-400">Missing</p>
          {evidence.missing.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-red-200 bg-red-900/10 p-2 rounded border border-red-900/30">
              <span className="text-red-500">!</span> {m}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. Timeline Suggestions Panel
const TimelineSuggestionsPanel: React.FC<{ 
  events: TimelineEvent[], 
  approvedIds: Set<string>,
  sharedIds: Set<string>,
  onApprove: (id: string) => void, 
  onReject: (id: string) => void,
  onExport: () => void,
  onShare: () => void
}> = ({ events, approvedIds, sharedIds, onApprove, onReject, onExport, onShare }) => {
  const [filterHighImpact, setFilterHighImpact] = useState(false);

  const displayedEvents = filterHighImpact 
    ? events.filter(ev => ev.impact === 'High') 
    : events;

  return (
    <section className="bg-[#212327] rounded-xl p-5 border border-[#2d2f31]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-[#9ba1a6] uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> Timeline Builder
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterHighImpact(!filterHighImpact)}
            className={`text-[9px] px-2 py-0.5 rounded border transition-all font-bold uppercase tracking-tight ${
              filterHighImpact 
                ? 'bg-[#3b82f6] text-white border-[#3b82f6]' 
                : 'bg-transparent border-[#3e4042] text-[#5c6269] hover:text-[#9ba1a6]'
            }`}
          >
            {filterHighImpact ? 'CFAA Only' : 'Filter'}
          </button>
          <button 
            onClick={onExport}
            className="text-[9px] px-2 py-0.5 rounded border border-green-600/50 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white transition-all font-bold uppercase tracking-tight"
          >
            Legal Export
          </button>
          <button 
            onClick={onShare}
            className="text-[9px] px-2 py-0.5 rounded border border-orange-600/50 bg-orange-600/10 text-orange-400 hover:bg-orange-600 hover:text-white transition-all font-bold uppercase tracking-tight"
          >
            Share to Legal
          </button>
        </div>
      </div>
      <div className="relative border-l border-[#2d2f31] ml-2 pl-6 space-y-6">
        {displayedEvents.map((ev) => (
          <div key={ev.id} className={`relative p-2 rounded-lg transition-all ${approvedIds.has(ev.id) ? 'bg-green-900/10 border border-green-900/30' : ''}`}>
            <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#212327] ${
              approvedIds.has(ev.id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
              ev.impact === 'High' ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
              'bg-[#3e4042]'
            }`}></div>
            <div className="flex justify-between items-center mb-1">
              <span className="block text-[10px] text-[#5c6269] font-mono">{ev.timestamp}</span>
              {ev.impact === 'High' && (
                <div className="flex gap-1.5 items-center">
                  {sharedIds.has(ev.id) && (
                    <span className="text-[8px] bg-orange-900/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-900/30 font-bold uppercase tracking-tighter">Legal Review</span>
                  )}
                  <span className="text-[8px] text-[#3b82f6] font-bold uppercase tracking-widest">CFAA Impact</span>
                </div>
              )}
            </div>
            <p className="text-xs text-[#e1e3e6] mb-3 leading-relaxed">{ev.description}</p>
            <div className="flex gap-2">
              {!approvedIds.has(ev.id) ? (
                <button 
                  onClick={() => onApprove(ev.id)} 
                  className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors font-bold"
                >
                  Approve
                </button>
              ) : (
                <button 
                  onClick={() => onReject(ev.id)} 
                  className="text-[10px] bg-red-900/20 hover:bg-red-900/40 text-red-400 px-3 py-1 rounded transition-colors font-bold border border-red-900/30"
                >
                  Remove
                </button>
              )}
              {!approvedIds.has(ev.id) && (
                <button onClick={() => onReject(ev.id)} className="text-[10px] bg-[#2d2f31] hover:bg-[#3e4042] text-[#9ba1a6] px-3 py-1 rounded transition-colors">Reject</button>
              )}
            </div>
          </div>
        ))}
        {displayedEvents.length === 0 && (
          <p className="text-[10px] text-[#5c6269] italic py-2">No critical legal events found for current filters.</p>
        )}
      </div>
    </section>
  );
};

// 5. Law Explanation Panel
const LawExplanationPanel: React.FC<{ insights: LawInsight[], sharedCount: number }> = ({ insights, sharedCount }) => (
  <section className="bg-[#212327] rounded-xl p-5 border border-[#2d2f31]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold text-[#9ba1a6] uppercase tracking-widest flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500"></div> Legal Foundation
      </h3>
      {sharedCount > 0 && (
        <span className="text-[8px] bg-blue-900/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900/30 font-bold uppercase tracking-tighter animate-pulse">
          {sharedCount} Events Shared
        </span>
      )}
    </div>
    <div className="space-y-6">
      {insights.map((ins, i) => (
        <div key={i} className="space-y-3">
          <div className="p-2.5 bg-[#1a1c1e] rounded border-l-2 border-orange-500">
            <h4 className="text-xs font-bold text-orange-200">{ins.lawName}</h4>
          </div>
          <p className="text-[11px] text-[#9ba1a6] leading-normal px-1"><span className="text-[#5c6269] font-bold">Logic:</span> {ins.applicationLogic}</p>
          <div className="flex flex-wrap gap-1.5 px-1">
            {ins.requiredEvidence.map((re, j) => (
              <div key={j} className="group relative inline-block">
                <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold tracking-tighter transition-colors cursor-help ${
                  sharedCount > 0 
                    ? 'bg-green-900/10 text-green-400 border-green-900/30' 
                    : 'bg-[#2d2f31] text-[#ccd0d5] border-[#3e4042]'
                }`}>
                  {sharedCount > 0 ? '✓ ' : 'Req: '}{re.label}
                </span>
                {/* Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <div className="bg-[#1a1c1e] text-[#ccd0d5] text-[10px] p-2 rounded border border-[#3e4042] shadow-2xl w-max max-w-[200px] text-center leading-tight">
                    {re.description}
                  </div>
                  <div className="w-1.5 h-1.5 bg-[#1a1c1e] border-r border-b border-[#3e4042] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Main Cyber Justice Case Integration
export const CyberJusticeAIConversation: React.FC<{ cyberCase: any }> = ({ cyberCase }) => {
  // 5. Replace local useState with conversationStore
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    setTyping, 
    updateCaseMetadata,
    caseData 
  } = useConversationStore();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [sharedEventIds, setSharedEventIds] = useState<Set<string>>(new Set());

  // 4. Synchronize incoming case data with the global store
  useEffect(() => {
    if (cyberCase) {
      updateCaseMetadata(cyberCase);
    }
  }, [cyberCase, updateCaseMetadata]);

  // 1 & 8. Replace local suggestedQuestions with questionEngine
  const suggestedQuestions = useMemo(() => 
    caseData ? questionEngine.generateQuestions(caseData) : [], 
  [caseData]); // Updates dynamically from missing fields and confidence

  // 2 & 7. Replace local evidence with evidenceRecommendationEngine
  const evidence = useMemo(() => 
    caseData ? evidenceRecommendationEngine.getRecommendations(caseData.category, caseData.evidence) : { recommended: [], missing: [] }, 
  [caseData?.category, caseData?.evidence]); // Updates from crime category and uploaded files

  // 3. Replace local events with timelineSuggestionEngine
  const events = useMemo(() => 
    caseData ? timelineSuggestionEngine.suggestEvents(caseData.extractedFacts) : [], 
  [caseData?.extractedFacts]); // Maps actual extracted facts to the builder

  // 4 & 9. Replace local lawInsights with lawExplanationLayer
  const lawInsights = useMemo(() => 
    caseData ? lawExplanationLayer.getApplicableLaws(caseData.category, caseData.verifiedTimeline) : [], 
  [caseData?.category, caseData?.verifiedTimeline]); // Derives logic from verified timeline

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
  };

  const handleApproveEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      // 6. Update conversationStore (Single source of truth for the Case)
      updateCaseMetadata({
        verifiedTimeline: [...(caseData?.verifiedTimeline || []), event]
      });
    }
  };

  const handleRejectEvent = (id: string) => {
    updateCaseMetadata({
      verifiedTimeline: (caseData?.verifiedTimeline || []).filter((e: any) => e.id !== id)
    });
  };

  // 10. Replace txt export with Packet Adapters
  const handleExportSummary = async () => {
    if (caseData) {
      const packet = complaintPacketAdapter.buildPacket(caseData, lawInsights);
      await complaintPacketPdf.generate(packet);
    }
  };

  const handleShareToLegal = async () => {
    const approvedEvents = caseData?.verifiedTimeline || [];
    if (approvedEvents.length === 0) {
      alert("Please approve at least one timeline event to share with the legal team.");
      return;
    }

    setTyping(true);
    await lawExplanationLayer.submitForReview(approvedEvents);

    // Mark these specific approved events as shared
    setSharedEventIds(new Set(approvedEvents.map((e: any) => e.id)));
    setTyping(false);
  };

  const approvedIds = useMemo(() => 
    new Set((caseData?.verifiedTimeline || []).map((e: any) => e.id)), 
  [caseData?.verifiedTimeline]);

  return (
    <div className="flex h-screen bg-[#141517] text-[#e1e3e6] p-6 gap-6 font-sans antialiased">
      {/* 11. Mount ReviewCenter before export */}
      {isReviewOpen && (
        <ReviewCenter 
          caseData={caseData} 
          onClose={() => setIsReviewOpen(false)} 
          onConfirm={handleExportSummary} 
        />
      )}

      {/* Left Column: Context & Law */}
      <div className="w-[340px] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-none">
        <LawExplanationPanel insights={lawInsights} sharedCount={sharedEventIds.size} />
        <TimelineSuggestionsPanel 
          events={events} 
          approvedIds={approvedIds}
          sharedIds={sharedEventIds}
          onApprove={handleApproveEvent} 
          onReject={handleRejectEvent}
          onExport={() => setIsReviewOpen(true)}
          onShare={handleShareToLegal}
        />
      </div>

      {/* Middle Column: Chat */}
      <div className="flex-1 flex flex-col min-w-[500px]">
        <header className="mb-4 border-l-4 border-blue-600 pl-4">
          <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-3">
            CYBER JUSTICE AI <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full font-bold">CASE: {cyberCase?.id || 'ALPHA-7'}</span>
          </h1>
          <p className="text-xs text-[#5c6269] mt-1 font-medium italic">Status: Investigation Ongoing</p>
        </header>
        <ChatInterface messages={messages} isTyping={isTyping} onSend={handleSend} />
      </div>

      {/* Right Sidebar: Engines */}
      <div className="w-[340px] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-none">
        <SuggestedQuestionsPanel questions={suggestedQuestions} />
        <EvidenceSuggestionsPanel evidence={evidence} />
      </div>
    </div>
  );
};