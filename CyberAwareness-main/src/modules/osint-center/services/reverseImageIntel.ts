import { IntelligenceResult } from '../types/ciw.types';

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function uploadToProxy(file: File, proxyUrl: string, source: 'google-lens' | 'tineye'): Promise<Record<string, unknown> | null> {
  try {
    const form = new FormData();
    form.append('image', file);
    form.append('source', source);

    const response = await fetch(`${proxyUrl.replace(/\/+$/, '')}/${source}`, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Record<string, unknown>;
  } catch (error) {
    console.warn(`reverseImageIntel.uploadToProxy(${source}) failed`, error);
    return null;
  }
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const out: IntelligenceResult[] = [];
  const details = payload.trim();
  const title = `Reverse Image Intelligence`;
  const summary = details ? `Search context: ${details}` : 'Prepare image search analysis';
  const proxy = import.meta.env.VITE_REVERSE_IMAGE_PROXY_URL as string | undefined;
  const lensProxy = import.meta.env.VITE_GOOGLE_LENS_PROXY_URL as string | undefined;
  const tineyeProxy = import.meta.env.VITE_TINEYE_PROXY_URL as string | undefined;
  const architecture = {
    googleLens: lensProxy ? `${lensProxy.replace(/\/+$/, '')}/google-lens` : null,
    tineye: tineyeProxy ? `${tineyeProxy.replace(/\/+$/, '')}/tineye` : null,
    fallback: proxy ?? null,
  };

  const intel: IntelligenceResult = {
    id: makeId('reverse-image'),
    queryId: makeId('q'),
    source: 'reverse-image',
    title,
    summary,
    score: 0,
    meta: [
      {
        sourceName: 'reverse-image-architecture',
        fetchedAt: new Date().toISOString(),
        raw: {
          details,
          architecture,
        },
      },
    ],
  };

  out.push(intel);
  return out;
}

export async function uploadImage(file: File): Promise<Record<string, unknown> | null> {
  const lensProxy = import.meta.env.VITE_GOOGLE_LENS_PROXY_URL as string | undefined;
  const tineyeProxy = import.meta.env.VITE_TINEYE_PROXY_URL as string | undefined;

  if (lensProxy) {
    return uploadToProxy(file, lensProxy, 'google-lens');
  }

  if (tineyeProxy) {
    return uploadToProxy(file, tineyeProxy, 'tineye');
  }

  return null;
}
