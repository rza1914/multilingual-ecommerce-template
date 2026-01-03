/**
 * Remove Item Modal
 * Confirmation dialog for removing items from cart
 */

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Product } from '../../types/product.types';
import { getProductImage } from '../../utils/imageUtils';

interface RemoveItemModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveItemModal: React.FC<RemoveItemModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const title = product.title_en;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div
          className="glass-card max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 glass-orange p-2 rounded-xl hover:scale-110 transition-transform"
            aria-label={t('buttons.closeModal')}
          >
            <X className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </button>

          {/* Alert Icon */}
          <div className="flex justify-center mb-4">
            <div className="glass-orange p-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Remove from cart?
          </h3>

          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 glass rounded-2xl mb-6">
            <img
              src={getProductImage(product.image_url)}
              alt={title}
              className="w-16 h-16 object-cover rounded-xl"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                {title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to remove this item from your cart?
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-glass text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveItemModal;
