// frontend/src/utils/performanceMonitoring.ts
interface ImagePerformanceMetrics {
  url: string;
  startTime: number;
  endTime?: number;
  loadTime?: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
  size?: number;
}

class ImagePerformanceMonitor {
  private metrics: Map<string, ImagePerformanceMetrics> = new Map();
  private observers: Set<PerformanceObserver> = new Set();

  constructor() {
    this.setupLCPObserver();
    this.setupResourceObserver();
  }

  // Start tracking an image load
  startTracking(url: string): void {
    this.metrics.set(url, {
      url,
      startTime: performance.now(),
      status: 'pending'
    });
  }

  // Mark an image as successfully loaded
  markSuccess(url: string, size?: number): void {
    const metric = this.metrics.get(url);
    if (metric) {
      const endTime = performance.now();
      metric.endTime = endTime;
      metric.loadTime = endTime - metric.startTime;
      metric.status = 'success';
      metric.size = size;
      this.reportMetric(metric);
    }
  }

  // Mark an image as having an error
  markError(url: string, error?: string): void {
    const metric = this.metrics.get(url);
    if (metric) {
      metric.endTime = performance.now();
      metric.status = 'error';
      metric.error = error;
      this.reportMetric(metric);
    }
  }

  // Get performance metrics summary
  getMetrics(): ImagePerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Reset all metrics
  reset(): void {
    this.metrics.clear();
  }

  // Setup Largest Contentful Paint observer
  private setupLCPObserver(): void {
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.url && this.metrics.has(entry.url)) {
            // LCP timing
          }
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.add(lcpObserver);
      } catch (e) {
        console.warn('LCP Observer not supported:', e);
      }
    }
  }

  // Setup Resource timing observer
  private setupResourceObserver(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          if (entry.name && this.metrics.has(entry.name)) {
            // Add resource timing info to our metric
            const metric = this.metrics.get(entry.name);
            if (metric && entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              metric.size = resourceEntry.transferSize;
            }
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.add(resourceObserver);
      } catch (e) {
        console.warn('Resource Observer not supported:', e);
      }
    }
  }

  // Report performance metrics
  private reportMetric(metric: ImagePerformanceMetrics): void {
    // Log metrics for debugging
    if (metric.status === 'error') {
      console.warn(`Image failed to load: ${metric.url}`, metric.error);
    } else if (metric.status === 'success' && metric.loadTime) {
      console.log(`Image loaded: ${metric.url} in ${metric.loadTime.toFixed(2)}ms`);
    }

    // You could send metrics to analytics service here
    // Example: sendToAnalytics('image_load', metric);
  }

  // Get average load time across all images
  getAverageLoadTime(): number {
    const successfulMetrics = Array.from(this.metrics.values())
      .filter(m => m.status === 'success' && m.loadTime !== undefined);
    
    if (successfulMetrics.length === 0) return 0;
    
    const total = successfulMetrics.reduce((sum, m) => sum + (m.loadTime || 0), 0);
    return total / successfulMetrics.length;
  }

  // Get error rate
  getErrorRate(): number {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) return 0;
    
    const errorCount = allMetrics.filter(m => m.status === 'error').length;
    return errorCount / allMetrics.length;
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Create a singleton instance
export const imagePerformanceMonitor = new ImagePerformanceMonitor();
export default ImagePerformanceMonitor;