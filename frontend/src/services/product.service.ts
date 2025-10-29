/**
 * Product Service
 * Handles all product-related API calls
 */

import api from './api';
import { Product, ProductFilters, CreateProductData, UpdateProductData } from '../types/product.types';

/**
 * Get all products with optional filters
 * @param filters - Optional filters for products (search, price range, category, etc.)
 * @returns Promise<Product[]>
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice !== undefined) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());

    const queryString = params.toString();
    const url = queryString ? `/products/?${queryString}` : '/products/';

    const response = await api.get<Product[]>(url);
    return response as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Promise<Product>
 */
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response as unknown as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Get featured products
 * @param limit - Number of products to fetch (default: 6)
 * @returns Promise<Product[]>
 */
export const getFeaturedProducts = async (limit: number = 6): Promise<Product[]> => {
  try {
    return await getProducts({ limit });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * Create new product (Admin only)
 * @param data - Product data
 * @returns Promise<Product>
 */
export const createProduct = async (data: CreateProductData): Promise<Product> => {
  try {
    const response = await api.post<Product>('/products/', data);
    return response as unknown as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update existing product (Admin only)
 * @param id - Product ID
 * @param data - Updated product data
 * @returns Promise<Product>
 */
export const updateProduct = async (id: number, data: UpdateProductData): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response as unknown as Product;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

/**
 * Delete product (Admin only)
 * @param id - Product ID
 * @returns Promise<void>
 */
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

/**
 * Search products by query
 * @param query - Search query
 * @param limit - Number of results (default: 20)
 * @returns Promise<Product[]>
 */
export const searchProducts = async (query: string, limit: number = 20): Promise<Product[]> => {
  try {
    return await getProducts({ search: query, limit });
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
