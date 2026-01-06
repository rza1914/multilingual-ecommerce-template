/**
 * Admin Blog Management Page
 * Placeholder for blog post management
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Construction } from 'lucide-react';

const AdminBlog: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-orange-500" />
            {t('admin.blog.title', 'Blog Management')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.blog.subtitle', 'Create and manage blog posts')}
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" disabled>
          <Plus className="w-5 h-5" />
          {t('admin.blog.newPost', 'New Post')}
        </button>
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-12 text-center">
        <Construction className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.blog.comingSoon', 'Coming Soon')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {t('admin.blog.comingSoonDesc', 'Blog management feature is under development. You will be able to create, edit, and publish blog posts with multilingual support.')}
        </p>
      </div>
    </div>
  );
};

export default AdminBlog;