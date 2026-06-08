/**
 * Performance Optimization Utilities
 * Memoization, dynamic imports, and performance monitoring
 */

import React from 'react';

/**
 * Dynamic import wrapper with error handling
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: T,
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Dynamic import failed:', error);
    if (fallback) return fallback;
    throw error;
  }
}

/**
 * Memoized selector hook for Zustand stores (reduces unnecessary re-renders)
 */
export function useShallowMemo<T>(value: T): T {
  const memoRef = React.useRef<T>(value);

  React.useEffect(() => {
    memoRef.current = value;
  }, [value]);

  return React.useMemo(() => memoRef.current, []);
}

/**
 * Debounce hook for expensive operations
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events
 */
export function useThrottle<T>(value: T, delayMs: number = 300): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRanRef = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRanRef.current >= delayMs) {
        setThrottledValue(value);
        lastRanRef.current = Date.now();
      }
    }, delayMs - (Date.now() - lastRanRef.current));

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return throttledValue;
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}

/**
 * Create memoized component with deep comparison
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean,
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, areEqual);
}

/**
 * Virtualization helper for large lists
 */
export interface VirtualizedItem {
  id: string;
  [key: string]: any;
}

export function useVirtualizedList<T extends VirtualizedItem>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
) {
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const startIndex = Math.floor(scrollOffset / itemHeight);
  const endIndex = Math.min(items.length, Math.ceil((scrollOffset + containerHeight) / itemHeight));
  const visibleItems = items.slice(startIndex, endIndex);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollOffset(target.scrollTop);
  };

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
  };
}

/**
 * Resource cleanup utility
 */
export function useEffectCleanup(
  effect: () => void | (() => void),
  deps?: React.DependencyList,
): void {
  React.useEffect(() => {
    const cleanup = effect();
    return cleanup;
  }, deps);
}

/**
 * Lazy loading component wrapper
 */
export function useLazyComponent<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
) {
  const [Component, setComponent] = React.useState<React.ComponentType<P> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    dynamicImport(importFn)
      .then((module) => {
        if (isMounted) {
          setComponent(() => module.default);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [importFn]);

  return { Component, isLoading, error };
}

/**
 * Request deduplication - prevent duplicate API calls
 */
export class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  async execute<T>(
    key: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(): void {
    this.pendingRequests.clear();
  }
}

/**
 * Memory leak prevention utility
 */
export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
) {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;

    const execute = async () => {
      try {
        const result = await asyncFn();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}
