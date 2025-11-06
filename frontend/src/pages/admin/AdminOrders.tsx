import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAdminOrders,
  updateOrderStatus,
  deleteAdminOrder,
  AdminOrder
} from '../../services/admin.service';
import {
  ShoppingCart, Eye, Edit2, Trash2, Package, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  const fetchOrders = async (status: string = 'all') => {
    try {
      setLoading(true);
      const data = await getAdminOrders(0, 100, status);
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    fetchOrders(status);
  };

  const openEditModal = (order: AdminOrder) => {
    setEditingOrder(order);
    setNewStatus(order.status);
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder) return;

    setUpdating(true);
    try {
      await updateOrderStatus(editingOrder.id, newStatus);
      setEditingOrder(null);
      fetchOrders(selectedStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(t('admin.updateStatusError'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (order: AdminOrder) => {
    if (!window.confirm(t('admin.deleteOrderConfirm', { id: order.id }))) {
      return;
    }

    try {
      await deleteAdminOrder(order.id);
      fetchOrders(selectedStatus);
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert(t('admin.deleteOrderError'));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusFilters = [
    { value: 'all', label: t('admin.allOrders'), count: orders.length },
    { value: 'pending', label: t('order.pending'), icon: '⏱️' },
    { value: 'processing', label: t('order.processing'), icon: '📦' },
    { value: 'shipped', label: t('order.shipped'), icon: '🚚' },
    { value: 'delivered', label: t('order.delivered'), icon: '✅' },
    { value: 'cancelled', label: t('order.cancelled'), icon: '❌' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('admin.loadingOrders')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('admin.orderManagement')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin.orderManagementDesc')}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleStatusFilter(filter.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedStatus === filter.value
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-2 border-gray-200 dark:border-gray-800'
                }`}
              >
                {filter.icon && <span>{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.noOrdersFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedStatus === 'all'
                ? t('admin.noOrdersPlaced')
                : t('admin.noStatusOrders', { status: t(`order.${selectedStatus}`) })
              }
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.orderID')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.customer')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.date')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.items')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.total')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900 dark:text-white">
                          #{order.id.toString().padStart(6, '0')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {order.full_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold">
                          <Package className="w-4 h-4" />
                          {order.items_count}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-orange-500 text-lg">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                          {t(`order.${order.status}`)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title={t('admin.viewDetails')}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(order)}
                            className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                            title={t('admin.updateStatus')}
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t('admin.deleteOrder')}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editingOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm z-[60]"
            onClick={() => !updating && setEditingOrder(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('admin.updateOrderStatus')}
                </h2>
                <button
                  onClick={() => setEditingOrder(null)}
                  disabled={updating}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t('admin.orderLabel')}: <span className="font-semibold text-gray-900 dark:text-white">
                    #{editingOrder.id.toString().padStart(6, '0')}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('admin.customerLabel')}: <span className="font-semibold text-gray-900 dark:text-white">
                    {editingOrder.full_name}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.newStatus')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                >
                  <option value="pending">⏱️ {t('order.pending')}</option>
                  <option value="processing">📦 {t('order.processing')}</option>
                  <option value="shipped">🚚 {t('order.shipped')}</option>
                  <option value="delivered">✅ {t('order.delivered')}</option>
                  <option value="cancelled">❌ {t('order.cancelled')}</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingOrder(null)}
                  disabled={updating}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('admin.updating')}
                    </span>
                  ) : (
                    t('admin.updateStatus')
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
