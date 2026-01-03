import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CartItem from './CartItem';
import './cart-sidebar.css';

/**
 * CartSidebar Component
 * 
 * A glassmorphism-styled sidebar for displaying cart items.
 * Features:
 * - Semi-transparent blurred background
 * - Smooth slide-in/out animations
 * - RTL/LTR support
 * - Keyboard accessible (Escape to close)
 * - Clear visual hierarchy: Header → Items → Footer
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls sidebar visibility
 * @param {function} props.onClose - Callback to close the sidebar
 * @param {Array} props.items - Cart items array
 * @param {number} props.total - Cart total amount
 * @param {function} props.onUpdateQuantity - Callback for quantity changes
 * @param {function} props.onRemoveItem - Callback for item removal
 * @param {function} props.onCheckout - Callback for checkout action
 */
const CartSidebar = ({
  isOpen,
  onClose,
  items = [],
  total = 0,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const { t } = useTranslation();

  // Handle Escape key to close sidebar for accessibility
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Attach keyboard listener when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Format price with locale support
  const formatPrice = (price) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Calculate item count for header badge
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay backdrop - click to close */}
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main sidebar container */}
      <aside
        className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title', 'Shopping Cart')}
        aria-hidden={!isOpen}
      >
        {/* ===== HEADER SECTION ===== */}
        <header className="cart-sidebar__header">
          <div className="cart-sidebar__title-wrapper">
            <h2 className="cart-sidebar__title">
              {t('cart.title', 'Shopping Cart')}
            </h2>
            {itemCount > 0 && (
              <span className="cart-sidebar__badge">
                {itemCount}
              </span>
            )}
          </div>
          <button
            className="cart-sidebar__close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* ===== ITEMS LIST SECTION ===== */}
        <div className="cart-sidebar__content">
          {items.length === 0 ? (
            <div className="cart-sidebar__empty">
              <svg
                className="cart-sidebar__empty-icon"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="cart-sidebar__empty-text">
                {t('cart.empty', 'Your cart is empty')}
              </p>
            </div>
          ) : (
            <ul className="cart-sidebar__items" role="list">
              {items.map((item) => (
                <li key={item.id} className="cart-sidebar__item-wrapper">
                  <CartItem
                    item={item}
                    onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
                    onRemove={() => onRemoveItem(item.id)}
                    formatPrice={formatPrice}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== FOOTER SECTION ===== */}
        <footer className="cart-sidebar__footer">
          {/* Subtotal row */}
          <div className="cart-sidebar__subtotal">
            <span className="cart-sidebar__subtotal-label">
              {t('cart.subtotal', 'Subtotal')}
            </span>
            <span className="cart-sidebar__subtotal-value">
              {formatPrice(total)}
            </span>
          </div>

          {/* Shipping notice */}
          <p className="cart-sidebar__shipping-notice">
            {t('cart.shippingNotice', 'Shipping calculated at checkout')}
          </p>

          {/* Checkout button */}
          <button
            className="cart-sidebar__checkout-btn"
            onClick={onCheckout}
            disabled={items.length === 0}
            aria-disabled={items.length === 0}
          >
            {t('cart.checkout', 'Proceed to Checkout')}
          </button>

          {/* Continue shopping link */}
          <button
            className="cart-sidebar__continue-btn"
            onClick={onClose}
          >
            {t('cart.continueShopping', 'Continue Shopping')}
          </button>
        </footer>
      </aside>
    </>
  );
};

export default CartSidebar;