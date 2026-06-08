import React, { useMemo, useState, useCallback } from 'react';
import { buildGraph } from '../utils/graph';
import InvestigationCanvas from './workspace/InvestigationCanvas';
import DraggablePanel from './workspace/DraggablePanel';
import BookmarksPanel from './workspace/BookmarksPanel';
import KeyboardShortcuts from './workspace/KeyboardShortcuts';
import SelectionToolbar from './workspace/SelectionToolbar';
import useWorkspaceStore from '../store/workspaceStore';
import useCIWStore from '../store/ciwStore';
import GraphLegend from './GraphLegend';
import GraphNode from './GraphNode';
import GraphSearchBar from './GraphSearchBar';
import GraphFilters, { type FilterState } from './GraphFilters';
import GraphDetailsPanel from './GraphDetailsPanel';
import GraphCorrelationSummary from './GraphCorrelationSummary';
import {
  findShortestPath,
  filterGraph,
  searchNodes,
} from '../utils/graphUtils';
import { findCorrelationLinks } from '../services/correlationEngine';
const svgWidth = 2400;
const svgHeight = 1600;

function getRelationshipColor(relationship: string) {
  switch (relationship) {
    case 'owns':
      return '#0ff';
    case 'linked_to':
      return '#7cffec';
    case 'contacted':
      return '#fef08a';
    case 'associated_with':
      return '#a78bfa';
    case 'observed_in':
      return '#f97316';
    default:
      return '#38bdf8';
  }
}

function computeLayout(nodes: Array<{ id: string; type: string }>, edges: Array<{ source: string; target: string }>) {
  const center = { x: svgWidth / 2, y: svgHeight / 2 };
  const positions: Record<string, { x: number; y: number }> = {};
  const root = nodes[0];
  if (!root) return positions;
  positions[root.id] = center;

  const resultNodes = nodes.filter((node) => node.id !== root.id && node.type !== 'source');
  const sourceNodes = nodes.filter((node) => node.type === 'source');
  const primaryRadius = Math.min(svgWidth, svgHeight) / 3.4;

  resultNodes.forEach((node, index) => {
    const angle = (index / Math.max(resultNodes.length, 1)) * Math.PI * 2;
    positions[node.id] = {
      x: center.x + Math.cos(angle) * primaryRadius,
      y: center.y + Math.sin(angle) * primaryRadius,
    };
  });

  const parentCounts: Record<string, number> = {};
  sourceNodes.forEach((node) => {
    const parentEdge = edges.find((edge) => edge.target === node.id && positions[edge.source]);
    const parentId = parentEdge?.source ?? root.id;
    const parent = positions[parentId] ?? center;
    const count = parentCounts[parentId] ?? 0;
    const angle = (count / 6) * Math.PI * 2 + 0.3;
    const offset = 120 + (count % 2) * 30;

    positions[node.id] = {
      x: parent.x + Math.cos(angle) * offset,
      y: parent.y + Math.sin(angle) * offset,
    };

    parentCounts[parentId] = count + 1;
  });

  return positions;
}

