/**
 * Admin Site Settings Page
 * Placeholder for site configuration
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Construction } from 'lucide-react';

const AdminSiteSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-orange-500" />
          {t('admin.settings.title', 'Site Settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('admin.settings.subtitle', 'Configure your store settings')}
        </p>
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-12 text-center">
        <Construction className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.settings.comingSoon', 'Coming Soon')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {t('admin.settings.comingSoonDesc', 'Site settings feature is under development. You will be able to configure store name, logo, contact info, shipping, payments, and SEO.')}
        </p>
      </div>
    </div>
  );
};

export default AdminSiteSettings;