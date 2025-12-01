import React, { useState, useEffect } from 'react';
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

interface Bundle {
  items: Product[];
  original_price: number;
  discounted_price: number;
  savings: number;
  discount_percent: number;
  description: string;
}

interface CartSuggestionsResponse {
  cross_sell: Product[];
  bundle: Bundle | null;
  up_sell: Product[];
  reasoning: string;
}

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface CartSuggestionsProps {
  cartItems: CartItem[];
  onAddToCart: (productId: number) => void;
}

interface CartSuggestionsProps {
  cartItems: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  onAddToCart: (productId: number) => void;
}

const CartSuggestions: React.FC<CartSuggestionsProps> = ({ cartItems, onAddToCart }) => {
  const [suggestions, setSuggestions] = useState<CartSuggestionsResponse | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetchSuggestions();
  }, [cartItems]);

  const fetchSuggestions = async () => {
    if (!cartItems || cartItems.length === 0) {
      setSuggestions(null);
      setSuggestionsLoading(false);
      return;
    }

    try {
      setSuggestionsLoading(true);
      setError(null);

      const response = await fetch(
        getFullApiUrl('/cart/suggestions'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ cart_items: cartItems }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CartSuggestionsResponse = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching cart suggestions:', err);
      setError('خطا در دریافت پیشنهادها. لطفاً بعداً دوباره امتحان کنید.');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const addToCart = (productId: number) => {
    onAddToCart(productId);
  };

  if (suggestionsLoading) {
    return (
      <div className="py-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="bg-gray-200 rounded-lg h-32 w-full mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!suggestions || (!suggestions.cross_sell.length && !suggestions.bundle && !suggestions.up_sell.length)) {
    return null; // Don't show suggestions if there are none
  }

  return (
    <div className="py-6">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800">{suggestions.reasoning}</p>
      </div>

      {/* Bundle Suggestions */}
      {suggestions.bundle && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🎁</span>
            <h3 className="text-xl font-bold text-gray-800">پیشنهاد باندل ویژه</h3>
          </div>
          <p className="text-lg text-purple-700 mb-4">{suggestions.bundle.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {suggestions.bundle.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-16 h-16 object-contain rounded mr-3"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl mr-3" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-600">
                    {item.discount_price && item.discount_price < item.price ? (
                      <span>
                        <span className="text-red-500 font-bold">{formatPrice(item.discount_price)}</span>
                        <span className="text-gray-500 line-through mr-2">{formatPrice(item.price)}</span>
                      </span>
                    ) : (
                      <span className="text-blue-600 font-bold">{formatPrice(item.price)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                قیمت اصلی: <span className="line-through">{formatPrice(suggestions.bundle.original_price)} تومان</span>
              </p>
              <p className="text-xl font-bold text-green-600">
                قیمت نهایی: {formatPrice(suggestions.bundle.discounted_price)} تومان
              </p>
              <p className="text-green-600 font-semibold">
                صرفه‌جویی: {formatPrice(suggestions.bundle.savings)} تومان ({suggestions.bundle.discount_percent}% تخفیف)
              </p>
            </div>
            <button
              onClick={() => suggestions.bundle?.items.forEach(item => addToCart(item.id))}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              افزودن همه به سبد
            </button>
          </div>
        </div>
      )}

      {/* Cross-sell Suggestions */}
      {suggestions.cross_sell.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🎁</span>
            <h3 className="text-xl font-bold text-gray-800">با این هم بگیر!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.cross_sell.map((product) => (
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
                    </div>
                  )}
                  <button
                    onClick={() => addToCart(product.id)}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                  >
                    افزودن با 1 کلیک
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Up-sell Suggestions */}
      {suggestions.up_sell.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">💎</span>
            <h3 className="text-xl font-bold text-gray-800">ارتقا بده!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.up_sell.map((product) => (
              <div 
                key={product.id} 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden border border-blue-100"
              >
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="w-full h-40 object-contain p-2 bg-white"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 truncate">{product.title}</h4>
                  <p className="text-xs text-blue-600 mt-1">مدل بهتر نسبت به محصول موجود</p>
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
                  <button
                    onClick={() => addToCart(product.id)}
                    className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    انتخاب مدل بهتر
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSuggestions;