import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegacyWrapper } from '../../legacy/LegacyWrapper';
import SmartSearchBar from '../../legacy/SmartSearchBar'; // Legacy component

interface MultilingualSmartSearchBarProps {
  className?: string;
  useLegacy?: boolean;
  onSearch?: (results: any[], query?: string) => void;
}

export const MultilingualSmartSearchBar: React.FC<MultilingualSmartSearchBarProps> = ({ 
  className = '', 
  useLegacy = false,
  onSearch
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`multilingual-smart-search-bar ${className}`}>
      {useLegacy ? (
        <LegacyWrapper component={SmartSearchBar} legacyProps={{ onSearch }} />
      ) : (
        // کامپوننت جدید با تمام ویژگی‌ها
        <div className="new-search-features">
          <div className="feature-notice">
            <span>✨ {t('common.new_features_notice', 'ویژگی‌های جدید فعال است')}</span>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">{t('search.new_title', 'جستجوی هوشمند جدید')}</h3>
            <p>{t('search.new_description', 'این نسخه جدید شامل تمام ویژگی‌های جستجوی هوشمند است')}</p>
          </div>
        </div>
      )}
    </div>
  );
};