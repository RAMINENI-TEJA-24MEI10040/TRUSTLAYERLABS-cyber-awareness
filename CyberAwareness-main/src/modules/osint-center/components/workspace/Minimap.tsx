import React from 'react';
import useWorkspaceStore from '../../store/workspaceStore';
import useCIWStore from '../../store/ciwStore';

const Minimap: React.FC = () => {
  const nodePositions = useWorkspaceStore((s) => s.nodePositions);
  const selectEntity = useWorkspaceStore((s) => s.selectEntity);
  const nodes = useCIWStore((s) => s.lastResponse?.results ?? []);

  const width = 160;
  const height = 112;

  const points = nodes.map((n: any) => {
    const pos = nodePositions[n.id] ?? { x: 0, y: 0 };
    return { id: n.id, x: (pos.x % width) + width / 2, y: (pos.y % height) + height / 2 };
  });

  return (
    <svg width={width} height={height} className="block">
      <rect x={0} y={0} width={width} height={height} fill="#021214" rx={6} />
      {points.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r={3} fill="#0ff" onClick={() => selectEntity(p.id)} style={{ cursor: 'pointer' }} />
      ))}
    </svg>
  );
};

export default Minimap;
