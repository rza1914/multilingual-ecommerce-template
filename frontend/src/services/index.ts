/**
 * Services Barrel Export
 * Centralized exports for all service modules
 */

export { api, apiClient, buildApiUrl } from './api.service';
export { default as apiService } from './api.service';

export { userService } from './userService';
export { adminService } from './adminService';
export { productService } from './product.service';
export { cartService } from './cartService';

// Future services will be exported here
// export { orderService } from './orderService';