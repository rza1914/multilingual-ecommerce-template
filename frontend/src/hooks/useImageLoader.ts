// frontend/src/hooks/useImageLoader.ts
import { useState, useCallback } from 'react';
import { PLACEHOLDER_IMAGE } from '../utils/imageUtils';

interface ImageLoaderOptions {
  src: string;
  fallbackImages?: string[];
  quality?: number;
  width?: number;
  height?: number;
}

interface ImageLoaderResult {
  src: string;
  isLoading: boolean;
  error: boolean;
  loadNextFallback: () => boolean;
}

export const useImageLoader = ({
  src,
  fallbackImages = [],
  quality = 80,
  width,
  height
}: ImageLoaderOptions): ImageLoaderResult => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(-1); // -1 means original src

  // Preload image and handle success/error
  const loadImage = useCallback((url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setError(false);
        resolve(true);
      };
      img.onerror = () => {
        setIsLoading(false);
        setError(true);
        resolve(false);
      };
      img.src = url;
    });
  }, []);

  // Try to load the next fallback image
  const loadNextFallback = useCallback((): boolean => {
    let nextIndex = currentFallbackIndex + 1;
    
    if (nextIndex < fallbackImages.length) {
      // Try the next fallback
      const nextSrc = fallbackImages[nextIndex];
      setCurrentSrc(nextSrc);
      setCurrentFallbackIndex(nextIndex);
      setIsLoading(true);
      setError(false);
      loadImage(nextSrc);
      return true;
    } else {
      // No more fallbacks, try placeholder
      if (currentFallbackIndex < fallbackImages.length) {
        setCurrentSrc(PLACEHOLDER_IMAGE);
        setCurrentFallbackIndex(fallbackImages.length); // Mark as using placeholder
        setIsLoading(true);
        setError(false);
        loadImage(PLACEHOLDER_IMAGE);
        return true;
      }
      return false; // No more fallbacks
    }
  }, [currentFallbackIndex, fallbackImages, loadImage]);

  // Attempt to load the initial image
  if (currentFallbackIndex === -1 && isLoading) {
    loadImage(currentSrc);
  }

  return {
    src: currentSrc,
    isLoading,
    error,
    loadNextFallback
  };
};