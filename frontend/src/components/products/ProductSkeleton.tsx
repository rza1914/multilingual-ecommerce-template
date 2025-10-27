/**
 * Product Skeleton Component
 * Loading placeholder for product cards
 */

import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden rounded-2xl mb-4">
        <div className="aspect-square bg-gradient-to-r from-gray-200 via-orange-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg w-3/4 shimmer" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-full shimmer" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-5/6 shimmer" />
      </div>

      {/* Price Skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-8 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 dark:from-orange-900 dark:via-orange-800 dark:to-orange-900 rounded-lg w-24 shimmer" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-full w-8 shimmer" />
      </div>

      {/* Button Skeleton */}
      <div className="mt-4 h-12 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300 dark:from-orange-700 dark:via-orange-600 dark:to-orange-700 rounded-2xl shimmer" />
    </div>
  );
};

/**
 * Grid of Product Skeletons
 */
interface ProductSkeletonGridProps {
  count?: number;
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
