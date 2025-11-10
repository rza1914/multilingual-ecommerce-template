// frontend/src/components/products/ProductImage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useImageLoader } from '../../hooks/useImageLoader';
import { getResponsiveImageFormats } from '../../utils/imageUtils';
import { imageService } from '../../services/imageService';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  sizes?: string; // Responsive image sizes
  quality?: number; // Image quality for optimization services (1-100)
  placeholder?: string; // Custom placeholder image
  fallbackImages?: string[]; // Additional fallback images
  loading?: 'eager' | 'lazy'; // Standard loading attribute
  onError?: () => void;
  onLoad?: () => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  quality = 80,
  placeholder,
  fallbackImages = [],
  loading = 'lazy',
  onError,
  onLoad
}) => {
  const [isVisible, setIsVisible] = useState(priority); // Visible if priority image
  const [isBlurred, setIsBlurred] = useState(true); // For progressive loading
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use our custom image loader hook
  const {
    src: displaySrc,
    isLoading,
    error,
    loadNextFallback
  } = useImageLoader({
    src,
    fallbackImages,
    quality,
    width,
    height
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Trigger 100px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, loading]);

  // Handle image load for progressive loading
  const handleImageLoad = useCallback(() => {
    setIsBlurred(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error to try fallbacks or placeholder
  const handleImageError = useCallback(() => {
    if (loadNextFallback()) {
      // If there's a fallback, the hook will handle updating the src
    } else {
      // No more fallbacks, show error state
      setIsBlurred(false);
      onError?.();
    }
  }, [loadNextFallback, onError]);

  // Build responsive image sources
  const buildSrcSet = () => {
    if (!width || !height) return undefined;
    
    // Use the image service to create a proper srcset
    return imageService.createSrcSet(displaySrc, width, height);
  };

  // Get responsive formats for WebP support
  const responsiveFormats = getResponsiveImageFormats(displaySrc, width, height);

  // Determine classes based on state
  const imageClasses = `w-full h-full object-cover transition-all duration-300 ${
    isBlurred ? 'blur-md scale-105' : 'blur-0 scale-100'
  } ${isLoading ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : {}}
    >
      {/* Loading skeleton */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 p-4 text-center">
            <div className="text-4xl mb-2">📷</div>
            <p>Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual image with WebP support */}
      {isVisible && !error && (
        <picture>
          <source 
            srcSet={buildSrcSet()} 
            sizes={sizes}
            type="image/webp" 
          />
          <img
            ref={imgRef}
            src={responsiveFormats.jpeg}
            srcSet={buildSrcSet()}
            sizes={sizes}
            alt={alt}
            className={imageClasses}
            loading={priority ? 'eager' : loading}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      )}

      {/* Low-resolution preview for progressive loading */}
      {!isBlurred && !error && displaySrc && (
        <img
          src={displaySrc.replace(/\?.*/, `?w=50&h=50&q=30`)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 blur-md"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ProductImage;