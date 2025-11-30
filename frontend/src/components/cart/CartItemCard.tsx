/**
 * Cart Item Card Component
 * Displays individual cart item with quantity controls
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../../contexts/CartContext';
import { useCart } from '../../contexts/CartContext';
import ProductImage from '../products/ProductImage';
import { getLocalizedTitle, getLocalizedDescription, formatCurrency } from '../../utils/i18n';
import RemoveItemModal from './RemoveItemModal';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const { product } = item;
  const title = getLocalizedTitle(product);
  const description = getLocalizedDescription(product);

  // Calculate price
  const hasDiscount = product.discount && product.discount > 0;
  const price = hasDiscount
    ? product.price * (1 - (product.discount ?? 0) / 100)
    : product.price;
  const itemSubtotal = price * quantity;

  // Stock status
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isInsufficientStock = quantity > product.stock;

  /**
   * Handle quantity change from input
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
      updateQuantity(product.id, newQuantity);
    }
  };

  /**
   * Handle quantity decrease
   */
  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product.id, newQuantity);
    }
  };

  /**
   * Handle quantity increase
   */
  const handleIncrease = () => {
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(product.id, newQuantity);
    }
  };

  /**
   * Handle remove item
   */
  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <>
      <div className="glass-card p-6 animate-slide-up hover:shadow-xl transition-all duration-300">
        <div className="flex gap-6">
          {/* Product Image */}
          <Link to={`/products/${product.id}`} className="flex-shrink-0">
            <ProductImage
              src={product.image_url || ''}
              alt={title}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
              width={128}
              height={128}
            />
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            {/* Title and Remove Button */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${product.id}`}
                  className="font-bold text-lg text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2"
                >
                  {title}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                  {description}
                </p>
              </div>

              {/* Remove Button (Desktop) */}
              <button
                onClick={() => setIsRemoveModalOpen(true)}
                className="ml-4 glass-orange p-2 rounded-xl hover:scale-110 transition-transform hidden md:flex"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* Category Badge */}
            {product.category && (
              <span className="badge-glass text-xs inline-block mb-3">
                {product.category}
              </span>
            )}

            {/* Stock Warnings */}
            {isInsufficientStock && (
              <div className="flex items-center gap-2 mb-3 text-red-500 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('cart.insufficientStock', { count: product.stock })}</span>
              </div>
            )}

            {isLowStock && !isInsufficientStock && (
              <div className="flex items-center gap-2 mb-3 text-orange-500 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('product.lowStock', { count: product.stock })}</span>
              </div>
            )}

            {/* Price and Quantity Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
              {/* Price */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gradient-orange">
                    {formatCurrency(price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('cart.subtotal')}: <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(itemSubtotal)}
                  </span>
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="glass-orange p-2 rounded-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  disabled={isOutOfStock}
                  className="w-16 text-center text-lg font-bold glass-card px-3 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
                />

                <button
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="glass-orange p-2 rounded-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </button>

                {/* Remove Button (Mobile) */}
                <button
                  onClick={() => setIsRemoveModalOpen(true)}
                  className="md:hidden glass-orange p-2 rounded-xl hover:scale-110 transition-transform ml-2"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <RemoveItemModal
        product={product}
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemove}
      />
    </>
  );
};

export default CartItemCard;
