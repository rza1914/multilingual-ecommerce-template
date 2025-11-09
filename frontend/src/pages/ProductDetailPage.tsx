import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import RecommendationSection from '../components/legacy/RecommendationSection';
import { getProductImage, handleImageError } from '../utils/imageUtils';
import { getLocalizedTitle, getLocalizedDescription, formatCurrency } from '../utils/i18n';
import { Star, ShoppingCart, Package, Shield, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const productId = parseInt(id, 10);
          const data = await productService.getProduct(productId);
          setProduct(data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(t('productDetailPage.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            {t('productDetailPage.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>{t('productDetailPage.productNotFound')}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary mt-4"
          >
            {t('productDetailPage.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount && product.discount > 0;
  const currentPrice = hasDiscount 
    ? product.price * (1 - (product.discount || 0) / 100)
    : product.price;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  // Multilingual content
  const title = getLocalizedTitle(product);
  const description = getLocalizedDescription(product);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('productDetailPage.backToProducts')}</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="flex flex-col">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-center h-full min-h-[400px]">
                <img
                  src={getProductImage(product.image_url)}
                  alt={title}
                  onError={handleImageError}
                  className="max-h-96 object-contain rounded-lg"
                />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {hasDiscount && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {t('productDetailPage.discount', { discount: product.discount })}
                  </span>
                )}
                {product.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    <Star className="w-3 h-3 inline mr-1" />
                    {t('product.featured')}
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {t('product.outOfStock')}
                  </span>
                ) : isLowStock ? (
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {t('product.lowStock', { count: product.stock })}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {t('product.inStock')}
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Category */}
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                {product.category || t('productDetailPage.uncategorized')}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h1>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    ({product.rating.toFixed(1)}) • {product.stock} {t('productDetailPage.inStock')}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                {description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('productDetailPage.quantity')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg">-</span>
                  </button>

                  <span className="text-xl font-bold w-12 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    disabled={quantity >= product.stock}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold mb-6 ${
                  isOutOfStock
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock 
                  ? t('product.outOfStock') 
                  : `${t('productDetailPage.addToCart')} • ${formatCurrency(currentPrice * quantity)}`
                }
              </button>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-gray-500 dark:text-gray-400">{t('productDetailPage.sku')}</div>
                  <div className="font-semibold">#{product.id.toString().padStart(6, '0')}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-gray-500 dark:text-gray-400">{t('productDetailPage.availability')}</div>
                  <div className={`font-semibold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-500'}`}>
                    {isOutOfStock 
                      ? t('product.outOfStock') 
                      : isLowStock 
                        ? `${t('product.lowStock', { count: product.stock })}` 
                        : `${t('product.inStock')} (${product.stock})`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-12">
          <RecommendationSection productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;