import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  t?: (key: string) => string; // Optional translation function
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use provided translation function or fallback to direct text
      const t = this.props.t || ((key: string) => {
        const translations: Record<string, string> = {
          'errorBoundary.title': 'Something went wrong.',
          'errorBoundary.message': 'We\'re sorry for the inconvenience. Please refresh the page to try again.',
          'errorBoundary.details': 'Error Details'
        };
        return translations[key] || key;
      });

      return (
        <div className="error-boundary p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">{t('errorBoundary.title')}</h2>
          <p className="text-red-600">{t('errorBoundary.message')}</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2 text-sm text-red-700 bg-red-100 p-2 rounded">
              <summary className="font-medium cursor-pointer">{t('errorBoundary.details')}</summary>
              <pre className="whitespace-pre-wrap mt-2">
                {this.state.error && this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;