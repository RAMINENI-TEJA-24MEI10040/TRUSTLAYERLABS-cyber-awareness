import { useEffect } from 'react';
import useWorkspaceStore from '../../store/workspaceStore';

const KeyboardShortcuts: React.FC = () => {
  const selectAll = useWorkspaceStore((s) => s.selectMultiple);
  const clearSelection = useWorkspaceStore((s) => s.clearSelection);
  const getVisible = useWorkspaceStore((s) => s.visibleIds ?? []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll(useWorkspaceStore.getState().visibleIds ?? []);
      }
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectAll, clearSelection]);

  return null;
};

export default KeyboardShortcuts;
