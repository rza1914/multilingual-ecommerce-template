import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats, getRecentOrders, getRevenueChart, DashboardStats, RecentOrder, RevenueChartData } from '../../services/admin.service';
import {
  Users, Package, ShoppingCart, DollarSign,
  TrendingUp, Eye, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [statsData, ordersData, chartData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
        getRevenueChart(7)
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
      setRevenueData(chartData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('admin.loadingDashboard')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.failedToLoad')}
          </h1>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
          >
            {t('admin.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('admin.dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('admin.welcomeMessage')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('admin.newThisMonth', { count: stats.new_users_count })}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total_users}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t('admin.totalUsers')}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('admin.active')}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total_products}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t('admin.totalProducts')}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('admin.newThisMonth', { count: stats.recent_orders_count })}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total_orders}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t('admin.totalOrders')}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-white/80">
                {t('admin.revenueThisMonth', { amount: formatCurrency(stats.recent_revenue) })}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(stats.total_revenue)}
            </h3>
            <p className="text-white/80">{t('admin.totalRevenue')}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all text-left group"
          >
            <Package className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t('admin.manageProducts')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('admin.manageProductsDesc')}
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all text-left group"
          >
            <ShoppingCart className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t('admin.manageOrders')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('admin.manageOrdersDesc')}
            </p>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('admin.revenueOverview')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('admin.last7Days')}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            {revenueData.length > 0 ? (
              <div className="space-y-4">
                {revenueData.map((day, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                  const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-sm font-bold text-orange-500">
                          {formatCurrency(day.revenue)}
                        </span>
                      </div>
                      <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('admin.ordersCount', { count: day.orders })}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t('admin.noRevenueData')}</p>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('admin.ordersByStatus')}
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.orders_by_status).length > 0 ? (
                Object.entries(stats.orders_by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'processing' ? 'bg-blue-500' :
                        status === 'shipped' ? 'bg-purple-500' :
                        status === 'delivered' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {t(`order.${status}`)}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('admin.noOrdersYet')}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('admin.recentOrders')}
            </h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              {t('admin.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.orderID')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.customer')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.date')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.total')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          #{order.id.toString().padStart(6, '0')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {order.full_name}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-orange-500">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {t(`order.${order.status}`)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('admin.noOrdersYet')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
