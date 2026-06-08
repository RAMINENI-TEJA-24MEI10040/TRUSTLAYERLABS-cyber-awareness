import React from 'react';
import useWorkspaceStore from '../../store/workspaceStore';
import useCIWStore from '../../store/ciwStore';

const BookmarksPanel: React.FC = () => {
  const bookmarks = useWorkspaceStore((s) => s.bookmarks);
  const toggle = useWorkspaceStore((s) => s.toggleBookmark);
  const selectEntity = useWorkspaceStore((s) => s.selectEntity);
  const allNodes = useCIWStore((s) => s.lastResponse?.results ?? []);

  const getNode = (id: string) => allNodes.find((n: any) => n.id === id);

  return (
    <div className="p-3 bg-[#021317] border border-cyan-800/30 rounded text-cyan-100 w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Bookmarks</div>
      </div>
      <div className="space-y-2 text-xs">
        {bookmarks.map((b) => {
          const node = getNode(b);
          return (
            <div key={b} className="flex items-center justify-between p-2 bg-[#011417]/40 rounded">
              <div className="truncate" title={node?.label ?? b}>{node?.label ?? b}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => selectEntity(b)} className="text-[11px] px-2 py-0.5 border rounded">Go</button>
                <button onClick={() => toggle(b)} className="text-[11px] px-2 py-0.5 border rounded">Unpin</button>
              </div>
            </div>
          );
        })}
        {bookmarks.length === 0 && <div className="text-xs text-slate-400">No bookmarks</div>}
      </div>
    </div>
  );
};

export default BookmarksPanel;
