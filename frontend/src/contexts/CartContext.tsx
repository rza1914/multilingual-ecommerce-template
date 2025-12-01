import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// FIX: اصلاح مسیر ایمپورت Product
import { Product } from '@/types/product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// Mock coupon codes (replace with API call later)
const MOCK_COUPONS: Record<string, number> = {
  'WELCOME10': 10,  // 10% off
  'SAVE20': 20,     // 20% off
  'FREESHIP': 0,    // free shipping (handled separately)
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: number) => boolean;

  // New features
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getDiscount: () => number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscount: number;
  isFreeShipping: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('luxstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('luxstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Validate stock availability
    if (product.stock === 0) {
      console.warn('Product is out of stock');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);

      if (existingItem) {
        // Check if adding more would exceed stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          console.warn(`Cannot add more than ${product.stock} items to cart`);
          return prevItems;
        }

        // Update quantity if item already exists
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Validate initial quantity doesn't exceed stock
        if (quantity > product.stock) {
          console.warn(`Cannot add more than ${product.stock} items to cart`);
          return prevItems;
        }

        // Add new item
        return [...prevItems, { id: Date.now(), product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          // Validate quantity doesn't exceed stock
          if (quantity > item.product.stock) {
            console.warn(`Cannot add more than ${item.product.stock} items to cart`);
            return item; // Keep current quantity
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Calculate discounted price if discount exists
      const hasDiscount = item.product.discount && item.product.discount > 0;
      const price = hasDiscount
        ? item.product.price * (1 - (item.product.discount ?? 0) / 100)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.product.id === productId);
  };

  /**
   * Get subtotal (sum of all items before tax/shipping)
   */
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const hasDiscount = item.product.discount && item.product.discount > 0;
      const price = hasDiscount
        ? item.product.price * (1 - (item.product.discount ?? 0) / 100)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  /**
   * Get tax (10% of subtotal)
   */
  const getTax = () => {
    return getSubtotal() * 0.10;
  };

  /**
   * Get shipping cost
   * $10 flat rate, FREE if subtotal > $100 or FREESHIP coupon
   */
  const getShipping = () => {
    if (couponCode === 'FREESHIP' || getSubtotal() >= 100) {
      return 0;
    }
    return 10;
  };

  /**
   * Check if free shipping is active
   */
  const isFreeShipping = () => {
    return getShipping() === 0;
  };

  /**
   * Get discount amount from coupon
   */
  const getDiscount = () => {
    if (!couponCode || couponDiscount === 0) return 0;
    return getSubtotal() * (couponDiscount / 100);
  };

  /**
   * Apply coupon code
   */
  const applyCoupon = async (code: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const upperCode = code.toUpperCase();
    if (MOCK_COUPONS[upperCode] !== undefined) {
      setCouponCode(upperCode);
      setCouponDiscount(MOCK_COUPONS[upperCode]);
      return true;
    }
    return false;
  };

  /**
   * Remove coupon
   */
  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getSubtotal,
        getTax,
        getShipping,
        getDiscount,
        applyCoupon,
        removeCoupon,
        couponCode,
        couponDiscount,
        isFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};