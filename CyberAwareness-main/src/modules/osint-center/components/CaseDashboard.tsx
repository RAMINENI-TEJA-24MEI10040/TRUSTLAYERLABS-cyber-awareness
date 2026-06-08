import { useState, useMemo } from 'react';
import { useCaseStore, CaseStatus, CasePriority } from '../store/caseStore';
import { Plus, Trash2, Search } from 'lucide-react';

interface CreateModalState {
  open: boolean;
  title: string;
  description: string;
  priority: CasePriority;
}

const STATUS_COLORS: Record<CaseStatus, string> = {
  Open: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Active: 'bg-green-500/20 text-green-300 border-green-500/30',
  Pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Closed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Archived: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
};

const PRIORITY_COLORS: Record<CasePriority, string> = {
  Low: 'bg-green-500/20 text-green-300',
  Medium: 'bg-blue-500/20 text-blue-300',
  High: 'bg-orange-500/20 text-orange-300',
  Critical: 'bg-red-500/20 text-red-300',
};

export function CaseDashboard(): JSX.Element {
  const {
    cases,
    activeCaseId,
    switchCase,
    createCase,
    deleteCase,
    updateStatus,
    searchCases,
  } = useCaseStore();

  const [createModal, setCreateModal] = useState<CreateModalState>({
    open: false,
    title: '',
    description: '',
    priority: 'Medium',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CaseStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<CasePriority | ''>('')

  const filteredCases = useMemo(() => {
    let result = searchQuery ? searchCases(searchQuery) : cases;

    if (filterStatus) {
      result = result.filter((c) => c.status === filterStatus);
    }
    if (filterPriority) {
      result = result.filter((c) => c.priority === filterPriority);
    }

    return result.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [cases, searchQuery, filterStatus, filterPriority, searchCases]);

  const activeCaseCount = cases.filter((c) => c.status === 'Active').length;
  const openCaseCount = cases.filter((c) => c.status === 'Open').length;

  const handleCreateCase = (): void => {
    if (!createModal.title.trim()) return;
    createCase(createModal.title, createModal.description, createModal.priority);
    setCreateModal({ open: false, title: '', description: '', priority: 'Medium' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Investigation Cases</h1>
          <p className="text-gray-400 mt-1">Manage your investigation cases and track status</p>
        </div>
        <button
          onClick={() => setCreateModal({ ...createModal, open: true })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 transition"
        >
          <Plus size={18} />
          New Case
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
          <div className="text-2xl font-bold text-green-300">{activeCaseCount}</div>
          <div className="text-sm text-gray-400">Active Cases</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
          <div className="text-2xl font-bold text-blue-300">{openCaseCount}</div>
          <div className="text-sm text-gray-400">Open Cases</div>
        </div>
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
          <div className="text-2xl font-bold text-cyan-300">{cases.length}</div>
          <div className="text-sm text-gray-400">Total Cases</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-cyan-500/20 text-white rounded focus:outline-none focus:border-cyan-500/40"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CaseStatus | '')}
            className="px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded text-sm focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as CasePriority | '')}
            className="px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded text-sm focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery || filterStatus || filterPriority
            ? 'No cases match your filters'
            : 'No cases yet'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded border transition ${
                activeCaseId === c.id
                  ? 'bg-cyan-500/10 border-cyan-500/60'
                  : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => switchCase(c.id)}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white hover:text-cyan-300">{c.title}</h3>
                    <span className={`text-xs px-2 py-1 border rounded ${STATUS_COLORS[c.status]}`}>
                      {c.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${PRIORITY_COLORS[c.priority]}`}>
                      {c.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{c.description}</p>
                  {c.notes && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-900/50 p-2 rounded">
                      {c.notes.split('\n---\n')[c.notes.split('\n---\n').length - 1]}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value as CaseStatus)}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 text-white rounded text-xs focus:outline-none focus:border-cyan-500/40"
                  >
                    <option value="Open">Open</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <button
                    onClick={() => deleteCase(c.id)}
                    className="p-2 hover:bg-gray-800 rounded transition text-gray-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500 flex gap-4">
                <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                <span>Modified: {new Date(c.updatedAt).toLocaleDateString()}</span>
                <span>Workspaces: {c.workspaceIds.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {createModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-500/40 rounded p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">New Investigation Case</h2>

            <input
              type="text"
              placeholder="Case title"
              value={createModal.title}
              onChange={(e) => setCreateModal({ ...createModal, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-cyan-500/40"
            />

            <textarea
              placeholder="Description (optional)"
              value={createModal.description}
              onChange={(e) => setCreateModal({ ...createModal, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-cyan-500/40 resize-none h-20"
            />

            <select
              value={createModal.priority}
              onChange={(e) => setCreateModal({ ...createModal, priority: e.target.value as CasePriority })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-cyan-500/40"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCreateModal({ ...createModal, open: false })}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCase}
                disabled={!createModal.title.trim()}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 disabled:opacity-50 transition"
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseDashboard;
