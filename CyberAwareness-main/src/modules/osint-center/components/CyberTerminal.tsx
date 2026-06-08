/**
 * Cyber Terminal Interface Component
 * Terminal-driven investigation platform with hacker aesthetics
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Terminal, X, Maximize2, Minimize2 } from 'lucide-react';
import ciwStore from '../store/ciwStore';
import { useEvidenceStore } from '../store/evidenceStore';
import timelineStore from '../store/timelineStore';
import { extractEntitiesFromEvidence } from '../services/entityExtraction';
import { findCorrelationLinks } from '../services/correlationEngine';

type TerminalOutputType = 'command' | 'output' | 'error' | 'success' | 'scan' | 'loading';

interface TerminalLine {
  id: string;
  type: TerminalOutputType;
  text: string;
  timestamp: number;
}

interface TerminalCommand {
  command: string;
  description: string;
  usage: string;
  category: 'search' | 'show' | 'utility';
}

const AVAILABLE_COMMANDS: TerminalCommand[] = [
  {
    command: 'search email <query>',
    description: 'Search for emails in evidence',
    usage: 'search email admin@example.com',
    category: 'search',
  },
  {
    command: 'search username <query>',
    description: 'Search for usernames in evidence',
    usage: 'search username admin123',
    category: 'search',
  },
  {
    command: 'search domain <query>',
    description: 'Search for domains in evidence',
    usage: 'search domain malicious.com',
    category: 'search',
  },
  {
    command: 'search ip <query>',
    description: 'Search for IP addresses in evidence',
    usage: 'search ip 192.168.1.1',
    category: 'search',
  },
  {
    command: 'search wallet <query>',
    description: 'Search for cryptocurrency wallets',
    usage: 'search wallet 0x1234567890abcdef',
    category: 'search',
  },
  {
    command: 'search mobile <query>',
    description: 'Search for mobile numbers',
    usage: 'search mobile +919876543210',
    category: 'search',
  },
  {
    command: 'show graph',
    description: 'Display relationship graph statistics',
    usage: 'show graph',
    category: 'show',
  },
  {
    command: 'show evidence',
    description: 'Display evidence locker statistics',
    usage: 'show evidence',
    category: 'show',
  },
  {
    command: 'show timeline',
    description: 'Display case timeline statistics',
    usage: 'show timeline',
    category: 'show',
  },
  {
    command: 'show summary',
    description: 'Display investigation summary',
    usage: 'show summary',
    category: 'show',
  },
  {
    command: 'show legal',
    description: 'Display legal framework',
    usage: 'show legal',
    category: 'show',
  },
  {
    command: 'show complaint',
    description: 'Display complaint packet',
    usage: 'show complaint',
    category: 'show',
  },
  {
    command: 'clear',
    description: 'Clear terminal output',
    usage: 'clear',
    category: 'utility',
  },
  {
    command: 'help',
    description: 'Show help information',
    usage: 'help',
    category: 'utility',
  },
];

export const CyberTerminal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [output, setOutput] = useState<TerminalLine[]>([
    {
      id: '0',
      type: 'success',
      text: '> CYBER INVESTIGATION TERMINAL v1.0',
      timestamp: Date.now(),
    },
    {
      id: '1',
      type: 'output',
      text: '> Type "help" for available commands',
      timestamp: Date.now() + 100,
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoComplete, setAutoComplete] = useState<string[]>([]);
  const [selectedAutoComplete, setSelectedAutoComplete] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Store access
  const evidenceItems = useEvidenceStore((s) => s.items);
  const activeCaseId = ciwStore.getState().activeCaseId;
  const graph = ciwStore.getState().graph;
  const caseEvents = activeCaseId ? timelineStore.getState().events.filter((e) => e.caseId === activeCaseId) : [];

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Generate autocomplete suggestions
  const generateAutoComplete = useCallback((inputText: string): string[] => {
    if (!inputText.trim()) return [];

    const suggestions: string[] = [];

    // Command suggestions
    AVAILABLE_COMMANDS.forEach((cmd) => {
      if (cmd.command.toLowerCase().startsWith(inputText.toLowerCase())) {
        suggestions.push(cmd.command);
      }
    });

    return suggestions.slice(0, 5);
  }, []);

  // Handle input change with autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setSelectedAutoComplete(-1);
    setAutoComplete(generateAutoComplete(newInput));
  };

  // Execute terminal command
  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      // Add to history
      setHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      // Add command to output
      const cmdId = Date.now().toString();
      setOutput((prev) => [
        ...prev,
        {
          id: cmdId,
          type: 'command',
          text: `$ ${trimmedCmd}`,
          timestamp: Date.now(),
        },
      ]);

      const parts = trimmedCmd.split(' ');
      const mainCmd = parts[0]?.toLowerCase();
      const subCmd = parts[1]?.toLowerCase();
      const query = parts.slice(2).join(' ');

      try {
        if (mainCmd === 'search') {
          handleSearchCommand(subCmd, query);
        } else if (mainCmd === 'show') {
          handleShowCommand(subCmd);
        } else if (mainCmd === 'clear') {
          setOutput([]);
        } else if (mainCmd === 'help') {
          handleHelpCommand();
        } else {
          setOutput((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'error',
              text: `Command not found: ${mainCmd}. Type "help" for available commands.`,
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (error) {
        setOutput((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'error',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: Date.now(),
          },
        ]);
      }

      setInput('');
      setAutoComplete([]);
    },
    [evidenceItems, graph, activeCaseId, caseEvents],
  );

  const handleSearchCommand = (subCmd: string | undefined, query: string) => {
    if (!subCmd) {
      setOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'error',
          text: 'Usage: search [email|username|domain|ip|wallet|mobile] <query>',
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    if (!query) {
      setOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'error',
          text: `Usage: search ${subCmd} <query>`,
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    // Scan for entities in evidence
    const caseEvidence = activeCaseId ? evidenceItems.filter((e) => e.caseId === activeCaseId) : evidenceItems;
    const results: string[] = [];

    caseEvidence.forEach((evidence) => {
      const extraction = extractEntitiesFromEvidence(evidence.id, evidence.summary || evidence.raw, evidence.title);
      const matches = extraction.entities.filter((e) => {
        const entityType = subCmd === 'email' ? 'email' : subCmd === 'domain' ? 'domain' : subCmd === 'ip' ? 'ip' : subCmd === 'wallet' ? 'wallet' : subCmd === 'mobile' ? 'mobile' : 'username';
        return e.type === entityType && e.value.toLowerCase().includes(query.toLowerCase());
      });

      matches.forEach((match) => {
        results.push(`[${evidence.id}] ${evidence.title}: ${match.value} (confidence: ${(match.confidence * 100).toFixed(0)}%)`);
      });
    });

    if (results.length === 0) {
      setOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'output',
          text: `No ${subCmd} entities found matching: ${query}`,
          timestamp: Date.now(),
        },
      ]);
    } else {
      results.forEach((result, idx) => {
        setOutput((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${idx}`,
            type: 'scan',
            text: result,
            timestamp: Date.now() + idx * 50,
          },
        ]);
      });

      setOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'success',
          text: `Found ${results.length} matching entities`,
          timestamp: Date.now() + results.length * 50,
        },
      ]);
    }
  };

  const handleShowCommand = (subCmd: string | undefined) => {
    if (!subCmd) {
      setOutput((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'error',
          text: 'Usage: show [graph|evidence|timeline|summary|legal|complaint]',
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    let output = '';

    switch (subCmd) {
      case 'graph':
        output = `RELATIONSHIP GRAPH\n`;
        output += `├─ Nodes: ${graph?.nodes.length ?? 0}\n`;
        output += `├─ Edges: ${graph?.edges.length ?? 0}\n`;
        output += `├─ Correlation Links: ${findCorrelationLinks(graph?.nodes ?? []).length}\n`;
        output += `└─ Active Case: ${activeCaseId || 'None'}`;
        break;

      case 'evidence': {
        const caseEvidence = activeCaseId ? evidenceItems.filter((e) => e.caseId === activeCaseId) : evidenceItems;
        output = `EVIDENCE LOCKER\n`;
        output += `├─ Total Items: ${caseEvidence.length}\n`;
        output += `├─ Sources: ${new Set(caseEvidence.map((e) => e.source)).size}\n`;
        output += `├─ Tags: ${new Set(caseEvidence.flatMap((e) => e.tags)).size}\n`;
        output += `└─ Most Recent: ${caseEvidence.length > 0 ? new Date(caseEvidence[0].createdAt).toLocaleString() : 'N/A'}`;
        break;
      }

      case 'timeline': {
        output = `INVESTIGATION TIMELINE\n`;
        output += `├─ Active Case: ${activeCaseId || 'None'}\n`;
        output += `├─ Total Events: ${caseEvents.length}\n`;
        const severities = new Set(caseEvents.map((e) => e.severity));
        output += `├─ Severity Levels: ${Array.from(severities).join(', ') || 'N/A'}\n`;
        output += `└─ Latest Event: ${caseEvents.length > 0 ? new Date(caseEvents[0].timestamp).toLocaleString() : 'N/A'}`;
        break;
      }

      case 'summary': {
        const caseEvidence = activeCaseId ? evidenceItems.filter((e) => e.caseId === activeCaseId) : evidenceItems;
        output = `INVESTIGATION SUMMARY\n`;
        output += `├─ Case ID: ${activeCaseId || 'None'}\n`;
        output += `├─ Evidence Count: ${caseEvidence.length}\n`;
        output += `├─ Graph Entities: ${graph?.nodes.length ?? 0}\n`;
        output += `├─ Timeline Events: ${caseEvents.length}\n`;
        output += `└─ Relationships: ${graph?.edges.length ?? 0}`;
        break;
      }

      case 'legal':
        output = `LEGAL FRAMEWORK\n`;
        output += `├─ Indian Cyber Law (ITA, BNS, SPPU)\n`;
        output += `├─ Cyber Crime Stations Network\n`;
        output += `├─ Evidence Chain Compliance\n`;
        output += `└─ Report Generation Ready`;
        break;

      case 'complaint':
        output = `COMPLAINT PACKET\n`;
        output += `├─ Status: Ready for Generation\n`;
        output += `├─ Format: PDF Report\n`;
        output += `├─ Legal Framework: ITA & BNS\n`;
        output += `└─ Export Available`;
        break;

      default:
        setOutput((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'error',
            text: `Unknown show command: ${subCmd}`,
            timestamp: Date.now(),
          },
        ]);
        return;
    }

    setOutput((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'output',
        text: output,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleHelpCommand = () => {
    const commands = AVAILABLE_COMMANDS;

    setOutput((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'output',
        text: 'AVAILABLE COMMANDS',
        timestamp: Date.now(),
      },
    ]);

    const categories = ['search', 'show', 'utility'] as const;
    categories.forEach((category, catIdx) => {
      const categoryCommands = commands.filter((c) => c.category === category);
      setOutput((prev) => [
        ...prev,
        {
          id: `${Date.now()}-cat-${catIdx}`,
          type: 'output',
          text: `\n${category.toUpperCase()} COMMANDS:`,
          timestamp: Date.now() + catIdx * 50,
        },
      ]);

      categoryCommands.forEach((cmd, cmdIdx) => {
        setOutput((prev) => [
          ...prev,
          {
            id: `${Date.now()}-cmd-${catIdx}-${cmdIdx}`,
            type: 'output',
            text: `  ${cmd.command.padEnd(30)} - ${cmd.description}`,
            timestamp: Date.now() + (catIdx * 50 + cmdIdx * 10),
          },
        ]);
      });
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedAutoComplete >= 0 && autoComplete[selectedAutoComplete]) {
        executeCommand(autoComplete[selectedAutoComplete]);
      } else {
        executeCommand(input);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (autoComplete.length > 0 && selectedAutoComplete < autoComplete.length - 1) {
        setSelectedAutoComplete((prev) => prev + 1);
      } else if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
        setAutoComplete([]);
        setSelectedAutoComplete(-1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedAutoComplete >= 0) {
        setSelectedAutoComplete((prev) => Math.max(-1, prev - 1));
      } else if (historyIndex >= 0) {
        const newIndex = historyIndex - 1;
        if (newIndex < 0) {
          setInput('');
          setHistoryIndex(-1);
        } else {
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        }
        setAutoComplete([]);
        setSelectedAutoComplete(-1);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (autoComplete.length > 0) {
        const nextIndex = (selectedAutoComplete + 1) % autoComplete.length;
        setSelectedAutoComplete(nextIndex);
      }
    } else if (e.key === 'Escape') {
      setAutoComplete([]);
      setSelectedAutoComplete(-1);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 rounded-lg bg-black border border-cyan-500 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-500/50 z-40"
        title="Open Terminal"
      >
        <Terminal size={20} />
      </button>
    );
  }

  const terminalHeight = isMaximized ? 'h-screen' : 'h-96';
  const terminalWidth = isMaximized ? 'w-screen' : 'w-full';

  return (
    <div
      className={`fixed bottom-0 ${isMaximized ? 'inset-0' : 'right-0 rounded-t-lg'} ${terminalWidth} ${terminalHeight} bg-black border border-cyan-500 flex flex-col z-50 shadow-2xl shadow-cyan-500/50`}
      style={{
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
      }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/30 bg-black/80">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-500" />
          <span className="text-cyan-400 font-mono text-sm font-bold">CYBER_TERMINAL</span>
          <span className="text-cyan-600 font-mono text-xs ml-2">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:text-cyan-300 text-cyan-500 transition-colors"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:text-red-400 text-cyan-500 transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 bg-black"
        style={{
          textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
        }}
      >
        {output.map((line) => {
          const baseClass = 'font-mono text-sm';
          let colorClass = 'text-slate-400';

          switch (line.type) {
            case 'command':
              colorClass = 'text-cyan-400';
              break;
            case 'output':
              colorClass = 'text-slate-300';
              break;
            case 'error':
              colorClass = 'text-red-400';
              break;
            case 'success':
              colorClass = 'text-emerald-400';
              break;
            case 'scan':
              colorClass = 'text-yellow-400 animate-pulse';
              break;
            case 'loading':
              colorClass = 'text-cyan-300 animate-pulse';
              break;
          }

          return (
            <div key={line.id} className={`${baseClass} ${colorClass} whitespace-pre-wrap break-words`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Auto-complete dropdown */}
      {autoComplete.length > 0 && (
        <div className="border-t border-cyan-500/30 bg-black/90 max-h-32 overflow-y-auto">
          {autoComplete.map((suggestion, idx) => (
            <div
              key={idx}
              className={`px-4 py-1 font-mono text-xs cursor-pointer transition-colors ${
                idx === selectedAutoComplete ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Terminal Input */}
      <div className="border-t border-cyan-500/30 bg-black/80 p-4 flex items-center gap-2">
        <span className="text-cyan-500 font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-cyan-300 placeholder-slate-600 outline-none font-mono text-sm"
          autoFocus
          spellCheck="false"
        />
        <span className="text-cyan-500 animate-pulse">▮</span>
      </div>

      {/* CRT Scanlines overlay */}
      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        
        .crt-effect {
          animation: scanlines 0.15s linear infinite;
          opacity: 0.15;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CyberTerminal;
