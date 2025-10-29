/**
 * Cart Summary Component
 * Displays order summary with totals and coupon input
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CouponInput from './CouponInput';

interface CartSummaryProps {
  showCoupon?: boolean;
  showCheckoutButton?: boolean;
  showContinueShopping?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  showCoupon = true,
  showCheckoutButton = true,
  showContinueShopping = true,
}) => {
  const navigate = useNavigate();
  const {
    getSubtotal,
    getTax,
    getShipping,
    getDiscount,
    cartItems,
  } = useCart();

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = subtotal + tax + shipping - discount;

  const isEmpty = cartItems.length === 0;

  /**
   * Handle checkout - navigate to checkout page
   */
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="glass-card p-6 sticky top-24 animate-slide-up">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="glass-orange p-2 rounded-xl">
          <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gradient-orange">
          Order Summary
        </h2>
      </div>

      {/* Summary Lines */}
      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Shipping</span>
          {shipping === 0 ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white">
              ${shipping.toFixed(2)}
            </span>
          )}
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Tax (10%)
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${tax.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span className="font-semibold">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-orange-500/30 my-6" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Total
        </span>
        <span className="text-3xl font-bold text-gradient-orange">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Coupon Input */}
      {showCoupon && (
        <div className="mb-6">
          <CouponInput />
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <button
          onClick={handleCheckout}
          disabled={isEmpty}
          className="w-full btn-primary text-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Continue Shopping Link */}
      {showContinueShopping && (
        <Link
          to="/products"
          className="block text-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
        >
          Continue Shopping
        </Link>
      )}

      {/* Security Note */}
      <div className="mt-6 glass p-4 rounded-2xl">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          🔒 Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
