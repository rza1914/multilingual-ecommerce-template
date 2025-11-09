// frontend/src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log the error to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo): void => {
    // In a real application, you would send this to an error reporting service
    // such as Sentry, LogRocket, or similar
    console.group('Error Boundary Report');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.groupEnd();
    
    // In a real implementation, you would send this data to your backend
    // Example:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ error: error.toString(), errorInfo, timestamp: new Date() })
    // });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Default fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          <details className="mt-4 p-4 bg-gray-100 rounded text-left max-w-2xl">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="text-xs mt-2 p-2 bg-gray-200 overflow-auto">
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;