import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { userService } from '@/services/userService';
import type { UserListItem, UserRole, UserStatus, UserFilters } from '@/types/user.types';
import { EmptyState } from '@/components/admin/EmptyState';

// Role configuration with icons and colors
const roleConfig: Record<UserRole, {
  label: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}> = {
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-700 dark:text-purple-400'
  },
  moderator: {
    label: 'Moderator',
    icon: Shield,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-400'
  },
  customer: {
    label: 'Customer',
    icon: Users,
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-400'
  }
};

// Status configuration
const statusConfig: Record<UserStatus, {
  label: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}> = {
  active: {
    label: 'Active',
    icon: UserCheck,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-400'
  },
  inactive: {
    label: 'Inactive',
    icon: UserX,
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-400'
  },
  suspended: {
    label: 'Suspended',
    icon: ShieldAlert,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-700 dark:text-amber-400'
  }
};

/**
 * AdminUsers Page Component
 * Displays users in a table with filtering and CRUD operations
 */
export const AdminUsers: React.FC = () => {
  // State
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: UserFilters = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await userService.getUsers(filters);
      
      setUsers(response.items);
      setTotalUsers(response.total);
      setTotalPages(response.pages);
    } catch (err) {
      console.error('Error fetching users:', err);
      
      if (userService.isApiError(err)) {
        setError(err.message);
      } else {
        setError('Failed to load users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Role badge component
  const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const config = roleConfig[role];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {config.label}
      </span>
    );
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {config.label}
      </span>
    );
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && users.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            User Management
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Users</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{error}</p>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage customer accounts and permissions ({totalUsers} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="customer">Customer</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <Users className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(user.created_at)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {users.length} of {totalUsers} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">{currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;