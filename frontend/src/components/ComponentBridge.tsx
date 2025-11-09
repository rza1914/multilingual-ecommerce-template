import React from 'react';

interface ComponentBridgeProps {
  legacyComponent: React.ComponentType<any>;
  modernComponent: React.ComponentType<any>;
  useLegacy: boolean;
  legacyProps?: Record<string, any>;
  modernProps?: Record<string, any>;
  fallback?: React.ReactNode;
}

export const ComponentBridge: React.FC<ComponentBridgeProps> = ({
  legacyComponent: LegacyComp,
  modernComponent: ModernComp,
  useLegacy,
  legacyProps = {},
  modernProps = {},
  fallback = null
}) => {
  try {
    return useLegacy ? 
      <LegacyComp {...legacyProps} /> : 
      <ModernComp {...modernProps} />;
  } catch (error) {
    console.error('خطا در رندر کامپوننت:', error);
    return <>{fallback}</>;
  }
};

// استفاده در کامپوننت‌ها
export const SmartSearchBridge: React.FC<{
  useLegacy: boolean;
  onSearch: (results: any[], query?: string) => void;
}> = ({ useLegacy, onSearch }) => {
  // Dynamic import for legacy component
  const LegacySmartSearch = useLegacy ? 
    React.lazy(() => import('./legacy/SmartSearchBar').catch(() => ({ default: () => <div>Legacy Smart Search Error</div> }))) : 
    null;
    
  // Dynamic import for modern component  
  const ModernSmartSearch = !useLegacy ? 
    React.lazy(() => import('./ai/SmartSearchBar').catch(() => ({ default: () => <div>Modern Smart Search Error</div> }))) : 
    null;

  return useLegacy && LegacySmartSearch ? (
    <React.Suspense fallback={<div>Loading legacy search...</div>}>
      <LegacySmartSearch onSearch={onSearch} />
    </React.Suspense>
  ) : ModernSmartSearch ? (
    <React.Suspense fallback={<div>Loading modern search...</div>}>
      <ModernSmartSearch onSearch={onSearch} />
    </React.Suspense>
  ) : null;
};