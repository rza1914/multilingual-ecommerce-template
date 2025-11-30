/**
 * Product Card Component
 * Displays individual product with real backend data
 */

import { Product } from '../../types/product.types';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { getLocalizedTitle, getLocalizedDescription, formatCurrency } from '../../utils/i18n';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  // Calculate discount with safe number handling
  const hasDiscount = product.discount && product.discount > 0;
  const safePrice = Number(product.price) || 0;
  const safeDiscount = Number(product.discount) || 0;
  
  const discountedPrice = hasDiscount
    ? safePrice * (1 - safeDiscount / 100)
    : safePrice;

  // Stock status with safe number handling
  const safeStock = Number(product.stock) || 0;
  const isOutOfStock = safeStock === 0;
  const isLowStock = safeStock > 0 && safeStock < 10;

  // Handle quick add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) {
      // Show a simple alert for out of stock
      alert(t('product.outOfStock'));
      return;
    }

    addToCart(product, 1);
  };

  // Get multilingual content
  const title = getLocalizedTitle(product, product.title_en);
  const description = getLocalizedDescription(product, product.description_en);

  return (
    <>
      <Link 
        to={`/products/${product.id}`}
        className="block"
      >
      <div
        className="glass-card group relative overflow-hidden will-change-transform tilt-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-orange-600/20 blur-xl" />
        </div>

        {/* Image Container with Zoom Effect */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <ProductImage
            src={product.image_url || ''}
            alt={title}
            className={`w-full h-56 object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
            width={400}
            height={400}
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
                {t('product.outOfStock')}
              </div>
            </div>
          )}

          {/* Discount Badge with Pulse Animation */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-4 right-4 badge-orange animate-pulse-slow">
              <Sparkles className="w-3 h-3 mr-1" />
              -{safeDiscount}%
            </div>
          )}

          {/* Featured Badge with Glass Effect */}
          {product.is_featured && (
            <div className="absolute top-4 left-4 badge-glass backdrop-blur-xl">
              ⭐ {t('product.featured')}
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {t('product.lowStock', { count: safeStock })}
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
                {t('product.addToCart')}
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
                      i < Math.floor(Number(product.rating) || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {(Number(product.rating) || 0).toFixed(1)}
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
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                    {formatCurrency(safePrice)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gradient-orange">
                  {formatCurrency(safePrice)}
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
      </Link>

    </>
  );
};

export default ProductCard;
