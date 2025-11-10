// frontend/src/services/imageService.ts
import { PLACEHOLDER_IMAGE } from '../utils/imageUtils';

interface ImageMetadata {
  url: string;
  width?: number;
  height?: number;
  type?: string;
  size?: number;
}

class ImageService {
  private cache: Map<string, ImageMetadata> = new Map();
  private maxCacheSize = 100; // Cache up to 100 image metadata entries

  /**
   * Validates an image URL by attempting to load it
   */
  async validateImage(url: string): Promise<boolean> {
    if (!url) return false;
    
    try {
      // Check cache first
      if (this.cache.has(url)) {
        return true;
      }

      // Create temporary image to verify
      const img = new Image();
      const promise = new Promise<boolean>((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        // Add a timeout to prevent hanging
        setTimeout(() => resolve(false), 10000);
      });
      
      img.src = url;
      
      const isValid = await promise;
      
      if (isValid) {
        // Cache successful images
        this.addToCache(url, { url });
      }
      
      return isValid;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    }
  }

  /**
   * Measures image dimensions
   */
  async getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
    if (!url) return null;
    
    try {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
    }
  }

  /**
   * Optimizes an image URL with service-specific parameters
   */
  optimizeImageUrl(url: string, width?: number, height?: number, quality: number = 80): string {
    if (!url) return PLACEHOLDER_IMAGE;
    
    // If it's already a placeholder, return as is
    if (url === PLACEHOLDER_IMAGE) return url;
    
    // For Unsplash images
    if (url.includes('unsplash.com')) {
      const newUrl = new URL(url);
      if (width) newUrl.searchParams.set('w', width.toString());
      if (height) newUrl.searchParams.set('h', height.toString());
      newUrl.searchParams.set('q', quality.toString());
      newUrl.searchParams.set('auto', 'format');
      return newUrl.toString();
    }
    
    // For Pexels images
    if (url.includes('pexels.com')) {
      const newUrl = new URL(url);
      if (width) newUrl.searchParams.set('w', width.toString());
      if (height) newUrl.searchParams.set('h', height.toString());
      newUrl.searchParams.set('dpr', '1');
      newUrl.searchParams.set('auto', 'compress');
      return newUrl.toString();
    }
    
    // For generic optimization services we can add parameters to
    try {
      const newUrl = new URL(url);
      if (width) newUrl.searchParams.set('width', width.toString());
      if (height) newUrl.searchParams.set('height', height.toString());
      return newUrl.toString();
    } catch {
      // If URL parsing fails, return original URL
      return url;
    }
  }

  /**
   * Generates WebP version of an image URL if service supports it
   */
  getWebPVersion(url: string, width?: number, height?: number): string {
    if (!url) return PLACEHOLDER_IMAGE;
    
    // For services that support WebP format parameter
    if (url.includes('unsplash.com') || url.includes('pexels.com')) {
      const newUrl = new URL(url);
      newUrl.searchParams.set('fm', 'webp');
      if (width) newUrl.searchParams.set('w', width.toString());
      if (height) newUrl.searchParams.set('h', height.toString());
      return newUrl.toString();
    }
    
    // For other services, return original URL
    return url;
  }

  /**
   * Creates a responsive image set string for srcset attribute
   */
  createSrcSet(url: string, baseWidth: number, baseHeight?: number): string {
    if (!url) return '';
    
    // Generate multiple size variants
    const sizes = [0.25, 0.5, 0.75, 1, 1.5, 2].map(scale => ({
      width: Math.round(baseWidth * scale),
      height: baseHeight ? Math.round(baseHeight * scale) : undefined
    }));
    
    return sizes
      .map(size => `${this.optimizeImageUrl(url, size.width, size.height)} ${size.width}w`)
      .join(', ');
  }

  /**
   * Preloads an image to warm the browser cache
   */
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('No URL provided for preloading'));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${url}`));
      };
      img.src = url;
    });
  }

  /**
   * Batch preload multiple images
   */
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url));
    await Promise.allSettled(promises);
  }

  /**
   * Get fallback image chain for an image URL
   */
  getFallbackChain(url: string, additionalFallbacks: string[] = []): string[] {
    const fallbacks: string[] = [];
    
    // If not using placeholder already, add it as the final fallback
    if (url !== PLACEHOLDER_IMAGE) {
      fallbacks.push(PLACEHOLDER_IMAGE);
    }
    
    // Add any additional fallbacks provided
    fallbacks.push(...additionalFallbacks);
    
    return fallbacks;
  }

  /**
   * Add to cache with size management
   */
  private addToCache(url: string, metadata: ImageMetadata): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove the first entry (oldest) if cache is full
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(url, metadata);
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const imageService = new ImageService();
export default ImageService;