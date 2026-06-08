import React, { PropsWithChildren, useRef, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

interface PanelProps {
  id: string;
  title: string;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose?: () => void;
  className?: string;
}

const DraggablePanel: React.FC<PropsWithChildren<PanelProps>> = ({ id, title, children, defaultWidth = 420, defaultHeight = 320, onClose, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 80, y: 80 });
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`ciw.panel.${id}`);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj.pos) setPos(obj.pos);
        if (obj.size) setSize(obj.size);
        if (typeof obj.collapsed === 'boolean') setCollapsed(obj.collapsed);
        if (typeof obj.maximized === 'boolean') setMaximized(obj.maximized);
      }
    } catch (e) {
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`ciw.panel.${id}`, JSON.stringify({ pos, size, collapsed, maximized }));
  }, [id, pos, size, collapsed, maximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !start) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const handleMouseUp = () => {
    setDragging(false);
    setStart(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, start]);

  const style: CSSProperties = {
    position: 'absolute',
    left: pos.x,
    top: pos.y,
    width: size.w,
    height: collapsed ? undefined : size.h,
    zIndex: 50,
  };

  return (
    <div ref={ref} style={style} className={`bg-slate-900/70 border border-cyan-800/30 rounded shadow-lg overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center justify-between p-2 cursor-move bg-[#031216]" onMouseDown={handleMouseDown} role="toolbar" aria-label={title}>
        <div className="text-sm text-cyan-200 font-semibold">{title}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed((c) => !c)} className="text-xs px-2 py-1 border rounded">{collapsed ? 'Expand' : 'Collapse'}</button>
          <button onClick={() => setMaximized((m) => !m)} className="text-xs px-2 py-1 border rounded">{maximized ? 'Restore' : 'Max'}</button>
          <button onClick={onClose} className="text-xs px-2 py-1 border rounded">Close</button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-2" style={{ height: maximized ? 'calc(100vh - 80px)' : size.h, overflow: 'auto' }}>
          {children}
        </div>
      )}

      <div
        className="w-4 h-4 absolute right-0 bottom-0 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = size.w;
          const startH = size.h;

          const onMove = (ev: MouseEvent) => {
            setSize({ w: Math.max(220, startW + (ev.clientX - startX)), h: Math.max(160, startH + (ev.clientY - startY)) });
          };
          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}
      />
    </div>
  );
};

export default DraggablePanel;
