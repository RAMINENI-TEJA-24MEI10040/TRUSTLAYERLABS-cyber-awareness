import useWorkspaceStore from '../store/workspaceStore';
import useWorkspaceManagerStore from '../store/workspaceManagerStore';

export interface InvestigationPackage {
  version: string;
  exportedAt: string;
  metadata: {
    workspaceName: string;
    workspaceDescription: string;
    caseTitle?: string;
    exportedBy: string;
  };
  graph?: {
    nodePositions: Record<string, { x: number; y: number }>;
    groups: Record<string, unknown>;
  };
  tags: string[];
}

function getCurrentUser(): string {
  return localStorage.getItem('ciw-user') || 'system';
}

export function validatePackage(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  const pkg = data as Record<string, unknown>;
  return !!(
    pkg.version &&
    typeof pkg.version === 'string' &&
    pkg.metadata &&
    typeof pkg.metadata === 'object' &&
    pkg.exportedAt &&
    typeof pkg.exportedAt === 'string'
  );
}

export async function exportWorkspace(
  workspaceId: string,
  workspaceName: string,
  workspaceDescription: string
): Promise<Blob> {
  const state = useWorkspaceStore.getState();
  const user = getCurrentUser();

  const pkg: InvestigationPackage = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    metadata: {
      workspaceName,
      workspaceDescription,
      exportedBy: user,
    },
    graph: {
      nodePositions: state.nodePositions,
      groups: state.groups,
    },
    tags: Object.values(state.tags).flat(),
  };

  return new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
}

export async function exportAsPackage(
  workspaceId: string,
  workspaceName: string,
  workspaceDescription: string
): Promise<Blob> {
  // Since we can't add zip dependencies, return JSON
  // In production, could use dynamic import or web worker
  return exportWorkspace(workspaceId, workspaceName, workspaceDescription);
}

export async function importWorkspace(file: File): Promise<string> {
  try {
    let content: string;
    if (typeof (file as any).text === 'function') {
      content = await (file as any).text();
    } else {
      content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file as any);
      });
    }

    const pkg = JSON.parse(content);

    if (!validatePackage(pkg)) {
      throw new Error('Invalid package format');
    }

    const imported = pkg as InvestigationPackage;

    // Create new workspace with imported data
    const manager = useWorkspaceManagerStore.getState();
    const workspaceName = imported.metadata?.workspaceName || 'Imported Workspace';
    const workspaceDesc = imported.metadata?.workspaceDescription || '';
    const newWorkspaceId = manager.createWorkspace(workspaceName, workspaceDesc);

    // switch active workspace to new one
    manager.switchWorkspace(newWorkspaceId);

    const state = useWorkspaceStore.getState();

    if (imported.graph?.nodePositions) {
      Object.entries(imported.graph.nodePositions).forEach(([entityId, pos]) => {
        state.saveNodePosition(entityId, pos);
      });
    }

    if (imported.graph?.groups) {
      Object.values(imported.graph.groups).forEach((group: Record<string, unknown>) => {
        state.createGroup(group as unknown as Parameters<typeof state.createGroup>[0]);
      });
    }

    return newWorkspaceId;
  } catch (error) {
    throw new Error(`Failed to import workspace: ${error}`);
  }
}

export function downloadWorkspaceJSON(data: InvestigationPackage, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function createWorkspaceBackup(
  workspaceId: string,
  workspaceName: string
): Promise<InvestigationPackage> {
  const state = useWorkspaceStore.getState();
  const user = getCurrentUser();

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    metadata: {
      workspaceName,
      workspaceDescription: '',
      exportedBy: user,
    },
    graph: {
      nodePositions: state.nodePositions,
      groups: state.groups,
    },
    tags: Object.values(state.tags).flat(),
  };
}
