import React, { ComponentType, ReactElement } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface WithErrorBoundaryProps {
  children: ReactElement;
}

export const withErrorBoundary = (
  Component: ComponentType<any>,
  fallback?: ReactElement
) => {
  return function ComponentWithErrorBoundary(props: any) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// For functional components that need error boundary protection
export const wrapWithBoundary = (Component: ReactElement, fallback?: ReactElement) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {Component}
    </ErrorBoundary>
  );
};