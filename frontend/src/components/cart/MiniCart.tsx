/**
 * Mini Cart Sidebar - NEW VERSION
 * Fixed with inline styles for proper flex layout
 */

import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductImage, handleImageError } from '../../utils/imageUtils';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md z-[60]
                    transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar with PROPER FLEX LAYOUT */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'clamp(90vw, 500px, 90vw)',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-bg)',
          boxShadow: '0 0 50px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #FF6B35',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-out',
          overflow: 'hidden',
        }}
        className="dark:bg-gray-900 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER - Fixed height */}
        <div
          className="p-6 border-b-2 border-orange-500/20
                      bg-gradient-to-br from-orange-50 to-white
                      dark:from-gray-800 dark:to-gray-900"
          style={{
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-orange-500">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl
                         bg-white dark:bg-gray-800
                         hover:bg-orange-100 dark:hover:bg-orange-900/30
                         border-2 border-gray-200 dark:border-gray-700
                         hover:border-orange-500
                         transition-all duration-200
                         shadow-lg hover:shadow-orange-500/20"
              aria-label="Close cart"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* CONTENT - Scrollable */}
        <div
          className="bg-gray-50 dark:bg-gray-950 p-6"
          style={{
            flex: 1,
            minHeight: 0, // CRITICAL: allows flex child to shrink below content size
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {cartItems.length === 0 ? (
            // Empty State
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
              }}
              className="py-12"
            >
              <div className="w-24 h-24 rounded-full
                            bg-gradient-to-br from-orange-100 to-orange-50
                            dark:from-orange-900/20 dark:to-orange-800/10
                            flex items-center justify-center mb-4
                            shadow-lg">
                <ShoppingCart className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some products to get started!
              </p>
              <button
                onClick={() => {
                  navigate('/products');
                  onClose();
                }}
                className="px-6 py-3
                         bg-gradient-to-r from-orange-500 to-orange-600
                         text-white rounded-xl font-semibold
                         hover:shadow-xl hover:shadow-orange-500/50
                         hover:scale-105
                         transition-all duration-300
                         border-2 border-orange-400"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            // Cart Items List
            <div className="space-y-4">
              {cartItems.map((item, index) => {
                const hasDiscount = item.product.discount && item.product.discount > 0;
                const price = hasDiscount
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price;
                const itemSubtotal = price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-900
                             rounded-2xl p-4
                             shadow-lg hover:shadow-xl
                             border-2 border-gray-100 dark:border-gray-800
                             hover:border-orange-500/50
                             transition-all duration-300 animate-fadeInUp"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={getProductImage(item.product.image_url)}
                        alt={item.product.title_en}
                        onError={handleImageError}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0
                                 border-2 border-gray-100 dark:border-gray-800"
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                          {item.product.title_en}
                        </h4>
                        <p className="text-orange-500 font-bold text-sm mb-2">
                          ${price.toFixed(2)}
                          {hasDiscount && (
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-lg
                                     bg-orange-50 dark:bg-orange-900/20
                                     hover:bg-orange-100 dark:hover:bg-orange-900/40
                                     border border-orange-200 dark:border-orange-800
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-colors"
                          >
                            <Minus className="w-4 h-4 text-orange-500" />
                          </button>
                          <span className="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 rounded-lg
                                     bg-orange-50 dark:bg-orange-900/20
                                     hover:bg-orange-100 dark:hover:bg-orange-900/40
                                     border border-orange-200 dark:border-orange-800
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-colors"
                          >
                            <Plus className="w-4 h-4 text-orange-500" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-lg
                                 hover:bg-red-50 dark:hover:bg-red-900/20
                                 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800
                                 transition-colors
                                 group flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="mt-3 pt-3 border-t-2 border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="font-semibold text-orange-500">
                          ${itemSubtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER - Fixed height */}
        {cartItems.length > 0 && (
          <div
            className="border-t-2 border-orange-500/30 p-6
                        bg-white dark:bg-gray-900
                        shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
            style={{
              flexShrink: 0,
            }}
          >
            {/* Total */}
            <div className="flex justify-between items-center mb-4 pb-4
                          border-b-2 border-gray-200 dark:border-gray-800">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-orange-500">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigate('/cart');
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl
                         bg-white dark:bg-gray-800
                         border-2 border-orange-500
                         text-orange-500 font-semibold
                         hover:bg-orange-50 dark:hover:bg-orange-900/20
                         shadow-lg hover:shadow-xl
                         transition-all duration-300"
              >
                View Full Cart
              </button>
              <button
                onClick={() => {
                  navigate('/checkout');
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl
                         bg-gradient-to-r from-orange-500 to-orange-600
                         text-white font-semibold
                         hover:shadow-xl hover:shadow-orange-500/60
                         hover:scale-[1.02]
                         border-2 border-orange-400
                         transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}