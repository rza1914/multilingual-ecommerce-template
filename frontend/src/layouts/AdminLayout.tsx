/**
 * Admin Layout Component
 * Wrapper layout for all admin pages with sidebar navigation
 */

import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.loading', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Top Padding for Mobile Toggle Button */}
        <div className="lg:hidden h-4" />
        
        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;