// Phase 10F validation script

// Polyfill simple localStorage for Node
(global as any).localStorage = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

// Ensure crypto.randomUUID exists
if (!(global as any).crypto) {
  (global as any).crypto = require('crypto');
}

(async () => {
  try {
    console.log('Importing stores...');
    const useWorkspaceManager = (await import('../src/modules/osint-center/store/workspaceManagerStore.ts')).default;
    const useCaseStore = (await import('../src/modules/osint-center/store/caseStore.ts')).default;
    const snapshotSvc = await import('../src/modules/osint-center/services/workspaceSnapshotService.ts');
    const importExport = await import('../src/modules/osint-center/services/workspaceImportExport.ts');
    const autoSave = await import('../src/modules/osint-center/services/workspaceAutoSave.ts');
    const useWorkspaceStore = (await import('../src/modules/osint-center/store/workspaceStore.ts')).default;
    const useEvidenceStore = (await import('../src/modules/osint-center/store/evidenceStore.ts')).default;
    const useTimelineStore = (await import('../src/modules/osint-center/store/timelineStore.ts')).default;

    // 1. Workspace lifecycle: Create
    console.log('\n1) Workspace lifecycle tests');
    const wm = useWorkspaceManager;

    const wsId = wm.createWorkspace('Validation WS', 'Created by test');
    console.log('Created workspace:', wsId);

    // Verify existence
    const active = wm.getActiveWorkspace();
    console.log('Active workspace name:', active?.name);

    // 2) Rename
    wm.renameWorkspace(wsId, 'Validation WS Renamed');
    console.log('Renamed to:', wm.getActiveWorkspace()?.name);

    // 3) Duplicate
    const dupId = wm.duplicateWorkspace(wsId, 'Validation WS Copy');
    console.log('Duplicated workspace id:', dupId);

    // 4) Archive
    wm.archiveWorkspace(wsId);
    console.log('Archived original workspace status:', wm.workspaces.find(w => w.id === wsId)?.status);

    // 5) Delete
    wm.deleteWorkspace(dupId);
    console.log('Deleted duplicated workspace exists?', wm.workspaces.some(w => w.id === dupId));

    // 6) Switch
    const remain = wm.workspaces[0];
    if (remain) {
      wm.switchWorkspace(remain.id);
      console.log('Switched to workspace:', wm.activeWorkspaceId === remain.id);
    }

    // Case lifecycle
    console.log('\n2) Case lifecycle tests');
    const cs = useCaseStore;
    const caseId = cs.createCase('Test Case', 'Case created by validation script');
    console.log('Case created:', caseId);

    // Edit
    cs.updateCase(caseId, { description: 'Updated description' });
    console.log('Case description after edit:', cs.cases.find(c => c.id === caseId)?.description);

    // Close
    cs.updateStatus(caseId, 'Closed');
    console.log('Case status after close:', cs.cases.find(c => c.id === caseId)?.status);

    // Archive
    cs.archiveCase(caseId);
    console.log('Case status after archive:', cs.cases.find(c => c.id === caseId)?.status);

    // Search
    const results = cs.searchCases('validation');
    console.log('Search results length for "validation":', results.length);

    // Filter
    const filtered = cs.filterCases('Closed', undefined);
    console.log('Filter Closed cases count:', filtered.length);

    // Snapshot system
    console.log('\n3) Snapshot tests');
    const activeWsId = wm.activeWorkspaceId || wsId;

    // Modify workspace: add node positions and evidence and timeline
    const wsRuntime = useWorkspaceStore.getState();
    wsRuntime.saveNodePosition('node-1', { x: 100, y: 200 });
    wsRuntime.createGroup({ id: 'g1', name: 'Group1', members: ['node-1'], collapsed: false, color: '#00ffff' });
    useEvidenceStore.addEvidence({ title: 'Evidence One', source: 'test', tags: [] , summary: 'test', raw: {} , notes: ''});
    useTimelineStore.addEvent({ caseId, eventType: 'test', title: 'Test Event', description: 'added by test', severity: 'info' });

    const snap = await snapshotSvc.createSnapshot(activeWsId, 'Snapshot for test');
    console.log('Created snapshot id:', snap.id);

    // Modify workspace again
    wsRuntime.saveNodePosition('node-1', { x: 500, y: 600 });
    useEvidenceStore.addEvidence({ title: 'Evidence Two', source: 'test2', tags: [], summary: 'test2', raw: {}, notes: '' });
    useTimelineStore.addEvent({ caseId, eventType: 'test2', title: 'Test Event 2', description: 'second', severity: 'info' });

    // Restore snapshot
    await snapshotSvc.restoreSnapshot(snap.id);
    console.log('Restored snapshot. Node position now:', useWorkspaceStore.getState().nodePositions['node-1']);

    // Verify evidence/timeline not restored by snapshot (since snapshot captures graph only). Evidence count:
    console.log('Evidence count (should be >=1):', useEvidenceStore.items.length);
    console.log('Timeline events count (should be >=1):', useTimelineStore.events.length);

    // Export workspace
    console.log('\n4) Import/Export tests');
    const blob = await importExport.exportWorkspace(activeWsId, 'Exported WS', 'desc');
    const text = await (blob as Blob).text();
    console.log('Exported package size (chars):', text.length);

    // Re-import: create a new temp workspace
    const newWsId = wm.createWorkspace('Imported Workspace', 'from package');
    // Simulate import by calling importWorkspace with a File-like object
    const file = new (require('buffer').Blob)([text], { type: 'application/json' });
    try {
      // importWorkspace expects File with .text(); Node Blob has text() in newer versions
      // we'll call importWorkspace but it uses FileReader which isn't in Node; skip actual import and validate package instead
      const isValid = importExport.validatePackage(JSON.parse(text));
      console.log('Imported package valid:', isValid);
    } catch (e) {
      console.error('Import validation failed', e);
    }

    // Auto-save: call manualSave and ensure snapshot created
    await autoSave.manualSave();
    const snaps = await snapshotSvc.listSnapshots(activeWsId);
    console.log('Snapshots after manualSave count:', snaps.length);

    // Start auto-save with short interval and stop
    const stop = autoSave.startAutoSave(1500);
    await new Promise((r) => setTimeout(r, 1700));
    stop();

    console.log('\nValidation complete');
    process.exit(0);
  } catch (err) {
    console.error('Validation script error', err);
    process.exit(2);
  }
})();
