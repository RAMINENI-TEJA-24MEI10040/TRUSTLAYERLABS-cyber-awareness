import { motion } from 'framer-motion';
import useCIWStore from '../store/ciwStore';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
// Lightweight results renderer: render JSON summary for intelligence results

const CIWResultsGrid: React.FC = () => {
  const last = useCIWStore((s) => s.lastResponse);
  const isLoading = useCIWStore((s) => s.isLoading);
  const isError = useCIWStore((s) => s.isError);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <LoadingSkeleton className="h-48" count={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-300 bg-[rgba(20,10,10,0.3)] rounded-md">
        <div className="font-semibold">Probe failed</div>
        <div className="text-sm mt-2">{isError}</div>
      </div>
    );
  }

  if (!last || last.results.length === 0) {
    return (
      <div className="p-6 text-cyan-200/60">No results yet. Run a probe to see intelligence here.</div>
    );
  }

  // normalize results if module returned object maps
  const normalized = Array.isArray(last.results) ? last.results : last.results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {normalized.map((r: any) => (
        <div key={r.id} className="relative">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {/* Save as evidence button */}
            <button
              onClick={() => {
                try {
                  // lazy import store to avoid circular deps
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  const useEvidenceStore = require('../store/evidenceStore').default;
                  const addFromResult = useEvidenceStore.getState().addFromResult;
                  // access current CIW query id
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  const ciw = require('../store/ciwStore').default.getState();
                  const caseId = ciw.activeCaseId;
                  const queryId = ciw.lastResponse?.query?.id ?? undefined;
                  addFromResult(caseId, queryId, r, []);
                  // simple toast (console for now)
                  // eslint-disable-next-line no-console
                  console.info('Saved evidence for', r.id);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('Save evidence failed', e);
                }
              }}
              className="px-2 py-1 bg-cyan-700/80 text-white rounded text-xs"
            >
              Save
            </button>
          </div>

          {renderCard(r.source, r)}
        </div>
      ))}
    </motion.div>
  );
};

function renderCard(source: string, data: any) {
  return (
    <div className="p-3 bg-slate-900 rounded-md border border-cyan-800/10 text-sm text-cyan-100">
      <div className="font-semibold mb-1">{source.toUpperCase()}</div>
      <div className="truncate text-xs opacity-80">{data.title ?? data.id ?? JSON.stringify(data).slice(0, 80)}</div>
      <pre className="mt-2 text-[11px] max-h-48 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default CIWResultsGrid;
