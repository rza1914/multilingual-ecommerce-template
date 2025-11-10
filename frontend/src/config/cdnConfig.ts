// frontend/src/config/cdnConfig.ts
export interface CDNConfig {
  enabled: boolean;
  baseUrl?: string;
  fallbackUrls?: string[];
  imageDomains: string[];  // Domains that should be proxied through our CDN
  cacheDuration: number;   // Cache duration in seconds
  maxConcurrentDownloads: number;
}

// Default CDN configuration
export const defaultCDNConfig: CDNConfig = {
  enabled: true,
  baseUrl: process.env.VITE_CDN_BASE_URL || undefined,
  fallbackUrls: [
    process.env.VITE_CDN_FALLBACK_1 || '',
    process.env.VITE_CDN_FALLBACK_2 || ''
  ].filter(Boolean),
  imageDomains: [
    'images.unsplash.com',
    'images.pexels.com',
    'picsum.photos',
    // Add other common image hosting domains
  ],
  cacheDuration: 86400, // 24 hours (24 * 60 * 60)
  maxConcurrentDownloads: 6,
};

// Function to determine if an image URL should use CDN
export const shouldUseCDN = (imageUrl: string): boolean => {
  if (!defaultCDNConfig.enabled || !defaultCDNConfig.baseUrl) {
    return false;
  }

  // Check if the image domain is in our list of domains to proxy
  const url = new URL(imageUrl);
  return defaultCDNConfig.imageDomains.some(domain => 
    url.hostname.includes(domain)
  );
};

// Function to generate a CDN URL for an image
export const generateCDNUrl = (imageUrl: string): string => {
  if (!shouldUseCDN(imageUrl) || !defaultCDNConfig.baseUrl) {
    return imageUrl;
  }

  try {
    // Create a URL that routes through our CDN
    const cdnUrl = new URL('/image', defaultCDNConfig.baseUrl);
    cdnUrl.searchParams.set('url', encodeURIComponent(imageUrl));
    return cdnUrl.toString();
  } catch (e) {
    console.error('Error generating CDN URL:', e);
    return imageUrl; // Return original URL if there's an error
  }
};

// Function to get the best available URL considering CDN and fallbacks
export const getBestImageUrl = (originalUrl: string): string => {
  if (!originalUrl) return '';
  
  // If CDN is configured for this domain, use it
  if (shouldUseCDN(originalUrl)) {
    return generateCDNUrl(originalUrl);
  }
  
  return originalUrl;
};