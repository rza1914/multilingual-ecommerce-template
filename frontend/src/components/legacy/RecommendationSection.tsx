import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFullApiUrl } from '../../config/api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  discount?: number;
  stock: number;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  category?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  score?: number;
  reason?: string;
}

interface RecommendationsResponse {
  related: Product[];
  accessories: Product[];
  upsell: Product[];
  downsell: Product[];
  explanation: string;
}

interface RecommendationSectionProps {
  productId: number;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ productId }) => {
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const token = localStorage.getItem('auth_token');
  
  useEffect(() => {
    fetchRecommendations();
  }, [productId]);

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      setError(null);
      
      const response = await fetch(
        getFullApiUrl(`/products/${productId}/recommendations`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendationsResponse = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('خطا در دریافت پیشنهادها. لطفاً بعداً دوباره امتحان کنید.');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const addToCart = (productId: number) => {
    // In a real implementation, this would call the cart service
    console.log(`Added product ${productId} to cart`);
    // Show a toast or notification
  };

  if (recommendationsLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="bg-gray-200 rounded-lg h-40 w-full mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="py-8 text-center text-gray-500">
        پیشنهادی یافت نشد
      </div>
    );
  }

  const renderRecommendationSection = (title: string, products: Product[], icon: string) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="ml-2">{icon}</span>
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                  className="w-full h-40 object-contain p-2 bg-gray-50"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 truncate">{product.title}</h4>
                <p className="text-xs text-gray-500 mt-1 truncate">{product.reason}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price)} تومان
                  </span>
                  {product.discount_price && product.discount_price < product.price && (
                    <span className="ml-2 text-sm text-red-500 line-through">
                      {formatPrice(product.price)} تومان
                    </span>
                  )}
                </div>
                {product.rating && (
                  <div className="mt-1 flex items-center">
                    <span className="text-yellow-500">⭐ {product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 mr-2">({product.stock} موجود)</span>
                  </div>
                )}
                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                >
                  افزودن به سبد
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800">{recommendations.explanation}</p>
      </div>
      
      {renderRecommendationSection('محصولات مرتبط', recommendations.related, '🔗')}
      {renderRecommendationSection('اکسسوری‌های پیشنهادی', recommendations.accessories, '🎁')}
      {renderRecommendationSection('پیشنهاد بهتر', recommendations.upsell, '⬆️')}
      {renderRecommendationSection('پیشنهاد ارزان‌تر', recommendations.downsell, '⬇️')}
    </div>
  );
};

export default RecommendationSection;