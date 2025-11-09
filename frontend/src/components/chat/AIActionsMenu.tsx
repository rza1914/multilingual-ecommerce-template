import React from 'react';
import { TFunction } from 'i18next';
import { Image, Sparkles, Gift, Ruler, TrendingUp } from 'lucide-react';
import { AIAction } from '../../types/chat.types';

interface AIActionsMenuProps {
  onAction: (action: AIAction) => void;
  onClose: () => void;
  darkMode: boolean;
  t: TFunction;
}

export const AIActionsMenu: React.FC<AIActionsMenuProps> = ({ 
  onAction, 
  onClose, 
  darkMode,
  t 
}) => {
  const actions = [
    { 
      id: 'image_analysis', 
      icon: Image, 
      label: t('chat.aiActions.imageAnalysis', 'Image Analysis'),
      description: t('chat.aiActions.imageAnalysisDesc', 'Upload an image to analyze products')
    },
    { 
      id: 'product_recommendation', 
      icon: Sparkles, 
      label: t('chat.aiActions.productRecommendation', 'Product Recommendations'),
      description: t('chat.aiActions.productRecommendationDesc', 'Get personalized product suggestions')
    },
    { 
      id: 'price_comparison', 
      icon: TrendingUp, 
      label: t('chat.aiActions.priceComparison', 'Price Comparison'),
      description: t('chat.aiActions.priceComparisonDesc', 'Compare prices across stores')
    },
    { 
      id: 'size_recommendation', 
      icon: Ruler, 
      label: t('chat.aiActions.sizeRecommendation', 'Size Recommendation'),
      description: t('chat.aiActions.sizeRecommendationDesc', 'Get perfect size suggestions')
    },
    { 
      id: 'gift_suggestion', 
      icon: Gift, 
      label: t('chat.aiActions.giftSuggestion', 'Gift Suggestions'),
      description: t('chat.aiActions.giftSuggestionDesc', 'Find perfect gifts for anyone')
    },
  ];

  // Close menu if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest('.ai-actions-menu')) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      className={`
        ai-actions-menu absolute bottom-16 left-3 right-3 z-10 rounded-xl p-3
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        border shadow-lg
      `}
      role="menu"
    >
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id as AIAction)}
              className={`
                flex flex-col items-center p-3 rounded-lg
                ${darkMode 
                  ? 'hover:bg-gray-700 text-gray-200 focus:ring-orange-500' 
                  : 'hover:bg-gray-100 text-gray-800 focus:ring-orange-500'}
                transition-colors focus:outline-none focus:ring-2
              `}
              role="menuitem"
              aria-label={action.description}
              tabIndex={0}
            >
              <div className={`
                p-2 rounded-full mb-1
                ${darkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-100 text-orange-600'}
              `} aria-hidden="true">
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};