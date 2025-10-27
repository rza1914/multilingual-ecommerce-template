/**
 * Image Utilities
 * Helper functions for handling product images
 */

/**
 * Default placeholder image URL
 */
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';

/**
 * Get product image URL with fallback
 * @param imageUrl - Product image URL from backend
 * @returns Valid image URL or placeholder
 */
export const getProductImage = (imageUrl: string | undefined): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }
  return imageUrl;
};

/**
 * Handle image load error
 * Sets fallback placeholder image on error
 * @param e - React synthetic event from img element
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
  const target = e.currentTarget;

  // Prevent infinite loop if placeholder also fails
  if (target.src !== PLACEHOLDER_IMAGE) {
    target.src = PLACEHOLDER_IMAGE;
  }
};

/**
 * Preload image
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Get optimized image URL with size parameters (for services that support it)
 * @param imageUrl - Original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  width?: number,
  height?: number
): string => {
  if (!imageUrl) return PLACEHOLDER_IMAGE;

  // If it's an Unsplash image, add optimization parameters
  if (imageUrl.includes('unsplash.com')) {
    const url = new URL(imageUrl);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  // If it's a Pexels image, add optimization parameters
  if (imageUrl.includes('pexels.com')) {
    const url = new URL(imageUrl);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('auto', 'compress');
    return url.toString();
  }

  return imageUrl;
};