const InvestigationExplorer: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('[InvestigationExplorer] MOUNTED - graph component is active');
  const lastResponse = useCIWStore((state) => state.lastResponse);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragRect, setDragRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    riskLevel: 'all',
    entityTypes: [],
    dateRange: null,
  });

  const fullGraph = useMemo(() => {
    if (!lastResponse?.query || !lastResponse?.results) {
      // eslint-disable-next-line no-console
      console.debug('[InvestigationExplorer] no data', { query: !!lastResponse?.query, results: !!lastResponse?.results, resultsLength: lastResponse?.results?.length });
      return null;
    }
    // eslint-disable-next-line no-console
    console.log('[InvestigationExplorer] buildGraph input:', lastResponse.results);
    const builtGraph = buildGraph(lastResponse.query, lastResponse.results);
    // eslint-disable-next-line no-console
    console.log('[InvestigationExplorer] graph output:', { nodes: builtGraph.nodes.length, edges: builtGraph.edges.length, nodeIds: builtGraph.nodes.map(n => n.id) });
    return builtGraph;
  }, [lastResponse]);

  const graph = useMemo(() => {
    if (!fullGraph) return null;
    const filtered = filterGraph(fullGraph, filters);
    // eslint-disable-next-line no-console
    console.log('[graph stats]', {
      nodes: filtered.nodes.length,
      edges: filtered.edges.length,
    });
    return filtered;
  }, [fullGraph, filters]);

  const positions = useMemo(() => {
    if (!graph) return {};
    return computeLayout(graph.nodes, graph.edges);
  }, [graph]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !graph) return null;
    return graph.nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [selectedNodeId, graph]);

  const linkedEdges = useMemo(() => {
    if (!selectedNodeId || !graph) return [];
    return graph.edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId);
  }, [selectedNodeId, graph]);

  const linkedNodes = useMemo(() => {
    if (!selectedNodeId || !graph) return [];
    const nodeIds = new Set<string>();
    linkedEdges.forEach((edge) => {
      if (edge.source === selectedNodeId) nodeIds.add(edge.target);
      if (edge.target === selectedNodeId) nodeIds.add(edge.source);
    });
    return graph.nodes.filter((n) => nodeIds.has(n.id));
  }, [selectedNodeId, linkedEdges, graph]);

  const correlationLinks = useMemo(() => {
    if (!graph || graph.nodes.length < 2) return [];
    return findCorrelationLinks(graph.nodes).slice(0, 10);
  }, [graph]);

  const selectNodeStore = useWorkspaceStore((s) => s.selectNode);
  const toggleNodeStore = useWorkspaceStore((s) => s.toggleNode);
  const setVisibleIds = useWorkspaceStore((s) => s.setVisibleIds);

  // emit visible IDs whenever graph changes
  useMemo(() => {
    if (graph) {
      const visibleIds = graph.nodes.filter((n: any) => !useWorkspaceStore.getState().removedNodes.includes(n.id)).map((n: any) => n.id);
      setVisibleIds(visibleIds);
    }
  }, [graph, setVisibleIds]);

  const handleNodeClick = useCallback(
    (nodeId: string, event?: React.MouseEvent) => {
      const additive = !!(event && (event.ctrlKey || event.metaKey || event.shiftKey));
      selectNodeStore(nodeId, additive);
      setSelectedNodeId(nodeId);
    },
    [selectNodeStore]
  );

  const handleSearch = useCallback(
    (query: string, type: string) => {
      if (!graph) return;
      const results = searchNodes(graph, query, type);
      if (results.length > 0) {
        const targetNode = results[0];
        const rootNode = graph.nodes[0];
        if (rootNode) {
          const path = findShortestPath(graph, rootNode.id, targetNode.id);
          setHighlightedPath(path);
          setSelectedNodeId(targetNode.id);
        }
      }
    },
    [graph]
  );

  const handleClearSearch = useCallback(() => {
    setHighlightedPath([]);
  }, []);

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    setScale((current) => {
      const next = Math.min(Math.max(current + delta, 0.5), 2.2);
      return next;
    });
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStart) return;
    setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const handlePointerUp = () => setDragStart(null);

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setScale(1);
    setHighlightedPath([]);
    setSelectedNodeId(null);
  };

  if (!graph) {
    return (
      <div className="rounded-b-lg border-t border-cyan-800/60 bg-slate-950/80 p-8 text-slate-300">
        <p className="text-sm leading-6">
          No graph data available yet. Run an investigation or select a query to visualize entity relationships.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-b-3xl border border-cyan-800/60 bg-[#041017] shadow-[0_0_30px_rgba(14,116,144,0.24)]">
      <InvestigationCanvas>
      <KeyboardShortcuts />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,300px] gap-0 h-[700px]">
        <div className="flex flex-col bg-[#041017]">
          <div className="border-b border-cyan-800/30 bg-slate-950/80 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-cyan-100">Investigation Explorer</p>
                <p className="text-xs text-slate-400">Click nodes to inspect, search to navigate paths</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <button
                  onClick={handleResetView}
                  className="rounded-xl border border-cyan-700/80 bg-cyan-950/60 px-3 py-2 hover:bg-cyan-900"
                  type="button"
                >
                  Reset
                </button>
                <span className="rounded-xl border border-cyan-700/80 bg-slate-900/70 px-3 py-2">
                  Nodes: {graph.nodes.length}
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="cursor-grab active:cursor-grabbing"
            >
              <defs>
                <marker id="arrow" markerWidth="7" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#7cffec" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.1" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
                {/* selection rectangle rendered on top later via absolute coords */}
                {/* group boundaries */}
                {Object.values(useWorkspaceStore.getState().groups).map((group: any) => {
                  const members = group.members || [];
                  if (!members.length) return null;
                  const memberPositions = members.map((id: string) => positions[id]).filter(Boolean);
                  if (!memberPositions.length) return null;
                  const xs = memberPositions.map((p) => p.x);
                  const ys = memberPositions.map((p) => p.y);
                  const minX = Math.min(...xs) - 140;
                  const maxX = Math.max(...xs) + 140;
                  const minY = Math.min(...ys) - 80;
                  const maxY = Math.max(...ys) + 80;
                  return (
                    <g key={`group-${group.id}`} opacity={0.14}>
                      <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} rx={18} fill={group.color ?? '#0ff'} />
                      <text x={minX + 12} y={minY + 22} className="text-xs font-semibold fill-slate-900">{group.name}</text>
                    </g>
                  );
                })}
                {graph.edges.map((edge) => {
                  const source = positions[edge.source];
                  const target = positions[edge.target];
                  if (!source || !target) return null;

                  const isHighlighted =
                    highlightedPath.includes(edge.source) &&
                    highlightedPath.includes(edge.target);

                  const color = isHighlighted ? '#00ff88' : getRelationshipColor(edge.relationship);
                  const strokeWidth = isHighlighted ? 3 : 2;
                  const opacity = isHighlighted ? 1 : 0.8;

                  return (
                    <g key={`${edge.source}-${edge.target}`}>
                      <path
                        d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        markerEnd="url(#arrow)"
                        opacity={opacity}
                        className={isHighlighted ? 'drop-shadow-lg' : ''}
                        style={{ filter: isHighlighted ? 'drop-shadow(0 0 8px #00ff88)' : undefined }}
                      />
                    </g>
                  );
                })}

                {correlationLinks.map((correlation) => {
                  const source = positions[correlation.sourceId];
                  const target = positions[correlation.targetId];
                  if (!source || !target) return null;

                  return (
                    <g key={`corr_${correlation.sourceId}-${correlation.targetId}`} opacity={0.4}>
                      <path
                        d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth={1}
                        strokeDasharray="4,4"
                      />
                    </g>
                  );
                })}

                {graph.nodes.filter(n => !useWorkspaceStore.getState().removedNodes.includes(n.id)).map((node) => {
                  const position = positions[node.id];
                  if (!position) return null;

                  const isSelected = node.id === selectedNodeId;
                  const isInPath = highlightedPath.includes(node.id);

                  return (
                    <g
                      key={node.id}
                      onClick={(e) => handleNodeClick(node.id, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent('ciw:node-context', { detail: { x: e.clientX, y: e.clientY, nodeId: node.id } }));
                        }}
                      className="cursor-pointer hover:opacity-100 transition-opacity"
                      opacity={isInPath || highlightedPath.length === 0 ? 1 : 0.3}
                    >
                      {isSelected && (
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r={130}
                          fill="none"
                          stroke="#0ff"
                          strokeWidth={2}
                          opacity={0.3}
                          style={{ animation: 'pulse 2s infinite' }}
                        />
                      )}

                      <GraphNode node={node} x={position.x} y={position.y} />

                      {isSelected && (
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r={110}
                          fill="none"
                          stroke="#0ff"
                          strokeWidth={2}
                        />
                      )}
                    </g>
                  );
                })}

                {/* selection rectangle */}
                {dragRect && (
                  <g>
                    <rect x={dragRect.x} y={dragRect.y} width={dragRect.w} height={dragRect.h} fill="#0ff" opacity={0.06} rx={6} />
                    <rect x={dragRect.x} y={dragRect.y} width={dragRect.w} height={dragRect.h} fill="none" stroke="#0ff" opacity={0.4} strokeWidth={1} />
                  </g>
                )}
              </g>
            </svg>

            <style>{`
              @keyframes pulse {
                0%, 100% { r: 130px; opacity: 0.3; }
                50% { r: 150px; opacity: 0.1; }
              }
            `}</style>
          </div>
        </div>

        <aside className="hidden xl:flex flex-col gap-4 border-l border-cyan-800/30 bg-slate-950/80 p-4 overflow-y-auto">
          <GraphSearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <GraphFilters onFilterChange={setFilters} />
          <GraphLegend />

          <div className="border-t border-cyan-700/30 pt-4">
            <GraphCorrelationSummary graph={graph} />
          </div>

          {selectedNode && (
            <div className="p-3 rounded-lg border border-cyan-700/40 bg-slate-900/60 text-xs">
              <div className="font-semibold text-cyan-100 mb-2">Selected Entity</div>
              <div className="text-slate-300">{selectedNode.label}</div>
              <div className="text-slate-500 text-[10px] mt-1 uppercase">{selectedNode.type}</div>
            </div>
          )}

          {highlightedPath.length > 0 && (
            <div className="p-3 rounded-lg border border-cyan-700/40 bg-emerald-950/30 text-xs">
              <div className="font-semibold text-emerald-100 mb-2">Investigation Path</div>
              <div className="space-y-1">
                {highlightedPath.map((nodeId, idx) => {
                  const node = graph.nodes.find((n) => n.id === nodeId);
                  return (
                    <div key={nodeId}>
                      {idx > 0 && <div className="text-emerald-600/60 text-[10px] text-center mb-1">↓</div>}
                      <div className="text-emerald-100 truncate">{node?.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>

      <SelectionToolbar />

      <GraphDetailsPanel
        node={selectedNode}
        linkedEdges={linkedEdges}
        linkedNodes={linkedNodes}
        onClose={() => setSelectedNodeId(null)}
        onNodeClick={handleNodeClick}
      />

      <DraggablePanel id="bookmarks" title="Bookmarks" className="hidden xl:block">
        <BookmarksPanel />
      </DraggablePanel>

      </InvestigationCanvas>
    </div>
  );
}

export default React.memo(InvestigationExplorer);
