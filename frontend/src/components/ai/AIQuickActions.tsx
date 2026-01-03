/**
 * AI Quick Actions Component
 * Provides predefined AI prompts for common tasks
 * RTL/LTR safe with glass-card styling
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Scale,
  Ruler,
  MessageSquare,
  TrendingDown,
  Wallet,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface QuickAction {
  id: string;
  icon: React.ReactNode;
  labelKey: string;
  prompt: string;
}

interface AIQuickActionsProps {
  onActionSelect: (prompt: string) => void;
  className?: string;
}

const AIQuickActions: React.FC<AIQuickActionsProps> = ({ onActionSelect, className = '' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Quick AI Actions configuration
  const quickActions: QuickAction[] = [
    {
      id: 'compare_prices',
      icon: <Scale className="w-4 h-4" />,
      labelKey: 'ai.actions.comparePrices',
      prompt: 'Compare prices of similar products and find the best deal'
    },
    {
      id: 'find_size',
      icon: <Ruler className="w-4 h-4" />,
      labelKey: 'ai.actions.findSize',
      prompt: 'Help me find the correct size based on my preferences'
    },
    {
      id: 'summarize_reviews',
      icon: <MessageSquare className="w-4 h-4" />,
      labelKey: 'ai.actions.summarizeReviews',
      prompt: 'Summarize customer reviews and highlight pros and cons'
    },
    {
      id: 'suggest_alternatives',
      icon: <TrendingDown className="w-4 h-4" />,
      labelKey: 'ai.actions.cheaperAlternatives',
      prompt: 'Suggest similar products with lower price'
    },
    {
      id: 'budget_search',
      icon: <Wallet className="w-4 h-4" />,
      labelKey: 'ai.actions.budgetSearch',
      prompt: 'Find the best products within my budget'
    }
  ];

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as HTMLElement)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleActionClick = (action: QuickAction) => {
    onActionSelect(action.prompt);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-orange p-2.5 rounded-xl flex items-center gap-1.5
                    hover:scale-105 transition-all duration-200
                    ${isOpen ? 'ring-2 ring-orange-500/50' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('ai.quickActions', 'AI Quick Actions')}
      >
        <Sparkles className="w-5 h-5 text-orange-500" />
        <ChevronDown className={`w-3.5 h-3.5 text-orange-500 transition-transform duration-200
                                 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-64
                     ltr:right-0 rtl:left-0
                     glass-card !rounded-2xl border-2 border-orange-500/30
                     shadow-2xl animate-scale-in overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('ai.quickActionsTitle', 'AI Quick Actions')}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('ai.quickActionsSubtitle', 'Select an action to get started')}
            </p>
          </div>

          {/* Actions List */}
          <div className="py-1">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className="w-full px-4 py-3 flex items-center gap-3
                           hover:bg-orange-500/10 transition-colors
                           text-start"
                role="menuitem"
              >
                <div className="glass-orange p-2 rounded-lg flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(action.labelKey, action.id.replace('_', ' '))}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Hint */}
          <div className="px-4 py-2 border-t border-white/10 bg-orange-500/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t('ai.poweredBy', '✨ Powered by AI')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuickActions;