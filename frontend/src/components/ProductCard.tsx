import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
// FIX: ایمپورت تایپ اصلی و صحیح Product
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // حالا product از تایپ صحیح هست و باید با addToCart سازگار باشه
    addToCart(product);
  };

  return (
    <div className="product-card">
      <img
        src={product.image_url || 'https://via.placeholder.com/150'}
        alt={product.title_en} // استفاده از title_en که اجباری است
        className="product-card-image"
      />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.title_en}</h3>
        <p className="product-card-description">
          {product.description_en ? product.description_en.substring(0, 100) + '...' : t('No description available.')}
        </p>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button onClick={handleAddToCart} className="add-to-cart-button">
            {t('Add to Cart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;