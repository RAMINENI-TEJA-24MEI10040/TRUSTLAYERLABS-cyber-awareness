/**
 * Global Error Boundary
 * Catches errors across the application and displays a fallback UI
 */

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-cyan-100 p-4">
          <div className="max-w-md w-full">
            <div className="border border-red-600/40 bg-red-900/10 rounded-lg p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-red-500" />
                <h1 className="text-lg font-bold text-red-300">Error Detected</h1>
              </div>

              {/* Error message */}
              <div className="space-y-2">
                <p className="text-sm text-slate-300">An unexpected error occurred:</p>
                <div className="bg-black/40 p-3 rounded border border-red-700/30 text-xs font-mono text-red-400 overflow-auto max-h-32">
                  {this.state.error?.message || 'Unknown error'}
                </div>
              </div>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-300">Stack trace</summary>
                  <pre className="mt-2 bg-black/40 p-2 rounded overflow-auto max-h-32 text-[10px]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded transition-colors"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 px-4 py-2 border border-cyan-600 text-cyan-400 hover:bg-cyan-600/10 rounded transition-colors"
                >
                  Go Home
                </button>
              </div>

              {/* Support message */}
              <p className="text-xs text-slate-500 text-center">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
