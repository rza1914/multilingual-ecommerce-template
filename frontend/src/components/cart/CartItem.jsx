import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * CartItem Component
 * 
 * Compact display for a single cart item.
 * Features:
 * - Thumbnail image
 * - Product name and variant info
 * - Quantity controls
 * - Price display
 * - Remove button
 * 
 * @param {Object} props
 * @param {Object} props.item - Cart item data
 * @param {function} props.onUpdateQuantity - Quantity change callback
 * @param {function} props.onRemove - Remove item callback
 * @param {function} props.formatPrice - Price formatting function
 */
const CartItem = ({ item, onUpdateQuantity, onRemove, formatPrice }) => {
  const { t } = useTranslation();

  // Handle quantity decrement, minimum is 1
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  // Handle quantity increment
  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  return (
    <article className="cart-item" aria-label={item.name}>
      {/* Product thumbnail */}
      <div className="cart-item__image-wrapper">
        <img
          src={item.image || '/placeholder-product.png'}
          alt={item.name}
          className="cart-item__image"
          loading="lazy"
        />
      </div>

      {/* Product details */}
      <div className="cart-item__details">
        <h4 className="cart-item__name" title={item.name}>
          {item.name}
        </h4>
        
        {/* Show variant if available (e.g., size, color) */}
        {item.variant && (
          <span className="cart-item__variant">
            {item.variant}
          </span>
        )}

        {/* Price display */}
        <span className="cart-item__price">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Quantity controls */}
      <div className="cart-item__quantity">
        <button
          className="cart-item__qty-btn"
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          aria-label={t('cart.decreaseQuantity', 'Decrease quantity')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect y="5" width="12" height="2" rx="1" />
          </svg>
        </button>
        
        <span className="cart-item__qty-value" aria-label={t('cart.quantity', 'Quantity')}>
          {item.quantity}
        </span>
        
        <button
          className="cart-item__qty-btn"
          onClick={handleIncrement}
          aria-label={t('cart.increaseQuantity', 'Increase quantity')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect y="5" width="12" height="2" rx="1" />
            <rect x="5" width="2" height="12" rx="1" />
          </svg>
        </button>
      </div>

      {/* Remove button */}
      <button
        className="cart-item__remove-btn"
        onClick={onRemove}
        aria-label={t('cart.removeItem', 'Remove {{name}} from cart', { name: item.name })}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6" />
          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
        </svg>
      </button>
    </article>
  );
};

export default CartItem;