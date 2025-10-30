import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/order.service';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(Number(orderId));
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('order.loadingDetails')}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('order.notFound')}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
          >
            {t('order.goHome')}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">

        {/* Success Header */}
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 mb-6 animate-bounce-slow">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('order.orderConfirmed')}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            {t('order.thankYou')}
          </p>

          <p className="text-gray-500 dark:text-gray-500">
            {t('order.receivedMessage')}
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center mb-8 shadow-xl">
          <p className="text-white/80 text-sm font-semibold mb-2">
            {t('order.orderNumberLabel')}
          </p>
          <p className="text-4xl font-bold text-white mb-4">
            #{order.id.toString().padStart(6, '0')}
          </p>
          <p className="text-white/80 text-sm">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('order.orderStatus')}
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-green-500">{t('order.confirmed')}</p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{t('order.processing')}</p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{t('order.shipped')}</p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{t('order.delivered')}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('order.orderDetails')}
          </h2>

          {/* Shipping Address */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('order.shippingAddress')}
            </h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>{order.full_name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.zip_code}</p>
              <p>{order.country}</p>
              <p className="text-sm mt-2">{order.email}</p>
              <p className="text-sm">{order.phone}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('order.orderSummary')}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>{t('order.subtotal')}</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('order.shipping')}</span>
                <span>${order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('order.tax')}</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>{t('order.discount')}</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                <span>{t('order.total')}</span>
                <span className="text-orange-500">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-4 bg-white dark:bg-gray-900 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {t('order.viewAllOrders')}
          </button>

          <button
            onClick={() => navigate('/products')}
            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all"
          >
            {t('order.continueShopping')}
          </button>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📧 {t('order.emailConfirmation')}{' '}
            <span className="font-semibold">{order.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
