/**
 * Empty State Component
 * Reusable component for displaying empty states
 */

import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  iconComponent?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  message,
  actionLabel,
  onAction,
  iconComponent,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="glass-card p-12 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 animate-bounce-slow">
          {iconComponent || (
            <div className="text-7xl opacity-50">{icon}</div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="btn-primary"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
