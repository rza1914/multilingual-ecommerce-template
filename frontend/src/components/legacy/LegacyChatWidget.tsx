import React from 'react';
import { useTranslation } from 'react-i18next';

export const LegacyChatWidget: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="legacy-chat-widget">
      <div className="legacy-header">
        <h3>{t('chat.legacy_title', 'چت بات قدیمی')}</h3>
        <p>{t('chat.legacy_description', 'این یک نسخه قدیمی از چت بات است')}</p>
      </div>
      
      <div className="legacy-content">
        <div className="legacy-message">
          <p>{t('chat.legacy_message', 'پیام نسخه قدیمی')}</p>
        </div>
      </div>
    </div>
  );
};