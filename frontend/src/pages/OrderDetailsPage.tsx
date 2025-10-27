import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/order.service';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft, Package, Truck, Home, CheckCircle, Clock,
  MapPin, CreditCard, Phone, Mail, X, AlertCircle
} from 'lucide-react';

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated]);

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

  const handleCancelOrder = async () => {
    if (!order) return;

    setCancelling(true);
    try {
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'shipped':
        return 'text-purple-600 dark:text-purple-400';
      case 'delivered':
        return 'text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status.toLowerCase());

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8 shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{order.id.toString().padStart(6, '0')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Status Tracker */}
          {order.status.toLowerCase() !== 'cancelled' && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {/* Pending/Confirmed */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 1
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {currentStep >= 1 ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`text-sm font-semibold ${
                    currentStep >= 1 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    Confirmed
                  </p>
                </div>

                <div className={`flex-1 h-1 ${
                  currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                } mx-2`} />

                {/* Processing */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 2
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-semibold ${
                    currentStep >= 2 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    Processing
                  </p>
                </div>

                <div className={`flex-1 h-1 ${
                  currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                } mx-2`} />

                {/* Shipped */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 3
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-semibold ${
                    currentStep >= 3 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    Shipped
                  </p>
                </div>

                <div className={`flex-1 h-1 ${
                  currentStep >= 4 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                } mx-2`} />

                {/* Delivered */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 4
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-semibold ${
                    currentStep >= 4 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    Delivered
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancelled Notice */}
          {order.status.toLowerCase() === 'cancelled' && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <X className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    Order Cancelled
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    This order has been cancelled and will not be processed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Shipping */}
          <div className="lg:col-span-2 space-y-8">

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Items ({order.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.title_en}
                      className="w-24 h-24 object-cover rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => navigate(`/products/${item.product_id}`)}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/100?text=Product';
                      }}
                    />
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-orange-500 transition-colors"
                        onClick={() => navigate(`/products/${item.product_id}`)}
                      >
                        {item.product?.title_en}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price_at_time.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-500">
                        ${(item.price_at_time * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{order.full_name}</p>
                <p>{order.address}</p>
                <p>{order.city}, {order.state} {order.zip_code}</p>
                <p>{order.country}</p>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{order.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{order.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-100 dark:border-gray-800 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Delivery Method */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Delivery Method
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {order.shipping_method === 'standard' && 'Standard Shipping (5-7 days)'}
                  {order.shipping_method === 'express' && 'Express Shipping (2-3 days)'}
                  {order.shipping_method === 'nextday' && 'Next Day Delivery'}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {order.payment_method === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>${order.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-orange-500">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <>
          <div
            className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm z-[60]"
            onClick={() => !cancelling && setShowCancelModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-gray-200 dark:border-gray-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Cancel Order?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Cancelling...
                    </span>
                  ) : (
                    'Yes, Cancel'
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
