# Bundle Size Optimization Guide

## Overview
This guide provides strategies and techniques to optimize the bundle size of the multilingual e-commerce template. The FloatingChatBot component and other parts of the application utilize several optimization techniques to maintain performance.

## Current Build Optimizations

### 1. Vite Build Configuration
- **Code Splitting**: Enabled via `cssCodeSplit: true` in vite.config.ts
- **Asset Hashing**: Content hashes used for cache-busting (`[name].[hash].ext`)
- **Sourcemap**: Disabled in production for smaller bundle size
- **Rollup Output**: Optimized for chunking and asset organization

### 2. Bundle Analysis
The build process includes `rollup-plugin-visualizer` which creates a bundle analysis HTML file at `./dist/bundle-analysis.html` after each production build.

## Optimization Techniques Used

### 1. Component Optimization
- **FloatingChatBot**: Uses `useCallback` to memoize functions and prevent unnecessary re-renders
- **Event Handling**: Uses passive event listeners and `requestAnimationFrame` for scroll performance
- **Conditional Rendering**: Efficient rendering based on component state

### 2. Import Optimization
- **Tree Shaking**: Uses named imports from libraries like Lucide React
- **Lazy Loading**: Components can be implemented with React.lazy() for non-critical paths
- **Dynamic Imports**: For optional features

## Recommendations for Further Optimization

### 1. Code Splitting
- Implement route-based code splitting using React.lazy()
- Split vendor libraries from application code

### 2. Image Optimization
- Use WebP format with fallbacks for images
- Implement lazy loading for images outside the viewport

### 3. Third-Party Libraries
- Audit dependencies regularly with `npm ls`
- Replace heavy libraries with lighter alternatives where possible
- Load external scripts asynchronously when needed

### 4. CSS Optimization
- Purge unused Tailwind CSS classes in production
- Consider using Tailwind's `content` configuration for better tree-shaking

## Bundle Analysis
After running a production build, use the generated visualization file to identify large dependencies and optimize accordingly.