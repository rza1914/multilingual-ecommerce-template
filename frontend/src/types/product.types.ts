/**
 * Product Types for Multilingual E-commerce
 * Supports English, Persian (Farsi), and Arabic
 */

export interface Product {
  id: number;
  title_en: string;
  title_fa?: string;
  title_ar?: string;
  description_en: string;
  description_fa?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  category?: string;
  stock: number;
  discount?: number;
  rating?: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  limit?: number;
  is_featured?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface CreateProductData {
  title_en: string;
  title_fa?: string;
  title_ar?: string;
  description_en: string;
  description_fa?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  category?: string;
  stock: number;
  discount?: number;
  is_featured?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}
