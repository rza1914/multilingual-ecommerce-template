/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel with collapsible mobile support
 */

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'admin.nav.dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin'
    },
    {
      id: 'users',
      labelKey: 'admin.nav.users',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users'
    },
    {
      id: 'products',
      labelKey: 'admin.nav.products',
      icon: <Package className="w-5 h-5" />,
      path: '/admin/products'
    },
    {
      id: 'orders',
      labelKey: 'admin.nav.orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      path: '/admin/orders'
    },
    {
      id: 'blog',
      labelKey: 'admin.nav.blog',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/blog'
    },
    {
      id: 'ai-settings',
      labelKey: 'admin.nav.aiSettings',
      icon: <Sparkles className="w-5 h-5" />,
      path: '/admin/ai-settings'
    },
    {
      id: 'settings',
      labelKey: 'admin.nav.siteSettings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-xl bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors"
        aria-label={t('admin.toggleSidebar')}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-screen
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {t('admin.panelTitle', 'Admin Panel')}
              </span>
            </div>
          )}
          
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? t('admin.expand') : t('admin.collapse')}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? t(item.labelKey, item.id) : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium truncate">
                      {t(item.labelKey, item.id)}
                    </span>
                  )}
                  {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="ms-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t('admin.version', 'Version')} 2.0.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;