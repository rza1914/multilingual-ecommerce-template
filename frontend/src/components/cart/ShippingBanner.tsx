/**
 * Shipping Banner Component
 * Shows progress towards free shipping
 */

import React from 'react';
import { Truck, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ShippingBanner: React.FC = () => {
  const { getSubtotal, isFreeShipping } = useCart();

  const subtotal = getSubtotal();
  const freeShippingThreshold = 100;
  const remaining = freeShippingThreshold - subtotal;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // If already qualified for free shipping
  if (isFreeShipping()) {
    return (
      <div className="glass-card p-4 mb-6 animate-slide-down">
        <div className="flex items-center justify-center gap-3">
          <div className="glass-orange p-2 rounded-full">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <p className="font-semibold text-green-600 dark:text-green-400">
            🎉 You got FREE shipping!
          </p>
          <Truck className="w-6 h-6 text-green-500 animate-bounce-slow" />
        </div>
      </div>
    );
  }

  // If close to free shipping
  return (
    <div className="glass-card p-4 mb-6 animate-slide-down">
      <div className="flex items-center gap-3 mb-3">
        <div className="glass-orange p-2 rounded-full">
          <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Add <span className="text-orange-600 dark:text-orange-400">${remaining.toFixed(2)}</span> more for <span className="text-green-600">FREE shipping</span>! 🚚
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 shimmer" />
        </div>
      </div>

      {/* Progress Text */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        {progress.toFixed(0)}% towards free shipping
      </p>
    </div>
  );
};

export default ShippingBanner;
