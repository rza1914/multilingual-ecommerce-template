import { mockProducts, Product } from '../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  getProducts: async (): Promise<Product[]> => {
    console.log("Fetching products from mock API...");
    await delay(500); // Simulate 0.5s network delay
    return mockProducts;
  },

  getProductById: async (id: number): Promise<Product | null> => {
    console.log(`Fetching product with id ${id} from mock API...`);
    await delay(300);
    return mockProducts.find(product => product.id === id) || null;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    console.log("Fetching featured products from mock API...");
    await delay(400);
    return mockProducts.filter(product => product.is_featured);
  }
};

export default mockApi;
