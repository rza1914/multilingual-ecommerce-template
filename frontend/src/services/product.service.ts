/**
 * Product Service
 * Handles all product-related API calls
 */

import api from './api';
import { API_CONFIG } from '../config/api.config';
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
    const url = queryString ? `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.PRODUCTS.LIST;

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
    const response = await api.get<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id));
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
    const response = await api.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, data);
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
    const response = await api.put<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id), data);
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
    await api.delete(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id));
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

/**
 * Smart search products using AI
 * @param searchQuery - Object containing search parameters
 * @returns Promise with search results and AI explanation
 */
export interface SmartSearchQuery {
  query: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
}

export interface SmartSearchResult {
  results: Product[];
  explanation: string;
  extracted_filters: Record<string, any>;
  total_results: number;
  related_searches: string[];
}

export const smartSearch = async (searchQuery: SmartSearchQuery): Promise<SmartSearchResult> => {
  try {
    // Validate the required query parameter
    if (!searchQuery.query || searchQuery.query.trim() === '') {
      throw new Error('Search query is required');
    }

    // Clean and validate the search query
    const cleanedQuery = {
      query: searchQuery.query.trim(),
      category: searchQuery.category || undefined,
      min_price: searchQuery.min_price || undefined,
      max_price: searchQuery.max_price || undefined,
      limit: searchQuery.limit || 10
    };

    const response = await api.post<any>(API_CONFIG.ENDPOINTS.PRODUCTS.SMART_SEARCH, cleanedQuery);
    
    // Properly type the response
    const responseData = response.data;
    
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid response structure from server');
    }
    
    // Validate required properties in response
    const result: SmartSearchResult = {
      results: Array.isArray(responseData.results) ? responseData.results : [],
      explanation: typeof responseData.explanation === 'string' ? responseData.explanation : '',
      extracted_filters: responseData.extracted_filters || {},
      total_results: typeof responseData.total_results === 'number' ? responseData.total_results : 0,
      related_searches: Array.isArray(responseData.related_searches) ? responseData.related_searches : []
    };
    
    return result;
  } catch (error) {
    console.error('Error in smart search:', error);
    // Return a safe default result on error
    return {
      results: [],
      explanation: 'خطا در انجام جستجو',
      extracted_filters: {},
      total_results: 0,
      related_searches: []
    };
  }
};
