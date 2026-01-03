/**
 * Mini Cart Sidebar
 * Styled with site's standard glassmorphism (glass-card, glass-orange)
 * Matches LanguageSwitcher dropdown design
 */

import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import ProductImage from '../products/ProductImage';
import { getLocalizedTitle, formatCurrency } from '../../utils/i18n';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { t } = useTranslation();
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
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-md
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar - Using glass-card standard */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className={`fixed top-0 h-screen z-[70]
                    flex flex-col
                    w-full max-w-[400px]
                    ltr:right-0 rtl:left-0
                    glass-card !rounded-none ltr:!rounded-l-3xl rtl:!rounded-r-3xl
                    border-2 border-orange-500/30
                    shadow-2xl
                    transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0 animate-scale-in' : 'ltr:translate-x-full rtl:-translate-x-full'}`}
      >
        {/* ===== HEADER ===== */}
        <header className="flex-shrink-0 px-4 py-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="glass-orange p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('cart.title')}
              </h2>
              {getTotalItems() > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/30">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="glass-orange p-2 rounded-xl hover:scale-110 transition-transform"
              aria-label={t('buttons.closeCart')}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 custom-scrollbar"
             style={{ minHeight: 0 }}>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="glass-orange w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {t('cart.empty')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('cart.emptyMessage')}
              </p>
              <button
                onClick={() => { navigate('/products'); onClose(); }}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            /* Cart Items */
            <div className="space-y-2">
              {cartItems.map((item, index) => {
                const hasDiscount = item.product.discount && item.product.discount > 0;
                const price = hasDiscount
                  ? item.product.price * (1 - (item.product.discount ?? 0) / 100)
                  : item.product.price;
                const itemSubtotal = price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="glass-card !rounded-2xl p-3 flex gap-3
                               border border-orange-500/20
                               hover:border-orange-500/40
                               transition-all duration-300 group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Product Image */}
                    <div className="glass-orange p-1 rounded-xl flex-shrink-0">
                      <ProductImage
                        src={item.product.image_url || ''}
                        alt={item.product.title_en}
                        className="w-14 h-14 object-cover rounded-lg"
                        width={56}
                        height={56}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {getLocalizedTitle(item.product, item.product.title_en)}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-orange-500">
                          {formatCurrency(price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="glass-card !rounded-lg flex items-center gap-0.5 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-md hover:bg-orange-500/20
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-colors"
                            aria-label={t('buttons.decreaseQuantity')}
                          >
                            <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 rounded-md hover:bg-orange-500/20
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-colors"
                            aria-label={t('buttons.increaseQuantity')}
                          >
                            <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                        <span className="glass-orange text-xs font-semibold px-2 py-1 rounded-lg text-orange-600 dark:text-orange-400">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg
                                 opacity-60 group-hover:opacity-100
                                 hover:bg-red-500/20 transition-all duration-200"
                      aria-label={t('buttons.removeItem')}
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        {cartItems.length > 0 && (
          <footer className="flex-shrink-0 px-4 py-4 border-t border-white/10">
            {/* Total */}
            <div className="glass-orange !rounded-xl flex justify-between items-center p-3 mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('cart.total')}
              </span>
              <span className="text-xl font-bold text-gradient-orange">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>

            {/* Shipping Notice */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
              {t('cart.shippingNotice')}
            </p>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => { navigate('/checkout'); onClose(); }}
                className="w-full btn-primary py-3 text-sm font-bold"
              >
                {t('cart.proceedToCheckout')}
              </button>
              <button
                onClick={() => { navigate('/cart'); onClose(); }}
                className="w-full glass-card !rounded-xl py-2.5 text-sm font-semibold
                           text-gray-700 dark:text-gray-300
                           hover:border-orange-500/40 transition-all"
              >
                {t('cart.viewCart')}
              </button>
            </div>
          </footer>
        )}
      </aside>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 53, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 53, 0.5);
        }
      `}</style>
    </>
  );
}