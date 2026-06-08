# Phase 10F Support Validation Test Plan

## Objective
Validate the OSINT workspace persistence, snapshot, and import/export flows, then produce a stability and performance report for the Phase 10F support track.

## Environment
- Repository: `CyberAwareness-main`
- Node environment: project root
- Validation tools: `npm run build`, `npm run typecheck`, `npm run lint`
- Browsers: Chrome, Edge, Firefox (manual or automated cross-browser verification required)

## Scope
1. Workspace persistence and metadata management
2. Snapshot creation, restore, and integrity checks
3. Import/export workflow for workspace state
4. Performance investigation for large graphs and UI responsiveness
5. Bundle analysis for large chunks and dynamic import optimization
6. Browser compatibility assessment

## Validation Checklist

### 1. Workspace Persistence Audit
- [ ] Create a new workspace from `WorkspaceDashboard`
- [ ] Confirm workspace metadata appears in the active workspace list
- [ ] Rename an existing workspace and verify `updatedAt` / UI label updates
- [ ] Duplicate a workspace and confirm copy creation with new ID
- [ ] Archive a workspace and verify it moves to archived list
- [ ] Delete a workspace and verify it is removed from metadata store
- [ ] Refresh the browser and ensure workspace metadata persists
- [ ] Verify graph state persists after refresh (workspace graph store uses Zustand persist)

### 2. Snapshot Validation
- [ ] Create a snapshot using the snapshot UI or auto-save flow
- [ ] Modify graph state: node positions, groups, tags, selection
- [ ] Modify evidence/timeline state if the UI supports it
- [ ] Restore a snapshot and verify graph state reverts to snapshot contents
- [ ] Confirm snapshot storage is persisted in localStorage under `ciw-workspace-snap-v1`
- [ ] Verify snapshot list updates and stale snapshots are removable

### 3. Import / Export Validation
- [ ] Export current workspace from `WorkspaceToolbar`
- [ ] Save exported JSON to disk and inspect format
- [ ] Re-import exported JSON via `Import` option
- [ ] Confirm imported state loads into store and page reloads successfully
- [ ] Compare pre-export and post-import data for consistency

### 4. Performance Report
- [ ] Load `InvestigationExplorer` with large graph data sets
- [ ] Measure interactive performance at 1k nodes
- [ ] Measure interactive performance at 5k nodes
- [ ] Measure interactive performance at 10k nodes
- [ ] Assess `RelationshipGraph` rendering and pan/zoom latency
- [ ] Evaluate selection engine responsiveness for multi-select and toggle
- [ ] Inspect `WorkspaceDashboard` performance with large workspace count

### 5. Bundle Analysis
- [ ] Identify largest build chunks in `dist/`
- [ ] Determine main chunk size and heavier page chunks
- [ ] Identify dynamic import candidates for heavy routes or tools
- [ ] Estimate reduction potential via code splitting and lazy loading
- [ ] Verify current build output with `vite build`

### 6. Browser Compatibility
- [ ] Validate workspace persistence and snapshot flows in Chrome
- [ ] Validate same flows in Edge
- [ ] Validate same flows in Firefox
- [ ] Record any behavioral differences or browser-specific failures

## Known Observations
- `npm run build` currently succeeds with Vite.
- `npm run typecheck` reports TypeScript errors across the repo.
- `npm run lint` reports ESLint errors and warnings, including use of unsupported TS version for the current `@typescript-eslint` parser.
- Current workspace persist design uses a single global `workspaceStore` plus separate `workspaceManagerStore` metadata.
- `WorkspacePersistence.loadWorkspace()` is defined but not used anywhere in the repo.
- The primary import/export flow in the toolbar uses `workspacePersistence.ts`, while `workspaceImportExport.ts` is currently unused.
- `workspaceImportExport.ts` contains a broken return variable reference that should be reviewed before production use.

## Reporting Deliverables
- Build status: `npm run build`
- Typecheck status: `npm run typecheck`
- Lint status: `npm run lint`
- Persistence report: verify active workspace metadata, save/load behavior, browser refresh, and snapshot key usage
- Snapshot report: verify snapshot create/restore/delete, list consistency, and graph data integrity
- Bundle report: identify large chunks, `index` chunk size, `jspdf` and page chunks, and dynamic import candidates
- Browser report: Chrome / Edge / Firefox compatibility notes
- Performance report: guided measurements for InvestigationExplorer, RelationshipGraph, selection, and dashboard

## Notes for Testing
- The workspace dashboard currently shows metadata operations, but graph state is not currently tied to workspace IDs in the persisted workspace store.
- Snapshot storage is keyed by workspace ID, but the graph snapshot retains only node positions, groups, selected nodes, and tags.
- Import flow in `WorkspaceToolbar` reloads the page after import, so post-import persistence should be verified after reload.
- Because `@typescript-eslint` warns about TS version 5.6.3, linting may have parser compatibility issues.
