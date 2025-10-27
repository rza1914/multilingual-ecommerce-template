/**
 * Product Card Component
 * Displays individual product with real backend data
 */

import { Product } from '../../types/product.types';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import ProductModal from './ProductModal';
import Toast, { ToastType } from '../Toast';
import { getProductImage, handleImageError } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  const { addToCart } = useCart();

  // Calculate discount
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Stock status
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  // Handle quick add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) {
      setToastMessage('Product is out of stock');
      setToastType('error');
      setShowToast(true);
      return;
    }

    addToCart(product, 1);
    setToastMessage('Added to cart! 🛒');
    setToastType('success');
    setShowToast(true);
  };

  // Handle card click to open modal
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Handle add to cart from modal
  const handleAddToCartFromModal = () => {
    setToastMessage('Added to cart! 🛒');
    setToastType('success');
    setShowToast(true);
  };

  // Get multilingual content (currently using English, TODO: add language context)
  const title = product.title_en;
  const description = product.description_en;

  return (
    <>
      <div
        className="glass-card group relative overflow-hidden will-change-transform tilt-3d cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Floating Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-orange-600/20 blur-xl" />
        </div>

        {/* Image Container with Zoom Effect */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            src={getProductImage(product.image_url)}
            alt={title}
            onError={handleImageError}
            className={`w-full h-56 object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
          />

          {/* Gradient Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl">
                Out of Stock
              </div>
            </div>
          )}

          {/* Discount Badge with Pulse Animation */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-4 right-4 badge-orange animate-pulse-slow">
              <Sparkles className="w-3 h-3 mr-1" />
              -{product.discount}%
            </div>
          )}

          {/* Featured Badge with Glass Effect */}
          {product.is_featured && (
            <div className="absolute top-4 left-4 badge-glass backdrop-blur-xl">
              ⭐ Featured
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Only {product.stock} left!
            </div>
          )}

          {/* Quick Action Button - Shows on Hover */}
          {!isOutOfStock && (
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={handleQuickAdd}
                className="btn-primary flex items-center gap-2 shadow-2xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 relative z-10">
          {/* Category and Rating Row */}
          <div className="flex justify-between items-center mb-3">
            <span className="badge-glass text-xs uppercase tracking-wider">
              {product.category || 'General'}
            </span>
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {title}
          </h3>

          {/* Product Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Price and Cart Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-gradient-orange">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gradient-orange">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className={`glass-orange p-3 rounded-2xl hover:scale-110 transition-all duration-300 glow-orange group/btn ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              aria-label="Add to cart"
            >
              <ShoppingCart
                className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover/btn:text-orange-700 dark:group-hover/btn:text-orange-300 transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCartFromModal}
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
