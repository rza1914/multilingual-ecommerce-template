import { Product } from './product.types';

export interface SmartSearchResult {
  results: Product[];
  explanation: string;
  extracted_filters: {
    brand?: string;
    max_price?: number;
    category?: string;
    // سایر فیلترها
  };
  total_results: number;
}