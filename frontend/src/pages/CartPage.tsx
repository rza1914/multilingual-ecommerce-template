/**
 * Cart Page
 * Full shopping cart page with items list and order summary
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItemCard from '../components/cart/CartItemCard';
import CartSummary from '../components/cart/CartSummary';
import ShippingBanner from '../components/cart/ShippingBanner';

const CartPage: React.FC = () => {
  const { cartItems, getTotalItems } = useCart();

  const isEmpty = cartItems.length === 0;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Continue Shopping</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-hero text-gradient-orange mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEmpty ? (
                'Your cart is empty'
              ) : (
                <>
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {isEmpty ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
          <div className="glass-card p-12 max-w-md w-full text-center">
            <div className="mb-6 animate-bounce-slow">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Looks like you haven't added any products to your cart yet.
              Start shopping to fill it up!
            </p>

            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Cart Items (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Banner */}
            <ShippingBanner />

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <CartItemCard item={item} />
                </div>
              ))}
            </div>

            {/* Mobile: Continue Shopping (visible on mobile only) */}
            <div className="lg:hidden">
              <Link
                to="/products"
                className="btn-glass w-full text-center flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Side - Order Summary (1/3 width, sticky) */}
          <div className="lg:col-span-1">
            <CartSummary
              showCoupon={true}
              showCheckoutButton={true}
              showContinueShopping={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
