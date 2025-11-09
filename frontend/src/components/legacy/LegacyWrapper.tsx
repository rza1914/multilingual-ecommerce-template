import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LegacyWrapperProps {
  component: React.ComponentType<any>;
  legacyProps?: any;
  className?: string;
}

export const LegacyWrapper: React.FC<LegacyWrapperProps> = ({ 
  component: Component, 
  legacyProps = {},
  className = '' 
}) => {
  const { t } = useTranslation();
  const [useLegacy, setUseLegacy] = useState(true);
  
  const toggleLegacy = () => {
    setUseLegacy(!useLegacy);
  };
  
  return (
    <div className={`legacy-wrapper ${className}`}>
      {/* دکمه تغییر بین نسخه‌ها */}
      <div className="legacy-toggle">
        <button
          onClick={toggleLegacy}
          className={`toggle-btn ${useLegacy ? 'legacy-active' : 'new-active'}`}
        >
          {useLegacy ? t('common.use_legacy', 'استفاده از نسخه قدیمی') : t('common.use_new', 'استفاده از نسخه جدید')}
        </button>
      </div>
      
      {/* نمایش نسخه جدید یا قدیمی */}
      {useLegacy ? (
        <div className="legacy-notice">
          <p>{t('common.legacy_notice', 'در حال استفاده از نسخه قدیمی')}</p>
        </div>
      ) : (
        <div className="new-features">
          <p>{t('common.new_features', 'ویژگی‌های جدید فعال است')}</p>
        </div>
      )}
      
      {/* رندر کردن کامپوننت */}
      <Component {...legacyProps} />
    </div>
  );
};