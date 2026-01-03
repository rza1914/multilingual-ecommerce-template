import { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../../types/product.types';
import { useCart } from '../../contexts/CartContext';
import ProductImage from './ProductImage';
import { useTranslation } from 'react-i18next';
import { getLocalizedTitle, getLocalizedDescription, formatCurrency } from '../../utils/i18n';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // Handle ESC key to close modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const hasDiscount = product.discount && product.discount > 0;
  const discountPercentage = product.discount || 0;

  // Ensure price is a valid number
  const safePrice = Number(product.price) || 0;
  const safeDiscount = Number(product.discount) || 0;

  const currentPrice = hasDiscount
    ? safePrice * (1 - safeDiscount / 100)
    : safePrice;

  // Ensure stock is a valid number
  const safeStock = Number(product.stock) || 0;
  const isOutOfStock = safeStock === 0;
  const isLowStock = safeStock > 0 && safeStock < 10;

  // Multilingual content
  const title = getLocalizedTitle(product);
  const description = getLocalizedDescription(product);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onAddToCart();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500/30 dark:border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-500/20 dark:shadow-orange-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 glass-orange p-2 rounded-xl hover:scale-110 transition-transform z-10"
            aria-label={t('buttons.closeModal')}
          >
            <X className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left: Product Image */}
            <div className="relative">
              <ProductImage
                src={product.image_url || ''}
                alt={title}
                className="w-full h-auto max-h-[500px] object-cover rounded-3xl"
                width={500}
                height={500}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <div className="badge-orange">
                    -{discountPercentage}% {t('productModal.off')}
                  </div>
                )}
                {product.is_featured && (
                  <div className="badge-glass">
                    ⭐ {t('product.featured')}
                  </div>
                )}
              </div>

              {/* Stock Badge */}
              <div className="absolute bottom-4 left-4">
                {isOutOfStock ? (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    {t('product.outOfStock')}
                  </div>
                ) : isLowStock ? (
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    {t('product.lowStock', { count: safeStock })}
                  </div>
                ) : (
                  <div className="badge-glass flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">{t('productModal.inStock', { count: safeStock })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              {/* Category */}
              <span className="badge-glass inline-flex w-fit mb-4">
                {product.category || t('productModal.general')}
              </span>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-orange mb-4">
                {title}
              </h2>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(Number(product.rating) || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({(Number(product.rating) || 0).toFixed(1)} / 5)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gradient-orange">
                  {formatCurrency(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(safePrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {description}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-300 dark:border-gray-700 mb-8" />

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t('productModal.quantity')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass-orange p-3 rounded-xl hover:scale-110 transition-transform"
                    disabled={quantity <= 1}
                    aria-label={t('buttons.decreaseQuantity')}
                  >
                    <Minus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </button>

                  <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(Math.min(safeStock, quantity + 1))}
                    className="glass-orange p-3 rounded-xl hover:scale-110 transition-transform"
                    disabled={quantity >= safeStock}
                    aria-label={t('buttons.increaseQuantity')}
                  >
                    <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full text-lg flex items-center justify-center gap-3"
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-6 h-6" />
                {t('productModal.addToCart')} • {formatCurrency(currentPrice * quantity)}
              </button>

              {/* Product Info */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="glass-orange p-4 rounded-2xl">
                  <span className="text-gray-600 dark:text-gray-400 block">{t('productModal.sku')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    #{product.id.toString().padStart(6, '0')}
                  </span>
                </div>
                <div className="glass-orange p-4 rounded-2xl">
                  <span className="text-gray-600 dark:text-gray-400 block">{t('productModal.category')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
