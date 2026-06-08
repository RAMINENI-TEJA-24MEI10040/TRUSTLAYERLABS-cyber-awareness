import React, { useRef, useEffect, useState, PropsWithChildren } from 'react';

interface CanvasProps {
  initialZoom?: number;
}

const GRID_SIZE = 48;

const InvestigationCanvas: React.FC<PropsWithChildren<CanvasProps>> = ({ children, initialZoom = 1 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<number>(initialZoom);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((z) => Math.min(Math.max(z + delta, 0.1), 3));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPanning(true);
    setOrigin({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning || !origin) return;
    setPan({ x: e.clientX - origin.x, y: e.clientY - origin.y });
  };
  const handlePointerUp = () => {
    setIsPanning(false);
    setOrigin(null);
  };

  const fitToView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const toWorkspace = (clientX: number, clientY: number) => {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div className="absolute top-2 right-2 flex gap-2 z-40">
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="px-2 py-1 bg-[#021018] text-cyan-200 rounded">+</button>
        <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="px-2 py-1 bg-[#021018] text-cyan-200 rounded">-</button>
        <button onClick={fitToView} className="px-2 py-1 bg-[#021018] text-cyan-200 rounded">Fit</button>
      </div>

      <div
        ref={contentRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        className="w-full h-full touch-none"
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect width={GRID_SIZE} height={GRID_SIZE} fill="#001014" />
              <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#03181c" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative w-full h-full">
          {children}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 w-40 h-28 bg-[#031317]/70 border border-cyan-800/30 rounded p-1 text-xs text-slate-300 z-40">
        <div className="text-[11px] text-cyan-300 mb-1">Minimap</div>
        <div className="w-full h-[70%] bg-[#021014] rounded" />
      </div>
    </div>
  );
};

export default InvestigationCanvas;
