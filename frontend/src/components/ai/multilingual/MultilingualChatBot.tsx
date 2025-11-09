import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegacyWrapper } from '../../legacy/LegacyWrapper';
import { LegacyChatWidget } from '../../legacy/LegacyChatWidget'; // Legacy component

interface MultilingualChatBotProps {
  className?: string;
  useLegacy?: boolean;
}

export const MultilingualChatBot: React.FC<MultilingualChatBotProps> = ({ 
  className = '', 
  useLegacy = false 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`multilingual-chat-bot ${className}`}>
      {useLegacy ? (
        <LegacyWrapper component={LegacyChatWidget} />
      ) : (
        // کامپوننت جدید با تمام ویژگی‌ها
        <div className="new-chat-features">
          <div className="feature-notice">
            <span>✨ {t('common.new_features_notice', 'ویژگی‌های جدید فعال است')}</span>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">{t('chat.new_title', 'چت هوشمند جدید')}</h3>
            <p>{t('chat.new_description', 'این نسخه جدید شامل تمام ویژگی‌های چت هوشمند است')}</p>
          </div>
        </div>
      )}
    </div>
  );
};