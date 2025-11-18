import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard'; 
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import * as authService from '../services/auth.service';
// FIX: ایمپورت تایپ اصلی و صحیح Product
import { Product } from '@/types/product';

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers: HeadersInit = {};
        const token = authService.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:8000/api/v1/products/?limit=6', {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [auth]);

  if (loading) {
    return <div className="product-list-loading">{t('Loading products...')}</div>;
  }

  if (error) {
    return <div className="product-list-error">{t('Error')}: {error}</div>;
  }

  return (
    <div className="product-list">
      <h2>{t('Featured Products')}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;