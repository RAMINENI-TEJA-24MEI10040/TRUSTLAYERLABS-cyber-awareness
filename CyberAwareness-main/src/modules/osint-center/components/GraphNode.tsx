import React from 'react';
import type { EntityNode } from '../types/ciw.types';
import useWorkspaceStore from '../store/workspaceStore';

interface GraphNodeProps {
  node: EntityNode & { radius?: number };
  x: number;
  y: number;
}

const typeColorMap: Record<string, string> = {
  ip: '#0ff',
  domain: '#7cffec',
  email: '#4ade80',
  username: '#60a5fa',
  wallet: '#f472b6',
  mobile: '#38bdf8',
  source: '#c084fc',
};

function getRiskAccent(node: EntityNode) {
  const score = typeof node.metadata?.score === 'number' ? node.metadata.score : 0;
  if (score >= 70) return '#ef4444';
  if (score >= 40) return '#f59e0b';
  return '#0ff';
}

const GraphNode: React.FC<GraphNodeProps> = ({ node, x, y }) => {
  const label = node.label || node.id;
  const displayLabel = label.length > 18 ? `${label.slice(0, 18)}...` : label;
  const background = '#071b24';
  const border = typeColorMap[node.type] ?? '#0ff';
  const accent = getRiskAccent(node);

  const isSelected = useWorkspaceStore((s) => s.selectedNodes.includes(node.id));
  // eslint-disable-next-line no-console
  console.log('graph node', node);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isSelected && (
        <rect x={-110} y={-50} width={220} height={100} rx={20} fill="none" stroke="#0ff" strokeWidth={2} opacity={0.18} />
      )}
      <circle r={node.radius ?? 6} fill={accent} opacity={0.18} />
      <rect
        x={-96}
        y={-34}
        width={192}
        height={68}
        rx={16}
        ry={16}
        fill={background}
        stroke={border}
        strokeWidth={2}
      />
      <rect
        x={-96}
        y={-34}
        width={192}
        height={6}
        rx={3}
        ry={3}
        fill={accent}
      />
      <text x={0} y={-4} textAnchor="middle" className="text-sm font-semibold fill-slate-100" style={{ fontFamily: 'Inter, sans-serif' }}>
        {displayLabel}
      </text>
      <text x={0} y={18} textAnchor="middle" className="text-[11px] fill-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
        {node.type?.toUpperCase()}
      </text>
    </g>
  );
};

export default React.memo(GraphNode);
